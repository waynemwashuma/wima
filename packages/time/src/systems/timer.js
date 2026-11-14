/** @import { AppSchedule, CoreSystems } from '@wimaengine/core' */

import { Query, World } from '@wimaengine/ecs'
import { Timer } from '../components'
import { VirtualClock } from '../resource'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Advances every {@linkcode Timer} component by the current virtual-clock delta.
 *
 * {@linkcode TimePlugin} registers this exact function directly in the repeating
 * {@linkcode AppSchedule.Update} schedule and the {@linkcode CoreSystems.Start}
 * group. This system reads the delta for the current frame from
 * {@linkcode VirtualClock}.
 *
 * Each invocation creates a {@linkcode Query} requiring {@linkcode Timer}, reads
 * {@linkcode VirtualClock#getDelta}, and calls {@linkcode Timer#update} on every
 * currently matching live component with that delta in seconds. The timer
 * updates elapsed, completion, cycle, and playback state; this system does not
 * update the clock, create entities, or return a value. A world with no
 * matching timers has no timer side effects, while a world without
 * {@linkcode VirtualClock} fails when its resource is requested.
 *
 * @example
 * ```js
 * import { Timer, TimePlugin } from '@wimaengine/time'
 *
 * app.registerPlugin(new TimePlugin())
 * world.spawn([new Timer({ duration: 1 })])
 * // The timer advances automatically on each Update/Start pass.
 * ```
 *
 * @param {World} world - Update world containing the {@linkcode VirtualClock} and timer entities.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode VirtualClock}.
 * @category system
 */
export function updateTimers(world) {
  const timers = new Query(world, [Timer])
  const clock = world.getResource(VirtualClock)
  const delta = clock.getDelta()

  timers.each(([timer]) => {
    timer.update(delta)
  })
}
/* eslint-enable jsdoc/check-tag-names */
