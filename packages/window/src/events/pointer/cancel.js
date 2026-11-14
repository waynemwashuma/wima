import { Vector2 } from '@wimaengine/math'

/**
 * Captures the pointer data emitted by a browser `pointercancel` event.
 *
 * The value preserves the pointer identity and device type, and stores the
 * event's local offset as a reusable {@linkcode Vector2} `position`.
 *
 * @example
 * ```js
 * const cancel = new PointerCancel(event)
 * console.log(cancel.id, cancel.pointerType, cancel.position)
 * ```
 */
export class PointerCancel {

  /**
   * The browser `pointerId` copied from `event.pointerId`.
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
   * Copies `pointerId` to `id` and `pointerType` to `pointerType`. The
   * position is set from the event's `offsetX` and `offsetY`.
   *
   * @param {PointerEvent} event - Browser pointer event to capture.
   */
  constructor(event) {
    this.id = event.pointerId
    this.pointerType = event.pointerType
    this.position.set(event.offsetX, event.offsetY)
  }
}
