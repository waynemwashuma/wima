import { App, Plugin } from '@wimaengine/app'
import { CommandsPlugin } from '@wimaengine/command'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { TimePlugin } from '@wimaengine/time'
import { Transform2DPlugin, Transform3DPlugin } from '@wimaengine/transform'
import { typeid } from '@wimaengine/type'
import { despawnParticles, emitParticles2D, emitParticles3D } from './systems'

/** @import {TypeId} from '@wimaengine/type' */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds 2D particle emission and lifetime cleanup to an {@linkcode App}.
 *
 * Enabled entities with an {@linkcode Emitter}, a {@linkcode GlobalTransform2D},
 * and a {@linkcode Timer} emit world-space particles when a configured emission
 * cycle begins. Each particle receives the emitter's current position and
 * orientation and is removed after its lifetime is complete.
 *
 * The plugin requires {@linkcode CorePlugin}, {@linkcode CommandsPlugin},
 * {@linkcode TimePlugin}, and {@linkcode Transform2DPlugin}. Register these
 * dependencies before registering this plugin; the app checks them but does
 * not install them automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CommandsPlugin } from '@wimaengine/command'
 * import { CorePlugin } from '@wimaengine/core'
 * import { Emitter2DPlugin } from '@wimaengine/emitter'
 * import { TimePlugin } from '@wimaengine/time'
 * import { Transform2DPlugin } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new CommandsPlugin())
 *   .registerPlugin(new TimePlugin())
 *   .registerPlugin(new Transform2DPlugin())
 *   .registerPlugin(new Emitter2DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Emitter2DPlugin extends Plugin {

  /**
   * Enables 2D particle emission and lifetime cleanup for the app.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: despawnParticles })
      .registerSystem({ schedule: AppSchedule.Update, system: emitParticles2D })

  }

  /**
   * Returns the plugin IDs required for 2D particle emission and cleanup.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(CommandsPlugin),
      typeid(TimePlugin),
      typeid(Transform2DPlugin)
    ]
  }
}

/**
 * Adds 3D particle emission and lifetime cleanup to an {@linkcode App}.
 *
 * Enabled entities with an {@linkcode Emitter}, a {@linkcode GlobalTransform3D},
 * and a {@linkcode Timer} emit world-space particles when a configured emission
 * cycle begins. Each particle receives the emitter's current position,
 * orientation, and scale and is removed after its lifetime is complete.
 *
 * The plugin requires {@linkcode CorePlugin}, {@linkcode CommandsPlugin},
 * {@linkcode TimePlugin}, and {@linkcode Transform3DPlugin}. Register these
 * dependencies before registering this plugin; the app checks them but does
 * not install them automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CommandsPlugin } from '@wimaengine/command'
 * import { CorePlugin } from '@wimaengine/core'
 * import { Emitter3DPlugin } from '@wimaengine/emitter'
 * import { TimePlugin } from '@wimaengine/time'
 * import { Transform3DPlugin } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new CommandsPlugin())
 *   .registerPlugin(new TimePlugin())
 *   .registerPlugin(new Transform3DPlugin())
 *   .registerPlugin(new Emitter3DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Emitter3DPlugin extends Plugin {

  /**
   * Enables 3D particle emission and lifetime cleanup for the app.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: despawnParticles })
      .registerSystem({ schedule: AppSchedule.Update, system: emitParticles3D })

  }

  /**
   * Returns the plugin IDs required for 3D particle emission and cleanup.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(CommandsPlugin),
      typeid(TimePlugin),
      typeid(Transform3DPlugin)
    ]
  }
}
/* eslint-enable jsdoc/check-tag-names */
