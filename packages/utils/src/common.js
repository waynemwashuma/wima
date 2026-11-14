let tmpID = 0

/**
 * Returns the next ID from this module's counter.
 *
 * The counter starts at `0` when the module is evaluated, so the first call
 * returns `1`. Every caller shares the same counter, which is not reset.
 *
 * @returns {number} The next numeric ID.
 */
export function generateIDBasic() {
  return (tmpID += 1)
}

/**
 * Removes an item by replacing it with the array's final item, then popping
 * the final item. Use this when the array's order does not matter.
 *
 * An index of `-1` is treated as a no-op. Other indexes are not validated. If
 * the removed item is not the final item and the final item is falsy, the final
 * item is still popped but the target slot is left unchanged because the
 * implementation uses a truthiness check.
 *
 * @template T
 * @param {T[]} arr - Array to modify in place.
 * @param {number} index - Index to remove, or `-1` to leave the array unchanged.
 * @returns {void} Nothing. The supplied array is modified in place.
 *
 * @example
 * ```js
 * const values = ['a', 'b', 'c']
 * swapRemove(values, 0)
 * // values is ['c', 'b']
 * ```
 */
export function swapRemove(arr, index) {
  if (index === -1) return
  if (arr.length - 1 === index) {
    arr.pop()

    return
  }

  const temp2 = arr.pop()

  if (!temp2) return

  arr[index] = temp2

  return
}

/**
 * Replaces numbered placeholders in a string with truthy positional arguments.
 *
 * Only placeholders made of decimal digits, such as `{0}` or `{12}`, are
 * recognized. A missing or falsy argument (`undefined`, `null`, `false`, `0`,
 * an empty string, or `NaN`) leaves its placeholder unchanged. Replacement
 * values are converted to strings by `String.prototype.replace`.
 *
 * @param {string} string - String containing numbered placeholders.
 * @param {...any} args - Values matched to placeholders by zero-based index.
 * @returns {string} The string with eligible placeholders replaced.
 *
 * @example
 * ```js
 * formatString('Hello, {0}!', 'Ada') // 'Hello, Ada!'
 * formatString('Count: {0}', 0) // 'Count: {0}'
 * ```
 */
export function formatString(string, ...args) {
  return string.replace(/{(\d+)}/g, (match, number) => {
    const index = parseInt(number)

    if (typeof index === 'number') {
      return args[index] || match
    }

    return match
  })
}

/**
 * Does nothing with the supplied arguments.
 *
 * Use this as a callback when an operation is optional. It always returns
 * `undefined`.
 *
 * @param {...unknown} _args - Values ignored by the function.
 * @returns {void} Always `undefined`.
 *
 * @example
 * ```js
 * values.forEach(noop)
 * ```
 */
export function noop(..._args) {}
