/** @import {Broadphasable2D} from './resources'*/
/** @import {PhysicsHitbox} from './components' */
/** @import {TypeId} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { CollisionPairs, Broadphase2D } from './resources'
import { getCollisionPairs, registerBroadphaseTypes2D, updateBroadphase2D } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Installs 2D broadphase resources and candidate generation in an {@linkcode App}.
 *
 * The plugin makes the configured {@linkcode Broadphasable2D} implementation
 * available through {@linkcode Broadphase2D} and provides {@linkcode CollisionPairs}
 * for the current broadphase candidates. Entities with {@linkcode PhysicsHitbox}
 * components are indexed, and overlapping hitboxes are reported as potential
 * collision pairs. The pairs are candidates for downstream collision
 * processing, not confirmed collisions.
 *
 * The app must also register {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
 * {@linkcode MathPlugin}. The plugin reports these dependencies through
 * {@linkcode Broadphase2DPlugin#requires}; it does not install them automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { Broadphase2DPlugin, NaiveBroadphase2D } from '@wimaengine/broadphase'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Broadphase2DPlugin({
 *     broadphase: new NaiveBroadphase2D()
 *   }))
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Broadphase2DPlugin extends Plugin {

  /**
   * Configured implementation passed to the installed {@linkcode Broadphase2D}
   * resource.
   *
   * The constructor retains the supplied object by reference, and
   * {@linkcode Broadphase2DPlugin#register} passes that same object to the
   * resource.
   *
   * @readonly
   * @type {Broadphasable2D}
   */
  innerBroadphase

  /**
   * Creates a broadphase plugin using the supplied indexing implementation.
   *
   * @param {Broadphase2DPluginOptions} options - Plugin configuration.
   */
  constructor({ broadphase }) {
    super()
    this.innerBroadphase = broadphase
  }

  /**
   * Makes the broadphase resources available and prepares candidate-pair
   * updates.
   *
   * The app receives a {@linkcode Broadphase2D} resource backed by the configured
   * implementation and a fresh {@linkcode CollisionPairs} resource. Each update
   * refreshes the broadphase from entities with {@linkcode PhysicsHitbox} and
   * rebuilds the pair list from overlapping hitboxes. Pairs are potential
   * collisions, not confirmed narrowphase results.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerBroadphaseTypes2D })
      .setResource(new Broadphase2D(this.innerBroadphase))
      .setResource(new CollisionPairs())
      .registerSystem({ schedule: AppSchedule.Update, system: getCollisionPairs })
      .registerSystem({ schedule: AppSchedule.Update, system: updateBroadphase2D })
  }

  /**
   * Returns the plugins required by this broadphase integration.
   *
   * @returns {TypeId[]} IDs for {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * and {@linkcode MathPlugin}.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(MathPlugin)]
  }
}

/**
 * Configuration for {@linkcode Broadphase2DPlugin}.
 *
 * @typedef Broadphase2DPluginOptions
 * @property {Broadphasable2D} broadphase - Implementation used by {@linkcode Broadphase2D}.
 */
/* eslint-enable jsdoc/check-tag-names */
