/**
 * Maps normalized tween progress to an eased progress value.
 *
 * A {@linkcode Tween} supplies `timeTaken / duration` as the input. The caller
 * does not clamp the input or the returned value before passing it to
 * {@linkcode TweenLerp}.
 *
 * @callback EasingFn
 * @param {number} t - Normalized tween progress, normally from `0` to `1`.
 * @returns {number} Progress value to use for interpolation.
 */
export {}
