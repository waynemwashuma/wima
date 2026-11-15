/** @import { AssetId } from '@wimaengine/asset' */
/** @import { TypeId } from '@wimaengine/type' */
/** @import { UntypedHandle } from '@wimaengine/asset' */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Runtime-only {@linkcode World} resource for scene-local asset handle mapping.
 *
 * {@linkcode Scene#toWorld} uses this map while restoring a {@linkcode Scene}: an
 * {@linkcode AssetId} for the scene asset, an asset {@linkcode TypeId}, and a snapshot
 * index identify the untyped {@linkcode Handle} associated with that scene asset.
 * The map is installed in the world on demand for scene restoration and is not
 * part of the scene snapshot itself.
 *
 * @example
 * ```js
 * // After {@linkcode Scene#toWorld} has restored a scene with an asset ID:
 * const sceneMap = world.getResource(AssetSceneMap)
 * const handle = sceneMap.get(sceneAssetId, textureTypeId, 0)
 * if (handle) handle.drop()
 * sceneMap.clear(sceneAssetId, textureTypeId)
 * ```
 *
 * @category resource
 */
export class AssetSceneMap {

  /**
   * Scene asset IDs mapped to asset type IDs and snapshot indexes.
   *
   * @private
   * @type {Map<AssetId, Map<TypeId, Map<number, UntypedHandle>>>}
   */
  scenes = new Map()

  /**
   * Stores an untyped {@linkcode Handle} for a scene asset snapshot.
   *
   * The supplied handle is stored as-is under the {@linkcode AssetId} and
   * {@linkcode TypeId} key; it is not cloned. An existing value at the same key is
   * replaced without dropping the previous handle.
   *
   * @param {AssetId} sceneAssetId - Scene asset ID used by {@linkcode Scene#toWorld}.
   * @param {TypeId} assetTypeId - Asset type ID represented by the snapshot.
   * @param {number} snapshotIndex - Index of the asset in the scene snapshot.
   * @param {UntypedHandle} handle - Handle to retain for later lookup.
   * @returns {void}
   */
  set(sceneAssetId, assetTypeId, snapshotIndex, handle) {
    const typeMap = this.getOrCreateTypeMap(sceneAssetId)
    let handles = typeMap.get(assetTypeId)

    if (!handles) {
      handles = new Map()
      typeMap.set(assetTypeId, handles)
    }

    handles.set(snapshotIndex, handle)
  }

  /**
   * Looks up a scene-local asset handle and returns a clone of it.
   *
   * The stored {@linkcode Handle} remains in the map; the returned clone gives the
   * caller its own reference. Returns `undefined` when any part of the key is
   * not mapped.
   *
   * @param {AssetId} sceneAssetId - Scene asset ID used by {@linkcode Scene#toWorld}.
   * @param {TypeId} assetTypeId - Asset type ID represented by the snapshot.
   * @param {number} snapshotIndex - Index of the asset in the scene snapshot.
   * @returns {UntypedHandle | undefined} A cloned handle, or `undefined` when
   * no handle is mapped.
   */
  get(sceneAssetId, assetTypeId, snapshotIndex) {
    const handle = this.scenes
      .get(sceneAssetId)
      ?.get(assetTypeId)
      ?.get(snapshotIndex)

    return handle?.clone()
  }

  /**
   * Drops mapped handles and removes scene-map entries.
   *
   * With no asset type, drops handles for every type under the scene asset and
   * removes the entire scene entry. With a {@linkcode TypeId}, only that type is
   * cleared; if it was the last type, its empty scene entry is removed too.
   * Missing scene or type entries are ignored. Each stored handle is released
   * through {@linkcode Handle#drop}.
   *
   * @param {AssetId} sceneAssetId - Scene asset ID to clear.
   * @param {TypeId} [assetTypeId] - Optional asset type ID to clear only.
   * @returns {void}
   */
  clear(sceneAssetId, assetTypeId) {
    const typeMap = this.scenes.get(sceneAssetId)

    if (!typeMap) {
      return
    }

    if (assetTypeId === undefined) {
      for (const handles of typeMap.values()) {
        this.dropHandles(handles)
      }

      this.scenes.delete(sceneAssetId)

      return
    }

    const handles = typeMap.get(assetTypeId)

    if (!handles) {
      return
    }

    this.dropHandles(handles)
    typeMap.delete(assetTypeId)

    if (typeMap.size === 0) {
      this.scenes.delete(sceneAssetId)
    }
  }

  /**
   * Keeps this runtime-only resource out of {@linkcode Scene} snapshots.
   *
   * @returns {undefined} Always `undefined`; the map is rebuilt during
   * {@linkcode Scene#toWorld} instead of serialized.
   */
  toSnapshot() {
    return undefined
  }

  /**
   * @private
   * @param {AssetId} sceneAssetId
   * @returns {Map<TypeId, Map<number, UntypedHandle>>}
   */
  getOrCreateTypeMap(sceneAssetId) {
    let typeMap = this.scenes.get(sceneAssetId)

    if (!typeMap) {
      typeMap = new Map()
      this.scenes.set(sceneAssetId, typeMap)
    }

    return typeMap
  }

  /**
   * @private
   * @param {Map<number, UntypedHandle>} handles
   */
  dropHandles(handles) {
    for (const handle of handles.values()) {
      handle.drop()
    }
  }
}
/* eslint-enable jsdoc/check-tag-names */
