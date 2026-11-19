/** @import { Constructor } from '@wimaengine/type' */
/** @import { AppSchedule, CoreSystems } from '@wimaengine/core' */
/** @import { SystemFunc } from '@wimaengine/ecs' */
/** @import { AssetPlugin } from '../plugins/asset' */
/** @import { AssetServerPlugin } from '../plugins/assetServer' */

import { LiveType, SnapshotType } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { ArrayInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Handle, HandleSnapshot } from '../core'
import { AssetLoadFail, AssetSaveSuccess } from '../events'
import { AssetServer, Assets, AssetsSnapshot } from '../resources'

/**
 * Creates a system that registers reflection metadata for one asset family.
 *
 * This factory returns the system without registering metadata. The asset
 * plugin passes its configured constructor to this factory and installs the
 * returned system once in the {@linkcode AppSchedule.Startup} schedule's
 * {@linkcode CoreSystems.Start} group. This behavior is provided by
 * {@linkcode AssetPlugin}. When the system runs, it requires the world's
 * {@linkcode TypeRegistry} resource and registers metadata for the typed
 * {@linkcode Handle} and {@linkcode Assets} entries, the matching
 * {@linkcode AssetsSnapshot} entry, and the shared {@linkcode HandleSnapshot} entry.
 * The registered fields are `type`, `index`, and `generation` for a typed
 * handle; `type` for a typed asset pool; `type` and `assets` for its snapshot;
 * and `type` and `asset` for a handle snapshot.
 *
 * It then attaches the methods used by reflection and scene restoration:
 * {@linkcode AssetsSnapshot.serialize}, {@linkcode AssetsSnapshot.deserialize},
 * and {@linkcode AssetsSnapshot.patch} to the typed asset snapshot entry;
 * {@linkcode HandleSnapshot.serialize} and {@linkcode HandleSnapshot.deserialize}
 * to the handle snapshot entry; and the static {@linkcode Assets#toSnapshot} and
 * {@linkcode Assets#fromSnapshot} methods to the typed asset pool entry. The
 * static {@linkcode Handle#toSnapshot} and {@linkcode Handle#fromSnapshot}
 * methods are registered on the matching typed handle entry.
 * The returned system does not create an asset pool or any other world
 * resource.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AppSchedule, CorePlugin, CoreSystems } from '@wimaengine/core'
 * import { registerAssetTypes } from '@wimaengine/asset'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * class Texture {}
 * const app = new App()
 * app
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerSystem({
 *     schedule: AppSchedule.Startup,
 *     systemGroup: CoreSystems.Start,
 *     system: registerAssetTypes(Texture)
 *   })
 *   .setRunner(() => {})
 *   .run()
 * // AssetPlugin performs the same registration for its configured asset.
 * ```
 *
 * @template T
 * @param {Constructor<T>} asset - Constructor identifying the asset family to
 * register.
 * @returns {SystemFunc} Startup system that registers
 * the asset family's reflection metadata and snapshot methods.
 */
