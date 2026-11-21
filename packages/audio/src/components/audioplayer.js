/** @import { NodeId } from '@wimaengine/datastructures' */
/** @import { AssetId, HandleSnapshotSerial } from '@wimaengine/asset' */
/** @import { ComponentHook, EntityHandle, World } from '@wimaengine/ecs' */
/* eslint-disable jsdoc/check-tag-names */
import { Handle, HandleSnapshot } from '@wimaengine/asset'
import { Audio } from '../assets'
import { AudioGraph } from '../resources'

/**
 * Stores the state needed to play an {@linkcode Audio} asset from an ECS entity.
 *
 * Pair it with {@linkcode Timer} to control one-shot or repeating playback. The
 * component supplies the asset handle, graph destination, and playback state
 * used to create a browser audio source.
 *
 * @category component
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AudioPlayer } from '@wimaengine/audio'
 * import { Timer, TimerMode } from '@wimaengine/time'
 *
 * const world = new World()
 *
 * // Pass a live handle from the world's audio asset resource.
 * function spawnAudioEntity(audioHandle) {
 *   return world.spawn([
 *     new AudioPlayer({ audio: audioHandle }),
 *     new Timer({ mode: TimerMode.Once })
 *   ])
 * }
 * ```
 */
export class AudioPlayer {

  /**
   * ID of this player's source slot in an {@linkcode AudioGraph}.
   *
   * A slot is assigned after the `audio` handle resolves for a player paired
   * with an {@linkcode Timer}. The slot can contain `undefined` before the first
   * source is created and while the timer is paused or complete. Its paired
   * timer takes its duration from the decoded buffer. `Once` uses a
   * non-looping source, while `Repeat` uses a looping one, and the timer's
   * `speed` controls the source's playback rate. Pausing or completing the
   * timer clears the current source. This ID is graph state, not an
   * `AudioBufferSourceNode`.
   *
   * @type {NodeId | undefined} Undefined until a source slot is assigned.
   */
  sourceNode

  /**
   * Optional {@linkcode AudioGraph} node to which the source slot is connected.
   *
   * When a source slot is first assigned, it connects to this destination. If
   * it is omitted, the slot connects to the graph root, which is the audio
   * destination. Changing `attach` after that does not rewire the existing
   * graph edge.
   *
   * @type {NodeId | undefined} Graph destination, or the graph root by default.
   */
  attach

  /**
   * Live handle for the {@linkcode Audio} asset to play.
   *
   * The handle identifies an entry in the world's {@linkcode AudioAssets} pool. An
   * absent or stale handle leaves the player without a source until a valid
   * handle is available. When the component is removed through
   * {@linkcode AudioPlugin}, its removal hook drops this handle.
   *
   * @type {Handle<Audio> | undefined} Asset handle, or `undefined` by default.
   */
  audio

  /**
   * Creates an audio player with an optional asset handle and graph destination.
   *
   * Both values are stored as provided. The constructor does not resolve the
   * asset, reserve an {@linkcode AudioGraph} slot, or create a Web Audio node.
   *
   * @param {AudioPlayerOptions} [options] - Asset handle and optional graph destination.
   */
  constructor({ attach, audio } = {}) {
    this.attach = attach
    this.audio = audio
  }

  /**
   * Copies an audio player's fields into a target component.
   *
   * `sourceNode`, `attach`, and `audio` are assigned directly. The `audio`
   * handle is not passed to {@linkcode Handle#clone}, so source and target share
   * the same handle object and no additional asset reference is acquired.
   *
   * @param {AudioPlayer} source - Player to copy.
   * @param {AudioPlayer} [target=new AudioPlayer()] - Component to populate.
   * @returns {AudioPlayer} The populated target.
   */
  static copy(source, target = new AudioPlayer()) {
    target.sourceNode = source.sourceNode
    target.attach = source.attach
    target.audio = source.audio

    return target
  }

  /**
   * Creates a player by applying {@linkcode AudioPlayer.copy}.
   *
   * The returned player shares the source's `audio` handle and copies its
   * runtime graph ID. It does not acquire a separate handle reference or create
   * a new graph slot.
   *
   * @param {AudioPlayer} target - Player to clone.
   * @returns {AudioPlayer} A player with copied runtime fields.
   */
  static clone(target) {
    return AudioPlayer.copy(target)
  }

  static default() {
    return new AudioPlayer()
  }

