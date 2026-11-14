/** @import { TypeId } from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Movable2DPlugin, Movable3DPlugin } from '@wimaengine/movable'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Linear2DDamping, Angular2DDamping, Linear3DDamping, Angular3DDamping } from './resources'
import { dampenRotation2D, dampenRotation3D, dampenVelocity2D, dampenVelocity3D, registerDamping2DTypes, registerDamping3DTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds scalar linear and angular damping to an {@linkcode App}.
 *
 * Register this plugin to provide {@linkcode Linear2DDamping} and
 * {@linkcode Angular2DDamping} resources and apply their values to matching 2D
 * motion components. It depends on {@linkcode CorePlugin},
 * {@linkcode ReflectPlugin}, and {@linkcode Movable2DPlugin}.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { Damping2DPlugin } from '@wimaengine/damping'
 * import { MathPlugin } from '@wimaengine/math'
 * import { Movable2DPlugin } from '@wimaengine/movable'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Movable2DPlugin())
 *   .registerPlugin(new Damping2DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Damping2DPlugin extends Plugin {

  /**
   * Adds the 2D damping resources to an {@linkcode App} and enables damping for
   * matching 2D motion components.
   *
   * The installed {@linkcode Linear2DDamping} and {@linkcode Angular2DDamping}
   * resources start with a value of `0.01`. Their values are applied to
   * matching 2D linear and angular motion as the app updates.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setResource(new Linear2DDamping(0.01))
      .setResource(new Angular2DDamping(0.01))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerDamping2DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: dampenVelocity2D })
      .registerSystem({ schedule: AppSchedule.Update, system: dampenRotation2D })
  }

  /**
   * Lists the plugins required by 2D damping.
   *
   * The app must already have {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * and {@linkcode Movable2DPlugin} registered. Registering this plugin does not
   * install those dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(Movable2DPlugin)]
  }
}

/**
 * Adds scalar linear and angular damping to an {@linkcode App}.
 *
 * Register this plugin to provide {@linkcode Linear3DDamping} and
 * {@linkcode Angular3DDamping} resources and apply their values to matching 3D
 * motion components. It depends on {@linkcode CorePlugin},
 * {@linkcode ReflectPlugin}, and {@linkcode Movable3DPlugin}.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { Damping3DPlugin } from '@wimaengine/damping'
 * import { MathPlugin } from '@wimaengine/math'
 * import { Movable3DPlugin } from '@wimaengine/movable'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Movable3DPlugin())
 *   .registerPlugin(new Damping3DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Damping3DPlugin extends Plugin {

  /**
   * Adds the 3D damping resources to an {@linkcode App} and enables damping for
   * matching 3D motion components.
   *
   * The installed {@linkcode Linear3DDamping} and {@linkcode Angular3DDamping}
   * resources start with a value of `0.01`. Their values are applied to
   * matching 3D linear and angular motion as the app updates.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setResource(new Linear3DDamping(0.01))
      .setResource(new Angular3DDamping(0.01))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerDamping3DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: dampenVelocity3D })
      .registerSystem({ schedule: AppSchedule.Update, system: dampenRotation3D })
  }

  /**
   * Lists the plugins required by 3D damping.
   *
   * The app must already have {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * and {@linkcode Movable3DPlugin} registered. Registering this plugin does not
   * install those dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(Movable3DPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
