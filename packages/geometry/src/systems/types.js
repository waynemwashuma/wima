/** @import {AppSchedule} from '@wimaengine/core' */
/** @import {GeometryPlugin} from '../plugin.js' */

import { World } from '@wimaengine/ecs'
import { Vector2 } from '@wimaengine/math'
import { EnumInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { BoundingBox2D, BoundingCircle, BoundType } from '../AABB'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers geometry reflection metadata in the world's
 * {@linkcode TypeRegistry}.
 *
 * {@linkcode GeometryPlugin} registers this
 * exact function directly in the one-shot
 * {@linkcode AppSchedule.Startup}
 * schedule. The registration does not specify a system group, so the
 * schedule's default group is used. A world without {@linkcode TypeRegistry}
 * fails when the resource is requested.
 *
 * The system registers the {@linkcode BoundType} enum under the explicit
 * `BoundType` type ID. It registers {@linkcode BoundingBox2D} as a struct with
 * `type`, `max`, and `min` fields, then attaches its `copy`, `serialize`, and
 * `deserialize` methods. It registers {@linkcode BoundingCircle} as a struct
 * with `type`, `r`, and `pos` fields and attaches the same three methods. This
 * prepares both bound values for reflection-aware storage and snapshots; it
 * does not create or populate any geometry instances.
 *
 * @example
 * ```js
 * import { GeometryPlugin } from '@wimaengine/geometry'
 *
 * app.registerPlugin(new GeometryPlugin())
 * // GeometryPlugin runs registerGeometryTypes during Startup.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @throws {Error} If the world does not contain {@linkcode TypeRegistry}.
 * @category system
 */
export function registerGeometryTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const boundTypeId = setTypeId('BoundType')

  registry.registerTypeId(boundTypeId, new EnumInfo(BoundType))

  registry.register(BoundingBox2D, new StructInfo({
    type: new Field(boundTypeId),
    max: new Field(typeid(Vector2)),
    min: new Field(typeid(Vector2))
  }))
  registry.get(BoundingBox2D)?.setMethod(BoundingBox2D.copy)
  registry.get(BoundingBox2D)?.setMethod(BoundingBox2D.serialize)
  registry.get(BoundingBox2D)?.setMethod(BoundingBox2D.deserialize)
  registry.register(BoundingCircle, new StructInfo({
    type: new Field(boundTypeId),
    r: new Field(typeid(Number)),
    pos: new Field(typeid(Vector2))
  }))
  registry.get(BoundingCircle)?.setMethod(BoundingCircle.copy)
  registry.get(BoundingCircle)?.setMethod(BoundingCircle.serialize)
  registry.get(BoundingCircle)?.setMethod(BoundingCircle.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
