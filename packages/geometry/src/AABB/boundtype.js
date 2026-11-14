/**
 * Provides the numeric discriminator used by 2D bounds APIs to distinguish
 * box-shaped and circle-shaped geometry.
 *
 * Use {@linkcode BoundType.Box2D} or {@linkcode BoundType.Circle} when application
 * code branches on the representation of a {@linkcode BoundingBox2D} or
 * {@linkcode BoundingCircle} value.
 *
 * @example
 * ```js
 * import { BoundingCircle, BoundType } from '@wimaengine/geometry'
 *
 * const bound = new BoundingCircle()
 * const isCircle = bound.type === BoundType.Circle
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const BoundType = {

  /** Identifies box-shaped {@linkcode BoundingBox2D} geometry (`0`). */
  Box2D: 0,

  /** Identifies circle-shaped {@linkcode BoundingCircle} geometry (`1`). */
  Circle: 1
}
