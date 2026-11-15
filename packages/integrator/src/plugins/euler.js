/** @import { TypeId } from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Movable2DPlugin, Movable3DPlugin } from '@wimaengine/movable'
import { Transform2DPlugin, Transform3DPlugin } from '@wimaengine/transform'
import { typeid } from '@wimaengine/type'
import {
  updateAngularEuler2D,
  updateOrientationEuler2D,
  updatePositionEuler2D,
  updateVelocityEuler2D,
  updateAngularEuler3D,
  updateOrientationEuler3D,
  updatePositionEuler3D,
  updateVelocityEuler3D
} from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds fixed-step 2D Euler integration to an {@linkcode App}.
 *
 * Use this plugin when an application needs 2D position, velocity, orientation,
 * and angular values to advance with Euler integration. It processes
 * {@linkcode Position2D}, {@linkcode Velocity2D}, {@linkcode Acceleration2D},
 * {@linkcode Orientation2D}, {@linkcode Rotation2D}, and {@linkcode Torque2D} with a
 * fixed `1 / 60` step.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { HierarchyPlugin } from '@wimaengine/hierarchy'
 * import { MathPlugin } from '@wimaengine/math'
 * import { EulerIntegrator2DPlugin } from '@wimaengine/integrator'
 * import { Movable2DPlugin } from '@wimaengine/movable'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { Transform2DPlugin } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .registerPlugin(new Movable2DPlugin())
 *   .registerPlugin(new Transform2DPlugin())
 *   .registerPlugin(new EulerIntegrator2DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class EulerIntegrator2DPlugin extends Plugin {

  /**
   * Enables fixed-step 2D Euler integration for an {@linkcode App}. Position and
   * velocity values, orientation, and angular values are processed during each
   * update using the fixed `1 / 60` step.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: updatePositionEuler2D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateVelocityEuler2D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateOrientationEuler2D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateAngularEuler2D })
  }

  /**
   * Returns the plugin IDs required for 2D Euler integration.
   *
   * The app must already have {@linkcode CorePlugin}, {@linkcode Movable2DPlugin},
   * and {@linkcode Transform2DPlugin} registered. Registering this plugin does
   * not install those dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(Movable2DPlugin), typeid(Transform2DPlugin)]
  }
}

/**
 * Adds fixed-step 3D Euler integration to an {@linkcode App}.
 *
 * Use this plugin when an application needs 3D position, velocity, orientation,
 * and angular values to advance with Euler integration. It processes
 * {@linkcode Position3D}, {@linkcode Velocity3D}, {@linkcode Acceleration3D},
 * {@linkcode Orientation3D}, {@linkcode Rotation3D}, and {@linkcode Torque3D} with a
 * fixed `1 / 60` step.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { HierarchyPlugin } from '@wimaengine/hierarchy'
 * import { MathPlugin } from '@wimaengine/math'
 * import { EulerIntegrator3DPlugin } from '@wimaengine/integrator'
 * import { Movable3DPlugin } from '@wimaengine/movable'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { Transform3DPlugin } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .registerPlugin(new Movable3DPlugin())
 *   .registerPlugin(new Transform3DPlugin())
 *   .registerPlugin(new EulerIntegrator3DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class EulerIntegrator3DPlugin extends Plugin {

  /**
   * Enables fixed-step 3D Euler integration for an {@linkcode App}. Position and
   * velocity values, orientation, and angular values are processed during each
   * update using the fixed `1 / 60` step.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: updatePositionEuler3D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateVelocityEuler3D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateOrientationEuler3D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateAngularEuler3D })
  }

  /**
   * Returns the plugin IDs required for 3D Euler integration.
   *
   * The app must already have {@linkcode CorePlugin}, {@linkcode Movable3DPlugin},
   * and {@linkcode Transform3DPlugin} registered. Registering this plugin does
   * not install those dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(Movable3DPlugin), typeid(Transform3DPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
