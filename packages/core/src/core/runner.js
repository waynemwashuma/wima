/** @import { App, Worlds } from '@wimaengine/app' */
/** @import { Executable, Runner, Scheduler, WorldRegistry } from '@wimaengine/schedule' */

import { assert } from '@wimaengine/logger'
import { typeid } from '@wimaengine/type'

/**
 * Runs an app's registered schedule callbacks from a browser animation-frame
 * loop.
 *
 * This function implements the {@linkcode Runner} contract used by {@linkcode App}.
 * The app passes it a {@linkcode Scheduler} and its {@linkcode Worlds} registry,
 * which maps world type IDs to worlds.
 *
 * When called, it reads `performance.now()` once and records each
 * {@linkcode Executable}'s first due time as that reading plus its `delay`. It
 * then requests the first `requestAnimationFrame` callback; no schedule
 * callback runs synchronously during this call. On each frame, cross-world
 * entries are processed before normal entries, and each registry's insertion
 * order from {@linkcode Scheduler} is preserved.
 *
 * For a due entry, the configured world labels are converted with `typeid` and
 * looked up with `worlds.get`. Cross-world callbacks receive the target world
 * first and the source world second; normal callbacks receive only their target
 * world. A repeating entry schedules its next run at the current frame time
 * plus `delay`, while an entry with `repeat: false` is deactivated after its
 * first run. The delay uses the browser's `performance.now()`/animation-frame
 * time units.
 *
 * After both registries are processed, the loop requests another animation
 * frame. This function does not catch failures: a missing target or source
 * world throws from its assertion, and an exception that escapes a schedule or
 * its configured error handler propagates from the frame callback. If a failure
 * occurs before the final `requestAnimationFrame` call, that callback does not
 * reschedule itself.
 *
 * @example
 * ```js
 * import { App, CorePlugin, ReflectPlugin } from 'wima'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin()) // installs defaultRunner
 *   .run()
 * ```
 *
 * @param {Scheduler} scheduler - Scheduler whose normal and cross-world entries
 * will be polled.
 * @param {WorldRegistry} worlds - World registry used to resolve each entry's
 * target and optional source labels.
 * @returns {void} The runner starts the animation-frame loop and returns
 * immediately.
 */
export function defaultRunner(scheduler, worlds) {

  /** @type {Map<string, { active: boolean, nextRunAt: number }>} */
  const crossWorldState = new Map()

  /** @type {Map<string, { active: boolean, nextRunAt: number }>} */
  const state = new Map()

  const now = performance.now()

  for (const executable of scheduler.crossWorldValues()) {
    crossWorldState.set(executable.typeId, {
      active: true,
      nextRunAt: now + executable.delay
    })
  }

  for (const executable of scheduler.values()) {
    state.set(executable.typeId, {
      active: true,
      nextRunAt: now + executable.delay
    })
  }

  const update = (/** @type {number} */ time) => {
    for (const executable of scheduler.crossWorldValues()) {
      const execState = crossWorldState.get(executable.typeId)

      if (!execState || !execState.active) continue

      if (time >= execState.nextRunAt) {
        const targetTypeId = typeid(executable.world)
        const targetWorld = worlds.get(targetTypeId)

        assert(targetWorld, `The world \`${targetTypeId}\` does not exist.`)

        const sourceTypeId = typeid(executable.sourceWorld)
        const sourceWorld = worlds.get(sourceTypeId)

        assert(sourceWorld, `The source world \`${sourceTypeId}\` does not exist.`)

        executable.schedule.run(targetWorld, sourceWorld, executable.errorHandler)

        if (executable.repeat) {
          execState.nextRunAt = time + executable.delay
        } else {
          execState.active = false
        }
      }
    }

    for (const executable of scheduler.values()) {
      const execState = state.get(executable.typeId)

      if (!execState || !execState.active) continue

      if (time >= execState.nextRunAt) {
        const targetTypeId = typeid(executable.world)
        const world = worlds.get(targetTypeId)

        assert(world, `The world \`${targetTypeId}\` does not exist.`)

        executable.schedule.run(world, executable.errorHandler)

        if (executable.repeat) {
          execState.nextRunAt = time + executable.delay
        } else {
          execState.active = false
        }
      }
    }

    requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
}
