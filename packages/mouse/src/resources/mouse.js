import { Vector2, Vector3 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the current mouse-pointer motion and wheel state as a world resource.
 *
 * The pointer position is local to the input target. Movement and wheel values
 * describe the mouse input received during the current update.
 *
 * If there is no mouse input during an update, the pointer position stays
 * unchanged and the movement and wheel values are zero. Use
 * {@linkcode MouseButtons} for mouse-button state.
 *
 * @example
 * ```js
 * // Read the current mouse state:
 * function readMouse(world) {
 *   const mouse = world.getResource(Mouse)
 *
 *   if (mouse.moved()) {
 *     console.log(mouse.position.x, mouse.position.y, mouse.delta.x, mouse.delta.y)
 *   }
 * }
 * ```
 *
 * @category resource
 */
export class Mouse {

  /**
   * Pointer position from the previous update.
   *
   * This can be used with {@linkcode Mouse#position} to compare the pointer's
   * position across updates.
   *
   * @type {Vector2}
   */
  lastPosition = new Vector2()

  /**
   * Current pointer position in the input target's local coordinates.
   *
   * It remains unchanged when the pointer does not move.
   *
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * Mouse movement during the current update.
   *
   * It is `Vector2.Zero` when the mouse does not move.
   *
   * @type {Vector2}
   */
  delta = new Vector2()

  /**
   * Mouse-wheel movement during the current update.
   *
   * The value is `Vector3.Zero` when the wheel does not move and includes
   * horizontal, vertical, and depth-axis scroll movement.
   *
   * @type {Vector3}
   */
  wheelDelta = new Vector3()

  /**
   * Reports whether the current update contains non-zero pointer movement.
   *
   * This is exactly `!this.delta.equals(Vector2.Zero)`, so either non-zero
   * component makes the result `true`; equal zero components make it `false`.
   *
   * @returns {boolean}
   */
  moved() {
    return !this.delta.equals(Vector2.Zero)
  }
}
/* eslint-enable jsdoc/check-tag-names */
