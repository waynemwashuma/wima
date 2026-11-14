/** @import { World } from '@wimaengine/ecs' */
import { CommandQueue } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Applies the deferred commands currently queued for a {@linkcode World}.
 *
 * The function first looks up the world's {@linkcode CommandQueue} and drains it.
 * It then calls each drained command's `execute(world)` in FIFO order. Draining
 * replaces the queue before any command runs, so commands added during
 * execution remain queued for the next call. If a command throws, execution
 * stops and the error propagates; already drained commands are not requeued.
 * The lookup asserts when the world has no {@linkcode CommandQueue}.
 *
 * Register this function directly with {@linkcode Schedule#add} when deferred
 * mutations should be applied at that point in a schedule. The
 * {@linkcode CommandsPlugin} registers it for the app's core schedule phases and
 * installs the required queue automatically.
 *
 * @example
 * ```js
 * import { CommandQueue, executeCommands } from '@wimaengine/command'
 * import { Schedule } from '@wimaengine/schedule'
 * import { World } from '@wimaengine/ecs'
 *
 * const world = new World()
 * world.setResource(new CommandQueue())
 *
 * const schedule = new Schedule()
 * schedule.add(executeCommands)
 * schedule.run(world)
 * ```
 *
 * @param {World} world - World whose command queue is drained and executed.
 * @returns {void}
 * @throws {Error} If `world` does not contain a {@linkcode CommandQueue}.
 * @category system
 */
export function executeCommands(world) {
  const commands = world.getResource(CommandQueue).drain()

  for (const command of commands) {
    command.execute(world)
  }
}
/* eslint-enable jsdoc/check-tag-names */
