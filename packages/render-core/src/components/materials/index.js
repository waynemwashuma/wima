/** @import { AssetId, HandleSnapshotSerial } from '@wimaengine/asset' */
/** @import { World } from '@wimaengine/ecs' */

/* eslint-disable jsdoc/check-tag-names */
import { Handle, HandleSnapshot } from '@wimaengine/asset'
import { typeid } from '@wimaengine/type'
import { BasicMaterial } from '../../assets'
import { MaterialInstance } from '../material'

/**
 * Component that associates an entity with a {@linkcode BasicMaterial} asset.
 * It specializes {@linkcode MaterialInstance} for basic materials, providing the
 * material-instance value used to identify that asset for the entity.
 *
 * @category component
 * @augments MaterialInstance<BasicMaterial>
 *
 * @example
 * ```js
 * import { Assets } from '@wimaengine/asset'
 * import { World } from '@wimaengine/ecs'
 * import { BasicMaterial, BasicMaterialInstance } from '@wimaengine/render-core'
 *
 * const world = new World()
 * const materials = new Assets(BasicMaterial)
 * const material = materials.add(new BasicMaterial())
 * const entity = world.spawn([new BasicMaterialInstance(material)])
 *
 * // With the render-core material plugin registered, pair this component with
 * // a mesh and transform to include the entity in a camera render pass.
 * console.log(world.get(entity, BasicMaterialInstance).handle.id())
 * ```
 */
export class BasicMaterialInstance extends MaterialInstance {

  /**
   * Copies a basic material component and acquires an independent handle for
   * the same material asset.
   *
   * When `target` is omitted, a new component is created. In either case, the
   * target receives `source.handle.clone()` and the source handle is not reused
   * as the target's handle.
   *
   * @param {BasicMaterialInstance} source
   * @param {BasicMaterialInstance} [target=new BasicMaterialInstance(source.handle)]
   * @returns {BasicMaterialInstance} The populated target component.
   */
  static copy(source, target = new BasicMaterialInstance(source.handle)) {
    target.handle = source.handle.clone()

    return target
  }

  /**
   * Creates a basic material component with an independent handle reference to
   * the same material asset as `target`.
   *
   * This delegates to {@linkcode BasicMaterialInstance.copy}.
   *
   * @param {BasicMaterialInstance} target - Component to clone.
   * @returns {BasicMaterialInstance} A new component for the same material asset.
   */
  static clone(target) {
    return BasicMaterialInstance.copy(target)
  }

  /**
   * Creates persistence data for this component's material handle.
   *
   * The snapshot does not retain the live handle. A path-backed snapshot uses
   * the world's asset server when restored; an index-backed snapshot requires
   * the owning scene asset ID when
   * {@linkcode BasicMaterialInstance.fromSnapshot} is called.
   *
   * @param {BasicMaterialInstance} instance - Live component being snapshotted.
   * @param {World} world - World used to resolve asset metadata.
   * @returns {BasicMaterialInstanceSnapshot} Snapshot of the material handle.
   */
  static toSnapshot(instance, world) {
    return new BasicMaterialInstanceSnapshot(Handle.toSnapshot(instance.handle, world))
  }
}

/**
 * Value object that represents the serialized material reference of a
 * {@linkcode BasicMaterialInstance}. It carries material-instance persistence
 * data across serialization and restoration; it is not an ECS component and
 * does not hold a live material handle.
 *
 * @example
 * ```js
 * // `materialInstance` is a BasicMaterialInstance in `world`.
 * const serial = BasicMaterialInstanceSnapshot.serialize(
 *   BasicMaterialInstance.toSnapshot(materialInstance, world)
 * )
 * const restored = BasicMaterialInstance.fromSnapshot(
 *   BasicMaterialInstanceSnapshot.deserialize(serial), world, sceneAssetId
 * )
 * ```
 *
 * A path-backed snapshot does not need `sceneAssetId`; a scene-local numeric
 * handle snapshot does.
 */
export class BasicMaterialInstanceSnapshot {

  /**
   * Snapshot of the material handle held by
   * {@linkcode BasicMaterialInstance}.
   *
   * The nested {@linkcode HandleSnapshot} is persistence data rather than a live
   * asset handle.
   *
   * @type {HandleSnapshot}
   */
  handle

  /**
   * Creates material-instance persistence data.
   *
   * The supplied {@linkcode HandleSnapshot} is stored as-is. This constructor does
   * not clone the snapshot or resolve an asset.
   *
   * @param {HandleSnapshot} handle - Snapshot of the material asset handle.
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * Restores a {@linkcode BasicMaterialInstance} from this persistence data.
   *
   * Path-backed snapshots are restored through the world's
   * {@linkcode AssetServer}. Numeric snapshots require `sceneAssetId` and a
   * matching scene asset mapping. If that mapping is unavailable, nested
   * restoration returns `undefined`, and this method still constructs a
   * component whose handle is `undefined`.
   *
   * @param {BasicMaterialInstanceSnapshot} snapshot - Snapshot being restored.
   * @param {World} world - World containing the {@linkcode AssetServer} and, when needed, the scene asset mapping.
   * @param {AssetId} [sceneAssetId] - Owning scene asset ID for a scene-local numeric handle snapshot.
   * @returns {BasicMaterialInstance} Restored material component.
   */
  static fromSnapshot(snapshot, world, sceneAssetId) {
    return new BasicMaterialInstance(/** @type {Handle<BasicMaterial>} */(Handle.fromSnapshot(snapshot.handle, world, sceneAssetId)))
  }

  /**
   * Converts this snapshot to plain persistence data.
   *
   * The returned object contains the serialized nested handle. This method
   * does not access a {@linkcode World}, use an {@linkcode AssetServer}, or restore
   * a live handle.
   *
   * @param {BasicMaterialInstanceSnapshot} value - Snapshot to serialize.
   * @returns {BasicMaterialInstanceSnapshotSerial} Serialized handle snapshot.
   */
  static serialize(value) {
    return {
      handle: HandleSnapshot.serialize(value.handle)
    }
  }

  /**
   * Rehydrates a snapshot from plain persistence data.
   *
   * This does not restore a live handle. When `out` is supplied, this method
   * updates and returns that same snapshot and passes its existing `handle` to
   * nested deserialization, so the same nested handle object is reused;
   * otherwise it creates and returns a new snapshot.
   *
   * @param {BasicMaterialInstanceSnapshotSerial} value - Serialized handle snapshot.
   * @param {BasicMaterialInstanceSnapshot} [out] - Snapshot object to populate.
   * @returns {BasicMaterialInstanceSnapshot} The populated snapshot.
   */
  static deserialize(value, out = new BasicMaterialInstanceSnapshot(new HandleSnapshot(typeid(Object), ''))) {
    out.handle = HandleSnapshot.deserialize(value.handle, out.handle)

    return out
  }
}

/**
 * Plain serialized representation of a
 * {@linkcode BasicMaterialInstanceSnapshot}.
 *
 * @typedef BasicMaterialInstanceSnapshotSerial
 * @property {HandleSnapshotSerial} handle
 */
