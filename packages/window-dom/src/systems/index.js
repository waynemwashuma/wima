import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { warn } from '@wimaengine/logger'
import { typeidGeneric } from '@wimaengine/type'
import { Window, Windows, WindowResize } from '@wimaengine/window'
import { setUpKeyboardEvents, setupPointerEvents, setUpFileEvents } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Synchronizes ECS window entities with their browser canvas elements.
 *
 * A window with a selector uses the matching canvas when it is available. A
 * window without a selector creates and appends a canvas to `document.body`.
 * Selector-backed windows remain unresolved when their selector does not match;
 * a later update can attach them after the DOM element has been created.
 *
 * @param {World} world
 * @returns {void}
 * @category system
 */
export function updateWindow(world) {
  const windows = world.getResource(Windows)
  const query = new Query(world, [EntityHandle, Window])

  query.each(([entity, window]) => {
    if (windows.getWindow(entity)) return

    let canvas

    if (window.selector) {
      const element = document.querySelector(window.selector)

      if (!(element instanceof HTMLCanvasElement)) {
        warn(`The provided selector '${window.selector}' does not yield a canvas element.`)
        return
      }

      canvas = element
    } else {
      canvas = document.createElement('canvas')
      document.body.append(canvas)
    }

    windows.setWindow(entity, canvas)
    canvas.tabIndex = -1
    canvas.focus()

    setupPointerEvents(world, canvas)
    setUpKeyboardEvents(world, canvas)
    setUpFileEvents(world, canvas)
  })
}

/**
 * Synchronizes browser canvas sizes with their {@linkcode Window} components.
 *
 * An entity is skipped when its `Windows` entry is not an
 * {@linkcode HTMLCanvasElement}. When the rounded displayed dimensions differ,
 * the system updates the backing canvas, updates the component, and dispatches
 * one {@linkcode WindowResize} event.
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
