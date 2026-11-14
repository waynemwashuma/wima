/** @import {AppSchedule} from '@wimaengine/core' */
/** @import {StoragePlugin} from '../plugin' */
import { World } from '@wimaengine/ecs'
import { OpaqueInfo, TypeRegistry } from '@wimaengine/reflect'
import { Cookies, Session, Storage } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the storage resource types in the world's {@linkcode TypeRegistry}.
 *
 * {@linkcode StoragePlugin} registers this exact
 * function directly in the one-shot
 * {@linkcode AppSchedule.Startup}
 * schedule. Each of {@linkcode Session}, {@linkcode Storage}, and {@linkcode Cookies} is
 * registered with {@linkcode OpaqueInfo},
 * so the registry knows the resource type without field-level reflection
 * metadata. This system only updates the registry; it does not read, write, or
 * otherwise mutate browser storage.
 *
 * @example
 * ```js
 * // StoragePlugin runs this automatically during Startup.
 * app.registerPlugin(new StoragePlugin())
 * ```
 *
 * @param {World} world
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry}.
 * @category system
 */
export function registerStorageTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Session, new OpaqueInfo())
  registry.register(Storage, new OpaqueInfo())
  registry.register(Cookies, new OpaqueInfo())
}
/* eslint-enable jsdoc/check-tag-names */
