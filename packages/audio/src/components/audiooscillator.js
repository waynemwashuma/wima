/** @import { NodeId } from '@wimaengine/datastructures' */
/** @import { ComponentHook, EntityHandle, World } from '@wimaengine/ecs' */
import { AudioGraph } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores waveform settings and playback state for procedural Web Audio on an
 * ECS entity.
 *
 * Pair it with {@linkcode Timer} to control when playback starts, pauses, or
 * repeats. The component supplies the waveform, pitch, detuning, graph
 * destination, and playback state used to create a browser oscillator.
 *
 * @category component
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AudioOscillator } from '@wimaengine/audio'
 * import { Timer, TimerMode } from '@wimaengine/time'
 *
 * const world = new World()
 * const entity = world.spawn([
 *   new AudioOscillator({ frequency: 440 }),
 *   new Timer({ duration: 1, mode: TimerMode.Repeat })
 * ])
 *
 * // The timer controls when the oscillator starts and, in Once mode, when it
 * // stops.
 * console.log(world.get(entity, AudioOscillator).frequency) // 440
 * ```
 */
export class AudioOscillator {

  /**
   * ID of this oscillator's slot in the world's {@linkcode AudioGraph}.
   * It is undefined until the component is associated with a graph slot. The
   * slot can contain `undefined` while playback is paused or complete, so this
   * value identifies the slot rather than the native {@linkcode OscillatorNode}
   * itself. With a paired {@linkcode Timer}, playback changes create or clear the
   * native oscillator stored in the slot. A paused or completed
   * {@linkcode TimerMode.Once} timer clears the slot's current oscillator; a
   * {@linkcode TimerMode.Repeat} timer keeps it available until playback is
   * paused or stopped.
   *
   * @type {NodeId | undefined}
   */
  sourceNode

  /**
   * Waveform used for oscillator playback. Use a value from
   * {@linkcode AudioOscillatorType}; the default is
   * {@linkcode AudioOscillatorType.Sine}.
   *
   * @type {AudioOscillatorType}
   */
  type

  /**
   * Optional {@linkcode AudioGraph} node that receives this oscillator. When
   * undefined, the reserved slot connects to the graph's destination root.
   * The value is used when `sourceNode` is first assigned; changing it later
   * does not rewire the existing graph edge.
   *
   * @type {NodeId | undefined}
   */
  attach

  /**
   * Detuning passed to the Web Audio oscillator, in cents. The default is `0`.
   * This value is read when a new native oscillator is created; changing it
   * does not update an already active node.
   *
   * @type {number}
   */
  detune

  /**
   * Oscillator frequency passed to Web Audio, in hertz. The default is `440`.
   * This value is read when a new native oscillator is created; changing it
   * does not update an already active node.
   *
   * @type {number}
   */
  frequency

  /**
   * Creates an oscillator component with the supplied initial waveform,
   * frequency, detuning, and graph destination. `sourceNode` starts undefined;
   * pair the component with a {@linkcode Timer} when playback should be controlled
   * by timer state. The constructor stores the settings without validating
   * waveform membership or numeric ranges.
   *
   * @param {AudioOscillatorOptions} [options] - Waveform, frequency, detune,
   * and destination graph node.
   */
  constructor({
    attach,
    type = AudioOscillatorType.Sine,
    detune = 0,
    frequency = 440
  } = {}) {
    this.attach = attach
    this.type = type
    this.detune = detune
    this.frequency = frequency
  }

  /**
   * Copies oscillator settings and runtime graph-slot state into a component.
   * All five fields are assigned as primitive values. This method does not
   * create a graph node, reconnect `attach`, or duplicate a native oscillator.
   *
   * @param {AudioOscillator} source - Component to copy.
   * @param {AudioOscillator} [target=new AudioOscillator()] - Component to
   * populate.
   * @returns {AudioOscillator} The populated target component.
   */
  static copy(source, target = new AudioOscillator()) {
    target.sourceNode = source.sourceNode
    target.attach = source.attach
    target.type = source.type
    target.detune = source.detune
    target.frequency = source.frequency

    return target
  }

  /**
   * Creates a component with the source's five field values.
   * This delegates to {@linkcode AudioOscillator.copy}; `sourceNode` remains only
   * an ID and no Web Audio node is duplicated.
   *
   * @param {AudioOscillator} target - Component to clone.
   * @returns {AudioOscillator} A new component with copied field values.
   */
  static clone(target) {
    return AudioOscillator.copy(target)
  }

  static default() {
    return new AudioOscillator()
  }

  /**
   * Converts the component into its serialized field object.
   * `sourceNode` is included as-is even though it identifies runtime graph
   * state rather than a portable Web Audio node.
   *
   * @param {AudioOscillator} value - Component to serialize.
   * @returns {AudioOscillatorSerial} Serialized oscillator fields.
   */
  static serialize(value) {
    return {
      sourceNode: value.sourceNode,
      attach: value.attach,
      type: value.type,
      detune: value.detune,
      frequency: value.frequency
    }
  }

  /**
   * Restores serialized fields into a new or supplied component.
   * Deserialization only assigns values; it does not validate them, rebuild a
   * graph slot, or reconnect the restored `sourceNode`.
   *
   * @param {AudioOscillatorSerial} value - Serialized oscillator fields.
   * @param {AudioOscillator} [out=new AudioOscillator()] - Component to fill.
   * @returns {AudioOscillator} The restored component.
   */
  static deserialize(value, out = new AudioOscillator()) {
    out.sourceNode = value.sourceNode
    out.attach = value.attach
    out.type = value.type
    out.detune = value.detune
    out.frequency = value.frequency

    return out
  }

  /**
   * Checks the field shape and primitive types accepted by
   * {@linkcode AudioOscillator.deserialize}.
   * The check permits undefined or numeric node IDs, requires numeric waveform,
   * detune, and frequency fields, and does not enforce finite values, numeric
   * ranges, or valid {@linkcode AudioOscillatorType} members.
   *
   * @param {unknown} value - Value to check.
   * @returns {value is AudioOscillatorSerial} Whether `value` has a valid
   * serialized shape.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('sourceNode' in value) || !('attach' in value) || !('type' in value) || !('detune' in value) || !('frequency' in value)) {
      return false
    }

    return (value.sourceNode === undefined || typeof value.sourceNode === 'number') &&
      (value.attach === undefined || typeof value.attach === 'number') &&
      typeof value.type === 'number' &&
      typeof value.detune === 'number' &&
      typeof value.frequency === 'number'
  }
}
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stops an {@linkcode AudioOscillator} component's active native oscillator before
 * the component is removed.
 *
 * {@linkcode AudioPlugin} installs this function as the remove callback in
 * {@linkcode ComponentHooks} for {@linkcode AudioOscillator}. The hook looks up the
 * world's {@linkcode AudioGraph}, reads the oscillator from `entity`, and stops
 * the native {@linkcode OscillatorNode} stored in the component's graph slot when
 * one exists. A paused or completed oscillator may have no native node in that
 * slot.
 *
 * The graph slot, its outgoing edge, and the graph node itself remain in place:
 * {@linkcode AudioGraph} does not currently provide a node-removal operation. The
 * hook does not remove the entity, clear `sourceNode`, or disconnect the
 * preserved graph edge. Unlike {@linkcode removeAudioPlayerSink}, it does not
 * guard a missing component, because the registered hook expects the component
 * to be present when an oscillator is removed.
 *
 * @example
 * ```js
 * // AudioPlugin installs this hook for AudioOscillator automatically.
 * function removeOscillatorComponent(world, entity) {
 *   world.remove(entity, [AudioOscillator])
 *   // Any active native oscillator is stopped; graph topology is retained.
 * }
 * ```
 *
 * @type {ComponentHook}
 * @param {EntityHandle} entity - Entity losing the component.
 * @param {World} world - World containing the oscillator and graph.
 * @returns {void}
 * @category component-hook
 */
export function removeOscillatorSink(entity, world) {
  const graph = world.getResource(AudioGraph)
  const audio = world.get(entity, AudioOscillator)

  // SAFETY: The node referenced by the player is guaranteed to be a `OscillatorNode`.
  const node = /** @type {OscillatorNode | undefined} */ (graph.graph.getNode(audio.sourceNode)?.weight)

  if (node) {
    node.stop()

    // TODO: Remove the audio sink from the graph when removing nodes on a graph
    // is available.
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * Numeric waveform choices for an {@linkcode AudioOscillator}.
 *
 * Set an oscillator's `type` to one of these members to select the matching
 * native {@linkcode OscillatorNode} waveform:
 * {@linkcode AudioOscillatorType.SawTooth} selects `sawtooth`,
 * {@linkcode AudioOscillatorType.Sine} selects `sine`,
 * {@linkcode AudioOscillatorType.Triangle} selects `triangle`, and
 * {@linkcode AudioOscillatorType.Square} selects `square`.
 * {@linkcode AudioOscillatorType.Sine} is the default selected by the
 * {@linkcode AudioOscillator} constructor.
 *
 * The values are plain numbers. The constructor accepts and stores any
 * number, and {@linkcode AudioOscillator.validateSerial} accepts any numeric
 * waveform value. If a number outside these members is used, playback throws
 * before an oscillator is created. Use one of these members for a waveform
 * value the playback path recognizes.
 *
 * @readonly
 * @enum {number}
 *
 * @example
 * ```js
 * import { AudioOscillator, AudioOscillatorType } from '@wimaengine/audio'
 *
 * const component = new AudioOscillator({ type: AudioOscillatorType.Square })
 * console.log(component.type) // 3; the oscillator produces a square waveform.
 * ```
 */
export const AudioOscillatorType = {

  /** Selects the native `sawtooth` waveform (`0`) for oscillator playback. */
  SawTooth: 0,

  /** Selects the native `sine` waveform (`1`); the component default. */
  Sine: 1,

  /** Selects the native `triangle` waveform (`2`) for oscillator playback. */
  Triangle: 2,

  /** Selects the native `square` waveform (`3`) for oscillator playback. */
  Square: 3
}

/**
 * @typedef AudioOscillatorOptions
 * @property {NodeId} [attach] - Graph destination; defaults to the graph root.
 * @property {AudioOscillatorType} [type] - Waveform; defaults to
 * {@linkcode AudioOscillatorType.Sine}.
 * @property {number} [frequency] - Frequency in hertz; defaults to `440`.
 * @property {number} [detune] - Detuning in cents; defaults to `0`.
 */

/**
 * @typedef AudioOscillatorSerial
 * @property {NodeId | undefined} sourceNode - Persisted graph slot ID.
 * @property {NodeId | undefined} attach - Persisted graph destination ID.
 * @property {AudioOscillatorType} type - Numeric waveform value.
 * @property {number} detune - Detuning in cents.
 * @property {number} frequency - Frequency in hertz.
 */
