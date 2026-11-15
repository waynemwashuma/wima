/**
 * Represents one typed event payload as an event record.
 *
 * Constructing the record stores the supplied value without queuing or
 * publishing it. Use {@linkcode Events} and {@linkcode Events#write} when the
 * payload should be queued for event readers.
 *
 * @template T
 * @example
 * ```js
 * import { CEvent } from '@wimaengine/event'
 *
 * const payload = { amount: 10 }
 * const event = new CEvent(payload)
 *
 * console.log(event.data === payload) // true
 * console.log(event.data.amount) // 10
 * ```
 */
export class CEvent {

  /**
   * The original typed payload stored in this event record.
   *
   * The value is stored by reference without cloning or freezing. Reassigning
   * this public field changes the payload exposed by the wrapper.
   *
   * @type {T}
   */
  data

  /**
   * Creates an event record around `data`.
   *
   * Construction stores only the supplied value. To make a payload readable
   * from an {@linkcode Events} resource, pass it to {@linkcode Events#write}.
   *
   * @param {T} data - Typed payload to store.
   */
  constructor(data) {
    this.data = data
  }
}
