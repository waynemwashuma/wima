/** @import { AnimationEffectorEnforcer } from './animationeffector' */
import { lerp } from '@wimaengine/math'

/**
 * Stores and evaluates timed numeric keyframes for one animated property.
 *
 * An {@linkcode AnimationClip} can group tracks by name. A track pairs one time
 * entry with each flattened keyframe value set, using its effector to determine
 * the values consumed per keyframe. Evaluate it with
 * {@linkcode AnimationTrack#getCurrent}, then pass the result to that effector
 * for the target selected by {@linkcode AnimationTarget}.
 *
 * The track performs component-wise linear interpolation only; it does not
 * apply values to an entity itself. Use an {@linkcode AnimationEffector} such as
 * {@linkcode Position2DAnimationEffector} to consume the evaluated values.
 *
 * @example
 * ```js
 * import {
 *   AnimationClip,
 *   AnimationTrack,
 *   Position2DAnimationEffector
 * } from '@wimaengine/animation'
 *
 * const track = new AnimationTrack(Position2DAnimationEffector)
 * track.times = [0, 1]
 * track.keyframes = [0, 0, 10, 4]
 *
 * const clip = new AnimationClip().add('player', track)
 * clip.calculateDuration()
 * console.log(track.getCurrent(0.5)) // [5, 2]
 * // A target with id 'player' associates this track with that target.
 * ```
 */
export class AnimationTrack {

  /**
   * Nondecreasing timestamps, in the same time units used by playback.
   * Duplicate timestamps are accepted by
   * {@linkcode AnimationTrack#validate}.
   *
   * @type {number[]}
   */
  times = []

  /**
   * Flattened numeric keyframe values. Each timestamp consumes exactly
   * `effector.elementSize()` consecutive entries.
   *
   * @type {number[]}
   */
  keyframes = []

  /**
   * Effector contract used to determine keyframe width and later apply the
   * interpolated values to an entity. The reference is stored directly.
   *
   * @type {AnimationEffectorEnforcer}
   */
  effector

  /**
   * Creates an empty track for an animation effector.
   *
   * `times` and `keyframes` start as new empty arrays. The effector is stored
   * without validation, so it must provide the methods expected by
   * {@linkcode AnimationTrack#validate} and
   * {@linkcode AnimationTrack#getCurrent}.
   *
   * @param {AnimationEffectorEnforcer} effector - Effector defining the values per keyframe.
   */
  constructor(effector) {
    this.effector = effector
  }

  /**
   * Checks the in-memory keyframe layout.
   *
   * Timestamps must be in nondecreasing order, and the flattened keyframe
   * length must equal `times.length * effector.elementSize()`. The method does
   * not check that entries are finite numbers, does not require a non-empty
   * track, and can throw if the effector does not provide `elementSize()`.
   * Empty arrays therefore pass when the effector reports a positive element
   * size, although interpolation still requires at least one keyframe.
   *
   * @returns {boolean} Whether the arrays satisfy the track layout.
   */
  validate() {

    // Validates keyframe times are in ascending order
    for (let i = 1; i < this.times.length; i++) {
      const last = this.times[i - 1]
      const current = this.times[i]

      if (last > current) {
        return false
      }
    }

    // the len of keyframes is equal to times
    if (this.keyframes.length / this.effector.elementSize() !== this.times.length) {
      return false
    }

    return true
  }

  /**
   * Returns the number of timed keyframes in the track.
   *
   * @returns {number} The length of {@linkcode AnimationTrack#times}.
   */
  length() {
    return this.times.length
  }

  /**
   * Converts a track to serialized arrays and its effector reference.
   *
   * The `times` and `keyframes` arrays are shallow-copied. The `effector`
   * reference is returned directly; it is neither cloned nor converted.
   *
   * @param {AnimationTrack} value - Track to serialize.
   * @returns {AnimationTrackSerial} Serialized track data.
   */
  static serialize(value) {
    return {
      times: value.times.slice(),
      keyframes: value.keyframes.slice(),
      effector: value.effector
    }
  }

