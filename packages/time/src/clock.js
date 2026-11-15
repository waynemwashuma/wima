/** @import {VirtualClock} from './resource' */

/**
 * Tracks elapsed time and the duration of the most recent update.
 *
 * Supply timestamps to {@linkcode Clock#update} to record a duration in seconds
 * and accumulate elapsed seconds. Use {@linkcode Clock#start} to reset the
 * accumulated values when a new timing interval begins. For a shared
 * application clock, use {@linkcode VirtualClock}.
 *
 * @example
 * ```js
 * import { Clock } from '@wimaengine/time'
 *
 * const clock = new Clock()
 *
 * clock.update(1000)
 * console.log(clock.getDelta()) // 1 second
 *
 * clock.update(1016)
 * console.log(clock.getDelta()) // 0.016 seconds
 * console.log(clock.getElapsed()) // 1.016 seconds
 * console.log(clock.getFrameRate()) // 62.5 frames per second
 *
 * clock.start()
 * console.log(clock.getElapsed()) // 0
 * ```
 */
export class Clock {

  /**
   * Total time accumulated by {@linkcode Clock#update}, in seconds.
   *
   * @private
   * @type {number}
   */
  elapsed = 0

  /**
   * Timestamp supplied to the most recent update, in milliseconds.
   *
   * @private
   * @type {number}
   */
  lastTick = 0

  /**
   * Duration calculated by the most recent update, in seconds.
   *
   * @private
   * @type {number}
   */
  delta = 0

  /**
   * Resets the elapsed time and current frame delta to zero.
   *
   * The last update timestamp is preserved. The next call to
   * {@linkcode Clock#update} therefore measures from the timestamp before the
   * reset.
   *
   * @returns {void}
   */
  start() {
    Clock.start(this)
  }

  /**
   * Returns the total time accumulated by the clock, in seconds.
   *
   * @returns {number} Elapsed time in seconds.
   */
  getElapsed() {
    return Clock.getElapsed(this)
  }

  /**
   * Returns the duration calculated by the most recent update, in seconds.
   *
   * This is `0` before the first update and after {@linkcode Clock#start}.
   *
   * @returns {number} The most recent frame delta in seconds.
   */
  getDelta() {
    return Clock.getDelta(this)
  }

  /**
   * Returns the instantaneous frame rate derived from the current delta.
   *
   * The value is calculated as `1 / delta`; it is not averaged or smoothed.
   * When the delta is `0`, JavaScript returns `Infinity`.
   *
   * @returns {number} Frames per second for the most recent delta.
   */
  getFrameRate() {
    return Clock.getFrameRate(this)
  }

  /**
   * Advances the clock using an absolute timestamp.
   *
   * The timestamp is expected in milliseconds, matching `performance.now()`.
   * The resulting delta and the accumulated elapsed time are in seconds.
   * With no argument, the method uses `performance.now()`.
   *
   * @param {number} [accumulate] - Timestamp in milliseconds. Defaults to `performance.now()`.
   * @returns {number} The duration since the previous update, in seconds.
   */
  update(accumulate = performance.now()) {
    return Clock.update(this, accumulate)
  }

  /**
   * Resets a clock's elapsed time and current frame delta to zero.
   *
   * `lastTick` is intentionally left unchanged, so the next update measures
   * from the timestamp that was recorded before the reset.
   *
   * @param {Clock} clock - {@linkcode Clock} to reset.
   * @returns {void}
   */
  static start(clock) {
    clock.elapsed = 0
    clock.delta = 0
  }

  /**
   * Gets the total elapsed time of a clock, in seconds.
   *
   * @param {Clock} clock - {@linkcode Clock} to read.
   * @returns {number} Elapsed time in seconds.
   */
  static getElapsed(clock) {
    return clock.elapsed
  }

  /**
   * Gets the duration calculated by the most recent update, in seconds.
   *
   * @param {Clock} clock - {@linkcode Clock} to read.
   * @returns {number} The most recent frame delta in seconds.
   */
  static getDelta(clock) {
    return clock.delta
  }

  /**
   * Gets the instantaneous frame rate derived from the current delta.
   *
   * The result is `1 / clock.delta`; a zero delta therefore produces
   * JavaScript's `Infinity` rather than a finite or averaged frame rate.
   *
   * @param {Clock} clock - {@linkcode Clock} to read.
   * @returns {number} Frames per second for the most recent delta.
   */
  static getFrameRate(clock) {
    return 1 / clock.delta
  }

  /**
   * Advances a clock using an absolute timestamp in milliseconds.
   *
   * The difference between the supplied timestamp and the previous
   * `lastTick` is divided by `1000` to produce a delta in seconds. That delta
   * is added to `elapsed`, then the supplied timestamp is stored as
   * `lastTick`. When omitted, the timestamp defaults to `performance.now()`.
   *
   * @param {Clock} clock - {@linkcode Clock} to advance.
   * @param {number} [accumulate] - Timestamp in milliseconds. Defaults to `performance.now()`.
   * @returns {number} The duration since the previous update, in seconds.
   */
  static update(clock, accumulate = performance.now()) {
    clock.delta = (accumulate - clock.lastTick) / 1000
    clock.elapsed += clock.delta
    clock.lastTick = accumulate

    return clock.delta
  }

  /**
   * Converts a clock into the plain state used by the type registry.
   *
   * The returned object contains the elapsed time and delta in seconds, plus
   * the most recent timestamp in milliseconds.
   *
   * @param {Clock} value - {@linkcode Clock} to serialize.
   * @returns {ClockSerial} The {@linkcode ClockSerial} state.
   */
  static serialize(value) {
    return {
      elapsed: value.elapsed,
      lastTick: value.lastTick,
      delta: value.delta
    }
  }

  /**
   * Restores clock state from a serialized value.
   *
   * When `out` is supplied, it is updated and returned. Otherwise a new
   * {@linkcode Clock} is created. Deserialization restores `elapsed`, `lastTick`, and
   * `delta` exactly; it does not advance the clock or read the current time.
   *
   * @param {ClockSerial} value - {@linkcode ClockSerial} state.
   * @param {Clock} [out] - {@linkcode Clock} to populate.
   * @returns {Clock} The restored {@linkcode Clock}.
   */
  static deserialize(value, out = new Clock()) {
    out.elapsed = value.elapsed
    out.lastTick = value.lastTick
    out.delta = value.delta

    return out
  }
}

/**
 * Serialized state for {@linkcode Clock}.
 *
 * @typedef ClockSerial
 * @property {number} elapsed - Accumulated elapsed time in seconds.
 * @property {number} lastTick - Most recent update timestamp in milliseconds.
 * @property {number} delta - Most recent frame duration in seconds.
 */
