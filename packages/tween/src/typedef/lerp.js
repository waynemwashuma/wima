/**
 * Writes an interpolated value into a tween's output target.
 *
 * A {@linkcode Tween} supplies its start and end values with the eased progress
 * returned by {@linkcode EasingFn}. The callback must mutate `out`; the caller
 * ignores its return value and does not replace the output target.
 *
 * @template T
 * @callback TweenLerp
 * @param {T} a - Value at normalized progress `0`.
 * @param {T} b - Value at normalized progress `1`.
 * @param {number} t - Eased normalized progress used for interpolation.
 * @param {T} out - Live target to update with the interpolated value.
 * @returns {void} The interpolated value must be written to `out`.
 */
export {}
