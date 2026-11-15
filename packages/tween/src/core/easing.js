/** @import { EasingFn } from '../typedef' */
/**
 * Built-in easing functions for mapping normalized tween progress to a curve.
 *
 * Each function accepts a progress value `x`, normally in the inclusive range
 * `0` to `1`, and returns the corresponding eased progress. Names ending in
 * `In` accelerate from the start, names ending in `Out` decelerate into the
 * end, and names ending in `InOut` combine both phases. Back and elastic
 * curves can overshoot during the transition, while bounce curves add a
 * rebound effect with slight endpoint offsets. These functions do not clamp
 * or validate `x`.
 *
 * Pass a member directly wherever a {@linkcode EasingFn} is accepted, such as the
 * `easing` argument of {@linkcode Tween}.
 *
 * @example
 * ```js
 * import { Easing } from '@wimaengine/tween'
 *
 * const ease = Easing.quadraticOut
 * const progress = ease(0.25) // 0.4375
 * ```
 *
 * @readonly
 * @enum {EasingFn}
 */
export const Easing = {

  /**
   * Returns the input progress unchanged.
   *
   * @type {EasingFn}
   */
  linear(x) {
    return x
  },

  /**
   * Accelerates from the start with a quadratic curve.
   *
   * @type {EasingFn}
   */
  quadraticIn(x) {
    return x * x
  },

  /**
   * Decelerates into the end with a quadratic curve.
   *
   * @type {EasingFn}
   */
  quadraticOut(x) {
    return x * (2 - x)
  },

  /**
   * Combines quadratic acceleration and deceleration around the midpoint.
   *
   * @type {EasingFn}
   */
  quadraticInOut(x) {
    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * x2 * x2
    }

    return -0.5 * ((x2 - 1) * (x2 - 3) - 1)
  },

  /**
   * Accelerates from the start with a cubic curve.
   *
   * @type {EasingFn}
   */
  cubicIn(x) {
    return x * x * x
  },

  /**
   * Decelerates into the end with a cubic curve.
   *
   * @type {EasingFn}
   */
  cubicOut(x) {
    const x2 = x - 1

    return x2 * x2 * x2 + 1
  },

  /**
   * Combines cubic acceleration and deceleration around the midpoint.
   *
   * @type {EasingFn}
   */
  cubicInOut(x) {
    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * x2 * x2 * x2
    }

    const x3 = x2 - 2

    return 0.5 * (x3 * x3 * x3 + 2)
  },

  /**
   * Accelerates from the start with a quartic curve.
   *
   * @type {EasingFn}
   */
  quarticIn(x) {
    return x * x * x * x
  },

  /**
   * Decelerates into the end with a quartic curve.
   *
   * @type {EasingFn}
   */
  quarticOut(x) {
    const x2 = x - 1

    return 1 - x2 * x2 * x2 * x2
  },

  /**
   * Combines quartic acceleration and deceleration around the midpoint.
   *
   * @type {EasingFn}
   */
  quarticInOut(x) {
    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * x2 * x2 * x2 * x2
    }

    const x3 = x2 - 2

    return -0.5 * (x3 * x3 * x3 * x3 - 2)
  },

  /**
   * Accelerates from the start with a quintic curve.
   *
   * @type {EasingFn}
   */
  quinticIn(x) {
    return x * x * x * x * x
  },

  /**
   * Decelerates into the end with a quintic curve.
   *
   * @type {EasingFn}
   */
  quinticOut(x) {
    const x2 = x - 1

    return x2 * x2 * x2 * x2 * x2 + 1
  },

  /**
   * Combines quintic acceleration and deceleration around the midpoint.
   *
   * @type {EasingFn}
   */
  quinticInOut(x) {
    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * x2 * x2 * x2 * x2 * x2
    }

    const x3 = x2 - 2

    return 0.5 * (x3 * x3 * x3 * x3 * x3 + 2)
  },

  /**
   * Accelerates from the start with a half-sine curve.
   *
   * @type {EasingFn}
   */
  sinusoidalIn(x) {
    return 1 - Math.sin(((1.0 - x) * Math.PI) / 2)
  },

  /**
   * Decelerates into the end with a half-sine curve.
   *
   * @type {EasingFn}
   */
  sinusoidalOut(x) {
    return Math.sin((x * Math.PI) / 2)
  },

  /**
   * Combines sinusoidal acceleration and deceleration around the midpoint.
   *
   * @type {EasingFn}
   */
  sinusoidalInOut(x) {
    return 0.5 * (1 - Math.sin(Math.PI * (0.5 - x)))
  },

  /**
   * Accelerates from the start with an exponential curve and returns exactly
   * `0` when `x` is `0`.
   *
   * @type {EasingFn}
   */
  exponentialIn(x) {
    return x === 0 ? 0 : Math.pow(1024, x - 1)
  },

  /**
   * Decelerates into the end with an exponential curve and returns exactly `1`
   * when `x` is `1`.
   *
   * @type {EasingFn}
   */
  exponentialOut(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
  },

  /**
   * Combines exponential acceleration and deceleration, returning exactly `0`
   * and `1` at the corresponding endpoints.
   *
   * @type {EasingFn}
   */
  exponentialInOut(x) {
    if (x === 0) {
      return 0
    }
    if (x === 1) {
      return 1
    }

    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * Math.pow(1024, x2 - 1)
    }

    return 0.5 * (-Math.pow(2, -10 * (x2 - 1)) + 2)
  },

  /**
   * Accelerates from the start along a circular curve.
   *
   * @type {EasingFn}
   */
  circularIn(x) {
    return 1 - Math.sqrt(1 - x * x)
  },

  /**
   * Decelerates into the end along a circular curve.
   *
   * @type {EasingFn}
   */
  circularOut(x) {
    const x2 = x - 1

    return Math.sqrt(1 - x2 * x2)
  },

  /**
   * Combines circular acceleration and deceleration around the midpoint.
   *
   * @type {EasingFn}
   */
  circularInOut(x) {
    const x2 = x * 2

    if (x2 < 1) {
      return -0.5 * (Math.sqrt(1 - x2 * x2) - 1)
    }

    const x3 = x2 - 2

    return 0.5 * (Math.sqrt(1 - x3 * x3) + 1)
  },

  /**
   * Accelerates with an elastic curve that oscillates and can overshoot below
   * `0` before reaching `1`; returns exactly `0` and `1` at the endpoints.
   *
   * @type {EasingFn}
   */
  elasticIn(x) {
    if (x === 0) {
      return 0
    }
    if (x === 1) {
      return 1
    }

    return -Math.pow(2, 10 * (x - 1)) * Math.sin((x - 1.1) * 5 * Math.PI)
  },

  /**
   * Decelerates with an elastic curve that can overshoot above `1` before
   * settling at the end; returns exactly `0` and `1` at the endpoints.
   *
   * @type {EasingFn}
   */
  elasticOut(x) {
    if (x === 0) {
      return 0
    }
    if (x === 1) {
      return 1
    }

    return Math.pow(2, -10 * x) * Math.sin((x - 0.1) * 5 * Math.PI) + 1
  },

  /**
   * Combines elastic acceleration and deceleration, with possible overshoot on
   * either side of the midpoint; returns exactly `0` and `1` at the endpoints.
   *
   * @type {EasingFn}
   */
  elasticInOut(x) {
    if (x === 0) {
      return 0
    }
    if (x === 1) {
      return 1
    }

    const x2 = x * 2

    if (x2 < 1) {
      return -0.5 * Math.pow(2, 10 * (x2 - 1)) * Math.sin((x2 - 1.1) * 5 * Math.PI)
    }

    return 0.5 * Math.pow(2, -10 * (x2 - 1)) * Math.sin((x2 - 1.1) * 5 * Math.PI) + 1
  },

  /**
   * Accelerates from the start with a backtrack that overshoots below `0`
   * before progressing toward the end.
   *
   * @type {EasingFn}
   */
  backIn(x) {
    const s = 1.70158

    return x === 1 ? 1 : x * x * ((s + 1) * x - s)
  },

  /**
   * Decelerates into the end with a backtrack that overshoots beyond `1`.
   *
   * @type {EasingFn}
   */
  backOut(x) {
    const s = 1.70158
    const x2 = x - 1

    return x === 0 ? 0 : x2 * x2 * ((s + 1) * x2 + s) + 1
  },

  /**
   * Combines backtrack acceleration and deceleration, overshooting around the
   * midpoint.
   *
   * @type {EasingFn}
   */
  backInOut(x) {
    const s = 1.70158 * 1.525
    const x2 = x * 2

    if (x2 < 1) {
      return 0.5 * (x2 * x2 * ((s + 1) * x2 - s))
    }

    const x3 = x2 - 2

    return 0.5 * (x3 * x3 * ((s + 1) * x3 + s) + 2)
  },

  /**
   * Mirrors {@linkcode Easing.bounceOut} so the curve bounces into the
   * start before accelerating toward the end. Because of the mirrored
   * `bounceOut` coefficients, `bounceIn(0)` returns `0.005625`.
   *
   * @type {EasingFn}
   */
  bounceIn(x) {
    return 1 - Easing.bounceOut(1 - x)
  },

  /**
   * Decelerates into the end through a piecewise parabolic bounce curve. Its
   * final branch returns `0.994375` at `x = 1` and can slightly overshoot `1`.
   *
   * @type {EasingFn}
   */
  bounceOut(x) {
    if (x < 1 / 2.75) {
      return 7.5625 * x * x
    } else if (x < 2 / 2.75) {
      const x2 = x - 1.5 / 2.75

      return 7.5625 * x2 * x2 + 0.75
    } else if (x < 2.5 / 2.75) {
      const x2 = x - 2.25 / 2.75

      return 7.5625 * x2 * x2 + 0.9375
    }

    const x2 = x - 2.65 / 2.75

    return 7.5625 * x2 * x2 + 0.984375

  },

  /**
   * Combines bounce-in and bounce-out behavior around the midpoint, inheriting
   * the bounce family's slight overshoot and endpoint offsets.
   *
   * @type {EasingFn}
   */
  bounceInOut(x) {
    if (x < 0.5) return Easing.bounceIn(x * 2) * 0.5

    return Easing.bounceOut(x * 2 - 1) * 0.5 + 0.5
  }
}
