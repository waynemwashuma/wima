import { Vector2 } from '@wimaengine/math'

/**
 * Captures the browser coordinates from a file-drag event.
 *
 * The constructor copies {@linkcode DragEvent#clientX} and
 * {@linkcode DragEvent#clientY} into {@linkcode Vector2} `position`. The resulting
 * event value exposes the coordinates without retaining the browser event.
 *
 * @example
 * ```js
 * const drag = new FileDrag(event)
 * console.log(drag.position.x, drag.position.y)
 * ```
 */
export class FileDrag {

  /**
   * Browser client coordinates copied from {@linkcode DragEvent#clientX} and
   * {@linkcode DragEvent#clientY}.
   *
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * Copies the browser event's {@linkcode DragEvent#clientX} and
   * {@linkcode DragEvent#clientY} into `position`.
   *
   * @param {DragEvent} event - Browser file-drag event whose coordinates are
   * captured.
   */
  constructor(event) {
    this.position.set(event.clientX, event.clientY)
  }
}
