/** @import {TypeId} from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { PointerCancel, PointerDown, PointerMove, PointerUp, WindowPlugin } from '@wimaengine/window'
import { TouchPointer } from './core'
import { Touches } from './resources'
import { registerTouchTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds touch input tracking to an {@linkcode App}.
 *
 * The plugin provides a {@linkcode Touches} resource in the app's default world.
 * It tracks touch contacts from pointer input and ignores pointers whose type
 * is not `touch`. Read the resource with `world.getResource(Touches)` to
 * inspect the active contacts.
 *
 * Each active contact is represented by a {@linkcode TouchPointer}. A touch
 * start creates a pointer with its current and previous positions set to the
 * start position. On later moves, the previous position is retained in
 * `lastposition` while the current position follows the contact. A pointer is
 * removed when its touch ends or is canceled.
 *
 * The plugin consumes typed {@linkcode PointerDown}, {@linkcode PointerMove},
 * {@linkcode PointerUp}, and {@linkcode PointerCancel} events from
 * {@linkcode WindowPlugin}. Only events whose `pointerType` is `touch` affect
 * the touch resource.
 *
 * The plugin requires {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
 * {@linkcode WindowPlugin}. Register these dependencies before registering this
 * plugin; it does not install them automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TouchPlugin, Touches } from '@wimaengine/touch'
 * import { WindowPlugin } from '@wimaengine/window'
 *
 * const app = new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new WindowPlugin({ initPrimaryWindow: false }))
 *   .registerPlugin(new TouchPlugin())
 *   .run()
 *
 * const touches = app.getWorld().getResource(Touches)
 * console.log(touches.getActive())
 * ```
 *
 * @category plugin
 */
export class TouchPlugin extends Plugin {

  /**
   * Adds touch input state to the app's default world.
   *
   * The app gains a {@linkcode Touches} resource for reading active
   * {@linkcode TouchPointer} values.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: updateTouch })
      .setResource(new Touches())
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerTouchTypes })
  }

  /**
   * Returns the plugin dependencies required for touch input.
   *
   * The returned IDs identify {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * and {@linkcode WindowPlugin}. Register these plugins before this plugin;
   * registering {@linkcode TouchPlugin} does not install them automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(WindowPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @param {World} world
 */
function updateTouch(world) {
  const touch = world.getResource(Touches)

  /** @type {Events<PointerDown>} */
  const start = world.getResourceByTypeId(typeidGeneric(Events, [PointerDown]))

  /** @type {Events<PointerMove>} */
  const move = world.getResourceByTypeId(typeidGeneric(Events, [PointerMove]))

  /** @type {Events<PointerUp>} */
  const end = world.getResourceByTypeId(typeidGeneric(Events, [PointerUp]))

  /** @type {Events<PointerCancel>} */
  const cancel = world.getResourceByTypeId(typeidGeneric(Events, [PointerCancel]))

  start.each((event) => {
    const { data } = event

    if (data.pointerType !== 'touch') return

    const pointer = new TouchPointer(0)

    pointer.position.copy(data.position)
    pointer.lastposition.copy(pointer.position)

    touch.set(data.id, pointer)
  })

  move.each((event) => {
    const { data } = event

    if (data.pointerType !== 'touch') return

    const id = touch.getId(data.id)

    if (id === undefined) return

    const pointer = touch.get(id)

    if (!pointer) return

    pointer.lastposition.copy(pointer.position)
    pointer.position.copy(data.position)
  })

  end.each((event) => {
    const { data } = event

    if (data.pointerType !== 'touch') return

    touch.delete(data.id)
  })
  cancel.each((event) => {
    const { data } = event

    if (data.pointerType !== 'touch') return

    touch.delete(data.id)
  })
}
