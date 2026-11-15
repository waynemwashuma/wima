import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { typeidGeneric } from '@wimaengine/type'
import { Window, Windows, WindowResize } from '@wimaengine/window'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Synchronizes browser canvas sizes with their {@linkcode Window} components.
 *
 * {@linkcode DOMWindowPlugin} registers this
 * exact function directly in the repeating
 * {@linkcode AppSchedule.Update}
 * schedule's {@linkcode CoreSystems.End}
 * group. The query requires both {@linkcode EntityHandle} and {@linkcode Window}; the
 * system also requires the {@linkcode Windows} resource and the typed
 * {@linkcode Events} resource for {@linkcode WindowResize}. An entity is skipped when
 * its `Windows` entry is not an {@linkcode HTMLCanvasElement}.
 *
 * For each canvas, the system rounds both dimensions from
 * {@linkcode Element#getBoundingClientRect}. It skips the
 * canvas when those dimensions already match the component. Otherwise it
 * updates the canvas backing size, updates the {@linkcode Window} component, and
 * dispatches one {@linkcode WindowResize} event with the new dimensions.
 *
 * @example
 * ```js
 * // DOMWindowPlugin installs resizeWindow in Update/CoreSystems.End.
 * app.registerPlugin(new DOMWindowPlugin())
 * // Resizing a tracked canvas updates Window and writes WindowResize.
 * ```
 *
 * @param {World} world
 * @returns {void}
 * @category system
 */
export function resizeWindow(world) {
  const windows = new Query(world, [EntityHandle, Window])
  const canvases = world.getResource(Windows)

  /** @type {Events<WindowResize>} */
  const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [WindowResize]))

  windows.each(([entity, window]) => {
    const canvas = canvases.getWindow(entity)

    if (!(canvas instanceof HTMLCanvasElement)) {
      return
    }

    const rect = canvas.getBoundingClientRect()
    const width = Math.round(rect.width)
    const height = Math.round(rect.height)

    if (width === window.getWidth() && height === window.getHeight()) {
      return
    }

    canvas.width = width
    canvas.height = height
    window.set(width, height)
    dispatch.write(new WindowResize(width, height))
  })
}
/* eslint-enable jsdoc/check-tag-names */