export function registerAssetTypes(asset) {
  return function registerAssetTypes(world) {
    const registry = world.getResource(TypeRegistry)
    const handleTypeId = typeidGeneric(Handle, [asset])
    const handleSnapshotTypeId = typeidGeneric(HandleSnapshot, [asset])
    const assetsTypeId = typeidGeneric(Assets, [asset])
    const assetsSnapshotTypeId = AssetsSnapshot.typeId(typeid(asset))

    registry.registerTypeId(handleTypeId, new StructInfo({
      type: new Field(typeid(Function)),
      index: new Field(typeid(Number)),
      generation: new Field(typeid(Number))
    }), Handle)
    registry.registerTypeId(
      assetsTypeId,
      new StructInfo({
        type: new Field(typeid(Function))
      }),
      Assets
    )
    registry.registerTypeId(assetsSnapshotTypeId, new StructInfo({
      type: new Field(typeid(String)),
      assets: new Field(typeid(Array))
    }), AssetsSnapshot)
    registry.registerTypeId(handleSnapshotTypeId, new StructInfo({
      type: new Field(typeid(Function)),
      asset: new Field(typeid(Object))
    }), HandleSnapshot)

    registry.getByTypeId(assetsTypeId)?.setMethod(Assets.toSnapshot)
    registry.getByTypeId(assetsTypeId)?.setMethod(Assets.fromSnapshot)
    registry.getByTypeId(assetsTypeId)?.setAttribute(new SnapshotType(assetsSnapshotTypeId))
    registry.getByTypeId(assetsSnapshotTypeId)?.setMethod(AssetsSnapshot.serialize)
    registry.getByTypeId(assetsSnapshotTypeId)?.setMethod(AssetsSnapshot.deserialize)
    registry.getByTypeId(assetsSnapshotTypeId)?.setMethod(AssetsSnapshot.patch)
    registry.getByTypeId(assetsSnapshotTypeId)?.setAttribute(new LiveType(assetsTypeId))

    registry.getByTypeId(handleTypeId)?.setMethod(Handle.toSnapshot)
    registry.getByTypeId(handleTypeId)?.setMethod(Handle.fromSnapshot)
    registry.getByTypeId(handleTypeId)?.setAttribute(new SnapshotType(handleSnapshotTypeId))
    registry.getByTypeId(handleSnapshotTypeId)?.setMethod(HandleSnapshot.serialize)
    registry.getByTypeId(handleSnapshotTypeId)?.setMethod(HandleSnapshot.deserialize)
    registry.getByTypeId(handleSnapshotTypeId)?.setAttribute(new LiveType(handleTypeId))
  }
}

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the reflection metadata used to serialize an
 * {@linkcode AssetServer}.
 *
 * {@linkcode AssetServerPlugin} registers this function directly as a one-shot
 * {@linkcode AppSchedule.Startup} system in the {@linkcode CoreSystems.Start}
 * group. It obtains the world's {@linkcode TypeRegistry}, computes the generic
 * IDs for arrays of {@linkcode AssetLoadFail} and {@linkcode AssetSaveSuccess}, and
 * registers an {@linkcode ArrayInfo} for each with the matching event type ID as
 * its element type.
 *
 * It then calls {@linkcode TypeRegistry#register} for {@linkcode AssetServer} with
 * a {@linkcode StructInfo} containing `failed` and `saved` {@linkcode Field}
 * entries that point at those generic array IDs. Using `register` also retains
 * the `AssetServer` constructor on the registry entry. The function writes
 * only reflection metadata: it does not create or mutate the server, process
 * asset requests, or write events. The nested event plugins provide the typed
 * event resources and their own event reflection metadata.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AppSchedule, CorePlugin, CoreSystems } from '@wimaengine/core'
 * import { registerAssetServerTypes } from '@wimaengine/asset'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * const app = new App()
 * app
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerSystem({
 *     schedule: AppSchedule.Startup,
 *     systemGroup: CoreSystems.Start,
 *     system: registerAssetServerTypes
 *   })
 *   .setRunner(() => {})
 *   .run()
 * // AssetServerPlugin performs this registration automatically.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerAssetServerTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const assetLoadFailArrayId = typeidGeneric(Array, [AssetLoadFail])
  const assetSaveSuccessArrayId = typeidGeneric(Array, [AssetSaveSuccess])

  registry.registerTypeId(assetLoadFailArrayId, new ArrayInfo(typeid(AssetLoadFail)))
  registry.registerTypeId(assetSaveSuccessArrayId, new ArrayInfo(typeid(AssetSaveSuccess)))

  registry.register(AssetServer, new StructInfo({
    failed: new Field(assetLoadFailArrayId),
    saved: new Field(assetSaveSuccessArrayId)
  }))
}
/* eslint-enable jsdoc/check-tag-names */
