/** @import {EventReader} from '../typedef' */
import { CEvent } from './event'

// TODO - use a pooling to reduce memory allocations.
/* eslint-disable jsdoc/check-tag-names */
/**
 * Buffers one typed event stream between writes and reads.
 *
 * {@linkcode Events#write} queues payloads in a pending buffer.
 * {@linkcode Events#clear} publishes that buffer as the readable batch, which
 * {@linkcode Events#each}, {@linkcode Events#readFirst}, {@linkcode Events#readLast},
 * and {@linkcode Events#count} inspect until the next clear. Writes after a clear
 * remain pending and are not part of the current readable batch.
 *
 * @template T
 * @category resource
 * @example
 * ```js
 * import { Events } from '@wimaengine/event'
 *
 * class Damage {
 *   constructor(amount) {
 *     this.amount = amount
 *   }
 * }
 *
 * const damageEvents = new Events()
 *
 * damageEvents.write(new Damage(10))
 * damageEvents.write(new Damage(3))
 * damageEvents.clear()
 *
 * damageEvents.each((event) => {
 *   console.log(event.data.amount)
 * })
 *
 * console.log(damageEvents.readFirst()?.data.amount) // 10
 * console.log(damageEvents.readLast()?.data.amount) // 3
 * console.log(damageEvents.count()) // 2
 *
 * damageEvents.write(new Damage(1))
 * console.log(damageEvents.count()) // Still 2: the new write is pending.
 * damageEvents.clear()
 * console.log(damageEvents.count()) // 1
 * ```
 */
export class Events {

  /**
   * Event records waiting for the next readable batch.
   *
   * {@linkcode Events#write} appends {@linkcode CEvent} records here. Read-side
   * methods do not inspect this buffer until {@linkcode Events#clear} promotes it
   * to {@linkcode Events#readBuffer}.
   *
   * @private
   * @type {CEvent<T>[]}
   */
  writeBuffer = []

  /**
   * The current readable batch of event records.
   *
   * Read-side methods inspect this buffer until the next
   * {@linkcode Events#clear}. It is replaced as a whole during rotation, so a new
   * {@linkcode Events#write} does not alter the batch currently being read.
   *
   * @private
   * @type {CEvent<T>[]}
   */
  readBuffer = []

  /**
   * Publishes pending writes as the current readable batch.
   *
   * The current write buffer becomes the read buffer, and a new empty write
   * buffer starts the next batch. The previous readable batch is replaced, but
   * its {@linkcode CEvent} records are not mutated. Events written after this call
   * remain pending and are invisible to {@linkcode Events#each},
   * {@linkcode Events#readFirst}, {@linkcode Events#readLast}, and
   * {@linkcode Events#count} until the next clear.
   *
   * @returns {void}
   */
  clear() {
    this.readBuffer = this.writeBuffer
    this.writeBuffer = []
  }

  /**
   * Calls `callback` once for each event in the readable batch, in write order.
   *
   * The callback receives a {@linkcode CEvent} wrapper. Events queued by
   * {@linkcode Events#write} while the callback runs are pending for the next
   * batch. The callback's return value is ignored. An empty readable batch
   * produces no callback and the method returns `undefined`.
   *
   * @param {EventReader<T>} callback - Function called with each readable event.
   * @returns {void} `undefined`; the readable batch is not returned.
   */
  each(callback) {
    for (let i = 0; i < this.readBuffer.length; i++) {
      callback(this.readBuffer[i])
    }
  }

  /**
   * Returns the first event in the readable batch.
   *
   * Returns the first {@linkcode CEvent} in write order, or `undefined` when the
   * readable batch is empty. Read the typed payload from {@linkcode CEvent#data}.
   *
   * @returns {CEvent<T> | undefined}
   */
  readFirst() {
    return this.readBuffer[0]
  }

  /**
   * Returns the last event in the readable batch.
   *
   * Returns the last {@linkcode CEvent} in write order, or `undefined` when the
   * readable batch is empty. Read the typed payload from {@linkcode CEvent#data}.
   *
   * @returns {CEvent<T> | undefined}
   */
  readLast() {
    return this.readBuffer[this.readBuffer.length - 1]
  }

  /**
   * Queues one typed payload for the next readable batch.
   *
   * The method creates a {@linkcode CEvent} record immediately, but read-side
   * methods cannot observe it until {@linkcode Events#clear} rotates the write
   * buffer into the readable batch. The payload is not returned directly;
   * readers access it through {@linkcode CEvent#data}.
   *
   * @param {T} data - Typed payload to queue.
   * @returns {void} `undefined`; the created wrapper is stored in the buffer.
   */
  write(data) {
    this.writeBuffer.push(new CEvent(data))
  }

  /**
   * Returns the number of events in the current readable batch.
   *
   * Payloads queued by {@linkcode Events#write} after the last
   * {@linkcode Events#clear} are not included. An empty readable batch
   * therefore has a count of `0`, even if events are waiting in the write
   * buffer.
   *
   * @returns {number}
   */
  count() {
    return this.readBuffer.length
  }
}
