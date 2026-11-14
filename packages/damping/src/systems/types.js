/** @import {AppSchedule} from '@wimaengine/core' */
/** @import {TypeEntry} from '@wimaengine/reflect' */
/** @import {Damping2DPlugin} from '../plugin' */
/** @import {Damping3DPlugin} from '../plugin' */
/** @import {ReflectPlugin} from '@wimaengine/reflect' */

import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Angular2DDamping, Angular3DDamping, Linear2DDamping, Linear3DDamping } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers reflection metadata for the 2D damping resources.
 *
 * {@linkcode Damping2DPlugin} registers this
 * exact function directly in the one-shot
 * {@linkcode AppSchedule.Startup}
 * schedule. The system expects {@linkcode TypeRegistry} to have been installed
 * in `world` by {@linkcode ReflectPlugin}.
 *
 * The system obtains the registry with `world.getResource(TypeRegistry)` and
 * registers {@linkcode Linear2DDamping} and {@linkcode Angular2DDamping}. Each
 * entry describes one numeric `value` field with a {@linkcode Field} containing
 * the `Number` type ID. After each registration, the system looks up the entry and
 * attaches that resource's `serialize` and `deserialize` functions with
 * {@linkcode TypeEntry#setMethod}. It does not attach `validateSerial`; that
 * remains a resource-level validation helper.
 *
 * @example
 * ```js
 * import { Damping2DPlugin } from '@wimaengine/damping'
 *
 * app.registerPlugin(new Damping2DPlugin())
 * // The type metadata is registered once during AppSchedule.Startup.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerDamping2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Linear2DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Linear2DDamping)?.setMethod(Linear2DDamping.serialize)
  registry.get(Linear2DDamping)?.setMethod(Linear2DDamping.deserialize)
  registry.register(Angular2DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Angular2DDamping)?.setMethod(Angular2DDamping.serialize)
  registry.get(Angular2DDamping)?.setMethod(Angular2DDamping.deserialize)
}

/**
 * Registers reflection metadata for the 3D damping resources.
 *
 * {@linkcode Damping3DPlugin} registers this
 * exact function directly in the one-shot
 * {@linkcode AppSchedule.Startup}
 * schedule. The system expects {@linkcode TypeRegistry} to have been installed
 * in `world` by {@linkcode ReflectPlugin}.
 *
 * The system obtains the registry with `world.getResource(TypeRegistry)` and
 * registers {@linkcode Linear3DDamping} and {@linkcode Angular3DDamping}. Each
 * entry describes one numeric `value` field with a {@linkcode Field} containing
 * the `Number` type ID. After each registration, the system looks up the entry
 * and attaches that resource's `serialize` and `deserialize` functions with
 * {@linkcode TypeEntry#setMethod}. It does not attach `validateSerial`; that
 * remains a resource-level validation helper.
 *
 * @example
 * ```js
 * import { Damping3DPlugin } from '@wimaengine/damping'
 *
 * app.registerPlugin(new Damping3DPlugin())
 * // The type metadata is registered once during AppSchedule.Startup.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerDamping3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Linear3DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Linear3DDamping)?.setMethod(Linear3DDamping.serialize)
  registry.get(Linear3DDamping)?.setMethod(Linear3DDamping.deserialize)
  registry.register(Angular3DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Angular3DDamping)?.setMethod(Angular3DDamping.serialize)
  registry.get(Angular3DDamping)?.setMethod(Angular3DDamping.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
