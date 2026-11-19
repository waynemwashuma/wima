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
  registry.get(Session)?.setMethod(Session.default)
  registry.register(Storage, new OpaqueInfo())
  registry.get(Storage)?.setMethod(Storage.default)
  registry.register(Cookies, new OpaqueInfo())
  registry.get(Cookies)?.setMethod(Cookies.default)
}
/* eslint-enable jsdoc/check-tag-names */
