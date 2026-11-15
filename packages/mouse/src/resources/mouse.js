import { Vector2 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the current mouse-pointer motion state as a world resource.
 *
 * The resource is updated from the latest matching {@linkcode PointerMove} event
 * whose `pointerType` is `'mouse'`. The pointer position is local to the event
 * target, and the movement reflects the values reported by that event.
 *
 * If no matching event is available, the pointer position stays unchanged and
 * the movement for that update is zero. This resource represents pointer
 * motion only; use {@linkcode MouseButtons} for mouse-button state.
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
   * Pointer position from before the most recent mouse-state update.
   *
   * The resource stores the current {@linkcode Mouse#position} here before
   * applying the latest matching {@linkcode PointerMove} event. When no matching
   * event is available, this remains the same as the current position.
   *
   * @type {Vector2}
   */
  lastPosition = new Vector2()

  /**
   * Current pointer position in the pointer-event target's local coordinates.
   *
   * This follows the latest matching {@linkcode PointerMove} event's `offsetX` and
   * `offsetY` values. It remains unchanged when no matching event is received.
   *
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * Movement reported by the latest matching pointer-move event.
   *
   * This follows the event's `movementX` and `movementY` values. It is
   * `Vector2.Zero` when no matching event is received.
   *
   * @type {Vector2}
   */
  delta = new Vector2()

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
