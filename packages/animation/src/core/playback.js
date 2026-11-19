import { PlaybackRepeat } from './repeat'

/**
 * Represents mutable timing state used to advance one animation.
 *
 * It advances an animation position while active and applies the selected
 * {@linkcode PlaybackRepeat} rule at the duration boundary. It does not load or
 * validate animation data, so callers provide the timing context and decide
 * how to use the resulting position.
 *
 * @example
 * ```js
 * import { AnimationPlayer, Playback, PlaybackRepeat } from '@wimaengine/animation'
 *
 * const player = new AnimationPlayer()
 * const playback = new Playback({
 *   duration: 2,
 *   repeatMode: PlaybackRepeat.Forever
 * })
 *
 * player.animations.set(42, playback)
 * playback.update(0.5)
 * console.log(playback.elapsed) // 0.5
 * ```
 */
export class Playback {

  /**
   * Multiplier applied to the delta passed to {@linkcode Playback#update}.
   * A value of `1` advances at normal speed, while `0` leaves elapsed time
   * unchanged during an update. No range or finiteness check is performed.
   *
   * @type {number}
   */
  speed

  /**
   * Duration used by {@linkcode Playback#update} as the non-repeating upper
   * bound or the repeating modulus. It is not automatically read from an
   * {@linkcode AnimationClip}.
   *
   * @type {number}
   */
  duration

  /**
   * Current position within the playback duration. It starts at `0`; updates
   * in {@linkcode PlaybackRepeat.None} mode clamp it only from above, while
   * {@linkcode PlaybackRepeat.Forever} mode wraps it with the JavaScript remainder
   * operator.
   *
   * @type {number}
   */
  elapsed = 0

  /**
   * Rule used by {@linkcode Playback#update} after applying `speed` to its delta.
   * It defaults to {@linkcode PlaybackRepeat.None}.
   *
   * @type {PlaybackRepeat}
   */
  repeatMode

  /**
   * Whether updates are ignored. A new playback is unpaused; pausing preserves
   * the current `elapsed` value.
   *
   * @type {boolean}
   */
  paused = false

  /**
   * Creates playback state with a duration of `1`, normal speed, no repeat,
   * zero elapsed time, and an unpaused state unless the value is changed after
   * construction.
   *
   * `elapsed` and `paused` are initialized by the class fields and are not
   * constructor options. The constructor does not validate the supplied
   * numbers or repeat mode.
   *
   * @param {PlaybackSettings} [options={}] - Initial duration, speed, and repeat mode.
   */
  constructor({
    duration = 1,
    speed = 1,
    repeatMode = PlaybackRepeat.None
  } = {}) {
    this.duration = duration
    this.speed = speed
    this.repeatMode = repeatMode
  }

  /**
   * Creates playback with its constructor defaults.
   *
   * @returns {Playback} A new default playback value.
   */
  static default() {
    return new Playback()
  }

  /**
   * Copies all playback fields into a playback value.
   *
   * The five scalar fields are assigned directly. If `target` is omitted, a
   * new {@linkcode Playback} is created; if it is supplied, that same object is
   * populated and returned.
   *
   * @param {Playback} source - Playback state to copy.
   * @param {Playback} [target=new Playback()] - Value to populate.
   * @returns {Playback} The populated target playback.
   */
  static copy(source, target = new Playback()) {
    target.duration = source.duration
    target.speed = source.speed
    target.repeatMode = source.repeatMode
    target.elapsed = source.elapsed
    target.paused = source.paused

    return target
  }

  /**
   * Creates an independent playback value with the same scalar state.
   *
   * @param {Playback} target - Playback state to clone.
   * @returns {Playback} A new playback value.
   */
  static clone(target) {
    return Playback.copy(target)
  }

  /**
   * Converts playback state to its serializable five-field representation.
   *
   * The returned object contains `speed`, `duration`, `elapsed`, `repeatMode`,
   * and `paused` in that shape; it is a new object and does not modify the
   * playback value.
   *
   * @param {Playback} value - Playback state to serialize.
   * @returns {PlaybackSerial} Serialized playback state.
   */
  static serialize(value) {
    return {
      speed: value.speed,
      duration: value.duration,
      elapsed: value.elapsed,
      repeatMode: value.repeatMode,
      paused: value.paused
    }
  }

