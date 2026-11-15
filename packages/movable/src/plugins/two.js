/** @import {Movable3DPlugin} from './three' */
/** @import {TypeId} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { registerMovable2DTypes } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds 2D movable component support to an {@linkcode App}.
 *
 * Register this plugin to make {@linkcode Velocity2D}, {@linkcode Rotation2D},
 * {@linkcode Acceleration2D}, and {@linkcode Torque2D} available as movable
 * components.
 *
 * It depends on {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
 * {@linkcode MathPlugin}. Registering {@linkcode Movable2DPlugin} does not install
 * missing dependencies automatically. Use {@linkcode Movable3DPlugin} when an
 * app needs the corresponding 3D components.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { Movable2DPlugin } from '@wimaengine/movable'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Movable2DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Movable2DPlugin extends Plugin {

  /**
   * Enables 2D movable component support for an {@linkcode App}.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerMovable2DTypes })
  }

  /**
   * Returns the plugin IDs required for 2D movable component support.
   *
   * The app must already have {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * and {@linkcode MathPlugin} registered. Registering this plugin does not
   * install them automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(MathPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
