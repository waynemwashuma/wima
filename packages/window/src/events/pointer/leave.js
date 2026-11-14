import { Vector2 } from '@wimaengine/math'

/**
 * Captures the pointer data emitted by a browser `pointerleave` event.
 *
 * The value preserves the pointer identity and device type and stores the
 * event's local offset as a reusable {@linkcode Vector2} `position`.
 *
 * @example
 * ```js
 * const leave = new PointerLeave(event)
 * console.log(leave.id, leave.pointerType, leave.position)
 * ```
 */
export class PointerLeave {

  /**
   * The browser `pointerId` identifying the pointer.
   *
   * @readonly
   * @type {number}
   */
  id

  /**
   * The browser `pointerType`, such as `mouse`, `pen`, or `touch`.
   *
   * @readonly
   * @type {string}
   */
  pointerType

  /**
   * Local pointer coordinates copied from `offsetX` and `offsetY`.
   *
   * @readonly
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * Copies `pointerId` to `id`, preserves `pointerType`, and maps the event's
   * `offsetX` and `offsetY` values to `position.x` and `position.y`.
   *
   * @param {PointerEvent} event - Browser pointer event to capture.
   */
  constructor(event) {
    this.id = event.pointerId
    this.pointerType = event.pointerType
    this.position.set(event.offsetX, event.offsetY)
  }
}