  /**
   * Restores serialized fields into a playback value.
   *
   * The supplied `out` value is updated in place, or a new {@linkcode Playback}
   * is created when it is omitted. This method copies fields without
   * validating them; call {@linkcode Playback.validateSerial} first for
   * untrusted input.
   *
   * @param {PlaybackSerial} value - Serialized playback state.
   * @param {Playback} [out=new Playback()] - Value to populate.
   * @returns {Playback} The populated output playback.
   */
  static deserialize(value, out = new Playback()) {
    out.speed = value.speed
    out.duration = value.duration
    out.elapsed = value.elapsed
    out.repeatMode = value.repeatMode
    out.paused = value.paused

    return out
  }

  /**
   * Checks the shallow serialized shape used by {@linkcode Playback.deserialize}.
   *
   * A non-null object must contain all five fields with number types for
   * `speed`, `duration`, `elapsed`, and `repeatMode`, and a boolean type for
   * `paused`. The validator does not check finite values, numeric ranges, or
   * whether `repeatMode` is one of {@linkcode PlaybackRepeat}'s values. The
   * current implementation does not guard `null`, so callers must pass a
   * non-null value or guard it before calling.
   *
   * @param {unknown} value
   * @returns {value is PlaybackSerial} Whether the value has the required field types.
   */
  static validateSerial(value) {
    if (typeof value !== 'object') {
      return false
    }

    if (!('speed' in value) ||
      !('duration' in value) ||
      !('elapsed' in value) ||
      !('repeatMode' in value) ||
      !('paused' in value)
    ) {
      return false
    }

    return typeof value.speed === 'number' &&
      typeof value.duration === 'number' &&
      typeof value.elapsed === 'number' &&
      typeof value.repeatMode === 'number' &&
      typeof value.paused === 'boolean'
  }

  /**
   * Resets elapsed time to `0` and resumes playback.
   *
   * @returns {void}
   */
  start() {
    this.elapsed = 0
    this.play()
  }

  /**
   * Resets elapsed time to `0` and pauses playback.
   *
   * @returns {void}
   */
  stop() {
    this.elapsed = 0
    this.pause()
  }

  /**
   * Resumes playback without changing elapsed time.
   *
   * @returns {void}
   */
  play() {
    this.paused = false
  }

  /**
   * Pauses playback at its current elapsed time.
   *
   * @returns {void}
   */
  pause() {
    this.paused = true
  }

  /**
   * Advances elapsed time unless the playback is paused.
   *
   * The effective step is `delta * speed`. With
   * {@linkcode PlaybackRepeat.None}, elapsed time is capped at `duration` with
   * `Math.min`, so a negative step is not clamped at zero. With
   * {@linkcode PlaybackRepeat.Forever}, elapsed time is reduced modulo `duration`
   * and therefore wraps after each duration. Any other numeric repeat value
   * leaves the effective step unnormalized. A zero duration in repeat mode
   * follows JavaScript remainder behavior and produces `NaN`.
   *
   * @param {number} delta - Time step in the same units as `duration`.
   * @returns {void}
   */
  update(delta) {
    if (this.paused) {
      return
    }

    const seekTime = this.elapsed + delta * this.speed

    this.elapsed = seekTime
    switch (this.repeatMode) {
      case PlaybackRepeat.None:
        this.elapsed = Math.min(this.duration, seekTime)
        break

      case PlaybackRepeat.Forever:

        this.elapsed %= this.duration
        break
    }
  }
}

/**
 * Serialized form of {@linkcode Playback}.
 *
 * @typedef PlaybackSerial
 * @property {number} speed - Playback-rate multiplier.
 * @property {number} duration - Non-repeating upper bound or repeat modulus.
 * @property {number} elapsed - Current playback position.
 * @property {number} repeatMode - Numeric value from {@linkcode PlaybackRepeat}.
 * @property {boolean} paused - Whether updates are ignored.
 */

/**
 * Optional initial values accepted by the {@linkcode Playback} constructor.
 *
 * @typedef PlaybackSettings
 * @property {number} [duration=1] - Duration used by updates.
 * @property {number} [speed=1] - Multiplier applied to update deltas.
 * @property {PlaybackRepeat} [repeatMode=PlaybackRepeat.None] - Repeat rule.
 */
