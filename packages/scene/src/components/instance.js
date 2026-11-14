/** @import { EntityId } from '@wimaengine/ecs' */
/** @import { World } from '@wimaengine/ecs' */
/** @import { AssetId, HandleSnapshotSerial } from '@wimaengine/asset' */
/** @import { Scene } from "../assets" */
/** @import { SceneFilter } from '../assets' */
/** @import { AssetSceneMap } from '../resources' */
import { Handle, HandleSnapshot } from '@wimaengine/asset'
import { typeid } from '@wimaengine/type'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Associates an ECS entity with a scene asset to instantiate beneath that entity.
 *
 * The component stores a live {@linkcode Handle} for a {@linkcode Scene} asset and
 * may store a second handle for a {@linkcode SceneFilter} asset. The scene is
 * restored beneath the component's entity when its asset is available. An
 * optional {@linkcode SceneFilter} limits which component and resource types are
 * restored.
 *
 * {@linkcode ScenePlugin} provides scene instantiation support. The component's
 * entity remains the root of the restored scene.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { SceneInstance } from '@wimaengine/scene'
 *
 * // `sceneHandle` is a Handle<Scene> from the scene asset pool or asset server.
 * const sceneHandle = getSceneHandle()
 * const world = new World()
 * const instanceEntity = world.spawn([
 *   new SceneInstance(sceneHandle)
 * ])
 *
 * // The scene is instantiated beneath instanceEntity when its asset is ready.
 * const instance = world.get(instanceEntity, SceneInstance)
 * console.log(instance?.entityMap.size ?? 0)
 * ```
 */
export class SceneInstance {

  /**
   * Maps each restored world entity to its source scene entity.
   *
   * Both keys and values are packed entity IDs. The map is empty until the
   * scene is restored, is rebuilt for later restorations, and is not included
   * in the component's snapshot.
   *
   * @public
   * @type {Map<EntityId,EntityId>}
   */
  entityMap = new Map()

  /**
   * Live handle for the scene asset to restore.
   *
   * The constructor stores the supplied handle directly. `copy()` and
   * `clone()` create independent references to the same asset; scene support
   * releases the reference when the component is removed.
   *
   * @public
   * @type {Handle<Scene>}
   */
  handle

  /**
   * Optional live handle for a scene component and resource filter.
   *
   * The filter limits which component and resource types are restored. An
   * undefined value means that no filter is applied.
   *
   * @public
   * @type {Handle<SceneFilter> | undefined}
   */
  filter

  /**
   * Creates a component that references a scene asset and, optionally, a
   * filter asset.
   *
   * The supplied handles are stored directly. This constructor does not clone
   * them or acquire replacement references.
   *
   * @param {Handle<Scene>} handle
   * @param {Handle<SceneFilter>} [filter] - Optional filter asset handle.
   */
  constructor(handle, filter) {
    this.handle = handle
    this.filter = filter
  }

  /**
   * Copies a scene instance with independent asset-handle references.
   *
   * Both live handles are cloned. A supplied target keeps its existing
   * `entityMap`; the default target starts with a new empty map and never
   * copies the source's runtime mapping.
   *
   * @param {SceneInstance} source
   * @param {SceneInstance} [target]
   * @returns {SceneInstance} The populated target component.
   */
  static copy(source, target = new SceneInstance(source.handle, source.filter)) {
    target.handle = source.handle.clone()
    target.filter = source.filter?.clone()

    return target
  }

  /**
   * Creates a scene instance with cloned asset-handle references.
   *
   * The returned component has a fresh runtime `entityMap` and does not share
   * the source's map.
   *
   * @param {SceneInstance} target
   * @returns {SceneInstance}
   */
  static clone(target) {
    return SceneInstance.copy(target)
  }

  /**
   * Creates a persistence snapshot for this scene instance.
   *
   * The scene handle and optional filter handle are converted to
   * {@linkcode HandleSnapshot} values. The returned snapshot contains no live
   * handles and does not include `entityMap`; the mapping is rebuilt when the
   * scene is restored. Numeric, scene-local asset references require the
   * owning scene asset ID when restored.
   *
   * @param {World} world - World used to resolve asset metadata.
   * @returns {SceneInstanceSnapshot} Snapshot of the live asset handles.
   */
  toSnapshot(world) {
    return new SceneInstanceSnapshot(
      this.handle.toSnapshot(world),
      this.filter?.toSnapshot(world)
    )
  }
}

/**
 * Stores persisted scene and optional filter handles for a
 * {@linkcode SceneInstance}.
 *
 * The snapshot is a value object containing {@linkcode HandleSnapshot} values
 * instead of live handles. Restoring scene-local numeric handles also
 * requires the owning scene asset ID.
 *
 * @example
 * ```js
 * // `instance` is a live SceneInstance and `ownerSceneAssetId` identifies
 * // the scene that owns any numeric, scene-local handle locators.
 * const serial = SceneInstanceSnapshot.serialize(instance.toSnapshot(world))
 * const restored = SceneInstanceSnapshot.validateSerial(serial) &&
 *   SceneInstanceSnapshot.deserialize(serial)
 *     .fromSnapshot(world, ownerSceneAssetId)
 * ```
 */
export class SceneInstanceSnapshot {

  /**
   * Snapshot of the scene asset handle held by {@linkcode SceneInstance}.
   *
   * This is persistence data, not a live {@linkcode Handle}. Its locator is a
   * server path or a scene-local asset-pool index, as defined by
   * {@linkcode HandleSnapshot}.
   *
   * @type {HandleSnapshot}
   */
  handle

  /**
   * Optional snapshot of the {@linkcode SceneInstance} filter handle.
   *
   * `undefined` means that the live instance had no filter. A present value is
   * restored independently from {@linkcode SceneInstanceSnapshot#handle}.
   *
   * @type {HandleSnapshot | undefined}
   */
  filter

  /**
   * Creates a scene-instance snapshot value.
   *
   * The nested snapshots are stored exactly as supplied. The constructor does
   * not clone them, validate their serializable shape, or restore live asset
   * handles.
   *
   * @param {HandleSnapshot} handle - Snapshot of the scene asset handle.
   * @param {HandleSnapshot} [filter] - Optional snapshot of the filter handle.
   */
  constructor(handle, filter) {
    this.handle = handle
    this.filter = filter
  }

  /**
   * Restores a live {@linkcode SceneInstance} from this snapshot.
   *
   * Each nested {@linkcode HandleSnapshot} receives the same `world` and
   * optional `sceneAssetId`. String locators are resolved through
   * {@linkcode AssetServer}; numeric locators are resolved through
   * {@linkcode AssetSceneMap} when the scene asset ID is supplied. Missing
   * numeric mappings produce `undefined`. The method still constructs a
   * `SceneInstance`, so an unresolved scene handle leaves `handle` undefined,
   * and an absent or unresolved filter leaves `filter` undefined.
   *
   * The world must contain an {@linkcode AssetServer}. A path-backed handle also
   * requires its asset type to be registered there.
   *
   * @param {World} world - World used for asset-handle restoration.
   * @param {AssetId} [sceneAssetId] - Owning scene ID required for numeric handle locators.
   * @returns {SceneInstance} A new component containing the restored handle values.
   * @throws {Error} If the world has no asset server, or a path-backed handle has no registered asset pool.
   */
  fromSnapshot(world, sceneAssetId) {
    return new SceneInstance(
      /** @type {Handle<Scene>} */(this.handle.fromSnapshot(world, sceneAssetId)),
      /** @type {Handle<SceneFilter> | undefined} */(this.filter?.fromSnapshot(world, sceneAssetId))
    )
  }

  /**
   * Converts a scene-instance snapshot to plain persistence data.
   *
   * This delegates both fields to {@linkcode HandleSnapshot.serialize}. It
   * returns a new object, keeps the nested type and path-or-index values as-is,
   * and does not access a {@linkcode World}, resolve an asset, or retain a live
   * handle. The returned `filter` property is `undefined` when this snapshot
   * has no filter.
   *
   * @param {SceneInstanceSnapshot} value - Snapshot to serialize.
   * @returns {SceneInstanceSnapshotSerial} Plain serialized snapshot data.
   */
  static serialize(value) {
    return {
      handle: HandleSnapshot.serialize(value.handle),
      filter: value.filter && HandleSnapshot.serialize(value.filter)
    }
  }

  /**
   * Rehydrates a scene-instance snapshot from plain persistence data.
   *
   * This delegates each nested field to {@linkcode HandleSnapshot.deserialize};
   * it does not access a {@linkcode World}, load an asset, or restore a live
   * component. When `out` is supplied, the same outer snapshot is returned and
   * its existing nested handle snapshot is reused where possible. An omitted
   * serialized filter explicitly clears `out.filter`.
   *
   * @param {SceneInstanceSnapshotSerial} value - Plain serialized snapshot data.
   * @param {SceneInstanceSnapshot} [out] - Snapshot object to populate and return.
   * @returns {SceneInstanceSnapshot} The populated snapshot.
   */
  static deserialize(value, out = new SceneInstanceSnapshot(new HandleSnapshot(typeid(Object), ''))) {
    out.handle = HandleSnapshot.deserialize(value.handle, out.handle)
    out.filter = value.filter ?
      HandleSnapshot.deserialize(value.filter, out.filter) :
      undefined

    return out
  }

  /**
   * Checks whether a value has the serialized shape expected by
   * {@linkcode SceneInstanceSnapshot.deserialize}.
   *
   * This is a structural check only. It requires a valid serialized
   * {@linkcode HandleSnapshot} in `handle`, and accepts `filter` when it is
   * absent, `undefined`, or another valid serialized handle snapshot. It does
   * not check asset registration, path existence, pool indexes, scene
   * mappings, or whether a live handle can be restored.
   *
   * @param {unknown} value - Value to inspect.
   * @returns {value is SceneInstanceSnapshotSerial} Whether the serialized shape is accepted.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('handle' in value)) {
      return false
    }

    if (!HandleSnapshot.validateSerial(value.handle)) {
      return false
    }

    return !('filter' in value) ||
      value.filter === undefined ||
      HandleSnapshot.validateSerial(value.filter)
  }
}

/**
 * Plain serialized representation of a {@linkcode SceneInstanceSnapshot}.
 *
 * Both fields contain the serialized shape produced by
 * {@linkcode HandleSnapshot.serialize}; `filter` is optional and is `undefined`
 * when the snapshot has no filter handle.
 *
 * @typedef SceneInstanceSnapshotSerial
 * @property {HandleSnapshotSerial} handle
 * @property {HandleSnapshotSerial} [filter]
 */
