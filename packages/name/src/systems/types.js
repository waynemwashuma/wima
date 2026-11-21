/** @import {AppSchedule, CoreSystems} from '@wimaengine/core' */
/** @import {NamePlugin} from '../plugin' */
import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Name } from '../components'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers reflection metadata for the {@linkcode Name} component.
 *
 * {@linkcode NamePlugin} registers this exact function directly as a one-shot
 * {@linkcode AppSchedule.Startup} system. The registration does not specify a
 * system group, so {@linkcode CoreSystems.Main} is used as Startup's default
 * group; the earlier {@linkcode CoreSystems.Start} phase runs before this
 * system.
 *
 * The function obtains the world's {@linkcode TypeRegistry}, registers `Name` as
 * a {@linkcode StructInfo} with one `String` field named `value`, and attaches
 * {@linkcode Name.copy}, {@linkcode Name.clone}, {@linkcode Name.serialize}, and
 * {@linkcode Name.deserialize} as reflection methods. It updates only existing
 * registry metadata: it does not create the registry, validate name values,
 * or add `Name` components to entities.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AppSchedule, CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { registerNameTypes } from '@wimaengine/name'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerSystem({ schedule: AppSchedule.Startup, system: registerNameTypes })
 *   .run()
 * // NamePlugin normally installs this Startup system for you.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry}.
 * @category system
 */
export function registerNameTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Name, new StructInfo({
    value: new Field(typeid(String))
  }))
  registry.get(Name)?.setMethod(Name.copy)
  registry.get(Name)?.setMethod(Name.clone)
  registry.get(Name)?.setMethod(Name.default)
  registry.get(Name)?.setMethod(Name.serialize)
  registry.get(Name)?.setMethod(Name.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
