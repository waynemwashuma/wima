/** @import {AppSchedule} from '@wimaengine/core' */
/** @import {ReflectPlugin, TypeEntry} from '@wimaengine/reflect' */
/** @import {Gravity2DPlugin} from '../plugin' */
/** @import {Gravity3DPlugin} from '../plugin' */
import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Gravity2D, Gravity3D } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers reflection metadata for the 2D gravity resource.
 *
 * {@linkcode Gravity2DPlugin} registers this exact function directly in the
 * one-shot {@linkcode AppSchedule.Startup} schedule. The system expects
 * {@linkcode TypeRegistry} to have been installed in `world` by
 * {@linkcode ReflectPlugin}.
 *
 * It obtains the registry with `world.getResource(TypeRegistry)` and registers
 * {@linkcode Gravity2D} as a struct with numeric `x` and `y` fields. It then
 * looks up the registered entry and attaches {@linkcode Gravity2D.serialize} and
 * {@linkcode Gravity2D.deserialize} with {@linkcode TypeEntry#setMethod}. The resulting metadata
 * describes the 2D vector shape only; no `z` field is registered.
 *
 * @example
 * ```js
 * import { Gravity2DPlugin } from '@wimaengine/gravity'
 *
 * app.registerPlugin(new Gravity2DPlugin())
 * // Gravity2D metadata is registered once during AppSchedule.Startup.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerGravity2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Gravity2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(Gravity2D)?.setMethod(Gravity2D.default)
  registry.get(Gravity2D)?.setMethod(Gravity2D.serialize)
  registry.get(Gravity2D)?.setMethod(Gravity2D.deserialize)
}

/**
 * Registers reflection metadata for the 3D gravity resource.
 *
 * {@linkcode Gravity3DPlugin} registers this exact function directly in the
 * one-shot {@linkcode AppSchedule.Startup} schedule. The system expects
 * {@linkcode TypeRegistry} to have been installed in `world` by
 * {@linkcode ReflectPlugin}.
 *
 * It obtains the registry with `world.getResource(TypeRegistry)` and registers
 * {@linkcode Gravity3D} as a struct with numeric `x`, `y`, and `z` fields. It then
 * looks up the registered entry and attaches {@linkcode Gravity3D.serialize} and
 * {@linkcode Gravity3D.deserialize} with {@linkcode TypeEntry#setMethod}. The resulting metadata
 * includes all three vector coordinates.
 *
 * @example
 * ```js
 * import { Gravity3DPlugin } from '@wimaengine/gravity'
 *
 * app.registerPlugin(new Gravity3DPlugin())
 * // Gravity3D metadata is registered once during AppSchedule.Startup.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerGravity3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Gravity3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Gravity3D)?.setMethod(Gravity3D.default)
  registry.get(Gravity3D)?.setMethod(Gravity3D.serialize)
  registry.get(Gravity3D)?.setMethod(Gravity3D.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
