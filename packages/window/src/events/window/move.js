import { Vector2 } from '@wimaengine/math'

/**
 * Captures the position reported by a window movement event.
 *
 * The event value stores the supplied numeric coordinates in a reusable
 * {@linkcode Vector2} `position` field. It contains the payload at event-creation
 * time, so consumers can read the coordinates without retaining the source
 * window event.
 *
 * @example
 * ```js
 * const move = new WindowMove(320, 180)
 * console.log(move.position.x, move.position.y) // 320 180
 * ```
 */
export class WindowMove {

  /**
   * Window coordinates copied from the constructor's `x` and `y` arguments
   * into {@linkcode Vector2}.
   *
   * @readonly
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * Creates a window movement event value with the supplied coordinates stored
   * in `position`.
   *
   * @param {number} x - Horizontal window coordinate.
   * @param {number} y - Vertical window coordinate.
   */
  constructor(x, y) {
    this.position.set(x, y)
  }
}
