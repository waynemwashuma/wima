import { EntityHandle, optional, Query, World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { Children } from '@wimaengine/hierarchy'
import { TypeRegistry } from '@wimaengine/reflect'
import { typeidGeneric } from '@wimaengine/type'
import { SceneInstance } from '../components'
import { SceneModified } from '../events'
import { SceneAssets, SceneFilterAssets, SceneSpawner } from '../resources'

export * from './types'

/**
 * Requeues every live instance of a scene whose asset was modified.
 *
 * The instance entity is the runtime anchor and must remain alive. Its
 * spawned descendants are removed so `spawnScenes` can restore the current
 * scene asset on the next pass.
 *
 * @param {World} world
 */
export function refreshModifiedScenes(world) {

  /** @type {import('@wimaengine/event').Events<SceneModified>} */
  const modifiedEvents = world.getResourceByTypeId(
    typeidGeneric(Events, [SceneModified])
  )

  const instances = new Query(
    world,
    [EntityHandle, SceneInstance, Children],
    [optional(Children)]
  )
  const spawner = world.getResource(SceneSpawner)

  modifiedEvents.each((event) => {
    const sceneId = event.data.id

    instances.each(([entity, instance, children]) => {
      if (instance.handle.id() !== sceneId) return

      if (children) {

        // Do not change this loop as children are despawned and removed from the
        // parent list by the hierarchy component hooks.
        for (let i = children.list.length - 1; i >= 0; i--) {
          world.despawn(children.list[i])
        }
      }

      spawner.add(sceneId, entity)
    })
  })
}

/**
 * @param {World} world
 */
export function spawnScenes(world) {
  const scenes = world.getResource(SceneAssets)
  const instances = new Query(world, [SceneInstance])
  const spawner = world.getResource(SceneSpawner)
  const typeRegistry = world.getResource(TypeRegistry)
  const sceneFilters = world.getResource(SceneFilterAssets)

  for (const assetId of spawner.assets()) {
    const scene = scenes.getByAssetId(assetId)

    if (!scene) continue

    const list = spawner.get(assetId)

    for (let i = 0; i < list.length; i++) {
      const entity = EntityHandle.from(list[i])
      const instance = instances.get(entity)

      if (!instance) continue

      const filter = instance[0].filter ?
        sceneFilters.get(instance[0].filter) :
        undefined

      instance[0].entityMap.clear()
      scene.toWorld(world, instance[0], typeRegistry, entity, filter)
    }

    spawner.clear(assetId)
  }
}
