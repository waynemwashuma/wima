/** @import {EntityHandle, EntityId} from '@wimaengine/ecs' */
/** @import {AssetId} from '@wimaengine/asset' */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Tracks pending scene instances by scene asset ID.
 *
 * Each entry associates a scene {@linkcode AssetId} with an entity carrying a
 * {@linkcode SceneInstance} component. The resource records which entities are
 * waiting for their scene assets and lets callers inspect or update those
 * associations. It does not instantiate scenes, create entities, or alter
 * entities by itself. {@linkcode ScenePlugin} provides this resource for a world.
 *
 * @example
 * ```js
 * import { SceneSpawner } from '@wimaengine/scene'
 *
 * // Assume `world` has the scene resource available.
 * const spawner = world.getResource(SceneSpawner)
 * const instanceEntity = world.spawn([])
 * const sceneId = sceneHandle.id()
 *
 * spawner.add(sceneId, instanceEntity)
 * spawner.add(sceneId, instanceEntity) // the entity is recorded once
 * console.log(spawner.get(sceneId)) // [instanceEntity.id()]
 *
 * for (const pendingSceneId of spawner.assets()) {
 *   console.log(spawner.get(pendingSceneId))
 * }
 *
 * spawner.remove(sceneId, instanceEntity)
 * spawner.flush(sceneId) // clears the key and returns sceneId
 * ```
 *
 * @category resource
 */
export class SceneSpawner {

  /**
   * Pending entity ids grouped by scene asset id.
   *
   * Each asset key remains in the map with an empty list when its last entity is
   * removed. The {@linkcode clear} and {@linkcode flush} methods remove the key
   * itself.
   *
   * @private
   * @type {Map<AssetId,EntityId[]>}
   */
  map = new Map()

  /**
   * Records an entity as waiting for a scene asset.
   *
   * The entity id is appended only when that id is not already recorded for
   * the asset. Calling this method repeatedly for the same asset and entity
   * is therefore idempotent. This method stores the id immediately; it does
   * not check whether the asset is loaded or whether the entity still exists.
   *
   * @param {AssetId} id
   * @param {EntityHandle} entity
   * @returns {void}
   */
  add(id, entity) {
    const list = this.map.get(id)
    const entityId = entity.id()

    if (list) {
      if (!list.includes(entityId)) {
        list.push(entityId)
      }
    } else {
      this.map.set(id, [entityId])
    }
  }

  /**
   * Stops tracking an entity for a scene asset.
   *
   * If the asset has no list, or the list does not contain this entity id,
   * the method does nothing. Removing the last entity leaves an empty list
   * under the asset id; use {@linkcode clear} or {@linkcode flush} to remove that
   * key.
   * This method only changes the pending map and does not despawn the entity.
   *
   * @param {AssetId} id
   * @param {EntityHandle} entity
   * @returns {void}
   */
  remove(id, entity) {
    const list = this.map.get(id)

    if (!list) return

    const index = list.indexOf(entity.id())

    if (index === -1) return

    list.splice(index, 1)
  }

  /**
   * Removes all pending entities for a scene asset.
   *
   * Missing asset ids are ignored. Clearing a key does not affect the scene
   * asset or any entity that was previously listed under it.
   *
   * @param {AssetId} id
   * @returns {void}
   */
  clear(id) {
    this.map.delete(id)
  }

  /**
   * Returns the pending entity ids for a scene asset.
   *
   * The returned list is the resource's stored list rather than a copy. It
   * is typed as readonly for callers; use {@linkcode add}, {@linkcode remove}, and
   * {@linkcode clear} to maintain the map. An unknown asset id returns
   * `undefined`. A key whose entities were all removed returns an empty list
   * until the key is cleared.
   *
   * @param {AssetId} id
   * @returns {readonly EntityId[] | undefined}
   */
  get(id) {
    return this.map.get(id)
  }

  /**
   * Removes all pending entities for an asset and returns its id.
   *
   * This is a convenience for consuming a pending key. It does not look up
   * the asset, spawn a scene, or change any entity. The same id is returned
   * even when no key was present.
   *
   * @param {AssetId} id
   * @returns {AssetId}
   */
  flush(id) {
    this.clear(id)

    return id
  }

  /**
   * Iterates over scene asset ids currently tracked by this resource.
   *
   * Keys remain present after their last entity is removed, so the iterator
   * can include an asset whose {@linkcode get} result is an empty list. Use
   * {@linkcode get} to inspect the entity ids associated with each asset.
   *
   * @returns {IterableIterator<AssetId>} Iterator over the current asset ids.
   */
  assets() {
    return this.map.keys()
  }
}
/* eslint-enable jsdoc/check-tag-names */
