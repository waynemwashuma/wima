/**
 * Builds a path from flat coordinate pairs on a Canvas 2D drawing target.
 *
 * The target may be a {@linkcode CanvasRenderingContext2D} or {@linkcode Path2D}.
 * Values are consumed as `[x, y]` pairs: the first pair is passed to `moveTo`,
 * and each later pair is passed to `lineTo`. Fewer than two values return
 * without changing the target. When `close` is `true`, the default, the
 * helper adds a final line segment back to the first pair; passing `false`
 * leaves the path open.
 *
 * @example
 * ```js
 * import { vertices } from '@wimaengine/render-canvas2d'
 *
 * const path = new Path2D()
 * vertices(path, [0, 0, 10, 0, 10, 10])
 * ```
 *
 * @param {CanvasRenderingContext2D | Path2D} ctx - Canvas 2D context or path to update.
 * @param {ArrayLike<number>} vertices - Numeric values in flat `[x, y]` pair order.
 * @param {boolean} [close=true] - Whether to add a segment back to the first pair.
 * @returns {void} Always returns `undefined`.
 */
export function vertices(ctx, vertices, close = true) {
  if (vertices.length < 2) return

  ctx.moveTo(vertices[0], vertices[1])

  for (let i = 2; i < vertices.length; i += 2) {
    ctx.lineTo(vertices[i], vertices[i + 1])
  }

  if (close) ctx.lineTo(vertices[0], vertices[1])
}
