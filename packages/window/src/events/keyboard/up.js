/**
 * Captures the keyboard data from a browser `keyup` event.
 *
 * Construct this value from the event when handling a released key. It keeps
 * the browser's key identity, physical code, keyboard location, and target.
 *
 * @example
 * ```js
 * const up = new KeyUp(new KeyboardEvent('keyup', {
 *   key: 'a',
 *   code: 'KeyA'
 * }))
 *
 * console.log(up.key, up.code) // a KeyA
 * ```
 */
export class KeyUp {

  /**
   * The key value copied from `event.key`.
   *
   * @type {string}
   */
  key

  /**
   * The physical key code copied from `event.code`.
   *
   * @type {string}
   */
  code

  /**
   * The keyboard location copied from `event.location`.
   *
   * @type {number}
   */
  location

  /**
   * The event target copied from `event.target`, or `null` when the browser
   * event has no target.
   *
   * @type {EventTarget | null}
   */
  target

  /**
   * Copies `key`, `code`, `location`, and `target` from the browser event.
   *
   * @param {KeyboardEvent} event - Browser keyboard event to capture.
   */
  constructor(event) {
    this.key = event.key
    this.code = event.code
    this.location = event.location
    this.target = event.target
  }
}
