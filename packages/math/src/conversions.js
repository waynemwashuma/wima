import { Vector2 } from 'hisabati'

/**
 * Converts a pixel-space coordinate to normalized device coordinates (NDC).
 *
 * Use this helper for coordinates measured from the top-left of a viewport.
 * The returned NDC coordinate uses the viewport center as `(0, 0)`, X from
 * `-1` on the left to `1` on the right, and Y increasing upward. The
 * conversion is `xNdc = 2 * x / width - 1` and
 * `yNdc = 1 - 2 * y / height`.
 *
 * `width` and `height` default to the browser viewport's `innerWidth` and
 * `innerHeight`. The helper does not mutate its inputs and returns a new
 * {@linkcode Vector2}. Use {@linkcode ndcToPx} for the inverse conversion.
 *
 * @param {number} x - Pixel-space X coordinate, measured from the left edge.
 * @param {number} y - Pixel-space Y coordinate, measured from the top edge.
 * @param {number} [width=innerWidth] - Viewport width used for the conversion.
 * @param {number} [height=innerHeight] - Viewport height used for the conversion.
 * @returns {Vector2} NDC coordinate equivalent to the pixel coordinate, with Y up.
 *
 * @example
 * const center = pxToNdc(400, 300, 800, 600)
 * // center.x === 0 and center.y === 0
 */
export function pxToNdc(x, y, width = innerWidth, height = innerHeight) {
  return new Vector2(
    (x / (width / 2)) - 1,
    1 - (y / (height / 2))
  )
}

/**
 * Converts a normalized device coordinate (NDC) to a pixel-space coordinate.
 *
 * Use this helper to map NDC coordinates into a viewport whose pixel origin is
 * at the top left. NDC uses the center as `(0, 0)`, X from `-1` on the left to
 * `1` on the right, and Y increasing upward. The returned pixel coordinate
 * uses Y increasing downward. The inverse conversion is
 * `xPx = (x + 1) * width / 2` and `yPx = (1 - y) * height / 2`.
 *
 * `width` and `height` default to the browser viewport's `innerWidth` and
 * `innerHeight`. The helper does not mutate its inputs and returns a new
 * {@linkcode Vector2}. Use {@linkcode pxToNdc} for the inverse conversion.
 *
 * @param {number} x - NDC X coordinate, where `-1` is left and `1` is right.
 * @param {number} y - NDC Y coordinate, where `-1` is bottom and `1` is top.
 * @param {number} [width=innerWidth] - Viewport width used for the conversion.
 * @param {number} [height=innerHeight] - Viewport height used for the conversion.
 * @returns {Vector2} Pixel-space coordinate equivalent to the NDC coordinate, with origin at the top left.
 *
 * @example
 * const center = ndcToPx(0, 0, 800, 600)
 * // center.x === 400 and center.y === 300
 */
export function ndcToPx(x, y, width = innerWidth, height = innerHeight) {
  return new Vector2(
    (x + 1) * (width / 2),
    (1 - y) * (height / 2)
  )
}
