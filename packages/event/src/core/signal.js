/**
 * Publishes updates to one mutable value by notifying registered listeners
 * synchronously.
 *
 * @example
 * ```ts
 * import { Signal } from '@wimaengine/event'
 *
 * const health = new Signal<number>(100)
 * const reportHealth = (value) => console.log(`Health: ${value}`)
 *
 * health.addListener(reportHealth)
 * health.setValue(75) // logs "Health: 75" before setValue() returns
 * console.log(health.getValue()) // 75
 *
 * health.removeListener(reportHealth)
 * health.setValue(50) // no longer logs
 * ```
 *
 * @template T
 */
export class Signal {

  /**
   * Registered listener callbacks, kept in the order they were added.
   *
   * Each call to `Signal.addListener` adds one registration; adding the same
   * callback more than once therefore creates separate entries.
   *
   * @type {signalListener<T>[]}
   */
  listeners = []

  /**
   * The current value held by this signal.
   *
   * `Signal.setValue` assigns the new value before notifying listeners, so
   * callbacks can read the updated value with `Signal.getValue`.
   * Assigning this public field directly changes the current value without
   * notifying listeners; use `Signal.setValue` to publish an update.
   *
   * @type {T}
   */
  value

  /**
   * Creates a signal with an initial current value.
   *
   * Construction does not notify listeners because none are registered yet.
   *
   * @param {T} value - Initial value held by the signal.
   */
  constructor(value) {
    this.value = value
  }

  /**
   * Returns the signal's current value without notifying listeners.
   *
   * @returns {T} The current value at the time of the call.
   */
  getValue() {
    return this.value
  }

  /**
   * Replaces the current value and synchronously notifies listeners.
   *
   * The assignment happens before the first callback. Each callback receives
   * the signal's current `Signal.value` at its turn, normally the value passed
   * as `x`; the previous value is not passed. Assigning the same value still
   * notifies listeners.
   *
   * Notification walks the live listener list. On an unchanged list, callbacks
   * run in registration order and duplicate registrations are visited once per
   * entry. A callback that uses `Signal.addListener` can append an entry that
   * is reached later in this call, while `Signal.removeListener` can shift
   * entries and cause a later entry to be skipped. A listener exception
   * propagates to the caller and stops notification of later entries.
   *
   * @example
   * ```js
   * const signal = new Signal(0)
   * const seen = []
   *
   * signal.addListener((value) => seen.push([value, signal.getValue()]))
   * signal.setValue(1)
   *
   * console.log(seen) // [[1, 1]]: the listener ran before setValue returned
   * ```
   *
   * @param {T} x - New value to store and publish.
   * @returns {void}
   */
  setValue(x) {
    this.value = x

    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](this.value)
    }
  }

  /**
   * Registers a listener for future value updates.
   *
   * Registration appends one callback entry and does not invoke it with the
   * current value. If the same callback is added more than once, each
   * registration is a separate entry: `Signal.setValue` can notify the
   * callback once for each entry, and `Signal.removeListener` removes them one
   * at a time.
   *
   * @example
   * ```js
   * const signal = new Signal(0)
   * const seen = []
   * const listener = (value) => seen.push(value)
   *
   * signal.addListener(listener)
   * signal.addListener(listener)
   * signal.setValue(1)
   * console.log(seen) // [1, 1]
   * ```
   *
   * @param {signalListener<T>} listener - Callback that receives each new value.
   * @returns {void}
   */
  addListener(listener) {
    this.listeners.push(listener)
  }

  /**
   * Removes the first registration matching a listener callback.
   *
   * The search starts at the first entry and uses callback identity. If the
   * callback was registered multiple times, later registrations remain and a
   * second call removes the next matching entry. Removing a callback that is
   * not registered is a no-op and returns `undefined`.
   *
   * @example
   * ```js
   * const signal = new Signal(0)
   * const listener = () => console.log('called')
   *
   * signal.addListener(listener)
   * signal.addListener(listener)
   * signal.removeListener(listener)
   * signal.setValue(1) // logs "called" once: one registration remains
   * ```
   *
   * @param {signalListener<T>} listener - Callback registration to remove.
   * @returns {void}
   */
  removeListener(listener) {
    for (let i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i] === listener) return this.detach(i)
    }
  }

  /**
   * Removes one listener registration by its array position.
   *
   * This internal operation is used by `Signal.removeListener` after it finds
   * the first matching callback.
   *
   * @private
   * @param {number} bindingIndex
   * @returns {void}
   */
  detach(bindingIndex) {
    this.listeners.splice(bindingIndex, 1)
  }
}

/**
 * @template T
 * @callback signalListener
 * @param {T} value - Value published by the signal.
 * @returns {void}
 */
