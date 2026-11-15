import { EntityHandle, optional, Query, World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { Children } from '@wimaengine/hierarchy'
import { TypeRegistry } from '@wimaengine/reflect'
import { typeidGeneric } from '@wimaengine/type'
import { SceneInstance } from '../components'
import { SceneModified } from '../events'
import { SceneAssets, SceneFilterAssets, SceneSpawner } from '../resources'

export * from './types'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Refreshes live scene instances after their scene asset is modified.
 *
 * {@linkcode ScenePlugin} registers this function directly in the repeating
 * {@linkcode AppSchedule.Update} schedule's
 * {@linkcode CoreSystems.End} group.
 * It runs after the `SceneModified` event buffer is cleared and before the {@linkcode spawnScenes} system. It reads the typed {@linkcode Events} resource for {@linkcode SceneModified} events and matches each event's asset id
 * against live {@linkcode SceneInstance} components through a {@linkcode Query}.
 *
 * The query returns the instance entity, its {@linkcode SceneInstance}, and an
 * optional {@linkcode Children} component. Matching uses the live handle's exact
 * `instance.handle.id()`. The instance entity itself remains alive; when
 * `Children` is present, the system despawns every direct child in reverse
 * list order. Each {@linkcode World#despawn} call lets hierarchy
 * hooks remove that child's descendants as well as the child from the
 * parent's live list while the loop is traversing it. Instances without
 * `Children` skip that loop.
 *
 * After descendants are removed, the system calls {@linkcode SceneSpawner#add}
 * with the modified scene id and instance entity. This queues the instance for
 * restoration; it does not spawn immediately. The add is idempotent for the
 * same scene id and entity, and every live instance matching the modified id
 * is queued. The later {@linkcode spawnScenes} pass restores the available asset
 * beneath those queued roots in the same update's scene-system flow.
 *
 * {@linkcode Events#each} iterates the current readable
 * `SceneModified` batch in write order but does not clear or remove events.
 * This function never calls {@linkcode Events#clear}; the event plugin's
 * separately scheduled clear system performs that buffer rotation before this
 * system runs. Events written after that clear wait for a later published
 * batch.
 *
 * @example
 * ```js
 * // ScenePlugin installs refreshModifiedScenes in Update/CoreSystems.End.
 * app.registerPlugin(new ScenePlugin())
 * // A SceneModified event removes old descendants and queues each live root;
 * // spawnScenes then restores the current scene asset.
 * ```
 *
 * @param {World} world - World containing SceneModified events, scene instances, and SceneSpawner.
 * @returns {void}
 * @category system
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
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Restores queued scene instances whose scene assets are available.
 *
 * {@linkcode ScenePlugin} registers this function directly in the repeating
 * {@linkcode AppSchedule.Update} schedule's
 * {@linkcode CoreSystems.End} group,
 * after the scene asset event updater. It iterates the pending asset IDs from
 * {@linkcode SceneSpawner#assets} and resolves each one through the typed
 * {@linkcode SceneAssets} pool with `getByAssetId(assetId)`.
 *
 * If a scene asset is not available, the system skips that asset immediately
 * and leaves its spawner entry queued for a later update. For an available
 * scene, it gets the queued packed entity IDs from {@linkcode SceneSpawner},
 * converts each with `EntityHandle.from`, and looks up the live
 * {@linkcode SceneInstance} through a {@linkcode Query}. A missing or stale entity is
 * skipped without restoration. After the lookup, an instance with a filter
 * handle resolves it through {@linkcode SceneFilterAssets}; no handle, or a handle
 * that no longer resolves, supplies `undefined` as the optional filter.
 *
 * Before restoring each live instance, the system clears its
 * {@linkcode SceneInstance#entityMap}. It then calls {@linkcode Scene#toWorld} with the
 * world, instance, {@linkcode TypeRegistry}, instance root entity, and resolved
 * filter. `toWorld` repopulates the mapping while restoring the scene beneath
 * that root. Once every queued entity for an available asset has been visited,
 * {@linkcode SceneSpawner#clear} removes that asset ID from the pending map,
 * including entries whose queued entities were no longer live. Missing scene
 * assets are the exception because the system continues before `clear`.
 *
 * @example
 * ```js
 * // ScenePlugin installs spawnScenes in Update/CoreSystems.End.
 * app.registerPlugin(new ScenePlugin())
 * // SceneInstance hooks queue asset IDs; each available scene is then
 * // restored beneath its live instance root during the update.
 * ```
 *
 * @param {World} world - World containing SceneAssets, SceneFilterAssets, SceneSpawner, and TypeRegistry.
 * @returns {void}
 * @category system
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
/* eslint-enable jsdoc/check-tag-names */
