/** @import {PhysicsHitbox} from '@wimaengine/broadphase' */
/** @import {TypeId} from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { Broadphase2DPlugin, NaiveBroadphase2D } from '@wimaengine/broadphase'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { EulerIntegrator2DPlugin } from '@wimaengine/integrator'
import { NarrowPhase2DPlugin } from '@wimaengine/narrowphase'
import { Transform2DPlugin } from '@wimaengine/transform'
import { typeid } from '@wimaengine/type'
import { collisionResponse, updateBodies, updateBounds } from '../systems'

// TODO: Convert to a plugin group
/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds configurable 2D collision handling to an {@linkcode App}.
 *
 * The plugin combines collider-bound updates, broadphase candidate selection,
 * narrowphase contact detection, and collision response. Applications can
 * provide their own {@linkcode Broadphase2DPlugin} and
 * {@linkcode NarrowPhase2DPlugin} instances; when omitted, the plugin creates a
 * default broadphase using {@linkcode NaiveBroadphase2D} and a default
 * narrowphase plugin. Collider bounds are refreshed automatically by default;
 * applications that maintain their own bounds can disable that behavior.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { HierarchyPlugin } from '@wimaengine/hierarchy'
 * import { MathPlugin } from '@wimaengine/math'
 * import { Physics2DPlugin } from '@wimaengine/physics'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { Transform2DPlugin } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .registerPlugin(new Transform2DPlugin())
 *   .registerPlugin(new Physics2DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Physics2DPlugin extends Plugin {

  /**
   * Creates a 2D physics integration with optional plugin injection.
   *
   * Omitted `broadphase` and `narrowphase` options create the default
   * collision plugins. Supplied plugin instances are kept by reference and
   * registered with the app when this plugin is registered.
   * `autoUpdateBounds` defaults to `true`; set it to `false` when the
   * application updates {@linkcode PhysicsHitbox} bounds itself.
   *
   * The `integrator` option defaults to {@linkcode EulerIntegrator2DPlugin} and
   * is retained for compatibility. It does not configure the collision
   * handling performed by this plugin.
   *
   * @param {Physics2DPluginOptions} [options={}] - Plugin configuration.
   */
  constructor({
    autoUpdateBounds = true,
    broadphase = new Broadphase2DPlugin({
      broadphase: new NaiveBroadphase2D()
    }),
    narrowphase = new NarrowPhase2DPlugin(),
    integrator = new EulerIntegrator2DPlugin()
  } = {}) {
    super()
    this.broadphase = broadphase
    this.narrowphase = narrowphase

    // TODO: Remove this, legacy option
    this.integrator = integrator
    this.autoUpdateBounds = autoUpdateBounds
  }

  /**
   * Registers the physics integration and its configured collision plugins
   * with `app`.
   *
   * During each update, colliders follow their associated transforms. When
   * `autoUpdateBounds` is enabled, {@linkcode PhysicsHitbox} bounds are refreshed
   * automatically; otherwise the application must maintain them before
   * collision detection runs. The configured {@linkcode Broadphase2DPlugin} and
   * {@linkcode NarrowPhase2DPlugin} instances are registered so their collision
   * data is available, and the resulting contacts are resolved for the
   * update.
   *
   * @param {App} app - App to configure.
   * @returns {void}
   */
  register(app) {
    app
    app.registerSystem({ schedule: AppSchedule.Update, system: updateBodies })

    if (this.autoUpdateBounds) app.registerSystem({ schedule: AppSchedule.Update, system: updateBounds })

    app
      .registerPlugin(this.broadphase)
      .registerPlugin(this.narrowphase)
      .registerSystem({ schedule: AppSchedule.Update, system: collisionResponse })
  }

  /**
   * Returns the plugin IDs required by this physics integration.
   *
   * Register {@linkcode CorePlugin} and {@linkcode Transform2DPlugin} before this
   * plugin. Registering it does not install those dependencies automatically.
   *
   * @returns {TypeId[]} IDs for {@linkcode CorePlugin} and
   * {@linkcode Transform2DPlugin}.
   */
  requires() {
    return [typeid(CorePlugin), typeid(Transform2DPlugin)]
  }
}

/**
 * Configuration for {@linkcode Physics2DPlugin}.
 *
 * Plugin values are injected by reference. The defaults are created by the
 * {@linkcode Physics2DPlugin} constructor when an option is omitted.
 *
 * @typedef Physics2DPluginOptions
 * @property {Plugin} [broadphase] - Broadphase plugin used to find candidate
 * pairs. Defaults to a {@linkcode Broadphase2DPlugin} using
 * {@linkcode NaiveBroadphase2D}.
 * @property {Plugin} [narrowphase] - Narrowphase plugin used to create
 * contacts. Defaults to a new {@linkcode NarrowPhase2DPlugin}.
 * @property {Plugin} [integrator] - Legacy integrator reference. Defaults to
 * a new {@linkcode EulerIntegrator2DPlugin}; it does not configure collision
 * handling in this plugin.
 * @property {boolean} [autoUpdateBounds=true] - Whether
 * {@linkcode PhysicsHitbox} bounds are refreshed automatically.
 */
/* eslint-enable jsdoc/check-tag-names */
