/** @import {AppSchedule} from '@wimaengine/core' */
/** @import {ReflectPlugin} from '@wimaengine/reflect' */
/** @import {TraverseEntities} from '@wimaengine/relationship' */
/** @import {HierarchyPlugin} from '../plugin' */

import { EntityHandle, World } from '@wimaengine/ecs'
import { ArrayInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Children, Parent } from '../components'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers reflection metadata for the hierarchy components.
 *
 * {@linkcode HierarchyPlugin} registers this
 * exact function directly as a one-shot
 * {@linkcode AppSchedule.Startup}
 * system. The registration does not specify a system group, so Startup uses
 * its default core group.
 *
 * The system first registers the generic `Array<EntityHandle>` type. It then
 * registers {@linkcode Children} as a struct with a `list` field of that array
 * type, attaching `copy`, `clone`, `serialize`, `deserialize`, `visit`, and
 * `map` as reflection methods. It registers {@linkcode Parent} as a struct with
 * an `entity` field of type `EntityHandle` and attaches the corresponding
 * six methods. The `visit` and `map` methods are the components'
 * {@linkcode TraverseEntities}
 * contract methods; they are included alongside the static serialization
 * methods.
 *
 * This function changes only the world's
 * {@linkcode TypeRegistry}. It does not create entities, add `Children` or
 * `Parent` components, or install their lifecycle hooks; those hooks are
 * installed by {@linkcode HierarchyPlugin}. The world must already provide
 * `TypeRegistry`, normally through {@linkcode ReflectPlugin}.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { HierarchyPlugin } from '@wimaengine/hierarchy'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .run()
 * // Startup registers Children, Parent, and Array<EntityHandle> metadata.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry}.
 * @category system
 */
export function registerHierarchyTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const entityArrayId = typeidGeneric(Array, [EntityHandle])

  registry.registerTypeId(entityArrayId, new ArrayInfo(typeid(EntityHandle)))

  registry.register(Children, new StructInfo({
    list: new Field(entityArrayId)
  }))
  registry.get(Children)?.setMethod(Children.copy)
  registry.get(Children)?.setMethod(Children.clone)
  registry.get(Children)?.setMethod(Children.default)
  registry.get(Children)?.setMethod(Children.serialize)
  registry.get(Children)?.setMethod(Children.deserialize)
  registry.get(Children)?.setMethod(Children.prototype.visit)
  registry.get(Children)?.setMethod(Children.prototype.map)
  registry.register(Parent, new StructInfo({
    entity: new Field(typeid(EntityHandle))
  }))
  registry.get(Parent)?.setMethod(Parent.copy)
  registry.get(Parent)?.setMethod(Parent.clone)
  registry.get(Parent)?.setMethod(Parent.default)
  registry.get(Parent)?.setMethod(Parent.serialize)
  registry.get(Parent)?.setMethod(Parent.deserialize)
  registry.get(Parent)?.setMethod(Parent.prototype.visit)
  registry.get(Parent)?.setMethod(Parent.prototype.map)
}
/* eslint-enable jsdoc/check-tag-names */
