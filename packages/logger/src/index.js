const marker = '🚀Chaos Engine:\n\n'
const mess = ['']

/**
 * Writes `message` to `console.log` with the engine log prefix.
 *
 * The call receives exactly `🚀Chaos Engine:\n\n` followed by `message` as its
 * single argument. The function returns `undefined`.
 *
 * @example
 * ```js
 * log('Loading the game.')
 * // console.log('🚀Chaos Engine:\n\nLoading the game.')
 * ```
 *
 * @param {string} message - Message to write.
 * @returns {void}
 */
export function log(message) {
  console.log(marker + message)
}

/**
 * Writes `message` to `console.warn` with the engine log prefix.
 *
 * The call receives exactly `🚀Chaos Engine:\n\n` followed by `message` as its
 * single argument. The function returns `undefined`.
 *
 * @example
 * ```js
 * warn('A texture is missing.')
 * // console.warn('🚀Chaos Engine:\n\nA texture is missing.')
 * ```
 *
 * @param {string} message - Warning to write.
 * @returns {void}
 */
export function warn(message) {
  console.warn(marker + message)
}

/**
 * Writes a prefixed warning only once for each message received by this module
 * instance.
 *
 * A repeated message returns without calling {@linkcode warn}. The cache uses
 * the equality provided by `Array.prototype.includes` and starts with an
 * empty-string sentinel, so `warnOnce('')` is suppressed on its first call.
 * A new message is cached before {@linkcode warn} writes the prefixed warning.
 * The function returns `undefined` whether it writes or suppresses a warning.
 *
 * @example
 * ```js
 * warnOnce('Unsupported format.')
 * warnOnce('Unsupported format.') // no second console warning
 * ```
 *
 * @param {string} message - Warning to write once.
 * @returns {void}
 */
export function warnOnce(message) {
  if (mess.includes(message)) return

  mess.push(message)
  warn(message)

}

/**
 * Writes a non-throwing error message to `console.error` with the engine log
 * prefix.
 *
 * The call receives exactly `🚀Chaos Engine:\n\n` followed by `message` as its
 * single argument. This function returns `undefined`.
 *
 * @example
 * ```js
 * error('The optional sound could not be loaded.')
 * // console.error('🚀Chaos Engine:\n\nThe optional sound could not be loaded.')
 * ```
 *
 * @param {string} message - Error message to write.
 * @returns {void}
 */
export function error(message) {
  console.error(marker + message)
}

/**
 * Throws a new `Error` with the engine log prefix in its message.
 *
 * The error message is exactly `🚀Chaos Engine:\n\n` followed by `message`.
 * This function never returns.
 *
 * @example
 * ```js
 * throws('The renderer is not initialized.')
 * // throws Error('🚀Chaos Engine:\n\nThe renderer is not initialized.')
 * ```
 *
 * @param {string} message - Error message to throw.
 * @returns {never}
 * @throws {Error} Always, with the prefixed message.
 */
export function throws(message) {
  throw new Error(marker + message)
}

/**
 * Checks that `test` is not `null` or `undefined`.
 *
 * All other values, including `false`, `0`, and an empty string, pass this
 * assertion. A successful call returns `undefined`; a failed call throws via
 * {@linkcode throws} and never returns.
 *
 * @example
 * ```js
 * const value = getValue()
 * assert(value, 'A value is required.')
 * // `value` is narrowed to a non-nullish value after this call.
 * ```
 *
 * @template T
 * @param {T} test - Value to check.
 * @param {string} message - Error message for a nullish value.
 * @returns {asserts test is NonNullable<T>} Returns `undefined` when `test` is non-nullish.
 * @throws {Error} When `test` is `null` or `undefined`.
 */
export function assert(test, message) {
  if (test === undefined || test === null) throws(message)
}

/**
 * Checks that `test` is truthy.
 *
 * This assertion rejects every falsy value, including `false`, `0`, `''`,
 * `null`, and `undefined`. A truthy value returns `undefined`; a falsy value
 * throws via {@linkcode throws} and never returns. Unlike {@linkcode assert}, it
 * does not allow non-nullish falsy values such as `false`, `0`, or `''`.
 *
 * @example
 * ```js
 * assertTrue(items.length > 0, 'At least one item is required.')
 * ```
 *
 * @param {boolean} test - Boolean condition to check.
 * @param {string} message - Error message for a falsy condition.
 * @returns {asserts test} Returns `undefined` when `test` is truthy.
 * @throws {Error} When `test` is falsy.
 */
export function assertTrue(test, message) {
  if (!test) throws(message)
}

/**
 * Writes a one-time deprecation warning for an API.
 *
 * The warning is sent through {@linkcode warnOnce}, so an identical complete
 * warning message is emitted only once for this module instance. The message
 * starts with the backtick-wrapped `original` value followed by
 * ` has been depreciated.`; the emitted text intentionally uses the literal
 * `depreciated` spelling. When `replacement` is not exactly `''`, the message
 * appends `Use \`replacement\` instead.` directly, without a space after the
 * first sentence. The function returns `undefined`.
 *
 * @example
 * ```js
 * deprecate('oldApi()', 'newApi()')
 * // warning: `oldApi()` has been depreciated.Use `newApi()` instead.
 * ```
 *
 * @param {string} original - Deprecated API name or expression.
 * @param {string} [replacement] - API name or expression to use instead.
 * @returns {void}
 */
export function deprecate(original, replacement = '') {
  let message = `\`${original}\` has been depreciated.`

  if (replacement !== '') message += `Use \`${replacement}\` instead.`

  warnOnce(message)
}
