/** @import {EntityHandle} from '@wimaengine/ecs' */
/** @import {PhysicsHitbox} from '@wimaengine/broadphase' */
/** @import {TypeId} from '@wimaengine/type' */
/** @import {Velocity2D} from '@wimaengine/movable' */
/** @import {Collider2D} from '@wimaengine/narrowphase' */
/** @import {Position2D} from '@wimaengine/transform' */
import { App, Plugin } from '@wimaengine/app'
import { Broadphase2DPlugin } from '@wimaengine/broadphase'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Movable2DPlugin } from '@wimaengine/movable'
import { NarrowPhase2DPlugin } from '@wimaengine/narrowphase'
import { Transform2DPlugin } from '@wimaengine/transform'
import { typeid } from '@wimaengine/type'
import { WindowPlugin } from '@wimaengine/window'
import {
  drawArms,
  drawBounds,
  drawContacts,
  drawPosition,
  drawShapes,
  drawVelocity
} from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds optional 2D physics debug overlays to an app's browser canvas.
 *
 * Enable overlays for shapes, bounds, positions, velocities, collision arms,
 * or contacts through the plugin options. `drawShapes` defaults to `true`;
 * every other overlay defaults to `false`. The overlays read the current
 * physics state and need the app's window and physics dependencies to be
 * registered.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { DefaultPlugin } from '@wimaengine/misc'
 * import { Physics2DDebuggerPlugin } from '@wimaengine/physics'
 *
 * new App()
 *   .registerPlugin(new DefaultPlugin())
 *   .registerPlugin(new Physics2DDebuggerPlugin({
 *     drawBounds: true,
 *     drawContacts: true
 *   }))
 *   .run()
 * ```
 *
 * Register {@linkcode DefaultPlugin} before this plugin for a standard setup.
 * Set `drawShapes` to `false` when the default shape overlay is not wanted.
 *
 * @category plugin
 */
export class Physics2DDebuggerPlugin extends Plugin {

  /**
   * Creates a debugger plugin with the selected overlays enabled.
   *
   * `drawShapes` defaults to `true`. `drawBounds`, `drawPosition`,
   * `drawVelocity`, `drawCollisionArm`, and `drawContacts` default to `false`.
   * Set an option to `true` to enable its overlay.
   *
   * @param {BodyDebuggerOptions} [options={}] - Drawing overlays to register.
   */
  constructor(options = {}) {
    super()
    options.drawCollisionArm = options.drawCollisionArm ?? false
    options.drawContacts = options.drawContacts ?? false
    options.drawPosition = options.drawPosition ?? false
    options.drawVelocity = options.drawVelocity ?? false
    options.drawBounds = options.drawBounds ?? false
    options.drawShapes = options.drawShapes ?? true
    this.options = options
  }

  /**
   * Registers each enabled debugger overlay for the app.
   *
   * Enabled overlays draw the current physics state on the main browser
   * canvas during app updates. If no canvas or 2D drawing context is available,
   * the plugin remains registered but produces no visible overlay.
   *
   * @param {App} app - App receiving the enabled overlays.
   * @returns {void}
   */
  register(app) {
    const { options } = this

    if (options.drawPosition) app.registerSystem({ schedule: AppSchedule.Update, system: drawPosition })
    if (options.drawBounds) app.registerSystem({ schedule: AppSchedule.Update, system: drawBounds })
    if (options.drawShapes) app.registerSystem({ schedule: AppSchedule.Update, system: drawShapes })
    if (options.drawCollisionArm) app.registerSystem({ schedule: AppSchedule.Update, system: drawArms })
    if (options.drawContacts) app.registerSystem({ schedule: AppSchedule.Update, system: drawContacts })
    if (options.drawPosition) app.registerSystem({ schedule: AppSchedule.Update, system: drawPosition })
    if (options.drawVelocity) app.registerSystem({ schedule: AppSchedule.Update, system: drawVelocity })
  }

  /**
   * Returns the plugin IDs required by the debugger overlays.
   *
   * Register {@linkcode CorePlugin}, {@linkcode WindowPlugin},
   * {@linkcode Broadphase2DPlugin}, {@linkcode NarrowPhase2DPlugin},
   * {@linkcode Transform2DPlugin}, and {@linkcode Movable2DPlugin} before this
   * plugin. Missing dependencies are not installed automatically.
   *
   * @returns {TypeId[]} Required plugin type IDs, in registration order.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(WindowPlugin),
      typeid(Broadphase2DPlugin),
      typeid(NarrowPhase2DPlugin),
      typeid(Transform2DPlugin),
      typeid(Movable2DPlugin)
    ]
  }
}

/**
 * Drawing overlays controlled by {@linkcode Physics2DDebuggerPlugin}.
 *
 * @typedef BodyDebuggerOptions
 * @property {boolean} [drawBounds=false] Draw {@linkcode PhysicsHitbox} bounds.
 * @property {boolean} [drawPosition=false] Mark each {@linkcode Position2D}.
 * @property {boolean} [drawVelocity=false] Draw each {@linkcode Velocity2D} from
 * its {@linkcode Position2D}.
 * @property {boolean} [drawShapes=true] Draw each {@linkcode Collider2D} shape.
 * @property {boolean} [drawCollisionArm=false] Draw lines from colliding
 * bodies to their contact points.
 * @property {boolean} [drawContacts=false] Mark the current contact points.
 */
/* eslint-enable jsdoc/check-tag-names */
