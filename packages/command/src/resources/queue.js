/** @import { CommandFn } from '../typedef' */
import { Command } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * World-scoped resource that stores deferred {@linkcode Command}.
 *
 * Commands are stored in FIFO order until a consumer drains the queue.
 * Draining returns the current batch and starts an empty queue, so commands
 * added afterward belong to the next batch. {@linkcode CommandsPlugin} provides
 * this resource for an app's default world; applications can also create and
 * install one directly.
 *
 * @example
 * ```js
 * import { Command, CommandQueue } from '@wimaengine/command'
 * import { World } from '@wimaengine/ecs'
 *
 * class PrintCommand extends Command {
 *   execute() {
 *     console.log('executed')
 *   }
 * }
 *
 * const world = new World()
 * const queue = new CommandQueue()
 * world.setResource(queue)
 * const first = new PrintCommand()
 * const second = new PrintCommand()
 * queue.add(first)
 * queue.add(second)
 *
 * console.log(queue.size()) // 2
 * for (const command of queue.drain()) command.execute(world)
 * console.log(queue.size()) // 0: draining starts an empty batch.
 * ```
 *
 * @category resource
 */
export class CommandQueue {

  /**
   * @private
   * @type {Command[]}
   */
  queue = []

  /**
   * Appends a command to the end of the FIFO queue.
   *
   * Commands remain in this order when the queue is drained.
   *
   * @param {Command} command
   * @returns {void}
   */
  add(command) {
    this.queue.push(command)
  }

  /**
   * Returns the queued commands and clears the queue immediately.
   *
   * The returned array contains the commands queued at the time of the call.
   * It is detached from the queue: commands added after `drain` returns are
   * stored in a new queue and are not included in that array.
   *
   * @returns {Command[]} The commands in FIFO order.
   */
  drain() {
    const { queue } = this

    this.queue = []

    return queue
  }

  /**
   * Returns the number of commands currently waiting to be drained.
   *
   * @returns {number}
   */
  size() {
    return this.queue.length
  }
}
