import { Vector2 } from '@wimaengine/math'

/**
 * Captures the pointer data emitted by a browser `pointerdown` event.
 *
 * The value preserves the pointer identity and device type, maps the browser
 * button code to `key`, and stores the event's local offset as a reusable
 * {@linkcode Vector2} position.
 *
 * @example
 * ```js
 * const down = new PointerDown(event)
 * if (down.key === 0) console.log('primary pointer pressed', down.position)
 * ```
 */
export class PointerDown {

  /**
   * The browser `pointerId` identifying the active pointer.
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
   * The browser `button` value for the pressed button. This field is named
   * `key` to match the window input event API.
   *
   * @readonly
   * @type {number}
   */
  key

  /**
   * Local pointer coordinates copied from `offsetX` and `offsetY`.
   *
   * @readonly
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * Maps `pointerId` to `id`, `pointerType` to `pointerType`, and `button` to
   * `key`. The position is set from the event's `offsetX` and `offsetY`.
   *
   * @param {PointerEvent} event - Browser pointer event to capture.
   */
  constructor(event) {
    this.id = event.pointerId
    this.pointerType = event.pointerType
    this.key = event.button
    this.position.set(event.offsetX, event.offsetY)
  }
}
