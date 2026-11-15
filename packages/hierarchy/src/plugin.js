/** @import {TypeId} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Children, Parent } from './components'
import { addSelfToChildren, despawnChildren, addSelfToParent, removeSelfFromParent } from './hooks'
import { registerHierarchyTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds synchronized parent/child hierarchy behavior to an {@linkcode App}.
 *
 * Use {@linkcode Children} and {@linkcode Parent} to describe an entity hierarchy.
 * Adding {@linkcode Children} adds or updates each child's {@linkcode Parent};
 * adding {@linkcode Parent} adds the child to its parent's {@linkcode Children}.
 * Removing a {@linkcode Parent} removes the child from its parent's list, and
 * despawning an entity with {@linkcode Children} recursively despawns its listed
 * children. These relationships stay synchronized when the corresponding
 * components change; the plugin does not create hierarchy entities for you.
 *
 * Register {@linkcode CorePlugin} and {@linkcode ReflectPlugin} before
 * {@linkcode HierarchyPlugin}. The app validates these dependencies but does not
 * install missing plugins automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { HierarchyPlugin } from '@wimaengine/hierarchy'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .run()
 * // Children and Parent relationships stay synchronized as entities change.
 * ```
 *
 * @category plugin
 */
export class HierarchyPlugin extends Plugin {

  /**
   * Enables synchronized hierarchy behavior for {@linkcode Children} and
   * {@linkcode Parent} components in an {@linkcode App}.
   *
   * Adding or removing either component keeps the parent/child relationship in
   * sync. Despawning an entity with {@linkcode Children} also despawns its listed
   * descendants.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setComponentHooks(Children, new ComponentHooks(
        addSelfToChildren,
        despawnChildren,
        null
      ))
      .setComponentHooks(Parent, new ComponentHooks(
        addSelfToParent,
        removeSelfFromParent,
        null
      ))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerHierarchyTypes })
  }

  /**
   * Returns the type IDs for the plugins required by this plugin.
   *
   * The app must already have {@linkcode CorePlugin} and
   * {@linkcode ReflectPlugin} registered; this plugin does not install missing
   * dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
