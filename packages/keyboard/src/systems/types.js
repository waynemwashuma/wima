import { World } from '@wimaengine/ecs'
import { OpaqueInfo, TypeRegistry } from '@wimaengine/reflect'
import { Keyboard } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers opaque reflection metadata for {@linkcode Keyboard}.
 *
 * {@linkcode KeyboardPlugin} registers this function directly in the one-shot
 * {@linkcode AppSchedule.Startup} schedule and the {@linkcode CoreSystems.Start}
 * group. When Startup runs, the world's {@linkcode TypeRegistry} receives an
 * {@linkcode OpaqueInfo} entry for {@linkcode Keyboard}. The resource's internal
 * button state is therefore identified as a reflected type without exposing
 * fields through struct metadata.
 *
 * The function updates type metadata only; {@linkcode KeyboardPlugin} creates
 * the resource separately.
 *
 * @param {World} world - Startup world containing {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerKeyboardTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Keyboard, new OpaqueInfo())
}
/* eslint-enable jsdoc/check-tag-names */
