/** @import {TypeId} from '@wimaengine/type' */
/** @import {Name} from './components' */
import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { registerNameTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds {@linkcode Name} component support to an {@linkcode App}.
 *
 * Register this plugin to make {@linkcode Name} available as a name component.
 * It depends on {@linkcode CorePlugin} and {@linkcode ReflectPlugin}.
 * Registering {@linkcode NamePlugin} does not install missing dependencies
 * automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { NamePlugin } from '@wimaengine/name'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new NamePlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class NamePlugin extends Plugin {

  /**
   * Enables name component support for an {@linkcode App}.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerNameTypes })
  }

  /**
   * Returns the plugin IDs required for name component support.
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
