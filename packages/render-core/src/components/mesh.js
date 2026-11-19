/** @import { AssetId, HandleSnapshotSerial } from '@wimaengine/asset' */
/** @import { ComponentHook, EntityHandle, World } from '@wimaengine/ecs' */
import { Handle, HandleSnapshot } from '@wimaengine/asset'
import { typeid } from '@wimaengine/type'
import { Mesh } from '../assets'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Associates an entity with a {@linkcode Mesh} asset through an ECS component
 * handle.
 *
 * Use {@linkcode Meshed} with a material component such as
 * {@linkcode BasicMaterialInstance} when an entity should use a mesh with a
 * material. This component supplies the mesh reference; the entity's
 * transform and material are separate components.
 *
 * @category component
 * @example
 * ```js
 * import { Assets } from '@wimaengine/asset'
 * import { World } from '@wimaengine/ecs'
 * import {
 *   BasicMaterial,
 *   BasicMaterialInstance,
 *   Mesh,
 *   Meshed
 * } from '@wimaengine/render-core'
 * import { createTransform3D } from '@wimaengine/transform'
 *
 * const meshes = new Assets(Mesh)
 * const materials = new Assets(BasicMaterial)
 * const mesh = meshes.add(Mesh.triangle3D())
 * const material = materials.add(BasicMaterial.default())
 *
 * const world = new World()
 * const entity = world.spawn([
 *   ...createTransform3D(),
 *   new Meshed(mesh),
 *   new BasicMaterialInstance(material)
 * ])
 * ```
 */
export class Meshed {

  /**
   * Mesh asset handle held by the component.
   *
   * The handle identifies the {@linkcode Mesh} asset without copying its data
   * into the entity.
   *
   * @type {Handle<Mesh>}
   */
  handle

  /**
   * Creates a mesh component from an asset handle.
   *
   * The supplied handle is stored as-is. A registered remove hook releases the
   * handle when the component is removed from an entity.
   *
   * @param {Handle<Mesh>} handle - Handle to the mesh asset for the entity.
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * Copies a mesh component and acquires another handle to the same mesh asset.
   *
   * When `target` is omitted, a new {@linkcode Meshed} component is returned. In
   * either case, the target receives an independent handle from
   * {@linkcode Handle#clone}, so the copied component refers to the same asset
   * and can be released independently.
   *
   * @param {Meshed} source - Component whose mesh handle should be copied.
   * @param {Meshed} [target=new Meshed(source.handle)] - Component to populate.
   * @returns {Meshed} The populated target component.
   */
  static copy(source, target = new Meshed(source.handle)) {
    target.handle = source.handle.clone()

    return target
  }

  /**
   * Creates a mesh component with an independent handle reference to the same
   * mesh asset as `target`.
   *
   * This delegates to {@linkcode Meshed.copy}.
   *
   * @param {Meshed} target - Component to clone.
   * @returns {Meshed} A new component with a cloned mesh handle.
   */
  static clone(target) {
    return Meshed.copy(target)
  }

  /**
   * Creates persistence data for this component's mesh handle.
   *
   * This delegates to {@linkcode Handle#toSnapshot}. The nested
   * {@linkcode HandleSnapshot} stores an asset-server path when the world has
   * path metadata for this handle. Otherwise it stores the mesh's scene-local
   * asset-pool index for restoration with the owning scene asset ID.
   *
   * @param {Meshed} meshed - Live mesh component being snapshotted.
   * @param {World} world - World used to resolve asset metadata.
   * @returns {MeshedSnapshot} Snapshot containing the mesh handle reference.
   */
  static toSnapshot(meshed, world) {
    return new MeshedSnapshot(Handle.toSnapshot(meshed.handle, world))
  }
}

/**
 * Holds serializable persistence data for a {@linkcode Meshed} component.
 *
 * This value stores a handle snapshot rather than a live asset handle, so it
 * can be persisted and later used to rebuild the component. It is not an ECS
 * component.
 */
export class MeshedSnapshot {

  static default() {
    return new MeshedSnapshot(new HandleSnapshot(typeid(Mesh), ''))
  }

  /**
   * Snapshot of the live handle held by {@linkcode Meshed}.
   *
   * The nested {@linkcode HandleSnapshot} carries either a path for
   * {@linkcode AssetServer} restoration or a numeric index for a scene-local
   * asset mapping.
   *
   * @type {HandleSnapshot}
   */
  handle

