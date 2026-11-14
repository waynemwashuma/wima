import { Assets } from '@wimaengine/asset'
import { Scene, SceneFilter } from '../assets'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Typed resource alias for the shared {@linkcode Assets} pool of {@linkcode Scene}
 * assets. It inherits {@linkcode Assets} behavior for adding scenes with
 * {@linkcode Assets#add} and resolving handles with {@linkcode Assets#get} or
 * {@linkcode Assets#getByAssetId}.
 *
 * Retrieve the shared pool with `world.getResource` and {@linkcode SceneAssets}.
 * A {@linkcode SceneInstance} can store a handle from this pool for scene
 * restoration.
 *
 * @example
 * ```js
 * import { Scene, SceneAssets, SceneInstance } from '@wimaengine/scene'
 *
 * // `world` provides the shared SceneAssets pool.
 * const scenes = world.getResource(SceneAssets)
 * const sceneHandle = scenes.add(new Scene())
 * const instanceEntity = world.spawn([
 *   new SceneInstance(sceneHandle)
 * ])
 *
 * // The handle identifies the scene in this shared pool.
 * console.log(scenes.get(sceneHandle) !== undefined, instanceEntity.id())
 * ```
 *
 * @augments {Assets<Scene>}
 * @category resource-alias
 */
export class SceneAssets extends Assets {}
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Typed resource alias for the shared {@linkcode Assets} pool of
 * {@linkcode SceneFilter} assets. It inherits {@linkcode Assets} behavior for
 * adding filters with {@linkcode Assets#add} and resolving handles with
 * {@linkcode Assets#get}.
 *
 * Retrieve the shared pool with `world.getResource` and
 * {@linkcode SceneFilterAssets}. A {@linkcode SceneInstance} can store an optional
 * handle from this pool to constrain restored component and resource type IDs.
 *
 * @example
 * ```js
 * import { SceneFilter, SceneFilterAssets, SceneFilterMode, SceneInstance } from '@wimaengine/scene'
 * import { Position2D } from '@wimaengine/transform'
 * import { typeid } from '@wimaengine/type'
 *
 * // `sceneHandle` is a Handle<Scene> from the SceneAssets pool.
 * const filters = world.getResource(SceneFilterAssets)
 * const filterHandle = filters.add(new SceneFilter(
 *   [typeid(Position2D)],
 *   SceneFilterMode.Allow
 * ))
 *
 * // `filterHandle` identifies the filter in the shared SceneFilterAssets pool.
 * world.spawn([new SceneInstance(sceneHandle, filterHandle)])
 * ```
 *
 * @augments {Assets<SceneFilter>}
 * @category resource-alias
 */
export class SceneFilterAssets extends Assets {}
/* eslint-enable jsdoc/check-tag-names */