  /**
   * Creates a persistence snapshot of this player.
   *
   * The snapshot stores `sourceNode` and `attach`, plus a
   * {@linkcode HandleSnapshot} for `audio` when a handle is present. It stores
   * asset locator data, not the loaded {@linkcode Audio} object or live Web Audio
   * node. Restoring it with {@linkcode AudioPlayer.fromSnapshot} restores
   * the recorded IDs but does not rebuild the graph slot.
   *
   * @param {AudioPlayer} player - Live player being snapshotted.
   * @param {World} world - World used to resolve asset metadata.
   * @returns {AudioPlayerSnapshot} Snapshot of the player's persisted fields.
   */
  static toSnapshot(player, world) {
    return new AudioPlayerSnapshot(
      player.sourceNode,
      player.attach,
      player.audio && Handle.toSnapshot(player.audio, world)
    )
  }
}

/**
 * Persistence data used to reconstruct an {@linkcode AudioPlayer} component.
 *
 * A snapshot captures the player's graph-slot IDs and its asset handle as
 * serializable data. It is not a live player, asset handle, or Web Audio node;
 * restoring it creates a new component and delegates handle restoration to
 * {@linkcode Handle#fromSnapshot}.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AudioPlayer, AudioPlayerSnapshot } from '@wimaengine/audio'
 *
 * const world = new World()
 * const serial = AudioPlayerSnapshot.serialize(
 *   AudioPlayer.toSnapshot(new AudioPlayer(), world)
 * )
 *
 * if (AudioPlayerSnapshot.validateSerial(serial)) {
 *   const player = AudioPlayer.fromSnapshot(AudioPlayerSnapshot.deserialize(serial), world)
 *   console.log(player.audio) // undefined: the source player had no handle.
 * }
 * ```
 */
export class AudioPlayerSnapshot {

  static default() {
    return new AudioPlayerSnapshot(undefined, undefined, undefined)
  }

  /**
   * Graph slot ID recorded from the player's {@linkcode AudioGraph}.
   *
   * This identifies a slot, not a native `AudioBufferSourceNode`. The ID may
   * be undefined when no source slot had been assigned. Restoring the snapshot
   * copies the recorded number but does not create or remap a slot in the
   * destination world's graph, so the value describes prior graph state rather
   * than a guaranteed live slot.
   *
   * @type {NodeId | undefined}
   */
  sourceNode

  /**
   * Graph destination ID recorded from the player's `attach` setting.
   *
   * `undefined` means that the player would connect a newly reserved slot to
   * the graph root. It is persisted as an ID only; restoration does not
   * reconnect the graph edge or verify that the destination exists.
   *
   * @type {NodeId | undefined}
   */
  attach

  /**
   * Serializable asset reference produced by {@linkcode Handle#toSnapshot}.
   *
   * This is a {@linkcode HandleSnapshot}, not a live {@linkcode Handle}; it can be
   * absent when the player has no audio handle.
   *
   * @type {HandleSnapshot | undefined}
   */
  audio

  /**
   * Creates persistence data from the player's three stored fields.
   *
   * The constructor assigns `sourceNode`, `attach`, and `audio` directly. It
   * does not validate IDs, resolve the asset, or inspect an audio graph.
   *
   * @param {NodeId | undefined} sourceNode
   * @param {NodeId | undefined} attach
   * @param {HandleSnapshot | undefined} audio
   */
  constructor(sourceNode, attach, audio) {
    this.sourceNode = sourceNode
    this.attach = attach
    this.audio = audio
  }

  /**
   * Restores an {@linkcode AudioPlayer} from this snapshot.
   *
   * `attach` and `sourceNode` are copied into the new component, but no graph
   * slot, native source, or graph edge is rebuilt. If `audio` is present,
   * restoration follows {@linkcode Handle#fromSnapshot}: path-backed
   * data uses the world's asset server, while a numeric scene-local locator
   * needs `sceneAssetId` and a matching scene mapping. An unmapped numeric
   * locator leaves the restored player's `audio` undefined.
   *
   * @param {AudioPlayerSnapshot} snapshot - Snapshot being restored.
   * @param {World} world - World used to restore the optional handle.
   * @param {AssetId} [sceneAssetId] - Scene ID for a numeric handle locator.
   * @returns {AudioPlayer} Restored player state.
   */
  static fromSnapshot(snapshot, world, sceneAssetId) {
    const player = new AudioPlayer({
      attach: snapshot.attach,
      audio: /** @type {Handle<Audio>} */(snapshot.audio && Handle.fromSnapshot(snapshot.audio, world, sceneAssetId))
    })

    player.sourceNode = snapshot.sourceNode

    return player
  }

  /**
   * Converts a snapshot into its plain serializable object.
   *
   * The returned object has exactly `sourceNode`, `attach`, and `audio` fields;
   * it is not a JSON string. The nested handle is flattened with
   * {@linkcode HandleSnapshot.serialize} when present. This method does not
   * resolve a handle or validate that any graph ID is live.
   *
   * @param {AudioPlayerSnapshot} value - Snapshot to serialize.
   * @returns {AudioPlayerSnapshotSerial} Plain snapshot data.
   */
  static serialize(value) {
    return {
      sourceNode: value.sourceNode,
      attach: value.attach,
      audio: value.audio ? HandleSnapshot.serialize(value.audio) : undefined
    }
  }

