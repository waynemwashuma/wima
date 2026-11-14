/**
 * Reports the dimensions produced by a window resize event.
 *
 * The DOM window integration writes this value to the typed event stream after
 * it synchronizes a canvas and its {@linkcode Window} component. Read `width` and
 * `height` from the event value to handle the new dimensions.
 *
 * @example
 * ```js
 * const resize = new WindowResize(1280, 720)
 * console.log(resize.width, resize.height) // 1280 720
 * ```
 */
export class WindowResize {

  /**
   * @readonly
   * @type {number}
   */
  width

  /**
   * @readonly
   * @type {number}
   */
  height

  /**
   * Creates a resize event value with the new dimensions.
   *
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.width = width
    this.height = height
  }
}
