/** @import {TypeId} from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Browser, PlatformOS } from './core'
import { Device } from './resources'
import { registerDeviceTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds a browser-aware {@linkcode Device} resource to an {@linkcode App}.
 *
 * Register this plugin when application code needs browser rendering
 * capabilities and detected {@linkcode PlatformOS} and {@linkcode Browser} values.
 * It populates the resource from the current browser environment and keeps it
 * available for application code to read. The WebAudio capability remains
 * available for application-managed state.
 *
 * This plugin depends on {@linkcode CorePlugin} and {@linkcode ReflectPlugin}.
 * Register those plugins before this plugin as shown in the example.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { Device, DevicePlugin } from '@wimaengine/device'
 *
 * const app = new App()
 * app
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new DevicePlugin())
 *   .run()
 *
 * // Read the resource from the app's world.
 * function chooseRenderer(world) {
 *   const device = world.getResource(Device)
 *   return device.capabilities.webgl ? 'webgl' : 'canvas'
 * }
 * ```
 *
 * @category plugin
 */
export class DevicePlugin extends Plugin {

  /**
   * Adds the {@linkcode Device} resource and detects the browser capabilities,
   * platform, and browser used by the application.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    const device = new Device()
    const ua = navigator.userAgent

    app
      .setResource(device)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerDeviceTypes })

    // rendering capabilities
    device.capabilities.canvas = !!window.CanvasRenderingContext2D
    device.capabilities.webgl = !!window.WebGLRenderingContext

    // @ts-ignore
    // Safety: Navigator.gpu is implemented in webgpu enabled devices
    device.capabilities.webgpu = !!navigator.gpu

    // platform operating system
    if (/Android/.test(ua)) {
      device.platform = PlatformOS.Android
    } else if (/iP[ao]d|iPhone/i.test(ua)) {
      device.platform = PlatformOS.Ios
    } else if (/Linux/.test(ua)) {
      device.platform = PlatformOS.Linux
    } else if (/Mac OS/.test(ua)) {
      device.platform = PlatformOS.Mac
    } else if (/Windows/.test(ua)) {
      device.platform = PlatformOS.Windows
    }

    // browser
    if (/Chrome/.test(ua)) {
      device.browser = Browser.Chrome
    } else if (/Firefox/.test(ua)) {
      device.browser = Browser.FireFox
    } else if (/Trident/.test(ua)) {
      device.browser = Browser.Edge
    } else if (/Opera/.test(ua)) {
      device.browser = Browser.Opera
    } else if (/Safari/.test(ua)) {
      device.browser = Browser.Safari
    }
  }

  /**
   * Returns the plugin IDs for the {@linkcode CorePlugin} and
   * {@linkcode ReflectPlugin} dependencies.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
