
/** @import { EntityHandle, World } from '@wimaengine/ecs' */

import { warn } from '@wimaengine/logger'
import { Window, Windows } from '@wimaengine/window'
import { setUpKeyboardEvents, setupPointerEvents, setUpFileEvents } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Opens the canvas for a newly added {@linkcode Window} component.
 *
 * The hook first reads the component's `selector` with
 * `document.querySelector`. When the selector resolves to an
 * {@linkcode HTMLCanvasElement}, that existing canvas is used. When the selector
 * is absent, does not match, or resolves to another element type, the hook
 * creates a new canvas, appends it to `document.body`, and uses it instead.
 * When a selector is supplied but does not resolve to a canvas, the hook
 * produces a warning before the fallback. A malformed CSS selector is passed
 * through to `querySelector` and therefore throws its DOM exception.
 *
 * Before registration, the hook synchronizes the canvas backing dimensions
 * from `getBoundingClientRect()`. Each rounded rectangle dimension is used
 * when non-zero; otherwise the canvas's current backing dimension is kept.
 * The resulting dimensions are written to both the canvas and the
 * {@linkcode Window} component. The canvas is then registered in the world's
 * {@linkcode Windows} resource, given `tabIndex = -1`, and focused.
 *
 * Finally, the hook bridges canvas keyboard (`keydown` and `keyup`), pointer
 * (`pointerdown`, `pointerup`, `pointermove`, `pointercancel`, `pointerenter`,
 * `pointerleave`, and `wheel`), and file (`dragover` and `drop`) events into
 * the corresponding window event resources. File drag and drop events are
 * prevented from performing the browser's default action.
 *
 * The hook expects the entity and {@linkcode Windows} resource to already be
 * available; it only attaches and registers the canvas for the supplied
 * component.
 *
 * @example
 * ```js
 * // With the browser window integration active, adding this component
 * // registers #game when it is a canvas. A missing or non-canvas selector
 * // creates and appends a new canvas.
 * const entity = world.spawn([
 *   new Window({ selector: '#game', width: 1280, height: 720 })
 * ])
 * ```
 *
 * @param {EntityHandle} entity - Entity receiving the {@linkcode Window} component.
 * @param {World} world - {@linkcode World} owning the component and {@linkcode Windows} resource.
 * @returns {void}
 * @category component-hook
 */
export function openWindow(entity, world) {

  // SAFETY: Component is guaranteed as this is its component hook
  const window = /** @type {Window}*/(world.get(entity, Window))

  if (window.selector) {
    const canvas = document.querySelector(window.selector)

    if (canvas instanceof HTMLCanvasElement) {
      registerWindow(world, entity, canvas, window)

      return
    }

    warn(`The provided selector '${window.selector}' does not yield a canvas element.`)

  }

  const canvas = document.createElement('canvas')

  document.body.append(canvas)
  registerWindow(world, entity, canvas, window)
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Window} window
 */
function syncWindowSize(canvas, window) {
  const rect = canvas.getBoundingClientRect()
  const width = Math.round(rect.width) || canvas.width
  const height = Math.round(rect.height) || canvas.height

  canvas.width = width
  canvas.height = height
  window.set(width, height)
}

/**
 * @param {World} world - {@linkcode World} containing the window resource.
 * @param {EntityHandle} entity - Entity whose canvas is registered.
 * @param {HTMLCanvasElement} canvas - Canvas to register.
 * @param {Window} window - Component associated with the canvas.
 */
function registerWindow(world, entity, canvas, window) {
  const windows = world.getResource(Windows)

  syncWindowSize(canvas, window)
  windows.setWindow(entity, canvas)

  // setting tabindex and focus to enable keyboard events
  // on the canvas element.
  canvas.tabIndex = -1
  canvas.focus()

  setupPointerEvents(world, canvas)
  setUpKeyboardEvents(world, canvas)
  setUpFileEvents(world, canvas)
}

/**
 * Closes the canvas for a removed {@linkcode Window} component.
 *
 * The hook looks up the entity's canvas in the world's {@linkcode Windows}
 * resource. If a canvas is registered, it removes it from the DOM and deletes
 * the resource entry. If no canvas is registered, it returns without changing
 * the DOM or resource.
 *
 * The hook only cleans up the DOM canvas and its {@linkcode Windows} entry; the
 * ECS removes the component or entity as part of the operation that invoked
 * the hook. It does not explicitly remove the event listeners attached to
 * the canvas. The hook does not create a replacement canvas, warn, or throw
 * for an entity without a registered window.
 *
 * @example
 * ```js
 * // Removing the Window component removes its registered canvas.
 * world.remove(entity, [Window])
 * ```
 *
 * @param {EntityHandle} entity - Entity whose {@linkcode Window} component is being removed.
 * @param {World} world - {@linkcode World} owning the {@linkcode Windows} resource.
 * @returns {void}
 * @category component-hook
 */
export function closeWindow(entity, world) {
  const windows = world.getResource(Windows)
  const canvas = windows.getWindow(entity)

  if (!canvas) return

  canvas.remove()
  windows.delete(entity)
}
/* eslint-enable jsdoc/check-tag-names */
