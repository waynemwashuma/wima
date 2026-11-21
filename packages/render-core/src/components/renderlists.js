/** @import {AssetId} from '@wimaengine/asset' */
/** @import {TypeId} from '@wimaengine/type' */
import { GlobalTransform2D, GlobalTransform3D } from '@wimaengine/transform'

/**
 * A render-entry value containing a material ID, mesh ID, and transform for one
 * renderable item. Add instances to {@linkcode RenderLists} passes when a caller
 * needs to retain the data for that item.
 *
 * @template T
 * @abstract
 */
export class RenderType {

  /**
   * Mesh asset ID stored in this render entry.
   *
   * Use this ID to identify the mesh asset for the draw. See
   * {@linkcode Meshed}.
   *
   * @type {AssetId}
   */
  meshid

  /**
   * Material asset ID stored in this render entry.
   *
   * Use this ID to identify the material asset for the draw. See
   * {@linkcode MaterialInstance}.
   *
   * @type {AssetId}
   */
  materialid

  /**
   * Resolved world transform stored in this render entry.
   *
   * Use it to describe the entry's world-space placement for rendering. The
   * value can be a {@linkcode GlobalTransform2D} or {@linkcode GlobalTransform3D}.
   *
   * @type {T}
   */
  transform

  /**
   * Creates a render-entry value for one material/mesh pair.
   *
   * The argument order is material ID first, mesh ID second, and resolved
   * transform third. Values are assigned directly to the corresponding fields;
   * no asset lookup or transform clone occurs.
   *
   * @example
   * ```js
   * // Create the entry from material and mesh IDs plus a resolved transform.
   * const item = new RenderType(
   *   material.handle.id(),
   *   mesh.handle.id(),
   *   globalTransform
   * )
   * opaquePass.push(item)
   *
   * // Read the entry's IDs and transform when preparing the draw.
   * const meshValue = meshes.getByAssetId(item.meshid)
   * const materialValue = materials.getByAssetId(item.materialid)
   * draw(meshValue, materialValue, item.transform)
   * ```
   *
   * @param {AssetId} materialid - Material handle ID.
   * @param {AssetId} meshid - Mesh handle ID.
   * @param {T} transform - Resolved global transform.
   */
  constructor(materialid, meshid, transform) {
    this.meshid = meshid
    this.materialid = materialid
    this.transform = transform
  }
}

/**
 * The base opaque-pass list for material-keyed {@linkcode RenderType} entries.
 * {@linkcode RenderLists2D} and {@linkcode RenderLists3D} provide camera
 * render-list components for the dimensional transform types.
 *
 * Pass arrays are shared with callers, so a retrieved pass can be inspected or
 * extended directly before the list is cleared or replaced.
 *
 * @example
 * ```js
 * import { RenderLists2D } from '@wimaengine/render-core'
 * import { typeid } from '@wimaengine/type'
 *
 * class BasicMaterial {}
 * const lists = new RenderLists2D()
 * const materialTypeId = typeid(BasicMaterial)
 * const pass = lists.setOpaquePass(materialTypeId)
 *
 * // Callers can append RenderType values to the shared pass.
 * console.log(lists.getOpaquePass(materialTypeId) === pass) // true
 * lists.clear()
 * console.log(lists.getOpaquePass(materialTypeId)) // undefined
 * ```
 *
 * @template T
 */
export class RenderLists {

  /**
   * Opaque render passes keyed by material type ID.
   *
   * Each map value is the mutable array of {@linkcode RenderType} entries for one
   * material type. The map stores the arrays directly; it does not copy a pass
   * returned by {@linkcode RenderLists#setOpaquePass}.
   *
   * @private
   * @type {Map<TypeId,RenderType<T>[]>}
   */
  opaquePass = new Map()

  /**
   * Returns the existing opaque pass for a material type ID.
   *
   * The returned array is the same array held by the map, so callers can read
   * or append its {@linkcode RenderType} entries. No pass is created when `id` is
   * absent; the method returns `undefined` instead.
   *
   * @param {TypeId} id
   * @returns {RenderType<T>[] | undefined}
   */
  getOpaquePass(id) {
    return this.opaquePass.get(id)
  }

  /**
   * Creates and stores an empty opaque pass for a material type ID.
   *
   * The new array is stored directly under `id` and returned for appending
   * {@linkcode RenderType} entries. If a pass already exists for that key, it is
   * replaced by a new empty array rather than appended to or merged.
   *
   * @param {TypeId} id
   * @returns {RenderType<T>[]}
   */
  setOpaquePass(id) {

    /** @type {RenderType<T>[]}*/
    const pass = []

    this.opaquePass.set(id, pass)

    return pass
  }

  /**
   * Removes every material-keyed opaque pass from this render list.
   *
   * After clearing, {@linkcode RenderLists#getOpaquePass} returns
   * `undefined` for the removed keys. Arrays returned before the clear remain
   * unchanged as ordinary arrays, but they are no longer stored in this map.
   *
   * @returns {void}
   */
  clear() {
    this.opaquePass.clear()
  }
}

/* eslint-disable jsdoc/check-tag-names */
/**
 * Camera render-list component for opaque 2D passes.
 *
 * Place this component on a camera entity with {@linkcode Camera} and
 * {@linkcode GlobalTransform2D}. It specializes {@linkcode RenderLists} for 2D
 * entries; {@linkcode RenderLists3D} is the corresponding 3D component.
 *
 * Use the inherited {@linkcode RenderLists#getOpaquePass},
 * {@linkcode RenderLists#setOpaquePass}, and {@linkcode RenderLists#clear} APIs to
 * manage its material-keyed passes.
 *
 * @example
 * ```js
 * import { createCamera2D } from '@wimaengine/render-core'
 *
 * // The prefab includes GlobalTransform2D, Camera, and RenderLists2D.
 * const cameraEntity = world.spawn(createCamera2D())
 * ```
 *
 * @augments {RenderLists<GlobalTransform2D>}
 * @category component
 */
