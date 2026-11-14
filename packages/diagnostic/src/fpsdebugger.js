/** @import {TypeId} from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule, CoreSystems } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { ReflectPlugin } from '@wimaengine/reflect'
import { TimerMode, VirtualClock, TimePlugin } from '@wimaengine/time'
import { typeid } from '@wimaengine/type'
import { RAFTimer } from './resources'
import { registerFpsDebuggerTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds a browser overlay that reports the app's instantaneous frame rate.
 *
 * Registering {@linkcode FPSDebugger} creates a repeating one-second {@linkcode RAFTimer}
 * and adds a `#fps-container` element to the browser's top-right corner. The
 * overlay refreshes once per timer cycle with the rounded value from
 * {@linkcode VirtualClock#getFrameRate}, such as `60 fps`.
 *
 * Register {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
 * {@linkcode TimePlugin} before {@linkcode FPSDebugger}. These dependencies must
 * already be registered; {@linkcode FPSDebugger} does not install them.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { FPSDebugger } from '@wimaengine/diagnostic'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TimePlugin } from '@wimaengine/time'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new TimePlugin())
 *   .registerDebugger(new FPSDebugger())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class FPSDebugger extends Plugin {

  /**
   * Adds the browser frame-rate overlay and its repeating {@linkcode RAFTimer} to
   * the app.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setResource(new RAFTimer({ duration: 1, mode: TimerMode.Repeat }))
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerFpsDebuggerTypes })
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: setUpUI })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: updateFPSCounter })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: updateRAFTimer })
  }

  /**
   * Returns the plugin IDs for the {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * and {@linkcode TimePlugin} dependencies.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(TimePlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 *
 */
function setUpUI() {
  const container = document.body.appendChild(document.createElement('div'))

  container.id = 'fps-container'
  container.style.position = 'absolute'
  container.style.top = '0px'
  container.style.right = '0px'
  container.style.width = '100px'
  container.style.height = '20px'
  container.style.background = 'black'
  container.style.textAlign = 'center'
  container.style.color = 'white'
}

/**
 * @param {World} world
 */
function updateFPSCounter(world) {
  const clock = world.getResource(VirtualClock)
  const timer = world.getResource(RAFTimer)

  if (!timer.cycleStarted()) return

  const container = document.querySelector('#fps-container')
  const fps = Math.round(clock.getFrameRate())

  if (container) container.innerHTML = `${fps} fps`
}

/**
 * @param {World} world
 */
function updateRAFTimer(world) {
  const clock = world.getResource(VirtualClock)
  const timer = world.getResource(RAFTimer)

  timer.update(clock.getDelta())
}
