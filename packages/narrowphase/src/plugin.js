/** @import { Broadphase2DPlugin, CollisionPairs } from '@wimaengine/broadphase' */
/** @import { TypeId } from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { PhysicsProperties } from './components'
import { physicspropertiesAddHook } from './hooks'
import { Contacts, SATNarrowphase2D } from './resources'
import { getSATContacts, registerNarrowphase2DTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Installs SAT-based 2D narrowphase collision detection for an {@linkcode App}.
 *
 * The plugin provides {@linkcode Contacts} and {@linkcode SATNarrowphase2D}
 * resources, configures {@linkcode PhysicsProperties} component hooks, and turns
 * broadphase candidate pairs into current SAT collision contacts.
 *
 * During updates, the plugin reads the {@linkcode CollisionPairs} resource, so a
 * broadphase plugin such as {@linkcode Broadphase2DPlugin} must also be installed
 * before the app updates. This plugin requires {@linkcode CorePlugin},
 * {@linkcode ReflectPlugin}, and {@linkcode MathPlugin}; the app validates those
 * dependencies but does not install them automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { Broadphase2DPlugin, NaiveBroadphase2D } from '@wimaengine/broadphase'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { NarrowPhase2DPlugin } from '@wimaengine/narrowphase'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Broadphase2DPlugin({
 *     broadphase: new NaiveBroadphase2D()
 *   }))
 *   .registerPlugin(new NarrowPhase2DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class NarrowPhase2DPlugin extends Plugin {

  /**
   * Installs {@linkcode Contacts} and {@linkcode SATNarrowphase2D} resources and
   * configures {@linkcode PhysicsProperties} component behavior.
   *
   * The {@linkcode PhysicsProperties} hook recalculates inverse inertia after the
   * component is added or inserted. The installed resources process candidate
   * pairs supplied by broadphase and expose the resulting collision contacts.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setComponentHooks(
        PhysicsProperties,
        new ComponentHooks(
          physicspropertiesAddHook,
          null,
          physicspropertiesAddHook
        )
      )
      .setResource(new Contacts())
      .setResource(new SATNarrowphase2D())
      .registerSystem({ schedule: AppSchedule.Startup, system: registerNarrowphase2DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: getSATContacts })
  }

  /**
   * Returns the plugin IDs required by this narrowphase integration.
   *
   * The app must already have {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * and {@linkcode MathPlugin} registered. Registering this plugin does not
   * install those dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(MathPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
