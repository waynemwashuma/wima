/**
 * Returns the text before the first dot in the final slash-delimited segment.
 *
 * This is a lightweight string helper, not a URL or filesystem parser. It
 * treats only `/` as a separator, keeps query strings intact, and returns an
 * empty string for an empty input, a trailing slash, or a final segment that
 * starts with a dot.
 *
 * @param {string} url - Path-like string to inspect.
 * @returns {string} The first dot-delimited part of the final path segment.
 *
 * @example
 * ```js
 * getFileName('/assets/hero.sprite.png') // 'hero'
 * getFileName('README') // 'README'
 * ```
 */
export function getFileName(url) {
  const prelude = url.split('/').pop()

  if (!prelude) return ''

  return prelude.split('.')[0]
}

/**
 * Returns the final dot-delimited segment of a string.
 *
 * This helper does not isolate a path segment before looking for a dot. If the
 * input contains no dot, it returns the entire input; if it ends in a dot, it
 * returns an empty string. Query strings and backslashes are treated as normal
 * characters.
 *
 * @param {string} url - Path-like string to inspect.
 * @returns {string} The text after the final dot, or the input when no dot is
 * present.
 *
 * @example
 * ```js
 * getFileExtension('/assets/hero.sprite.png') // 'png'
 * getFileExtension('README') // 'README'
 * ```
 */
export function getFileExtension(url) {
  const prelude = url.split('.').pop()

  if (!prelude) return ''

  return prelude
}
