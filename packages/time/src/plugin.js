/** @import {Timer, TimerMode} from './components' */
/** @import {TypeRegistry} from '@wimaengine/reflect' */
/** @import {TypeId} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule, CoreSystems } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Clock } from './clock'
import { VirtualClock } from './resource'
import { registerTimeTypes, updateTimers } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds virtual time and timer progression to an {@linkcode App}.
 *
 * {@linkcode TimePlugin} provides a fresh {@linkcode VirtualClock} resource and
 * advances {@linkcode Timer} components from the clock's current frame duration.
 * This gives application code one shared, controllable source of virtual time.
 *
 * The plugin depends on {@linkcode CorePlugin} and {@linkcode ReflectPlugin}.
 * Register both before {@linkcode TimePlugin}; plugin dependencies are checked
 * but are not installed automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TimePlugin } from '@wimaengine/time'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new TimePlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class TimePlugin extends Plugin {

  /**
   * Installs the app's {@linkcode VirtualClock} and connects timer progression to
   * the app's virtual time.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerTimeTypes })
      .setResource(new VirtualClock())
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: updateVirtualClock })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: updateTimers })
  }

  /**
   * Returns the plugin IDs required by {@linkcode TimePlugin}.
   *
   * Register {@linkcode CorePlugin} and {@linkcode ReflectPlugin} before this
   * plugin. Registering {@linkcode TimePlugin} does not install them
   * automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @param {World} world
 */
function updateVirtualClock(world) {
  const clock = world.getResource(VirtualClock)

  Clock.update(clock)
}
