/** @import {AppSchedule, CoreSystems} from '@wimaengine/core' */
/** @import {DevicePlugin} from '../plugin' */
import { World } from '@wimaengine/ecs'
import { EnumInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { Browser, PlatformOS } from '../core'
import { Device, DeviceCapabilities } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers device reflection metadata in the world's {@linkcode TypeRegistry}.
 *
 * {@linkcode DevicePlugin} registers this exact function directly in the one-shot
 * {@linkcode AppSchedule.Startup} schedule. The registration does not specify a
 * system group, so {@linkcode CoreSystems.Main} is used as Startup's default. The
 * {@linkcode CoreSystems.Start} phase runs earlier in the same startup pass.
 *
 * When it runs, the system registers explicit `PlatformOS` and `Browser` type
 * IDs with {@linkcode EnumInfo}, then registers {@linkcode DeviceCapabilities} and
 * {@linkcode Device} with {@linkcode StructInfo}. The struct metadata describes the
 * capability booleans, enum-backed platform and browser fields, and nested
 * capabilities value. It also attaches each type's `serialize` and
 * `deserialize` methods to its {@linkcode TypeEntry}, making the metadata usable
 * by reflection-aware snapshot code. The system changes only the registry; it
 * does not create or populate the {@linkcode Device} resource.
 *
 * Install {@linkcode DevicePlugin} to run this system automatically during
 * startup.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { DevicePlugin } from '@wimaengine/device'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new DevicePlugin())
 *   .run()
 * // Startup registers Device and DeviceCapabilities with TypeRegistry.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry}.
 * @category system
 */
export function registerDeviceTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const platformOsId = setTypeId('PlatformOS')
  const browserId = setTypeId('Browser')

  registry.registerTypeId(platformOsId, new EnumInfo(PlatformOS))
  registry.registerTypeId(browserId, new EnumInfo(Browser))

  registry.register(DeviceCapabilities, new StructInfo({
    webgpu: new Field(typeid(Boolean)),
    webgl: new Field(typeid(Boolean)),
    canvas: new Field(typeid(Boolean)),
    webAudio: new Field(typeid(Boolean))
  }))
  registry.get(DeviceCapabilities)?.setMethod(DeviceCapabilities.serialize)
  registry.get(DeviceCapabilities)?.setMethod(DeviceCapabilities.deserialize)
  registry.register(Device, new StructInfo({
    capabilities: new Field(typeid(DeviceCapabilities)),
    platform: new Field(platformOsId),
    browser: new Field(browserId)
  }))
  registry.get(Device)?.setMethod(Device.serialize)
  registry.get(Device)?.setMethod(Device.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
