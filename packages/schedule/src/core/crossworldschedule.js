/** @import { CrossWorldSystemFunc } from './crossworldsystem' */
/** @import { SystemId } from '@wimaengine/ecs' */
/** @import { World } from '@wimaengine/ecs' */

import { Bitset } from '@wimaengine/datastructures'
import { World as EcsWorld } from '@wimaengine/ecs'

/**
 * Coordinates an ordered collection of executable callbacks that run with a
 * target world and a source world.
 *
 * Each callback is enabled when appended. Use
 * {@linkcode CrossWorldSchedule#add} to append callbacks and
 * {@linkcode CrossWorldSchedule#run} to invoke enabled callbacks in append
 * order. Each callback receives the target world first and the source world
 * second.
 *
 * @example
 * ```ts
 * import { World } from '@wimaengine/ecs'
 * import { CrossWorldSchedule } from '@wimaengine/schedule'
 *
 * const targetWorld = new World()
 * const sourceWorld = new World()
 * const schedule = new CrossWorldSchedule()
 *
 * schedule.add((target, source) => {
 *   // `target` is targetWorld; `source` is sourceWorld.
 *   console.log('syncing the source world into the target world', source, target)
 * })
 *
 * schedule.run(targetWorld, sourceWorld)
 * ```
 */
export class CrossWorldSchedule {

  /**
   * @private
   * @type {CrossWorldSystemFunc[]}
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
   * {@linkcode CrossWorldSchedule#run} considers callbacks in append order.
   * Adding a callback does not execute it immediately.
   *
   * @param {(targetWorld: World, sourceWorld: World) => void} system - Executable callback called with the target world first and the source world second.
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
   * Each enabled callback receives `targetWorld` as its first argument and
   * `sourceWorld` as its second argument. Disabled entries are not called.
   *
   * If an enabled callback throws, `errorHandler` receives the normalized
   * error and `targetWorld`; `sourceWorld` is not passed to the handler.
   * Existing `Error` values are passed through; thrown strings become
   * `new Error(error)`, and other thrown values become `new Error(String(error))`.
   * Without a handler, the default handler rethrows the normalized error. A
   * custom handler that returns lets `run` continue with the next callback; if
   * the handler throws, `run` exits with that handler error.
   *
   * @param {World} targetWorld - Target world forwarded as the first argument to each enabled callback and to the error handler.
   * @param {World} sourceWorld - Source world forwarded as the second argument to each enabled callback.
   * @param {(error: Error, world: EcsWorld) => void} [errorHandler] - Optional handler for callback errors; it receives the normalized error and target world.
   * @returns {void}
   * @throws {Error} If the default error handler rethrows a normalized callback error or a custom error handler throws.
   */
  run(targetWorld, sourceWorld, errorHandler) {
    const handler = errorHandler ?? defaultErrorHandler

    for (let i = 0; i < this.systems.length; i++) {
      try {
        if (this.condition.get(i)) this.systems[i](targetWorld, sourceWorld)
      } catch(error) {
        if (error instanceof Error) {
          handler(error, targetWorld)
        } else if (typeof error === 'string') {
          handler(new Error(error), targetWorld)
        } else {
          handler(new Error(String(error)), targetWorld)
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
