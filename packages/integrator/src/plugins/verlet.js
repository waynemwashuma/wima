/** @import { TypeId } from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Movable2DPlugin } from '@wimaengine/movable'
import { Transform2DPlugin } from '@wimaengine/transform'
import { typeid } from '@wimaengine/type'
import { updatePositionVerlet2D, updateOrientationVerlet2D } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds fixed-step 2D Verlet integration to an {@linkcode App}.
 *
 * Use this plugin when an application needs 2D position, velocity, and angular
 * values to advance with fixed-step Verlet integration. It processes
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
 * import { Movable2DPlugin } from '@wimaengine/movable'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { Transform2DPlugin } from '@wimaengine/transform'
 * import { VerletIntegrator2DPlugin } from '@wimaengine/integrator'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .registerPlugin(new Movable2DPlugin())
 *   .registerPlugin(new Transform2DPlugin())
 *   .registerPlugin(new VerletIntegrator2DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class VerletIntegrator2DPlugin extends Plugin {

  /**
   * Enables fixed-step 2D Verlet integration for an {@linkcode App}. Position,
   * velocity, and angular values advance with the fixed `1 / 60` step.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: updatePositionVerlet2D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateOrientationVerlet2D })
  }

  /**
   * Returns the plugin IDs required for 2D Verlet integration.
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
/* eslint-enable jsdoc/check-tag-names */
