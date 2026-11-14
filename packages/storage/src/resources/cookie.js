/**
 * Used to manipulate and read from the cookie string.
 *
 * @module Cookie
 */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides direct access to the current document's cookies as a world resource.
 *
 * {@linkcode StoragePlugin} installs a fresh {@linkcode Cookies} resource. Unlike
 * {@linkcode Storage}, this resource reads and writes string pairs through
 * `document.cookie`; it does not serialize values as JSON. Cookie names and
 * values are interpolated into the cookie string without encoding, trimming,
 * or additional attributes, so callers must provide values that are valid for
 * the browser cookie syntax. `document.cookie` also excludes cookies that are
 * not visible to the current document, such as `HttpOnly` cookies.
 *
 * @example
 * ```js
 * import { Cookies } from '@wimaengine/storage'
 *
 * const cookies = world.getResource(Cookies)
 * cookies.set('theme', 'dark', 3600)
 * const theme = cookies.get('theme')
 * cookies.delete('theme')
 * ```
 *
 * @category resource
 */

export class Cookies {

  /**
   * Sets one cookie pair on the current document.
   *
   * The browser interprets `maxAge` as the `Max-Age` cookie attribute, in
   * seconds. Its default is `12000` seconds (3 hours and 20 minutes). The
   * source does not set `Path`, `Domain`, `Secure`, or `SameSite`, so the
   * browser applies its defaults and updates only the cookie matching the
   * current document's default scope. `n` and `v` are inserted verbatim.
   *
   * @param {string} n - Cookie name.
   * @param {string} v - String cookie value.
   * @param {number} [maxAge=12000] - Cookie lifetime in seconds.
   * @returns {void}
   */
  set(n, v, maxAge = 12000) {
    document.cookie = `${n}=${v};maxAge=${maxAge}`
  }

  /**
   * Returns the value of a visible cookie by its exact name.
   *
   * This implementation splits `document.cookie` on `;` and then splits each
   * pair on `=`. It does not trim cookie names or decode values. Because
   * browsers commonly separate pairs with `"; "`, a cookie after the first
   * pair can retain a leading space and fail the exact-name comparison. A
   * value containing `=` is also truncated to the text before its first `=`.
   * The method returns `undefined` when no pair matches.
   *
   * @param {string} n - Exact cookie name.
   * @returns {string | undefined} The first matching cookie value, or `undefined`.
   *
   */
  get(n) {
    const arr = document.cookie.split(';')

    for (let i = 0; i < arr.length; i++) {
      const pair = arr[i].split('=')

      if (pair[0] === n) return pair[1]
    }
  }

  /**
   * Expires one cookie by setting its `Max-Age` to zero.
   *
   * No path or domain is supplied, so the browser applies its default scope;
   * a cookie created with a different scope may remain. The cookie name is
   * inserted verbatim.
   *
   * @param {string} n - Cookie name.
   * @returns {void}
   */
  delete(n) {
    document.cookie = `${n}=; max-age=0`
  }

  /**
   * Attempts to expire every cookie exposed by `document.cookie`.
   *
   * The method passes each text before the first `=` directly to
   * {@linkcode Cookies.prototype.delete}.
   * It therefore inherits the parser's lack of trimming: standard whitespace
   * after a semicolon can cause later cookie names to be sent with a leading
   * space and fail to delete the actual cookie. Cookies hidden from
   * `document.cookie`, including `HttpOnly` cookies and cookies outside the
   * current document's scope, are not affected.
   *
   * @returns {void}
   */
  clear() {
    const arr = document.cookie.split(';')

    for (let i = 0; i < arr.length; i++) {
      const pair = arr[i].split('=')

      this.delete(pair[0])
    }
  }
}
