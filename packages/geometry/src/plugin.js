/** @import {BoundType, BoundingBox2D, BoundingCircle} from './AABB' */
/** @import {TypeId} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { registerGeometryTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds geometry value support to an {@linkcode App}.
 *
 * Register this plugin when the app uses {@linkcode BoundType},
 * {@linkcode BoundingBox2D}, or {@linkcode BoundingCircle} with engine features
 * that support geometry values. The app must register {@linkcode CorePlugin},
 * {@linkcode ReflectPlugin}, and {@linkcode MathPlugin} separately; registering
 * {@linkcode GeometryPlugin} does not install those dependencies automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { GeometryPlugin } from '@wimaengine/geometry'
 * import { MathPlugin } from '@wimaengine/math'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new GeometryPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class GeometryPlugin extends Plugin {

  /**
   * Enables geometry value support for an {@linkcode App}.
   *
   * After registration, the app can use {@linkcode BoundType},
   * {@linkcode BoundingBox2D}, and {@linkcode BoundingCircle} with its geometry-
   * aware features.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app.registerSystem({ schedule: AppSchedule.Startup, system: registerGeometryTypes })
  }

  /**
   * Reports the plugins required for geometry support.
   *
   * The app must already have {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * and {@linkcode MathPlugin} registered. Registering {@linkcode GeometryPlugin}
   * does not install those dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(MathPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
