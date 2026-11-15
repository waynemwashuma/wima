/** @import { ComponentHook, EntityHandle, World } from '@wimaengine/ecs' */
import { SceneInstance } from '../components'
import { SceneSpawner } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Queues a newly added {@linkcode SceneInstance} for deferred scene spawning.
 *
 * {@linkcode ScenePlugin} installs this function as the add callback in a
 * {@linkcode ComponentHook}. It looks up the instance on the entity, reads
 * `sceneInstance.handle.id()`, obtains the world's {@linkcode SceneSpawner}, and
 * records the scene asset ID together with the entity. The scene does not need
 * to be loaded yet; it remains pending until its asset becomes available.
 *
 * @example
 * ```js
 * // With ScenePlugin installed, adding the component queues its scene ID.
 * const entity = world.spawn([new SceneInstance(sceneHandle)])
 * // The scene is restored later when its asset becomes available.
 * ```
 *
 * @param {EntityHandle} entity - Entity receiving the
 * {@linkcode SceneInstance} component.
 * @param {World} world - World containing the
 * {@linkcode SceneSpawner} resource and component.
 * @returns {void}
 * @category component-hook
 */
export function initSceneInstance(entity, world) {
  const spawner = world.getResource(SceneSpawner)
  const sceneHandle = world.get(entity, SceneInstance)

  // the scene may actually not be loaded so we will defer the actual spawning of the scene entities to when the scene asset is actually loaded.
  spawner.add(sceneHandle.handle.id(), entity)
}
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Releases the resources held by a {@linkcode SceneInstance} as it leaves an ECS
 * entity.
 *
 * {@linkcode ScenePlugin} installs this function as the `remove` callback in
 * {@linkcode ComponentHooks} for {@linkcode SceneInstance}. The hook reads the
 * component while it is available to release its live asset handles.
 *
 * When the component is present, the hook removes the entity from the
 * {@linkcode SceneSpawner} entry for `sceneInstance.handle.id()`, then calls
 * {@linkcode Handle#drop} on the scene handle and, when present, the filter handle.
 * These calls queue the handles for deferred release.
 *
 * A stale entity or an entity without a {@linkcode SceneInstance} is a no-op. The
 * hook does not remove the component, despawn the entity, or remove any already
 * spawned scene descendants.
 *
 * @example
 * ```js
 * // ScenePlugin installs this hook for SceneInstance automatically.
 * world.remove(instanceEntity, [SceneInstance])
 * // The pending spawn is cancelled and both live handles are released.
 * ```
 *
 * @param {EntityHandle} entity - Entity whose
 * {@linkcode SceneInstance} component is being removed.
 * @param {World} world - World that owns the entity,
 * component, and {@linkcode SceneSpawner} resource.
 * @returns {void}
 * @category component-hook
 */
export function dropSceneInstance(entity, world) {
  const spawner = world.getResource(SceneSpawner)
  const sceneInstance = world.get(entity, SceneInstance)

  if (!sceneInstance) {
    return
  }

  spawner.remove(sceneInstance.handle.id(), entity)
  sceneInstance.handle.drop()
  sceneInstance.filter?.drop()
}
/* eslint-enable jsdoc/check-tag-names */
