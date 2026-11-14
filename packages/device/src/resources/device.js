import { Browser, PlatformOS } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Describes the detected platform, browser, and rendering capabilities for an
 * application.
 *
 * Install {@linkcode DevicePlugin} to add this world resource to an application.
 * It fills the {@linkcode DeviceCapabilities} flags and detects values from
 * {@linkcode PlatformOS} and {@linkcode Browser} so application code can choose
 * compatible behavior for the current environment. A new instance starts
 * with {@linkcode PlatformOS.Unknown} and {@linkcode Browser.Unknown}.
 * `webAudio` remains `false` until application code changes it.
 *
 * @example
 * ```js
 * import { Device } from '@wimaengine/device'
 *
 * // With DevicePlugin installed, read the resource from a world.
 * function chooseRenderer(world) {
 *   const device = world.getResource(Device)
 *
 *   if (device.capabilities.webgpu) return 'webgpu'
 *   if (device.capabilities.webgl) return 'webgl'
 *   return device.capabilities.canvas ? 'canvas' : 'none'
 * }
 * ```
 *
 * @category resource
 */
export class Device {

  /**
   * Capability flags for the current device and browser.
   *
   * @type {DeviceCapabilities}
   */
  capabilities = new DeviceCapabilities()

  /**
   * Detected operating system or platform.
   *
   * The value starts as {@linkcode PlatformOS.Unknown} and remains unknown when
   * no supported platform is detected.
   *
   * @type {PlatformOS}
   */
  platform = PlatformOS.Unknown

  /**
   * Browser detected for the current application environment.
   *
   * The value starts as {@linkcode Browser.Unknown} and remains unknown when no
   * supported browser is detected.
   *
   * @type {Browser}
   */
  browser = Browser.Unknown

  /**
   * Reports whether the detected platform is mobile.
   *
   * @returns {boolean} `true` for {@linkcode PlatformOS.Android} or
   * {@linkcode PlatformOS.Ios}, otherwise `false`.
   */
  isMobile() {
    return (
      this.platform === PlatformOS.Android ||
      this.platform === PlatformOS.Ios
    )
  }

  /**
   * Reports whether the detected platform is a PC platform.
   *
   * @returns {boolean} `true` for {@linkcode PlatformOS.Linux},
   * {@linkcode PlatformOS.Mac}, or {@linkcode PlatformOS.Windows}, otherwise
   * `false`.
   */
  isPc() {
    return (
      this.platform === PlatformOS.Linux ||
      this.platform === PlatformOS.Mac ||
      this.platform === PlatformOS.Windows
    )
  }

  /**
   * Converts a device resource to a plain object.
   *
   * The result contains `capabilities`, `platform`, and `browser` fields.
   *
   * @param {Device} value - Device to convert.
   * @returns {DeviceSerial} Object containing the device data.
   */
  static serialize(value) {
    return {
      capabilities: DeviceCapabilities.serialize(value.capabilities),
      platform: value.platform,
      browser: value.browser
    }
  }

  /**
   * Restores a device from a plain object.
   *
   * When `out` is supplied, it is populated and returned. Its existing
   * {@linkcode DeviceCapabilities} object is reused, and its `platform` and
   * `browser` values are replaced. Otherwise, a new `Device` is created.
   *
   * @param {DeviceSerial} value
   * @param {Device} [out] - Device instance to populate.
   * @returns {Device}
   */
  static deserialize(value, out = new Device()) {

    out.capabilities = DeviceCapabilities.deserialize(value.capabilities, out.capabilities)
    out.platform = value.platform
    out.browser = value.browser

    return out
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * Groups browser capability flags used by a {@linkcode Device} resource.
 *
 * A new instance starts with `webgpu`, `webgl`, and `webAudio` set to `false`.
 * Its `canvas` flag is initialized from `window.CanvasRenderingContext2D`.
 * {@linkcode DevicePlugin} refreshes the `canvas`, `webgl`, and `webgpu` flags
 * from the current browser environment; `webAudio` remains application-managed.
 *
 * @example
 * ```js
 * import { Device } from '@wimaengine/device'
 *
 * const device = new Device()
 * if (device.capabilities.webgpu) {
 *   console.log('Use the WebGPU renderer')
 * }
 * ```
 */
export class DeviceCapabilities {

  /**
   * Whether the browser exposes WebGPU support. Defaults to `false` until
   * {@linkcode DevicePlugin} checks the current browser environment.
   *
   * @type {boolean}
   */
  webgpu = false

  /**
   * Whether the browser exposes WebGL support. Defaults to `false` until
   * {@linkcode DevicePlugin} checks the current browser environment.
   *
   * @type {boolean}
   */
  webgl = false

  /**
   * Whether the browser exposes 2D canvas support.
   *
   * Initialized from `window.CanvasRenderingContext2D`. {@linkcode DevicePlugin}
   * refreshes this flag when it populates the {@linkcode Device} resource.
   *
   * @type {boolean}
   */
  canvas = !!window.CanvasRenderingContext2D

  /**
   * Whether the browser exposes WebAudio support.
   *
   * This flag defaults to `false` and is not populated by
   * {@linkcode DevicePlugin}. Application code may set it before serialization.
   *
   * @type {boolean}
   */
  webAudio = false

  /**
   * Converts capability flags to plain serializable data.
   *
   * The result contains `webgpu`, `webgl`, `canvas`, and `webAudio` fields. The
   * source instance is not changed, and the values are copied as-is.
   *
   * @param {DeviceCapabilities} value - Capabilities to serialize.
   * @returns {DeviceCapabilitiesSerial} The copied capability flags.
   */
  static serialize(value) {
    return {
      webgpu: value.webgpu,
      webgl: value.webgl,
      canvas: value.canvas,
      webAudio: value.webAudio
    }
  }

  /**
   * Restores capability flags from plain serializable data.
   *
   * If `out` is supplied, its object identity is preserved and all four
   * fields are overwritten. Otherwise, a new `DeviceCapabilities` is returned.
   * The input is expected to contain the four capability fields; this method
   * performs no validation or coercion.
   *
   * @param {DeviceCapabilitiesSerial} value - Serialized capability flags.
   * @param {DeviceCapabilities} [out] - Instance to populate and return.
   * @returns {DeviceCapabilities} The populated instance.
   */
  static deserialize(value, out = new DeviceCapabilities()) {
    out.webgpu = value.webgpu
    out.webgl = value.webgl
    out.canvas = value.canvas
    out.webAudio = value.webAudio

    return out
  }
}

/**
 * @typedef DeviceCapabilitiesSerial
 * @property {boolean} webgpu - Whether WebGPU is supported.
 * @property {boolean} webgl - Whether WebGL is supported.
 * @property {boolean} canvas - Whether 2D canvas is supported.
 * @property {boolean} webAudio - Whether WebAudio is supported.
 */

/**
 * @typedef DeviceSerial
 * @property {DeviceCapabilitiesSerial} capabilities
 * @property {PlatformOS} platform
 * @property {Browser} browser
 */
