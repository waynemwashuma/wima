/**
 * Identifies the browser category represented by a {@linkcode Device#browser}
 * value.
 *
 * Use these labels with {@linkcode Device#browser} to distinguish the browser
 * categories associated with a device. `Unknown` is the default when no
 * browser category is available.
 *
 * @readonly
 * @enum {number}
 *
 * @example
 * ```js
 * import { Browser, Device } from '@wimaengine/device'
 *
 * const device = new Device()
 * const isChromium = device.browser === Browser.Chrome ||
 *   device.browser === Browser.Edge
 * ```
 */
export const Browser = {

  /** Unknown or not-yet-detected browser. This is the default value. */
  Unknown: 0,

  /** Google Chrome. */
  Chrome: 1,

  /** Mozilla Firefox. */
  FireFox: 2,

  /** Apple Safari. */
  Safari: 3,

  /** Internet Explorer. */
  internetExplorer: 4,

  /** Opera. */
  Opera: 5,

  /** Microsoft Edge. */
  Edge: 6
}
