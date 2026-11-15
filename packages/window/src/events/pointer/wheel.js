import { Vector2, Vector3 } from '@wimaengine/math'

/**
 * Captures the wheel data emitted by a browser `wheel` event.
 *
 * The DOM pointer bridge identifies wheel input as a mouse event, stores the
 * event's local offset as {@linkcode Vector2} `position`, and stores the browser's
 * three-dimensional wheel delta in a {@linkcode Vector3}.
 *
 * @example
 * ```js
 * const wheel = new PointerWheel(event)
 * if (wheel.pointerType === 'mouse') console.log(wheel.delta)
 * ```
 */
export class PointerWheel {

  /**
   * The fixed pointer type for wheel input.
   *
   * @readonly
   * @type {string}
   */
  pointerType

  /**
   * Local wheel coordinates copied from `offsetX` and `offsetY`.
   *
   * @readonly
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * Wheel movement copied from `deltaX`, `deltaY`, and `deltaZ`.
   *
   * @readonly
   * @type {Vector3}
   */
  delta

  /**
   * Sets `pointerType` to `mouse`, maps the event offsets to `position`, and
   * creates `delta` from the event's three wheel-axis values.
   *
   * @param {WheelEvent} event - Browser wheel event to capture.
   */
  constructor(event) {
    this.pointerType = 'mouse'
    this.position.set(event.offsetX, event.offsetY)
    this.delta = new Vector3(
      event.deltaX,
      event.deltaY,
      event.deltaZ
    )
  }
}
