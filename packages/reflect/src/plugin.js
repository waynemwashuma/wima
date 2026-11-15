import { App, Plugin } from '@wimaengine/app'
import { TypeRegistry } from './resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds a {@linkcode TypeRegistry} resource to an {@linkcode App} for plugins that
 * register runtime type metadata.
 *
 * During plugin registration, {@linkcode ReflectPlugin} creates a fresh
 * {@linkcode TypeRegistry} and stages it with {@linkcode App#setResource}. The app
 * makes that resource available in its default world before the runner starts,
 * so application code can retrieve it with
 * `world.getResource(TypeRegistry)`.
 *
 * Plugins that register metadata for their components, resources, enums, or
 * other runtime values depend on {@linkcode ReflectPlugin} to use this shared
 * registry. Register {@linkcode ReflectPlugin} before those plugins; a missing
 * dependency causes {@linkcode App#run} to fail, and registering a plugin does
 * not install its dependencies automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TimePlugin } from '@wimaengine/time'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new TimePlugin())
 *   .run()
 * ```
 *
 * Once registered, application plugins can use the shared
 * {@linkcode TypeRegistry} resource for their type metadata.
 *
 * @category plugin
 */
export class ReflectPlugin extends Plugin {

  /**
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    const typeregistry = new TypeRegistry()

    app
      .setResource(typeregistry)
  }
}
/* eslint-enable jsdoc/check-tag-names */
