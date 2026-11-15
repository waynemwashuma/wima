/** @import {TypeId} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Session, Storage, Cookies } from './resources'
import { registerStorageTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds browser storage resources to an {@linkcode App}.
 *
 * The plugin provides fresh {@linkcode Session}, {@linkcode Storage}, and
 * {@linkcode Cookies} resources for application code. Use them for tab-scoped
 * values, origin-scoped values, and document cookies respectively.
 *
 * {@linkcode StoragePlugin} requires {@linkcode CorePlugin} and
 * {@linkcode ReflectPlugin}. Register these dependencies before the storage
 * plugin; plugin dependencies are checked but are not installed automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { Session, StoragePlugin } from '@wimaengine/storage'
 *
 * const app = new App()
 * app
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new StoragePlugin())
 *   .run()
 *
 * // Access the resources from an app world.
 * function saveScreen(world) {
 *   world.getResource(Session).set('screen', 'home')
 * }
 * ```
 *
 * @category plugin
 */
export class StoragePlugin extends Plugin {

  /**
   * Installs fresh {@linkcode Session}, {@linkcode Storage}, and
   * {@linkcode Cookies} resources for the app.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setResource(new Session())
      .setResource(new Storage())
      .setResource(new Cookies())
      .registerSystem({ schedule: AppSchedule.Startup, system: registerStorageTypes })
  }

  /**
   * Returns the plugin IDs required by {@linkcode StoragePlugin}.
   *
   * Register {@linkcode CorePlugin} and {@linkcode ReflectPlugin} before this
   * plugin. Registering {@linkcode StoragePlugin} does not install them
   * automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
