/** @import { Canvas2DFunction } from '../types' */
/** @import { Mesh } from '@wimaengine/render-core' */

import { BasicMaterial } from '@wimaengine/render-core'
import { vertices } from '../utils'

/**
 * Renders a {@linkcode BasicMaterial} as a filled path on a Canvas 2D context.
 *
 * This function is the default {@linkcode Canvas2DFunction} callback used for
 * `BasicMaterial`. It reads the mesh's `position2d` attribute. If that
 * attribute has no data, it returns without changing the context. Otherwise,
 * it sets `ctx.fillStyle` to an `rgb(...)` value whose channels are the
 * material color channels multiplied by 255, passes the positions to
 * {@linkcode vertices} with path closing enabled, and calls `ctx.fill()`.
 *
 * The material alpha channel is not applied. The callback leaves
 * `ctx.globalAlpha` unchanged because the corresponding assignment remains
 * disabled in the implementation.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context used for drawing.
 * @param {BasicMaterial} material - Material supplying the RGB color.
 * @param {Mesh} mesh - Mesh supplying the `position2d` vertex data.
 * @returns {void}
 */
export function renderBasicMaterial(ctx, material, mesh) {
  const { color } = material
  const positions = mesh.getAttribute('position2d')?.data

  if (!positions) return

  ctx.fillStyle = `rgb(${color.r * 255},${color.g * 255},${color.b * 255})`

  // ctx.globalAlpha = color.a

  vertices(ctx, positions, true)
  ctx.fill()
}
