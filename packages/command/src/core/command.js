/** @import { World } from '@wimaengine/ecs' */

/**
 * Defines a deferred mutation that a concrete command can apply to a
 * {@linkcode World}.
 *
 * Extend this class and implement {@linkcode Command#execute} for a specific
 * operation. Add command instances to a {@linkcode CommandQueue} when the
 * application wants to apply those mutations later; the application controls
 * when queued commands run.
 *
 * Undo is application-managed. Override {@linkcode Command#undo} when an inverse
 * operation is needed; the base methods are no-ops.
 *
 * @example
 * ```js
 * import { Command, CommandQueue } from '@wimaengine/command'
 * import { World } from '@wimaengine/ecs'
 *
 * class Score {
 *   value = 0
 * }
 *
 * class AddScoreCommand extends Command {
 *   constructor(amount) {
 *     super()
 *     this.amount = amount
 *   }
 *
 *   execute(world) {
 *     world.getResource(Score).value += this.amount
 *   }
 *
 *   undo(world) {
 *     world.getResource(Score).value -= this.amount
 *   }
 * }
 *
 * const world = new World()
 * world.setResource(new Score())
 *
 * const queue = new CommandQueue()
 * world.setResource(queue)
 * const command = new AddScoreCommand(10)
 * queue.add(command)
 * for (const queuedCommand of queue.drain()) queuedCommand.execute(world)
 * command.undo(world) // Optional application-managed reversal.
 * ```
 */
export class Command {

  /**
   * Applies the command's deferred mutation to a world.
   *
   * Override this method in a concrete command. The base implementation does
   * nothing.
   *
   * @param {World} _world - World to mutate.
   * @returns {void}
   */
  execute(_world) { }

  /**
   * Reverses the command's mutation when undo is supported by the application.
   *
   * Override this method in a concrete command that participates in an
   * application-managed undo flow. The base implementation does nothing.
   *
   * @param {World} _world - World to mutate.
   * @returns {void}
   */
  undo(_world) { }
}
