/** @import {Color} from './core' */
/** @import {TypeId} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { registerColorTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds {@linkcode Color} component support to an {@linkcode App}.
 *
 * Register this plugin to make {@linkcode Color} available as a structured color
 * component. It depends on {@linkcode CorePlugin} and {@linkcode ReflectPlugin}.
 * Registering {@linkcode ColorPlugin} does not install missing dependencies
 * automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { ColorPlugin } from '@wimaengine/color'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new ColorPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class ColorPlugin extends Plugin {

  /**
   * Enables color component support for an {@linkcode App}.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app.registerSystem({ schedule: AppSchedule.Startup, system: registerColorTypes })
  }

  /**
   * Returns the plugin IDs required for color component support.
   *
   * The app must already have {@linkcode CorePlugin} and {@linkcode ReflectPlugin}
   * registered. Registering this plugin does not install them automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
