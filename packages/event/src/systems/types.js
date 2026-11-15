/** @import {AppSchedule} from '@wimaengine/core' */
/** @import {SystemFunc} from '@wimaengine/ecs' */
/** @import {ReflectPlugin} from '@wimaengine/reflect' */
/** @import { Constructor } from '@wimaengine/type' */
/** @import {EventPlugin} from '../plugin' */

import { OpaqueInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeidGeneric } from '@wimaengine/type'
import { Events } from '../core'

/**
 * Creates a Startup system that registers reflection metadata for one event
 * payload constructor.
 *
 * {@linkcode EventPlugin} calls this factory for its configured event type and
 * installs the returned system in {@linkcode AppSchedule.Startup}. When the
 * system runs, it looks up the world's {@linkcode TypeRegistry}, registers the
 * event constructor with an empty {@linkcode StructInfo}, and registers
 * `typeidGeneric(Events, [event])` with {@linkcode OpaqueInfo}. The factory only
 * creates the system; it does not create the typed {@linkcode Events} resource,
 * publish events, or clear its buffers. The world must already provide
 * {@linkcode TypeRegistry}, normally through {@linkcode ReflectPlugin}.
 *
 * @example
 * ```js
 * import { registerEventTypes } from '@wimaengine/event'
 *
 * class Damage {}
 * const startupSystem = registerEventTypes(Damage)
 * // EventPlugin normally installs startupSystem in AppSchedule.Startup.
 * ```
 *
 * @template T
 * @param {Constructor<T>} event - Constructor for the event payload type to
 * register.
 * @returns {SystemFunc} Startup system that registers the event constructor and
 * its opaque `Events<T>` type ID in {@linkcode TypeRegistry}.
 */
export function registerEventTypes(event) {
  return function registerEventType(world) {
    const registry = world.getResource(TypeRegistry)

    registry.register(event, new StructInfo({}))
    registry.registerTypeId(typeidGeneric(Events, [event]), new OpaqueInfo())
  }
}
