/** @import {TypeId} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Vector2, Vector3, MathPlugin } from '@wimaengine/math'
import { Movable2DPlugin, Movable3DPlugin } from '@wimaengine/movable'
import { NarrowPhase2DPlugin } from '@wimaengine/narrowphase'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Gravity2D, Gravity3D } from './resources'
import { applyGravity2D, applyGravity3D, registerGravity2DTypes, registerGravity3DTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds configurable 2D gravity to an {@linkcode App}.
 *
 * The plugin installs a {@linkcode Gravity2D} resource initialized from the
 * configured {@linkcode Vector2}, or `(0, -980)` by default. It applies that
 * acceleration to eligible bodies as the app updates. The plugin depends on
 * {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, {@linkcode MathPlugin},
 * {@linkcode Movable2DPlugin}, and {@linkcode NarrowPhase2DPlugin}.
 *
 * Pass a {@linkcode Vector2} in `options.gravity` to choose a different
 * acceleration. The vector is copied into the installed resource.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { Gravity2DPlugin } from '@wimaengine/gravity'
 * import { MathPlugin, Vector2 } from '@wimaengine/math'
 * import { Movable2DPlugin } from '@wimaengine/movable'
 * import { NarrowPhase2DPlugin } from '@wimaengine/narrowphase'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Movable2DPlugin())
 *   .registerPlugin(new NarrowPhase2DPlugin())
 *   .registerPlugin(new Gravity2DPlugin({
 *     gravity: new Vector2(0, -9.8)
 *   }))
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Gravity2DPlugin extends Plugin {

  /**
   * Configured {@linkcode Vector2} gravity vector.
   *
   * The vector is copied into the installed {@linkcode Gravity2D} resource when
   * the plugin is registered, so the resource has its own value.
   *
   * @readonly
   * @type {Vector2}
   */
  gravity

  /**
   * Creates a 2D gravity plugin.
   *
   * The optional `gravity` value is a {@linkcode Vector2}. When omitted, it
   * defaults to `(0, -980)`.
   *
   * @param {Gravity2DPluginOptions} [options] - Optional gravity configuration.
   */
  constructor({ gravity = new Vector2(0, -980) } = {}) {
    super()
    this.gravity = gravity
  }

  /**
   * Installs configured 2D gravity in an app.
   *
   * The installed {@linkcode Gravity2D} contains a copy of
   * {@linkcode Gravity2DPlugin#gravity}. Its acceleration is added to
   * eligible bodies as the app updates.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setResource(new Gravity2D().copy(this.gravity))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerGravity2DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: applyGravity2D })
  }

  /**
   * Returns the plugin dependencies required by 2D gravity.
   *
   * The returned IDs identify {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * {@linkcode MathPlugin}, {@linkcode Movable2DPlugin}, and
   * {@linkcode NarrowPhase2DPlugin}. Register these plugins before this one;
   * registering {@linkcode Gravity2DPlugin} does not install them automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(MathPlugin),
      typeid(Movable2DPlugin),
      typeid(NarrowPhase2DPlugin)
    ]
  }
}

/**
 * Adds configurable 3D gravity to an {@linkcode App}.
 *
 * The plugin installs a {@linkcode Gravity3D} resource initialized from the
 * configured {@linkcode Vector3}, or `(0, -980, 0)` by default. It applies that
 * acceleration to eligible bodies as the app updates. The plugin depends on
 * {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, {@linkcode MathPlugin},
 * {@linkcode Movable3DPlugin}, and {@linkcode NarrowPhase2DPlugin}.
 *
 * Pass a {@linkcode Vector3} in `options.gravity` to choose a different
 * acceleration. The vector is copied into the installed resource.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { Gravity3DPlugin } from '@wimaengine/gravity'
 * import { MathPlugin, Vector3 } from '@wimaengine/math'
 * import { Movable3DPlugin } from '@wimaengine/movable'
 * import { NarrowPhase2DPlugin } from '@wimaengine/narrowphase'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Movable3DPlugin())
 *   .registerPlugin(new NarrowPhase2DPlugin())
 *   .registerPlugin(new Gravity3DPlugin({
 *     gravity: new Vector3(0, -9.8, 0)
 *   }))
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Gravity3DPlugin extends Plugin {

  /**
   * Configured {@linkcode Vector3} gravity vector.
   *
   * The vector is copied into the installed {@linkcode Gravity3D} resource when
   * the plugin is registered, so the resource has its own value.
   *
   * @readonly
   * @type {Vector3}
   */
  gravity

  /**
   * Creates a 3D gravity plugin.
   *
   * The optional `gravity` value is a {@linkcode Vector3}. When omitted, it
   * defaults to `(0, -980, 0)`.
   *
   * @param {Gravity3DPluginOptions} [options] - Optional gravity configuration.
   */
  constructor({ gravity = new Vector3(0, -980, 0) } = {}) {
    super()
    this.gravity = gravity
  }

  /**
   * Installs configured 3D gravity in an app.
   *
   * The installed {@linkcode Gravity3D} contains a copy of
   * {@linkcode Gravity3DPlugin#gravity}. Its acceleration is added to
   * eligible bodies' 3D acceleration values as the app updates.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setResource(new Gravity3D().copy(this.gravity))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerGravity3DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: applyGravity3D })
  }

  /**
   * Returns the plugin dependencies required by 3D gravity.
   *
   * The returned IDs identify {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * {@linkcode MathPlugin}, {@linkcode Movable3DPlugin}, and
   * {@linkcode NarrowPhase2DPlugin}. Register these plugins before this one;
   * registering {@linkcode Gravity3DPlugin} does not install them automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(MathPlugin),
      typeid(Movable3DPlugin),
      typeid(NarrowPhase2DPlugin)
    ]
  }
}

/**
 * Configuration accepted by {@linkcode Gravity3DPlugin}.
 *
 * @typedef Gravity3DPluginOptions
 * @property {Vector3} [gravity=new Vector3(0, -980, 0)] - Gravity copied into the world resource.
 */

/**
 * Configuration accepted by {@linkcode Gravity2DPlugin}.
 *
 * @typedef Gravity2DPluginOptions
 * @property {Vector2} [gravity=new Vector2(0, -980)] - Gravity copied into the world resource.
 */
/* eslint-enable jsdoc/check-tag-names */
