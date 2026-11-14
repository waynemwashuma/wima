import { World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { typeidGeneric } from '@wimaengine/type'
import { KeyDown, KeyUp } from '@wimaengine/window'

/**
 * Forwards browser keyboard events from an {@linkcode HTMLElement} to the typed
 * {@linkcode Events} resources in a {@linkcode World}. The `keydown` listener
 * queues a {@linkcode KeyDown} value, and the `keyup` listener queues a
 * {@linkcode KeyUp} value.
 *
 * The matching `Events<KeyUp>` and `Events<KeyDown>` resources must already be
 * registered in `world` before this helper is called. Calling it again adds
 * another pair of listeners; it does not return a cleanup function or remove
 * listeners automatically.
 *
 * @param {World} world - World containing the keyboard event resources.
 * @param {HTMLElement} target - Element that receives keyboard events.
 * @example
 * ```js
 * setUpKeyboardEvents(world, canvas)
 * ```
 */
export function setUpKeyboardEvents(world, target) {
  target.addEventListener('keyup', (event) => {

    /** @type {Events<KeyUp>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [KeyUp]))

    dispatch.write(new KeyUp(event))
  })
  target.addEventListener('keydown', (event) => {

    /** @type {Events<KeyDown>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [KeyDown]))

    dispatch.write(new KeyDown(event))
  })
}
