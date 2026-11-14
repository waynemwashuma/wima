/** @import {SystemFunc,SystemId} from '@wimaengine/ecs' */
import { Bitset } from '@wimaengine/datastructures'
import { World } from '@wimaengine/ecs'

/**
 * Represents an ordered collection of executable callbacks.
 *
 * Each callback is enabled when appended. Use {@linkcode Schedule#add} to
 * append callbacks and {@linkcode Schedule#run} to invoke enabled callbacks
 * in append order with a world.
 *
 * @example
 * ```ts
 * import { World } from '@wimaengine/ecs'
 * import { Schedule } from '@wimaengine/schedule'
 *
 * const world = new World()
 * const schedule = new Schedule()
 *
 * schedule.add((world) => {
 *   console.log('running a callback', world)
 * })
 *
 * schedule.run(world)
 * ```
 */
export class Schedule {

  /**
   * @private
   * @type {SystemFunc[]}
   */
  systems = []

  /**
   * @private
   * @type {Bitset}
   */
  condition = new Bitset()

  /**
   * Appends an executable callback to the schedule and enables it.
   *
   * The returned number is the callback's zero-based position.
   * {@linkcode Schedule#run} considers callbacks in append order, and adding
   * a callback does not execute it immediately.
   *
   * @param {(world: World) => void} system - Executable callback to append.
   * @returns {SystemId} The zero-based id of the appended callback.
   */
  add(system) {
    const { length } = this.systems

    this.systems.push(system)
    this.condition.resize(length + 1)
    this.condition.set(length)

    return length
  }

  /**
   * Invokes each enabled executable callback in append order.
   *
   * The `world` argument is passed as the only argument to every enabled
   * callback and as the second argument to `errorHandler`. Disabled entries
   * are skipped without being called.
   *
   * If an enabled callback throws, `errorHandler` receives the normalized
   * error and the same `world`. Existing `Error` values are passed through;
   * thrown strings become `new Error(error)`, and other thrown values become
   * `new Error(String(error))`. When no handler is provided, the default
   * handler rethrows the normalized error. A custom handler that returns lets
   * execution continue with the next callback; if it throws, `run` exits with
   * that handler error.
   *
   * @param {World} world - World forwarded to each enabled callback and the error handler.
   * @param {(error: Error, world: World) => void} [errorHandler] - Optional handler for callback errors.
   * @returns {void}
   * @throws {Error} If the default error handler rethrows a normalized callback error or a custom error handler throws.
   */
  run(world, errorHandler) {
    const handler = errorHandler ?? defaultErrorHandler

    for (let i = 0; i < this.systems.length; i++) {
      try {
        if (this.condition.get(i)) this.systems[i](world)
      } catch(error) {
        if (error instanceof Error) {
          handler(error, world)
        } else if (typeof error === 'string') {
          handler(new Error(error), world)
        } else {
          handler(new Error(String(error)), world)
        }
      }
    }
  }
}

/**
 * @param {Error} error
 * @throws {Error}
 */
function defaultErrorHandler(error) {
  throw error
}
