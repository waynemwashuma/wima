/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides tab-scoped JSON storage as a world resource.
 *
 * {@linkcode StoragePlugin} installs a fresh {@linkcode Session} resource. Values are
 * written to the browser's `sessionStorage`, so they survive reloads in the
 * same tab but are discarded when that tab or its top-level browsing context
 * ends. Each value is serialized with `JSON.stringify` by {@linkcode Session#set}
 * and deserialized with `JSON.parse` by {@linkcode Session#get}; values must be
 * JSON-serializable and returned objects are new parsed values.
 * The browser must provide the global `sessionStorage` object when these
 * methods run.
 *
 * @example
 * ```js
 * import { Session } from '@wimaengine/storage'
 *
 * const session = world.getResource(Session)
 * session.set('screen', { name: 'home' })
 * const screen = session.get('screen')
 * session.clear()
 * ```
 *
 * @category resource
 */
export class Session {

  /**
   * Serializes `v` and stores it under `k` in the current tab's
   * `sessionStorage`.
   *
   * @param {string} k - Storage key.
   * @param {any} v - JSON-serializable value to store.
   * @returns {void}
   */
  set(k, v) {
    const json = JSON.stringify(v)

    sessionStorage.setItem(k, json)
  }

  /**
   * Reads and parses the value stored under `k`.
   *
   * Returns `undefined` when `sessionStorage.getItem(k)` returns a falsy value.
   * Otherwise, returns the result of `JSON.parse`; malformed stored JSON
   * therefore throws the parser's error.
   *
   * @template T
   * @param {string} k - Storage key to retrieve.
   * @returns {T | undefined} The parsed value, or `undefined` when no value is stored.
   */
  get(k) {
    const json = sessionStorage.getItem(k)

    if (!json) return undefined

    return JSON.parse(json)
  }

  /**
   * Removes every key from the current tab's `sessionStorage`.
   *
   * This clears the browser storage area shared by the current top-level
   * browsing context, not only values written through this {@linkcode Session}
   * instance.
   *
   * @returns {void}
   */
  clear() {
    sessionStorage.clear()
  }
}
