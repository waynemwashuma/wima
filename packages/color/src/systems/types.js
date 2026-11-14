import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Color } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the color metadata used by reflection and persistence.
 *
 * {@linkcode ColorPlugin} registers this function directly in the one-shot
 * {@linkcode AppSchedule.Startup} schedule. The world's {@linkcode TypeRegistry}
 * receives {@linkcode Color} as a struct with numeric `r`, `g`, `b`, and `a`
 * fields. Its `copy`, `serialize`, and `deserialize` methods are attached to
 * the registered entry.
 *
 * The function updates type metadata only; {@linkcode ColorPlugin} does not use
 * it to create a color component or resource.
 *
 * @param {World} world - Startup world containing {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerColorTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Color, new StructInfo({
    r: new Field(typeid(Number)),
    g: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    a: new Field(typeid(Number))
  }))
  registry.get(Color)?.setMethod(Color.copy)
  registry.get(Color)?.setMethod(Color.serialize)
  registry.get(Color)?.setMethod(Color.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
