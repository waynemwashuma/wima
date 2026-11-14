import { BoundingBox2D } from './boundingbox'
import { BoundingCircle } from './boundingcircle'

/**
 * Returns whether two {@linkcode BoundingBox2D} values overlap.
 *
 * The x and y intervals are tested independently with inclusive comparisons.
 * Boxes that share an edge or corner therefore return `true`; boxes separated
 * on either axis return `false`. The helper reads the bounds without mutating
 * either value and does not validate or reorder their coordinates.
 *
 * @example
 * ```js
 * import { BoundingBox2D, intersectAABB2D } from '@wimaengine/geometry'
 *
 * const a = new BoundingBox2D(0, 0, 2, 2)
 * const b = new BoundingBox2D(2, 1, 4, 3)
 * intersectAABB2D(a, b) // true: the boxes share an x edge
 * ```
 *
 * @param {BoundingBox2D} a - First box.
 * @param {BoundingBox2D} b - Second box.
 * @returns {boolean} Whether the boxes overlap on both axes, including at an edge or corner.
 */
export function intersectAABB2D(a, b) {
  return (
    a.min.x <= b.max.x &&
    a.max.x >= b.min.x &&
    a.min.y <= b.max.y &&
    a.max.y >= b.min.y
  )
}

/**
 * Returns whether two {@linkcode BoundingCircle} values overlap using squared
 * distance.
 *
 * The helper returns `true` when the squared distance between the circle
 * centers is strictly less than `a.r * a.r + b.r * b.r`. It returns `false`
 * when those values are equal, so the exact threshold is not treated as an
 * overlap. This threshold is the sum of the squared radii, not the square of
 * the sum of the radii. No square root is calculated, neither circle is
 * mutated, and the comparison uses the radii exactly as stored.
 *
 * @param {BoundingCircle} a - First circle.
 * @param {BoundingCircle} b - Second circle.
 * @returns {boolean} Whether the squared center distance is below the squared-radius threshold.
 */
export function intersectCircle(a, b) {
  const distance = (a.pos.x - b.pos.x) * (a.pos.x - b.pos.x) +
    (a.pos.y - b.pos.y) * (a.pos.y - b.pos.y)

  return distance < a.r * a.r + b.r * b.r
}

/**
 * Returns whether a {@linkcode BoundingBox2D} and a {@linkcode BoundingCircle}
 * overlap.
 *
 * The circle center is clamped independently to the box's x and y limits. The
 * resulting point is the closest point on the box for the calculation. The
 * helper returns `true` only when the squared distance from that point to the
 * circle center is strictly less than `b.r * b.r`; a circle that only touches
 * the box boundary therefore returns `false`. The inputs are not mutated, and
 * their coordinates are not validated or reordered.
 *
 * @param {BoundingBox2D} a - Box to test.
 * @param {BoundingCircle} b - Circle to test.
 * @returns {boolean} Whether the circle reaches inside the box, excluding boundary-only contact.
 */
export function intersectAABB2DvsCircle(a, b) {
  const x = Math.max(a.min.x, Math.min(b.pos.x, a.max.x))
  const y = Math.max(a.min.y, Math.min(b.pos.y, a.max.y))
  const distance =
    (x - b.pos.x) * (x - b.pos.x) +
    (y - b.pos.y) * (y - b.pos.y)

  return distance < b.r * b.r
}
