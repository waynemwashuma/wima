import { Vector2 } from 'hisabati'

/**
 * Convert a pixel-space coordinate (origin top-left) to NDC (-1..1, Y up).
 *
 * @param {number} x
 * @param {number} y
 * @param {number} [width]
 * @param {number} [height]
 * @returns {Vector2}
 */
export function pxToNdc(x, y, width = innerWidth, height = innerHeight) {
  return new Vector2(
    (x / (width / 2)) - 1,
    1 - (y / (height / 2))
  )
}

/**
 * Convert an NDC coordinate (-1..1, Y up) to pixel-space (origin top-left).
 *
 * @param {number} x
 * @param {number} y
 * @param {number} [width]
 * @param {number} [height]
 * @returns {Vector2}
 */
export function ndcToPx(x, y, width = innerWidth, height = innerHeight) {
  return new Vector2(
    (x + 1) * (width / 2),
    (1 - y) * (height / 2)
  )
}
