/** @import { World } from '@wimaengine/ecs' */
/** @import { AppSchedule } from '@wimaengine/core' */
/** @import { ScenePlugin } from '../plugin' */

import { HandleSnapshot } from '@wimaengine/asset'
import { LiveType, SnapshotType } from '@wimaengine/core'
import { ArrayInfo, EnumInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { Scene, SceneFilter, SceneFilterMode } from '../assets'
import { SceneInstance, SceneInstanceSnapshot } from '../components'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the reflection metadata used to load, snapshot, and restore scenes.
 *
 * {@linkcode ScenePlugin} registers this function directly in
 * {@linkcode AppSchedule.Startup}. It obtains the world's {@linkcode TypeRegistry},
 * assigns the runtime `SceneFilterMode` ID with `setTypeId('SceneFilterMode')`,
 * and registers that ID with {@linkcode EnumInfo} for `SceneFilterMode`. It also
 * registers the `Array<String>` ID produced by `typeidGeneric(Array, [String])`.
 *
 * The registry then describes {@linkcode SceneFilter} with `typeIds` as that
 * string-array type and `mode` as the {@linkcode SceneFilterMode} type. It
 * describes {@linkcode SceneInstance} and {@linkcode SceneInstanceSnapshot} with a
 * `HandleSnapshot` `handle` field and an optional `HandleSnapshot` `filter`
 * field. The live instance entry receives
 * `SceneInstance.toSnapshot`; the snapshot entry receives
 * `SceneInstanceSnapshot.serialize` and `deserialize`, while
 * `SceneInstance.fromSnapshot` remains on the live entry.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetServerPlugin } from '@wimaengine/asset'
 * import { CorePlugin } from '@wimaengine/core'
 * import { HierarchyPlugin } from '@wimaengine/hierarchy'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { ScenePlugin } from '@wimaengine/scene'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new AssetServerPlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .registerPlugin(new ScenePlugin())
 *   .run()
 * // ScenePlugin's Startup system runs registerSceneTypes before scene restoration.
 * ```
 *
 * @param {World} world - World whose {@linkcode TypeRegistry} receives the metadata.
 * @returns {void}
 * @category system
 */
export function registerSceneTypes(world) {
  const registry = world.getResource(TypeRegistry)
  const sceneFilterModeId = setTypeId('SceneFilterMode')
  const typeIdArrayId = typeidGeneric(Array, [String])

  registry.registerTypeId(sceneFilterModeId, new EnumInfo(SceneFilterMode))
  registry.registerTypeId(typeIdArrayId, new ArrayInfo(typeid(String)))
  registry.register(SceneFilter, new StructInfo({
    typeIds: new Field(typeIdArrayId),
    mode: new Field(sceneFilterModeId)
  }))

  registry.register(SceneInstance, new StructInfo({
    handle: new Field(typeidGeneric(HandleSnapshot, [Scene])),
    filter: new Field(typeidGeneric(HandleSnapshot, [SceneFilter]), true)
  }))
  registry.get(SceneInstance)?.setMethod(SceneInstance.toSnapshot)
  registry.get(SceneInstance)?.setAttribute(new SnapshotType(typeid(SceneInstanceSnapshot)))

  registry.register(SceneInstanceSnapshot, new StructInfo({
    handle: new Field(typeidGeneric(HandleSnapshot, [Scene])),
    filter: new Field(typeidGeneric(HandleSnapshot, [SceneFilter]), true)
  }))
  registry.get(SceneInstanceSnapshot)?.setMethod(SceneInstanceSnapshot.serialize)
  registry.get(SceneInstanceSnapshot)?.setMethod(SceneInstanceSnapshot.deserialize)
  registry.get(SceneInstanceSnapshot)?.setAttribute(new LiveType(typeid(SceneInstance)))
}
/* eslint-enable jsdoc/check-tag-names */
