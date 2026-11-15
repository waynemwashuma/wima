/**
 * Defines how {@linkcode Playback} treats elapsed animation time at the duration
 * boundary.
 *
 * The non-repeating rule stops at the duration, while the repeating rule wraps
 * elapsed time to the start of another cycle. {@linkcode Playback} uses the
 * non-repeating rule by default.
 *
 * @example
 * ```js
 * import { Playback, PlaybackRepeat } from '@wimaengine/animation'
 *
 * const playback = new Playback({
 *   duration: 2,
 *   repeatMode: PlaybackRepeat.Forever
 * })
 * playback.update(2.5)
 * console.log(playback.elapsed) // 0.5
 * ```
 *
 * @enum {number}
 */
export const PlaybackRepeat = {

  /**
   * The non-repeating rule for {@linkcode Playback}. It caps `elapsed` at
   * `duration` after each update without pausing playback; a negative seek can
   * still leave `elapsed` below zero.
   *
   * @readonly
   */
  None: 0,

  /**
   * The repeating rule for {@linkcode Playback}. It wraps `elapsed` with
   * `elapsed % duration` after each update, so positive values repeat from the
   * start while negative values retain JavaScript's negative-remainder
   * behavior.
   *
   * @readonly
   */
  Forever: 1
}
