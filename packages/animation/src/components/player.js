/** @import { PlaybackSerial, PlaybackSettings } from '../core'*/
/** @import { AssetId } from '@wimaengine/asset'*/
/** @import { EntityHandle, World } from '@wimaengine/ecs' */
/** @import { AnimationTarget } from './target' */
import { Handle } from '@wimaengine/asset'
import { AnimationClip } from '../assets'
import { Playback } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Manages animation playback state for an entity.
 *
 * Registered animations retain their live asset references while their timing
 * state is managed by the component. Creating the component does not load an
 * asset or begin playback, and serialized state omits live references.
 *
 * Retained references are released when their registrations are removed or the
 * component is dropped.
 *
 * @category component
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import {
 *   AnimationClip,
 *   AnimationClipAssets,
 *   AnimationPlayer,
 *   PlaybackRepeat
 * } from '@wimaengine/animation'
 *
 * const world = new World()
 * const clips = new AnimationClipAssets(AnimationClip)
 * world.setResource(clips)
 *
 * // A real app normally gets this live handle from its animation asset pool
 * // or asset server. This local pool keeps the example self-contained.
 * const animationHandle = clips.add(new AnimationClip())
 * const entity = world.spawn([new AnimationPlayer()])
 * const player = world.get(entity, AnimationPlayer)
 *
 * player
 *   .set(animationHandle, {
 *     duration: 1,
 *     repeatMode: PlaybackRepeat.Forever
 *   })
 *   .start(animationHandle)
 * ```
 */
export class AnimationPlayer {

  /**
   * Maps each animation asset id to its {@linkcode Playback} state.
   *
   * Each key identifies an animation asset, and its value stores the playback
   * settings and current state for that asset. {@linkcode AnimationPlayer#set}
   * adds or replaces an entry, while the playback control methods update the
   * entry for the given id.
   *
   * @public
   * @type {Map<AssetId,Playback>}
   */
  animations = new Map()

  /**
   * Live animation asset handles keyed by the same ids as `animations`.
   *
   * The player keeps the exact handles passed to {@linkcode AnimationPlayer#set}.
   * The map is cleared when an animation entry is removed and by
   * {@linkcode dropAnimationPlayer}, and each stored handle is released before
   * it is removed. {@linkcode AnimationPlayer.serialize} and
   * {@linkcode AnimationPlayer.deserialize} do not include or recreate this map.
   *
   * @public
   * @type {Map<AssetId,Handle<AnimationClip>>}
   */
  handles = new Map()

  /**
   * Optional application-selected animation {@linkcode AssetId}.
   *
   * The value starts as `null` and is not changed when playback entries are
   * added, removed, or controlled. {@linkcode AnimationPlayer.copy} preserves
   * it, and {@linkcode AnimationPlayer.serialize} and
   * {@linkcode AnimationPlayer.deserialize} include it in the serialized
   * player state.
   *
   * @public
   * @type {AssetId | null}
   */
  current = null

  /**
   * Copies playback state, the selected id, and asset-handle references.
   *
   * Each {@linkcode Playback} value is copied into a new {@linkcode Playback}
   * object. Every source handle is cloned, so the returned player owns
   * independent handle references. When `target` is supplied, its maps are
   * cleared first. Its previous handles are not dropped by this method, so
   * release those handles before reusing a populated target.
   *
   * @param {AnimationPlayer} source
   * @param {AnimationPlayer} [target]
   * @returns {AnimationPlayer} The populated target player.
   */
  static copy(source, target = new AnimationPlayer()) {
    const { animations, handles } = target

    animations.clear()
    handles.clear()
    source.animations.forEach((playback, id) => {
      animations.set(id, Playback.copy(playback))
    })
    source.handles.forEach((handle, id) => {
      handles.set(id, handle.clone())
    })

    target.current = source.current

    return target
  }

  /**
   * Creates a player copy with cloned asset-handle references.
   *
   * This delegates to {@linkcode AnimationPlayer.copy}, so playback objects
   * and handles are independent of the source while callback-free values such
   * as `current` are copied directly.
   *
   * @param {AnimationPlayer} target
   * @returns {AnimationPlayer} A new player containing copied state.
   */
  static clone(target) {
    return AnimationPlayer.copy(target)
  }

  /**
   * Converts the player to its serializable playback state.
   *
   * The `animations` map becomes an array of `[assetId, playback]` entries and
   * each playback is passed through {@linkcode Playback.serialize}. The live
   * `handles` map is omitted because handles are runtime references; the
   * returned value contains only `animations` and `current`.
   *
   * @param {AnimationPlayer} value
   * @returns {AnimationPlayerSerial} Serialized player state.
   */
  static serialize(value) {
    return {
      animations: Array.from(value.animations.entries()).map(([id, playback]) => [
        id,
        Playback.serialize(playback)
      ]),
      current: value.current
    }
  }

  /**
   * Checks the object shape accepted by {@linkcode AnimationPlayer.deserialize}.
   *
   * `animations` must be an array of two-item entries containing a numeric
   * asset id and a valid {@linkcode Playback} serial. `current` must be `null` or
   * a number. This check does not confirm that an asset id resolves to a loaded
   * clip, and it does not validate or restore live handles. Guard `null`
   * separately when validating arbitrary input because the current
   * implementation uses property-membership checks after its object check.
   *
   * @param {unknown} value
   * @returns {value is AnimationPlayerSerial} Whether the value has a valid player serial shape.
   */
  static validateSerial(value) {
    if (typeof value !== 'object') {
      return false
    }

    if (!('animations' in value) || !('current' in value)) {
      return false
    }

    if (!Array.isArray(value.animations)) {
      return false
    }

    if (value.current !== null && typeof value.current !== 'number') {
      return false
    }

    for (let i = 0; i < value.animations.length; i++) {
      const entry = value.animations[i]

      if (!Array.isArray(entry) || entry.length !== 2) {
        return false
      }

      const [id, playback] = entry

      if (typeof id !== 'number' || !Playback.validateSerial(playback)) {
        return false
      }
    }

    return true
  }

  /**
   * Restores serialized playback state into a player.
   *
   * A new {@linkcode Playback} is created for each serialized entry and `current`
   * is copied. Deserialization does not recreate asset handles or clear an
   * existing `out.handles` map; the default output therefore has no retained
   * handles, and an application restoring into a populated player must manage
   * those handles explicitly. Validate external data with
   * {@linkcode AnimationPlayer.validateSerial} before calling this
   * method.
   *
   * @param {AnimationPlayerSerial} value
   * @param {AnimationPlayer} [out]
   * @returns {AnimationPlayer} The populated output player.
   */
  static deserialize(value, out = new AnimationPlayer()) {
    out.animations = new Map(
      value.animations.map(([id, playback]) => [id, Playback.deserialize(playback)])
    )
    out.current = value.current

    return out
  }

  /**
   * Registers or replaces playback for an animation asset.
   *
   * The new {@linkcode Playback} is created from `settings` with elapsed time at
   * zero and playback unpaused. The supplied handle is stored directly and
   * keyed by `handle.id()`. If another handle object is already stored for the
   * same id, that old handle is dropped before it is replaced. This method does
   * not load or verify the clip and does not change `current`.
   *
   * @param {Handle<AnimationClip>} handle
   * @param {PlaybackSettings} [settings]
   * @returns {AnimationPlayer} This player.
   */
  set(handle, settings) {
    const playback = new Playback(settings)
    const id = handle.id()
    const existing = this.handles.get(id)

    if (existing && existing !== handle) {
      existing.drop()
    }

    this.animations.set(id, playback)
    this.handles.set(id, handle)

    return this
  }

  /**
   * Returns the playback state registered for an animation asset id.
   *
   * The lookup uses `handle.id()` and does not inspect the asset pool or the
   * `handles` map, so a matching playback can still be returned after
   * deserialization even when no live handle has been reattached.
   *
   * @param {Handle<AnimationClip>} handle
   * @returns {Playback | undefined} The matching playback, when registered.
   */
  get(handle) {
    return this.animations.get(handle.id())
  }

  /**
   * Removes playback for an animation asset and releases its retained handle.
   *
   * If the id is not registered, this is a no-op. The `current` field is not
   * changed, even when it contains the removed id.
   *
   * @param {Handle<AnimationClip>} handle
   * @returns {AnimationPlayer} This player.
   */
  delete(handle) {
    const id = handle.id()
    const existing = this.handles.get(id)

    this.animations.delete(id)
    this.handles.delete(id)
    existing?.drop()

    return this
  }

  /**
   * Resets the matching playback to time zero and starts it.
   *
   * If the handle is not registered, this is a no-op. Returns this player for
   * chaining.
   *
   * @param {Handle<AnimationClip>} handle
   * @returns {AnimationPlayer} This player.
   */
  start(handle) {
    const playback = this.get(handle)

    if (playback) {
      playback.start()
    }

    return this
  }

  /**
   * Resets the matching playback to time zero and pauses it.
   *
   * If the handle is not registered, this is a no-op. Returns this player for
   * chaining.
   *
   * @param {Handle<AnimationClip>} handle
   * @returns {AnimationPlayer} This player.
   */
  stop(handle) {
    const playback = this.get(handle)

    if (playback) {
      playback.stop()
    }

    return this
  }

  /**
   * Resumes the matching playback without resetting its elapsed time.
   *
   * If the handle is not registered, this is a no-op. Returns this player for
   * chaining.
   *
   * @param {Handle<AnimationClip>} handle
   * @returns {AnimationPlayer} This player.
   */
  play(handle) {
    const playback = this.get(handle)

    if (playback) {
      playback.play()
    }

    return this
  }

  /**
   * Pauses the matching playback at its current elapsed time.
   *
   * If the handle is not registered, this is a no-op. Returns this player for
   * chaining.
   *
   * @param {Handle<AnimationClip>} handle
   * @returns {AnimationPlayer} This player.
   */
  pause(handle) {
    const playback = this.get(handle)

    if (playback) {
      playback.pause()
    }

    return this
  }

  /**
   * Resets and starts every registered playback.
   *
   * @returns {AnimationPlayer} This player.
   */
  startAll() {
    this.animations.forEach((playback) => {
      playback.start()
    })

    return this
  }

  /**
   * Resets and pauses every registered playback.
   *
   * @returns {AnimationPlayer} This player.
   */
  stopAll() {
    this.animations.forEach((playback) => {
      playback.stop()
    })

    return this
  }

  /**
   * Resumes every registered playback without resetting elapsed time.
   *
   * @returns {AnimationPlayer} This player.
   */
  playAll() {
    this.animations.forEach((playback) => {
      playback.play()
    })

    return this
  }

  /**
   * Pauses every registered playback at its current elapsed time.
   *
   * @returns {AnimationPlayer} This player.
   */
  pauseAll() {
    this.animations.forEach((playback) => {
      playback.pause()
    })

    return this
  }
}

/**
 * Serialized value produced by {@linkcode AnimationPlayer.serialize} and
 * accepted by {@linkcode AnimationPlayer.deserialize}.
 *
 * It stores serialized playback entries keyed by asset id and preserves the
 * optional current selection. The {@linkcode AnimationPlayer#handles} map
 * contains runtime references and is not included.
 *
 * @typedef AnimationPlayerSerial
 * @property {[AssetId, PlaybackSerial][]} animations - Serialized playback entries keyed by asset id.
 * @property {AssetId | null} current - Optional application-selected asset id.
 */

/**
 * Releases the live handles retained by an {@linkcode AnimationPlayer} component.
 *
 * Register this function as the component's remove callback. It looks up the
 * player with {@linkcode World#get}; if no player is found, it returns
 * without changing anything. Otherwise, it calls `drop()` on every retained
 * handle, then clears both `handles` and `animations`. It does not remove the
 * component or update `current`.
 *
 * @example
 * ```js
 * import { ComponentHooks, World } from '@wimaengine/ecs'
 * import { AnimationPlayer, dropAnimationPlayer } from '@wimaengine/animation'
 *
 * const world = new World()
 * world.setComponentHooks(
 *   AnimationPlayer,
 *   new ComponentHooks(null, dropAnimationPlayer)
 * )
 *
 * const entity = world.spawn([new AnimationPlayer()])
 * world.remove(entity, [AnimationPlayer])
 * // Removing the component also releases its retained handles.
 * ```
 *
 * @param {EntityHandle} entity - Entity whose player component is being removed.
 * @param {World} world - World that owns the entity.
 * @returns {void}
 * @category component-hook
 */
export function dropAnimationPlayer(entity, world) {
  const player = world.get(entity, AnimationPlayer)

  if (!player) {
    return
  }

  player.handles.forEach((handle) => {
    handle.drop()
  })
  player.handles.clear()
  player.animations.clear()
}
/* eslint-enable jsdoc/check-tag-names */
