import { World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { typeidGeneric } from '@wimaengine/type'
import {
  PointerDown,
  PointerUp,
  PointerMove,
  PointerCancel,
  PointerEnter,
  PointerLeave,
  PointerWheel
} from '@wimaengine/window'

/**
 * Attaches browser pointer and wheel listeners to a DOM target. Each listener
 * resolves the matching typed {@linkcode Events} resource with `typeidGeneric`,
 * constructs the corresponding window event from the browser event, and writes
 * it to that resource.
 *
 * The listeners map browser event names to window event values:
 *
 * - `pointerdown` → {@linkcode PointerDown}.
 * - `pointerup` → {@linkcode PointerUp}.
 * - `pointermove` → {@linkcode PointerMove}.
 * - `pointercancel` → {@linkcode PointerCancel}.
 * - `pointerenter` → {@linkcode PointerEnter}.
 * - `pointerleave` → {@linkcode PointerLeave}.
 * - `wheel` → {@linkcode PointerWheel}.
 *
 * Wheel defaults are suppressed and the target's browser context menu is
 * suppressed so a window-backed canvas owns its pointer surface.
 *
 * The target must provide `addEventListener`; a {@linkcode HTMLElement} such as
 * a canvas can be used. The {@linkcode World} must already contain an
 * {@linkcode Events} resource for each listed event type. Calling this helper
 * again adds another set of listeners; it does not return a cleanup function.
 *
 * @example
 * ```js
 * // Forward input from a canvas into the world's typed event resources.
 * setupPointerEvents(world, canvas)
 * ```
 *
 * @param {World} world - {@linkcode World} containing the typed event resources.
 * @param {HTMLElement} target - {@linkcode HTMLElement} receiving pointer and wheel events.
 * @returns {void}
 */
export function setupPointerEvents(world, target) {
  target.addEventListener('pointerdown', (e) => {

    /** @type {Events<PointerDown>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerDown]))

    dispatch.write(new PointerDown(e))
  })
  target.addEventListener('pointerup', (e) => {

    /** @type {Events<PointerUp>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerUp]))

    dispatch.write(new PointerUp(e))
  })
  target.addEventListener('pointermove', (e) => {

    /** @type {Events<PointerMove>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerMove]))

    dispatch.write(new PointerMove(e))
  })
  target.addEventListener('pointercancel', (e) => {

    /** @type {Events<PointerCancel>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerCancel]))

    dispatch.write(new PointerCancel(e))
  })
  target.addEventListener('pointerenter', (e) => {

    /** @type {Events<PointerEnter>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerEnter]))

    dispatch.write(new PointerEnter(e))
  })
  target.addEventListener('pointerleave', (e) => {

    /** @type {Events<PointerLeave>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerLeave]))

    dispatch.write(new PointerLeave(e))
  })

  // Wheel has no pointer event equivalent; keep it here for input support.
  target.addEventListener('wheel', (e) => {

    /** @type {Events<PointerWheel>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerWheel]))

    dispatch.write(new PointerWheel(e))
    e.preventDefault()
  }, { passive: false })

  // Window-backed canvas input owns the pointer surface; do not let the
  // browser open its context menu over native window interactions.
  target.addEventListener('contextmenu', (e) => e.preventDefault())
}
