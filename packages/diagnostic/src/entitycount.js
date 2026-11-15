/** @import { TypeId } from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule, CoreSystems } from '@wimaengine/core'
import { World, EntityHandle, Query } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds a browser overlay that displays the number of entities in the app's
 * default world.
 *
 * In a browser, the overlay appears near the top-right corner and refreshes
 * during app updates with text such as `42 entities`.
 *
 * The plugin requires {@linkcode CorePlugin} to provide the app's default world.
 * Register that dependency before this plugin; it is not added automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { EntityCountDiagnosticPlugin } from '@wimaengine/diagnostic'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerDebugger(new EntityCountDiagnosticPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class EntityCountDiagnosticPlugin extends Plugin {

  /**
   * Installs the entity-count overlay for the app's default world.
   *
   * The overlay is appended to `document.body` and refreshed during app
   * updates.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: setUpUI })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: updateEntityCount })
  }

  /**
   * Returns the plugin dependency required by this diagnostic.
   *
   * The returned ID identifies {@linkcode CorePlugin}, which provides the app's
   * default world. The app validates this dependency but does not install it
   * automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 *
 */
function setUpUI() {
  const container = document.body.appendChild(document.createElement('div'))

  container.id = 'entity-count-container'
  container.style.position = 'absolute'
  container.style.top = '34px'
  container.style.right = '0px'
  container.style.width = '100px'
  container.style.height = '20px'
  container.style.background = 'black'
  container.style.textAlign = 'center'
  container.style.color = 'white'
}

/**
 * @param {World} world
 */
function updateEntityCount(world) {
  const entities = new Query(world, [EntityHandle])
  const num = entities.count()
  const container = document.querySelector('#entity-count-container')

  if (container) container.innerHTML = `${num} entities`
}