  /**
   * Restores snapshot fields from a plain serializable object.
   *
   * This method copies the three fields and reuses `out` when supplied. A
   * nested `audio` value is rehydrated with
   * {@linkcode HandleSnapshot.deserialize}; no asset handle or graph node is
   * restored at this stage. Validate untrusted data with
   * {@linkcode AudioPlayerSnapshot.validateSerial} first.
   *
   * @param {AudioPlayerSnapshotSerial} value - Plain snapshot data.
   * @param {AudioPlayerSnapshot} [out] - Snapshot object to populate.
   * @returns {AudioPlayerSnapshot} Populated snapshot.
   */
  static deserialize(value, out = new AudioPlayerSnapshot(undefined, undefined, undefined)) {
    out.sourceNode = value.sourceNode
    out.attach = value.attach
    out.audio = value.audio ? HandleSnapshot.deserialize(value.audio, out.audio) : undefined

    return out
  }

  /**
   * Checks the fields and primitive types expected by
   * {@linkcode AudioPlayerSnapshot.deserialize}.
   *
   * It requires all three fields. `sourceNode` and `attach` may be undefined
   * or any JavaScript number, and `audio` may be undefined or a valid
   * {@linkcode HandleSnapshot} serial shape. This is a structural check only: it
   * does not verify that a graph ID is live, that IDs belong to the same graph,
   * or that the nested asset locator can be resolved in a world.
   *
   * @param {unknown} value - Value to check.
   * @returns {value is AudioPlayerSnapshotSerial} Whether the value is valid.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('sourceNode' in value) || !('attach' in value) || !('audio' in value)) {
      return false
    }

    return (value.sourceNode === undefined || typeof value.sourceNode === 'number') &&
      (value.attach === undefined || typeof value.attach === 'number') &&
      (value.audio === undefined || HandleSnapshot.validateSerial(value.audio))
  }
}

/**
 * Releases an {@linkcode AudioPlayer} component's asset handle and stops its active
 * buffer source before the component is removed.
 *
 * {@linkcode AudioPlugin} installs this function as the remove callback in
 * {@linkcode ComponentHooks} for {@linkcode AudioPlayer}. The hook first looks up the
 * world's {@linkcode AudioGraph}, then reads the player from `entity`. If the
 * entity is stale or has no player, it returns without dropping a handle or
 * looking up a graph node. Otherwise it calls {@linkcode Handle#drop}
 * on the optional audio handle and stops the native
 * `AudioBufferSourceNode` stored in the player's graph slot, when one exists.
 *
 * The graph slot, its outgoing edge, and the graph node itself remain in place:
 * {@linkcode AudioGraph} does not currently provide a node-removal operation. The hook
 * also does not remove the entity, clear `sourceNode`, or disconnect the
 * preserved graph edge.
 *
 * @example
 * ```js
 * // AudioPlugin installs this hook for AudioPlayer automatically.
 * function removePlayerComponent(world, entity) {
 *   world.remove(entity, [AudioPlayer])
 *   // The live handle is dropped and any active native source is stopped.
 * }
 * ```
 *
 * @type {ComponentHook}
 * @param {EntityHandle} entity - Entity losing the component.
 * @param {World} world - World containing the player and graph.
 * @returns {void}
 * @category component-hook
 */
export function removeAudioPlayerSink(entity, world) {
  const graph = world.getResource(AudioGraph)
  const audio = world.get(entity, AudioPlayer)

  if (!audio) {
    return
  }

  audio.audio?.drop()

  // SAFETY: The node referenced by the player is guaranteed to be a `AudioBufferSourceNode`.
  const node = /** @type {AudioBufferSourceNode | undefined} */(graph.graph.getNode(audio.sourceNode)?.weight)

  if (node) {
    node.stop()

    // TODO: Remove the audio sink from the graph when removing nodes on a graph
    // is available.
  }
}

/**
 * @typedef AudioPlayerOptions
 * @property {NodeId} [attach] - Graph node to receive playback; defaults to the graph root.
 * @property {Handle<Audio>} [audio] - Audio asset handle to resolve and play.
 */

/**
 * @typedef AudioPlayerSnapshotSerial
 * @property {NodeId | undefined} sourceNode - Persisted graph slot ID.
 * @property {NodeId | undefined} attach - Persisted graph destination ID.
 * @property {HandleSnapshotSerial | undefined} audio - Persisted asset handle data.
 */
