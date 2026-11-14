/** @import { WindowPlugin } from '@wimaengine/window' */
/** @import { DOMWindowPlugin } from '../plugin' */

import { World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { typeidGeneric } from '@wimaengine/type'
import { FileDrop, FileDrag } from '@wimaengine/window'

/**
 * Bridges browser file drag-and-drop input into the engine's typed window event resources. The {@linkcode DOMWindowPlugin} integration uses this helper after registering a canvas.
 *
 * The `dragover` listener constructs and writes a {@linkcode FileDrag} event, then
 * calls `event.preventDefault()`. The `drop` listener constructs and writes a
 * {@linkcode FileDrop} event, then also calls `event.preventDefault()`. No event
 * propagation is stopped. Each event is written through the matching typed
 * {@linkcode Events} resource, resolved with `typeidGeneric(Events, [FileDrag])` or
 * `typeidGeneric(Events, [FileDrop])`.
 *
 * The target must provide `addEventListener` and accept browser drag events; the
 * DOM integration passes an {@linkcode HTMLCanvasElement}. The world must already
 * contain the `Events<FileDrag>` and `Events<FileDrop>` resources, normally
 * supplied by the {@linkcode WindowPlugin} required by the {@linkcode DOMWindowPlugin}.
 *
 * @example
 * ```js
 * // DOMWindowPlugin calls this for the canvas registered for a Window.
 * setUpFileEvents(world, canvas)
 * ```
 *
 * @param {World} world - World containing the typed {@linkcode Events} resources.
 * @param {HTMLElement} target - DOM element that receives drag-and-drop events.
 * @returns {void}
 */
export function setUpFileEvents(world, target) {
  target.addEventListener('dragover', (event) => {

    /** @type {Events<FileDrag>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [FileDrag]))

    dispatch.write(new FileDrag(event))
    event.preventDefault()
  })
  target.addEventListener('drop', (event) => {

    /** @type {Events<FileDrop>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [FileDrop]))

    dispatch.write(new FileDrop(event))
    event.preventDefault()
  })
}
