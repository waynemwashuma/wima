/** @import {TypeId} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { registerMathTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds Hisabati math type support to an {@linkcode App}.
 *
 * Register this plugin when the app uses Hisabati math values with engine
 * features that support them. The plugin requires {@linkcode CorePlugin} and
 * {@linkcode ReflectPlugin}; registering {@linkcode MathPlugin} does not install
 * either dependency automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class MathPlugin extends Plugin {

  /**
   * Enables math type support for an {@linkcode App}.
   *
   * After registration, the app can use Hisabati math values with engine
   * features that support them.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app.registerSystem({ schedule: AppSchedule.Startup, system: registerMathTypes })
  }

  /**
   * Returns the plugin IDs required for math type support.
   *
   * The app must already have {@linkcode CorePlugin} and {@linkcode ReflectPlugin}
   * registered. Registering {@linkcode MathPlugin} does not install those
   * dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
