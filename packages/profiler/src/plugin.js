import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule, CoreSystems } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { warn } from '@wimaengine/logger'
import { ReflectPlugin } from '@wimaengine/reflect'
import { TimerMode, VirtualClock, TimePlugin } from '@wimaengine/time'
import { typeid } from '@wimaengine/type'
import { Profiler, ProfilerTimer } from './resources'
import { registerProfilerTypes } from './systems'

/** @import { TypeId } from '@wimaengine/type' */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds browser profiling to an {@linkcode App}.
 *
 * Registering this plugin makes a {@linkcode Profiler} resource and a repeating
 * {@linkcode ProfilerTimer} resource available to the app. The timer uses a
 * one-second cycle to refresh a browser viewer attached to `document.body`.
 *
 * The viewer lists each recorded profile label with its most recent measured
 * duration in milliseconds. Registration requires a browser document with a
 * `document.body`.
 *
 * Register {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
 * {@linkcode TimePlugin} before this plugin. Registering `ProfilerPlugin` does
 * not install those dependencies automatically.
 *
 * @category plugin
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ProfilerPlugin } from '@wimaengine/profiler'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TimePlugin } from '@wimaengine/time'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new TimePlugin())
 *   .registerPlugin(new ProfilerPlugin())
 * ```
 */
export class ProfilerPlugin extends Plugin {

  /**
   * Installs the profiler resources and browser viewer on an app.
   *
   * Fresh {@linkcode Profiler} and {@linkcode ProfilerTimer} resources are added to
   * the app, and the viewer is appended to `document.body`. Call this hook in
   * an environment where `document.body` is available.
   *
   * @inheritdoc
   * @param {App} app - {@linkcode App} that receives the profiler resources and viewer.
   * @returns {void}
   */
  register(app) {
    app.setResource(new Profiler())
    app.setResource(new ProfilerTimer({ duration: 1, mode: TimerMode.Repeat }))
    app.registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerProfilerTypes })
    setupProfileViewer(document.body)
    app.registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: updateProfileViewer })
    app.registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: updateProfileTimer })
  }

  /**
   * Returns the plugin dependencies required by the profiler.
   *
   * The app validates these dependencies before running. The returned IDs
   * identify {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
   * {@linkcode TimePlugin}; they are not installed by this plugin.
   *
   * @inheritdoc
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(TimePlugin)]
  }
}

/**
 * Creates the element used by the profiler viewer.
 *
 * The element is appended to `parent`, assigned the id `profile-view`, and
 * styled as a white-on-black absolutely positioned panel in the parent's
 * top-right corner. The viewer refresh logic looks it up by that id.
 *
 * @private
 * @param {HTMLElement} parent - Element that receives the viewer panel.
 * @returns {void}
 */
function setupProfileViewer(parent) {
  const container = parent.appendChild(document.createElement('p'))

  container.id = 'profile-view'
  container.style.position = 'absolute'
  container.style.right = '0px'
  container.style.top = '0px'
  container.style.color = 'white'
  container.style.background = 'black'
}

/**
 * Advances the profiler refresh timer using the current virtual frame delta.
 *
 * This helper does not measure profiles itself. It reads the
 * {@linkcode VirtualClock} resource and passes its delta in seconds to
 * {@linkcode ProfilerTimer#update}.
 *
 * @private
 * @param {World} registry - World containing the profiler and clock resources.
 * @returns {void}
 */
function updateProfileTimer(registry) {
  const timer = registry.getResource(ProfilerTimer)
  const clock = registry.getResource(VirtualClock)

  timer.update(clock.getDelta())
}

/**
 * Refreshes the browser profiler viewer after a timer cycle ends.
 *
 * Until {@linkcode ProfilerTimer#cycleEnded} is true, this helper does nothing. On
 * a completed cycle it finds `#profile-view`, clears its existing
 * children, and appends one paragraph per entry in
 * {@linkcode Profiler#profiles}. Each paragraph displays the profile label and
 * `delta.toFixed(4)` followed by `ms`. If the element is missing, the helper
 * logs a warning and leaves the profiles unchanged.
 *
 * @private
 * @param {World} registry - World containing the profiler and refresh timer.
 * @returns {void}
 */
function updateProfileViewer(registry) {
  const profiler = registry.getResource(Profiler)
  const timer = registry.getResource(ProfilerTimer)

  if (!timer.cycleEnded()) return

  const container = document.getElementById('profile-view')

  if (!container) return warn('no html element found to bind profiler to')

  container.innerHTML = ''

  for (const [key, value] of profiler.profiles) {
    const p = container.appendChild(document.createElement('p'))

    p.append(document.createTextNode(
      `${key}: ${value.delta.toFixed(4)}ms`
    ))
  }
}
/* eslint-enable jsdoc/check-tag-names */
