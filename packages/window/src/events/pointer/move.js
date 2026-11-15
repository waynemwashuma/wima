import { Vector2 } from '@wimaengine/math'

/**
 * Captures the pointer data emitted by a browser `pointermove` event.
 *
 * The DOM pointer bridge creates this event value with the browser pointer's
 * identity and device type, its local offset as {@linkcode Vector2} `position`,
 * and its movement since the previous event as {@linkcode Vector2} `delta`.
 *
 * @example
 * ```js
 * const move = new PointerMove(event)
 * console.log(move.id, move.pointerType, move.position, move.delta)
 * ```
 */
export class PointerMove {

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
   * Local pointer coordinates copied from `offsetX` and `offsetY`.
   *
   * @readonly
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * Pointer movement copied from `movementX` and `movementY`.
   *
   * @readonly
   * @type {Vector2}
   */
  delta = new Vector2()

  /**
   * Copies `pointerId` to `id`, `pointerType` to `pointerType`, and maps the
   * event offsets and movement values to `position` and `delta`.
   *
   * @param {PointerEvent} event - Browser pointer event to capture.
   */
  constructor(event) {
    this.id = event.pointerId
    this.pointerType = event.pointerType
    this.position.set(event.offsetX, event.offsetY)
    this.delta.set(event.movementX, event.movementY)
  }
}
