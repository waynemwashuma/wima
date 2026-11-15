/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides origin-scoped JSON storage as a world resource.
 *
 * {@linkcode StoragePlugin} installs a fresh {@linkcode Storage} resource. Values are
 * written to the browser's `localStorage`, so they normally survive page
 * reloads and browser sessions until they are removed or the browser clears
 * them. Each value is serialized with `JSON.stringify` by {@linkcode Storage#set}
 * and deserialized with `JSON.parse` by {@linkcode Storage#get}. This resource
 * does not namespace its keys, so its storage area is shared with other code
 * using the same origin's `localStorage`.
 *
 * @example
 * ```js
 * import { Storage } from '@wimaengine/storage'
 *
 * const storage = world.getResource(Storage)
 * storage.set('settings', { sound: true })
 * const settings = storage.get('settings')
 * storage.clear()
 * ```
 *
 * @category resource
 */

export class Storage {

  /**
   * Serializes `v` and stores it under `k` in the origin's `localStorage`.
   *
   * The browser storage API stores strings, so only JSON-serializable values
   * reliably round-trip through this method. `JSON.stringify` can throw for
   * values such as circular objects or `BigInt`; standalone `undefined`,
   * functions, and symbols do not produce JSON that {@linkcode Storage#get} can
   * parse.
   *
   * @param {string} k - Storage key.
   * @param {any} v - JSON-serializable value to store.
   * @returns {void}
   */
  set(k, v) {
    const json = JSON.stringify(v)

    localStorage.setItem(k, json)
  }

  /**
   * Reads and parses the value stored under `k`.
   *
   * Returns `undefined` when `localStorage.getItem(k)` returns a falsy value,
   * including when the key is absent. Otherwise, returns the result of
   * `JSON.parse`; malformed stored JSON therefore throws the parser's error.
   *
   * @template T
   * @param {string} k - Storage key to retrieve.
   * @returns {T | undefined} The parsed value, or `undefined` when no value is stored.
   */
  get(k) {
    const json = localStorage.getItem(k)

    if (!json) return undefined

    return JSON.parse(json)
  }

  /**
   * Removes every key from the origin's `localStorage`.
   *
   * This clears the browser storage area shared by the current origin, not
   * only values written through this {@linkcode Storage} instance.
   *
   * @returns {void}
   */
  clear() {
    localStorage.clear()
  }
}
