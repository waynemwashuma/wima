/** @import {Movable2DPlugin} from './two' */
/** @import {TypeId} from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { registerMovable3DTypes } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds 3D movable component support to an {@linkcode App}.
 *
 * Register this plugin when an app uses {@linkcode Velocity3D},
 * {@linkcode Rotation3D}, {@linkcode Acceleration3D}, or {@linkcode Torque3D}. It
 * makes these components available for use on app entities.
 *
 * The plugin requires {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
 * {@linkcode MathPlugin}. Registering this plugin does not install missing
 * dependencies automatically. Use {@linkcode Movable2DPlugin} when an app needs
 * the corresponding 2D components.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { Movable3DPlugin } from '@wimaengine/movable'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Movable3DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Movable3DPlugin extends Plugin {

  /**
   * Enables 3D movable components for an app.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerMovable3DTypes })
  }

  /**
   * Returns the plugin IDs required for 3D movable component support.
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
