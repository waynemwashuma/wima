/**
 * Identifies the operating-system categories used by a {@linkcode Device}
 * resource.
 *
 * Use these values to interpret a device's detected platform. `Unknown`
 * represents a device whose platform is not one of the supported categories.
 *
 * @example
 * ```js
 * import { Device, PlatformOS } from '@wimaengine/device'
 *
 * const device = new Device()
 * if (device.platform === PlatformOS.Unknown) {
 *   console.log('Platform was not recognized')
 * }
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const PlatformOS = {

  /**
   * No supported operating-system category was detected (`0`).
   *
   * This is the default platform on a new {@linkcode Device}.
   *
   * @readonly
   */
  Unknown: 0,

  /**
   * Android mobile platform (`1`).
   *
   * @readonly
   */
  Android: 1,

  /**
   * The iOS mobile platform (`2`).
   *
   * @readonly
   */
  Ios: 2,

  /**
   * Linux PC platform (`3`).
   *
   * @readonly
   */
  Linux: 3,

  /**
   * Windows PC platform (`4`).
   *
   * @readonly
   */
  Windows: 4,

  /**
   * The macOS PC platform (`5`).
   *
   * @readonly
   */
  Mac: 5
}