export class RenderLists2D extends RenderLists {

  static default() {
    return new RenderLists2D()
  }

  /**
   * Returns the copy target without copying any render passes.
   *
   * The source is ignored. Without a target, this method creates and returns
   * an empty {@linkcode RenderLists2D}; with a target, it returns that exact object
   * unchanged, including any passes it already contains.
   *
   * @param {RenderLists2D} _source - Render list ignored by this no-op copy.
   * @param {RenderLists2D} [target] - Object to return; defaults to a new render list.
   * @returns {RenderLists2D} The new default target or the supplied target.
   */
  static copy(_source, target = new RenderLists2D()) {
    return target
  }

  /**
   * Returns a new empty render list instead of cloning render passes.
   *
   * The input is ignored. This method delegates to
   * {@linkcode RenderLists2D.copy} without a copy target, so it always
   * returns a new {@linkcode RenderLists2D} whose inherited opaque-pass map is
   * empty.
   *
   * @param {RenderLists2D} target - Render list ignored by this no-op clone.
   * @returns {RenderLists2D} A new empty 2D render list.
   */
  static clone(target) {
    return RenderLists2D.copy(target)
  }

  /**
   * Returns the empty serialized representation for a 2D render list.
   *
   * The value is ignored and the inherited opaque passes are not serialized;
   * each call returns a new empty object.
   *
   * @param {RenderLists2D} _value - Render list ignored during serialization.
   * @returns {object} An empty serialized representation.
   */
  static serialize(_value) {
    return {}
  }

  /**
   * Returns an output render list without reading serialized data.
   *
   * The serialized input is ignored. Without `out`, this method creates and
   * returns a new empty {@linkcode RenderLists2D}; with `out`, it returns that
   * exact object unchanged, so no opaque passes are restored or replaced.
   *
   * @param {unknown} _value - Serialized value ignored during deserialization.
   * @param {RenderLists2D} [out] - Existing output to return unchanged.
   * @returns {RenderLists2D} The new default output or the supplied output.
   */
  static deserialize(_value, out = new RenderLists2D()) {
    return out
  }
}
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Camera render-list component for opaque 3D passes.
 *
 * Place this component on a camera entity with {@linkcode Camera} and
 * {@linkcode GlobalTransform3D}. It specializes {@linkcode RenderLists} for 3D
 * entries; {@linkcode RenderLists2D} is the corresponding 2D component.
 *
 * Use the inherited {@linkcode RenderLists#getOpaquePass},
 * {@linkcode RenderLists#setOpaquePass}, and {@linkcode RenderLists#clear} APIs to
 * manage its material-keyed passes.
 *
 * @example
 * ```js
 * import { createCamera3D } from '@wimaengine/render-core'
 *
 * // The prefab includes GlobalTransform3D, Camera, and RenderLists3D.
 * const cameraEntity = world.spawn(createCamera3D())
 * ```
 *
 * @augments {RenderLists<GlobalTransform3D>}
 * @category component
 */
export class RenderLists3D extends RenderLists {

  static default() {
    return new RenderLists3D()
  }

  /**
   * Returns the copy target without copying any render passes.
   *
   * The source is ignored. Without a target, this method creates and returns
   * an empty {@linkcode RenderLists3D}; with a target, it returns that exact object
   * unchanged, including any passes it already contains.
   *
   * @param {RenderLists3D} _source - Render list ignored by this no-op copy.
   * @param {RenderLists3D} [target] - Object to return; defaults to a new render list.
   * @returns {RenderLists3D} The new default target or the supplied target.
   */
  static copy(_source, target = new RenderLists3D()) {
    return target
  }

  /**
   * Returns a new empty render list instead of cloning render passes.
   *
   * The input is ignored. This method delegates to
   * {@linkcode RenderLists3D.copy} without a copy target, so it always
   * returns a new {@linkcode RenderLists3D} whose inherited opaque-pass map is
   * empty.
   *
   * @param {RenderLists3D} target - Render list ignored by this no-op clone.
   * @returns {RenderLists3D} A new empty 3D render list.
   */
  static clone(target) {
    return RenderLists3D.copy(target)
  }

  /**
   * Returns the empty serialized representation for a 3D render list.
   *
   * The value is ignored and the inherited opaque passes are not serialized;
   * each call returns a new empty object.
   *
   * @param {RenderLists3D} _value - Render list ignored during serialization.
   * @returns {object} An empty serialized representation.
   */
  static serialize(_value) {
    return {}
  }

  /**
   * Returns an output render list without reading serialized data.
   *
   * The serialized input is ignored. Without `out`, this method creates and
   * returns a new empty {@linkcode RenderLists3D}; with `out`, it returns that
   * exact object unchanged, so no opaque passes are restored or replaced.
   *
   * @param {unknown} _value - Serialized value ignored during deserialization.
   * @param {RenderLists3D} [out] - Existing output to return unchanged.
   * @returns {RenderLists3D} The new default output or the supplied output.
   */
  static deserialize(_value, out = new RenderLists3D()) {
    return out
  }
}
/* eslint-enable jsdoc/check-tag-names */
