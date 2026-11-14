import { Vector2 } from '@wimaengine/math'

/**
 * Captures the pointer data emitted by a browser `pointerup` event.
 *
 * The value preserves the pointer identity and device type, maps the browser
 * button code to `key`, and stores the event's local offset as a reusable
 * {@linkcode Vector2} position.
 *
 * @example
 * ```js
 * const up = new PointerUp(event)
 * if (up.key === 0) console.log('primary pointer released', up.position)
 * ```
 */
export class PointerUp {

  /**
   * The browser `pointerId` copied from `event.pointerId` to `id`.
   *
   * @readonly
   * @type {number}
   */
  id

  /**
   * The browser `pointerType` copied from `event.pointerType`, such as
   * `mouse`, `pen`, or `touch`.
   *
   * @readonly
   * @type {string}
   */
  pointerType

  /**
   * The browser `button` value copied from `event.button` to `key`.
   *
   * @readonly
   * @type {number}
   */
  key

  /**
   * Local pointer coordinates set from `event.offsetX` and `event.offsetY`.
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
