import { World } from '@wimaengine/ecs'
import { Vector2 } from '@wimaengine/math'
import { Field, OpaqueInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Mouse, MouseButtons } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers reflection metadata for {@linkcode Mouse} and {@linkcode MouseButtons}.
 *
 * {@linkcode MousePlugin} registers this function directly in the one-shot
 * {@linkcode AppSchedule.Startup} schedule and the {@linkcode CoreSystems.Start}
 * group. The world's {@linkcode TypeRegistry} receives {@linkcode Mouse} as a
 * struct with {@linkcode Vector2} fields `lastPosition`, `position`, and
 * `delta`, and receives {@linkcode MouseButtons} as opaque metadata.
 *
 * The function updates type metadata only; {@linkcode MousePlugin} creates the
 * two resources separately.
 *
 * @param {World} world - Startup world containing {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerMouseTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Mouse, new StructInfo({
    lastPosition: new Field(typeid(Vector2)),
    position: new Field(typeid(Vector2)),
    delta: new Field(typeid(Vector2))
  }))
  registry.register(MouseButtons, new OpaqueInfo())
}
/* eslint-enable jsdoc/check-tag-names */
