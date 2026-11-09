/** @import {EntityHandle, EntityId} from '@wimaengine/ecs' */
/** @import {AssetId} from '@wimaengine/asset' */

/**
 * Resource used to spawn scenes into the world.
 */
export class SceneSpawner {

  /**
   * @private
   * @type {Map<AssetId,EntityId[]>}
   */
  map = new Map()

  /**
   * @param {AssetId} id
   * @param {EntityHandle} entity
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
   * @param {AssetId} id
   * @param {EntityHandle} entity
   */
  remove(id, entity) {
    const list = this.map.get(id)

    if (!list) return

    const index = list.indexOf(entity.id())

    if (index === -1) return

    list.splice(index, 1)
  }

  /**
   * @param {AssetId} id
   */
  clear(id) {
    this.map.delete(id)
  }

  /**
   * @param {AssetId} id
   * @returns {readonly EntityId[]}
   */
  get(id) {
    return this.map.get(id)
  }

  /**
   * @param {AssetId} id
   */
  flush(id) {
    this.clear(id)

    return id
  }

  assets() {
    return this.map.keys()
  }
}
