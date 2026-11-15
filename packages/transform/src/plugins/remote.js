/** @import {TypeId} from '@wimaengine/type' */

import { Plugin, App } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { registerRemoteTransform2DTypes, registerRemoteTransform3DTypes, transformRemote2D, transformRemote3D } from '../systems'
import { Transform2DPlugin, Transform3DPlugin } from './transform'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds 2D remote-transform support to an {@linkcode App}.
 *
 * Entities with {@linkcode RemoteTransform2D} can follow selected position,
 * orientation, and scale channels from a referenced 2D entity while applying
 * their configured offset. A channel is updated only when it is enabled, and
 * the target is left unchanged when its referenced entity does not provide a
 * complete 2D transform.
 *
 * The plugin requires {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
 * {@linkcode MathPlugin}, plus {@linkcode Transform2DPlugin} for the source and
 * target transform components. Register these dependencies before registering
 * this plugin; dependencies are checked but not installed automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import {
 *   RemoteTransform2DPlugin,
 *   Transform2DPlugin
 * } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Transform2DPlugin())
 *   .registerPlugin(new RemoteTransform2DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class RemoteTransform2DPlugin extends Plugin {

  /**
   * Enables 2D remote transforms for an {@linkcode App}.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerRemoteTransform2DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: transformRemote2D })
  }

  /**
   * Returns the plugin IDs required for 2D remote-transform support.
   *
   * The app must already have {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * {@linkcode MathPlugin}, and {@linkcode Transform2DPlugin} registered.
   * Registering this plugin does not install them automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(MathPlugin),
      typeid(Transform2DPlugin)
    ]
  }
}

/**
 * Adds 3D remote-transform support to an {@linkcode App}.
 *
 * Entities with {@linkcode RemoteTransform3D} can follow selected position,
 * orientation, and scale channels from a referenced 3D entity while applying
 * their configured offset. A channel is updated only when it is enabled, and
 * the target is left unchanged when its referenced entity does not provide a
 * complete 3D transform.
 *
 * The plugin requires {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
 * {@linkcode MathPlugin}, plus {@linkcode Transform3DPlugin} for the source and
 * target transform components. Register these dependencies before registering
 * this plugin; dependencies are checked but not installed automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import {
 *   RemoteTransform3DPlugin,
 *   Transform3DPlugin
 * } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Transform3DPlugin())
 *   .registerPlugin(new RemoteTransform3DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class RemoteTransform3DPlugin extends Plugin {

  /**
   * Enables 3D remote transforms for an {@linkcode App}.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerRemoteTransform3DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: transformRemote3D })
  }

  /**
   * Returns the plugin IDs required for 3D remote-transform support.
   *
   * The app must already have {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * {@linkcode MathPlugin}, and {@linkcode Transform3DPlugin} registered.
   * Registering this plugin does not install them automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(MathPlugin),
      typeid(Transform3DPlugin)
    ]
  }
}
/* eslint-enable jsdoc/check-tag-names */
