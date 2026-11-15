/** @import {World} from '@wimaengine/ecs' */
import { EntityHandle, Query } from '@wimaengine/ecs'
import { warn } from '@wimaengine/logger'
import { MainWindow, Windows, Window } from '@wimaengine/window'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Clears the active Canvas 2D frame before the
 * {@linkcode Canvas2DRendererPlugin} render systems run.
 *
 * {@linkcode Canvas2DRendererPlugin} registers this function directly in the
 * update schedule's {@linkcode CoreSystems.Start} system group. It queries the
 * first entity matching `[EntityHandle, Window, MainWindow]`; that query
 * requires the {@linkcode Window} component and {@linkcode MainWindow} marker, then
 * uses the entity handle to look up its canvas in the {@linkcode Windows} resource.
 * The window component's stored dimensions are not read; successful clearing
 * uses the canvas's own `width` and `height`.
 *
 * If no entity matches the main-window query, the system warns and returns. If
 * {@linkcode Windows#getWindow} has no canvas for the matching entity, it returns
 * without drawing or warning. If `canvas.getContext('2d')` returns no context,
 * it warns and returns. Otherwise it calls `ctx.clearRect(0, 0, canvas.width,
 * canvas.height)` to clear the full canvas backing surface.
 *
 * @example
 * ```js
 * // Canvas2DRendererPlugin registers clearCanvas2d in the update flow.
 * app.registerPlugin(new Canvas2DRendererPlugin())
 * // Once the main window canvas exists, it is cleared before the Canvas 2D
 * // material systems draw their frame.
 * ```
 *
 * @param {World} world - World containing the main-window components and {@linkcode Windows} resource.
 * @returns {void}
 * @category system
 */
export function clearCanvas2d(world) {
  const windows = new Query(world, [EntityHandle, Window, MainWindow])
  const canvases = world.getResource(Windows)
  const window = windows.single()

  if (!window) return warn('Please define the main window before.')

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const ctx = canvas.getContext('2d')

  if (!ctx) return warn('2d context could not be created on the canvas.')

  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
/* eslint-enable jsdoc/check-tag-names */
