/**
 * Captures the keyboard data from a browser `keydown` event.
 *
 * Construct this value from the event when handling keyboard input. It keeps
 * the key identity, physical code, keyboard location, target, and the runtime
 * `scancode` alias.
 *
 * @property {string} scancode - Runtime property assigned from `event.code`; it
 * is not declared as a class field.
 * @example
 * ```js
 * const down = new KeyDown(new KeyboardEvent('keydown', {
 *   key: 'a',
 *   code: 'KeyA'
 * }))
 *
 * console.log(down.key, down.code, down.scancode) // a KeyA KeyA
 * ```
 */
export class KeyDown {

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
   * The event target copied from `event.target`.
   *
   * @type {EventTarget | null}
   */
  target

  /**
   * Copies `key`, `code`, `location`, and `target` from the browser event. It
   * also assigns `event.code` to the runtime `scancode` property, even though
   * `scancode` is not declared as a class field.
   *
   * @param {KeyboardEvent} event - Browser keyboard event to capture.
   */
  constructor(event) {
    this.scancode = event.code
    this.key = event.key
    this.code = event.code
    this.location = event.location
    this.target = event.target
  }
}
