/**
 * Provides numeric choices for the source and destination factors used by
 * WebGL blending.
 *
 * Pass a pair of values to `gl.blendFunc`. WebGL uses them to scale the source
 * and destination contributions before {@linkcode BlendEquation} combines them.
 *
 * @example
 * ```js
 * import { BlendMode } from '@wimaengine/render-webgl'
 *
 * // `gl` is an existing WebGL rendering context.
 * gl.blendFunc(BlendMode.SRC_ALPHA, BlendMode.ONE_MINUS_SRC_ALPHA)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const BlendMode = {

  /**
   * Uses zero for the selected source or destination factor (`0x0000`).
   *
   * @type {number}
   */
  ZERO: 0x0000,

  /**
   * Uses one for the selected source or destination factor (`0x0001`).
   *
   * @type {number}
   */
  ONE: 0x00001,

  /**
   * Uses the source color as the factor (`0x0300`).
   *
   * @type {number}
   */
  SRC_COLOR: 0x0300,

  /**
   * Uses one minus the source color as the factor (`0x0301`).
   *
   * @type {number}
   */
  ONE_MINUS_SRC_COLOR: 0x0301,

  /**
   * Uses the source alpha as the factor (`0x0302`).
   *
   * @type {number}
   */
  SRC_ALPHA: 0x0302,

  /**
   * Uses one minus the source alpha as the factor (`0x0303`).
   *
   * @type {number}
   */
  ONE_MINUS_SRC_ALPHA: 0x0303,

  /**
   * Uses the destination alpha as the factor (`0x0304`).
   *
   * @type {number}
   */
  DST_ALPHA: 0x0304,

  /**
   * Uses one minus the destination alpha as the factor (`0x0305`).
   *
   * The exported member is named `ONE_MINUS_DIST_ALPHA`.
   *
   * @type {number}
   */
  ONE_MINUS_DIST_ALPHA: 0x0305,

  /**
   * Uses the destination color as the factor (`0x0306`).
   *
   * @type {number}
   */
  DST_COLOR: 0x0306,

  /**
   * Uses one minus the destination color as the factor (`0x0307`).
   *
   * @type {number}
   */
  ONE_MINUS_DST_COLOR: 0x0307,

  /**
   * Uses `min(source alpha, 1 - destination alpha)` for the RGB source factor
   * (`0x0308`). The source alpha factor is `1`.
   *
   * @type {number}
   */
  SRC_ALPHA_SATURATE: 0x0308,

  /**
   * Uses the constant blend color as the factor (`0x8001`).
   *
   * @type {number}
   */
  CONSTANT_COLOR: 0x8001,

  /**
   * Uses one minus the constant blend color as the factor (`0x8002`).
   *
   * @type {number}
   */
  ONE_MINUS_CONSTANT_COLOR: 0x8002,

  /**
   * Uses the constant blend alpha as the factor (`0x8003`).
   *
   * @type {number}
   */
  CONSTANT_ALPHA: 0x8003,

  /**
   * Uses one minus the constant blend alpha as the factor (`0x8004`).
   *
   * @type {number}
   */
  ONE_MINUS_CONSTANT_ALPHA: 0x8004
}

/**
 * Provides numeric choices for the operation that combines source and
 * destination blend contributions.
 *
 * Pass one of these numeric constants to `gl.blendEquation`. WebGL applies the
 * selected operation to the values produced by the factors in
 * {@linkcode BlendMode}, for both color and alpha.
 *
 * @example
 * ```js
 * import { BlendEquation } from '@wimaengine/render-webgl'
 *
 * // `gl` is an existing WebGL rendering context.
 * gl.blendEquation(BlendEquation.REVERSE_SUBTRACT)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const BlendEquation = {

  /**
   * Adds the source and destination contributions: `source + destination` (`0x8006`).
   *
   * @type {number}
   */
  ADD: 0x8006,

  /**
   * Subtracts the destination contribution from the source contribution:
   * `source - destination` (`0x800A`).
   *
   * @type {number}
   */
  SUBTRACT: 0x800A,

  /**
   * Subtracts the source contribution from the destination contribution:
   * `destination - source` (`0x800B`).
   *
   * @type {number}
   */
  REVERSE_SUBTRACT: 0x800B
}