  /**
   * Restores serialized track fields into a track value.
   *
   * Both arrays are copied with `slice()`, and the effector reference is
   * assigned directly. The method does not call
   * {@linkcode AnimationTrack#validate} or validate the serialized input;
   * when `out` is omitted, it first creates a track with a temporary null
   * effector and then replaces it.
   *
   * @param {AnimationTrackSerial} value - Serialized track data.
   * @param {AnimationTrack} [out] - Track to populate.
   * @returns {AnimationTrack} The populated output track.
   */
  static deserialize(value, out = new AnimationTrack(/** @type {any} */ (null))) {
    out.times = value.times.slice()
    out.keyframes = value.keyframes.slice()
    out.effector = value.effector

    return out
  }

  /**
   * Checks the shallow serialized shape used by
   * {@linkcode AnimationTrack.deserialize}.
   *
   * A non-null object must contain `times`, `keyframes`, and `effector`.
   * `times` and `keyframes` must be arrays containing only values whose
   * `typeof` is `"number"`; `effector` only needs to be non-null and
   * non-undefined. This check does not verify timestamp ordering, keyframe
   * width, finite values, or the effector's methods.
   *
   * @param {unknown} value
   * @returns {value is AnimationTrackSerial} Whether the serialized shape is valid.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('times' in value) || !('keyframes' in value) || !('effector' in value)) {
      return false
    }

    if (!Array.isArray(value.times) || !Array.isArray(value.keyframes)) {
      return false
    }

    for (let i = 0; i < value.times.length; i++) {
      if (typeof value.times[i] !== 'number') {
        return false
      }
    }

    for (let i = 0; i < value.keyframes.length; i++) {
      if (typeof value.keyframes[i] !== 'number') {
        return false
      }
    }

    return value.effector !== undefined && value.effector !== null
  }

  /**
   * Evaluates the track at a time using component-wise linear interpolation.
   *
   * Values before or at the first timestamp resolve to the first keyframe;
   * values after or at the last timestamp resolve to the last keyframe. A
   * time between keyframes is interpolated independently for each effector
   * element. The track must contain at least one keyframe and have a valid
   * effector layout; this method does not call `validate()` first.
   *
   * @param {number} delta - Time at which to evaluate the track.
   * @returns {number[]} Interpolated values with the effector's element size.
   */
  getCurrent(delta) {
    const [indexA, indexB, t] = this.getCurrentLerp(delta)

    const computed = []
    const elementSize = this.effector.elementSize()

    for (let i = 0; i < elementSize; i++) {
      const a = this.keyframes[indexA * elementSize + i]
      const b = this.keyframes[indexB * elementSize + i]

      const value = lerp(a, b, t)

      computed[i] = value
    }

    return computed
  }

  /**
   * Finds the keyframe interval and interpolation amount for a time.
   *
   * The result is `[indexA, indexB, t]`. At or before the first timestamp it
   * is `[0, 0, 0]`; at or after the last timestamp it is
   * `[lastIndex, lastIndex, 0]`. For an interior time, `indexA` is the
   * preceding keyframe, `indexB` is the first keyframe whose timestamp is at
   * least `delta`, and `t` is the normalized distance between them.
   *
   * This method assumes a non-empty, nondecreasing `times` array and does not
   * validate it. Duplicate timestamps are permitted by `validate()`; interval
   * selection at a duplicate boundary follows the first timestamp that is at
   * least `delta`.
   *
   * @param {number} delta - Time at which to find an interval.
   * @returns {[number, number, number]} Two keyframe indexes and interpolation amount.
   */
  getCurrentLerp(delta) {
    const lastindex = this.times.length - 1
    let timestamp = 0

    if (delta <= this.times[0]) {
      return [0, 0, 0]
    }
    if (delta >= this.times[lastindex]) {
      return [lastindex, lastindex, 0]
    }

    for (let i = 0; i < this.times.length; i++) {
      if (this.times[i] >= delta) {
        timestamp = i
        break
      }
    }

    const start = this.times[timestamp - 1]
    const end = this.times[timestamp]

    const distance = start - end
    const covered = start - delta
    const centage = covered / distance

    return [timestamp - 1, timestamp, centage]
  }
}

/**
 * Serialized value produced by {@linkcode AnimationTrack.serialize} and accepted
 * by {@linkcode AnimationTrack.deserialize}.
 *
 * It contains copied timing and keyframe arrays plus the effector reference
 * needed to interpret each flattened keyframe.
 *
 * @typedef AnimationTrackSerial
 * @property {number[]} times - Nondecreasing keyframe timestamps.
 * @property {number[]} keyframes - Flattened values grouped by effector width.
 * @property {any} effector - Effector reference used by the track.
 */