  /**
   * Creates persistence data for a mesh component handle.
   *
   * The supplied {@linkcode HandleSnapshot} is stored as-is; this constructor
   * does not restore or clone a live handle.
   *
   * @param {HandleSnapshot} handle - Snapshot created from a {@linkcode Meshed} handle.
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * Restores a live {@linkcode Meshed} component from this persistence data.
   *
   * This delegates to {@linkcode Handle#fromSnapshot} and requires the
   * world to contain an {@linkcode AssetServer} resource. A string locator uses
   * the server to load or reserve the asset; a numeric locator requires
   * `sceneAssetId` and a matching scene asset mapping. If nested restoration
   * returns `undefined`, this method still returns a {@linkcode Meshed} whose
   * handle is `undefined`; a missing server or asset pool throws.
   *
   * @example
   * ```js
   * const serial = MeshedSnapshot.serialize(Meshed.toSnapshot(meshed, world))
   * const restored = Meshed.fromSnapshot(MeshedSnapshot.deserialize(serial), world, sceneAssetId)
   * ```
   *
   * @param {MeshedSnapshot} snapshot - Snapshot being restored.
   * @param {World} world - World used to restore the handle.
   * @param {AssetId} [sceneAssetId] - Owning scene ID for a scene-local handle index.
   * @returns {Meshed} Component wrapping the restored handle; an unmapped numeric index produces a component whose handle is `undefined`.
   */
  static fromSnapshot(snapshot, world, sceneAssetId) {
    return new Meshed(/** @type {Handle<Mesh>} */(Handle.fromSnapshot(snapshot.handle, world, sceneAssetId)))
  }

  /**
   * Converts a {@linkcode MeshedSnapshot} to plain persistence data.
   *
   * The nested {@linkcode HandleSnapshot.serialize} call preserves the handle
   * type and its path or scene-local index. This method does not access a
   * {@linkcode World}, load through an {@linkcode AssetServer}, or restore a live
   * handle.
   *
   * @param {MeshedSnapshot} value - Snapshot to serialize.
   * @returns {MeshedSnapshotSerial} Serialized handle snapshot.
   */
  static serialize(value) {
    return {
      handle: HandleSnapshot.serialize(value.handle)
    }
  }

  /**
   * Rehydrates a {@linkcode MeshedSnapshot} from plain persistence data.
   *
   * The nested {@linkcode HandleSnapshot.deserialize} call copies the serialized
   * type and path or scene-local index into `out.handle`. It does not access a
   * {@linkcode World} or {@linkcode AssetServer}; live-handle restoration happens
   * only through {@linkcode Meshed#fromSnapshot}.
   *
   * @param {MeshedSnapshotSerial} value - Serialized handle snapshot.
   * @param {MeshedSnapshot} [out] - Snapshot object to populate.
   * @returns {MeshedSnapshot} The populated snapshot.
   */
  static deserialize(value, out = new MeshedSnapshot(new HandleSnapshot(typeid(Object), ''))) {
    out.handle = HandleSnapshot.deserialize(value.handle, out.handle)

    return out
  }
}

/**
 * Plain serialized form of a {@linkcode MeshedSnapshot}.
 *
 * @typedef MeshedSnapshotSerial
 * @property {HandleSnapshotSerial} handle
 */

/**
 * Releases the mesh handle held by an entity's {@linkcode Meshed} component.
 *
 * This function is a {@linkcode ComponentHook} remove callback. It looks up
 * {@linkcode Meshed} for `entity` in `world`; when the entity is stale, invalid, or does
 * not have that component, the lookup is empty and the callback returns
 * without dropping anything. When the lookup succeeds, it calls
 * {@linkcode Handle#drop} on the component's handle.
 *
 * The callback runs while the component is still stored, before the row moves
 * during {@linkcode World#remove} or is deleted during {@linkcode World#despawn}.
 *
 * @param {EntityHandle} entity - Entity whose component lifecycle is changing.
 * @param {World} world - World that owns the entity and component lookup.
 * @returns {void}
 * @category component-hook
 */
export function removeMeshedHandle(entity, world) {
  const meshed = world.get(entity, Meshed)

  if (!meshed) {
    return
  }

  meshed.handle.drop()
}
/* eslint-enable jsdoc/check-tag-names */
