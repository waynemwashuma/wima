/** @import {AssetId} from '../types' */
/** @import {Assets} from '../resources' */
/** @import {World} from '@wimaengine/ecs' */
/** @import {Constructor, TypeId} from '@wimaengine/type'*/

import { packInto64Int } from '@wimaengine/datastructures'
import { setTypeId, typeid } from '@wimaengine/type'
import { AssetServer } from '../resources'
import { AssetChannel } from './channel'

const assetSceneMapId = setTypeId('AssetSceneMap')

/**
 * Represents a live, typed reference to an asset entry.
 *
 * A handle identifies one entry in an {@linkcode Assets} pool without containing
 * the asset itself. Copies share that identity, ownership changes are
 * deferred, and an older handle becomes stale if the entry is recycled.
 *
 * @example
 * ```js
 * import { AssetServer, Assets } from '@wimaengine/asset'
 * import { World } from '@wimaengine/ecs'
 *
 * class Texture {}
 * const world = new World()
 * const textures = new Assets(Texture)
 * const server = new AssetServer()
 * world.setResource(server)
 * server.registerAsset(textures)
 *
 * const handle = server.load(Texture, '/textures/player.png')
 * const copy = handle.clone()
 * const snapshot = Handle.toSnapshot(handle, world)
 * console.log(snapshot.asset) // '/textures/player.png'
 *
 * copy.drop()
 * handle.drop()
 * textures.update()
 * ```
 *
 * @template T
 */
export class Handle {

  /**
   * Constructor identifying the asset family represented by this handle.
   *
   * This is the constructor associated with the owning {@linkcode Assets} pool.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  type

  /**
   * Whether this handle has already queued its release.
   *
   * The flag makes repeated calls to {@linkcode Handle#drop} no-ops. It does not
   * indicate whether the corresponding pool entry is still live.
   *
   * @private
   * @type {boolean}
   */
  dropped = false

  /**
   * Deferred reference-operation state used by the owning asset pool.
   *
   * Handles from the same pool share this private state so reference changes
   * from {@linkcode Handle#clone} and {@linkcode Handle#drop} can be applied later
   * by {@linkcode Assets#update}.
   *
   * @private
   * @readonly
   * @type {AssetChannel<T>}
   */
  channel

  /**
   * Index of this handle's entry in the owning {@linkcode Assets} pool.
   *
   * The index can be reused after an entry is released, so it is not a
   * complete asset identity by itself. Pair it with
   * {@linkcode Handle#generation}, or use {@linkcode Handle#id}, when
   * identifying the entry.
   *
   * @readonly
   * @type {number}
   */
  index

  /**
   * Generation associated with the pool entry at {@linkcode Handle#index}.
   *
   * The owning {@linkcode Assets} pool increments the generation when it reuses
   * an index. A handle or asset ID with an older generation is stale and does
   * not resolve to the replacement entry.
   *
   * @readonly
   * @type {number}
   */
  generation = 0

  /**
   * Creates a handle for a typed asset-pool slot.
   *
   * This low-level constructor stores the supplied operation state, type, index,
   * and generation directly. It does not validate the slot or change its
   * reference count; {@linkcode Assets} pool operations normally create handles
   * for callers.
   *
   * @param {AssetChannel<T>} channel - Deferred-operation state for the owning asset pool.
   * @param {Constructor<T>} type - Constructor of the asset family.
   * @param {number} index - Index of the pool slot.
   * @param {number} generation - Generation associated with the slot.
   */
  constructor(channel, type, index, generation) {
    this.index = index
    this.generation = generation
    this.channel = channel
    this.type = type
  }

  /**
   * Returns this handle's packed asset identity.
   *
   * The slot index and generation are combined into an {@linkcode AssetId}.
   * This method does not inspect the owning pool, so a stale handle continues
   * to return the same identity.
   *
   * @returns {AssetId} Packed slot-and-generation identity.
   */
  id() {
    return /** @type {AssetId}*/ (packInto64Int(this.index, this.generation))
  }

  /**
   * Queues an additional reference for this identity and returns a handle for it.
   *
   * The returned handle has the same type, index, generation, and deferred
   * operation state as this handle. The reference count changes only when the
   * owning {@linkcode Assets} pool processes pending operations. If the identity
   * is stale at that time, the queued acquisition is ignored. The returned
   * handle is not marked as dropped.
   *
   * @returns {Handle<T>} A separate handle for the same identity.
   */
  clone() {
    const { channel, index, generation } = this

    channel.acquire(this.id())

    return new Handle(channel, this.type, index, generation)
  }

  /**
   * Creates a {@linkcode HandleSnapshot} for this handle.
   *
   * The world must contain an {@linkcode AssetServer} resource. If the server has
   * truthy path metadata for this handle's packed ID, the snapshot stores that
   * path; otherwise it stores the handle's pool index for scene-local
   * restoration. The snapshot always stores the asset type ID. This method does
   * not validate the handle's generation or fetch the asset.
   *
   * @template U
   * @param {Handle<U>} handle - Live handle being snapshotted.
   * @param {World} world - World containing the {@linkcode AssetServer} resource.
   * @returns {HandleSnapshot} Path-backed or scene-local reference data.
   * @throws {Error} If the world does not contain an {@linkcode AssetServer} resource.
   */
  static toSnapshot(handle, world) {
    const server = world.getResource(AssetServer)
    const info = server?.getAssetInfo(handle)

    if (info?.path) {
      return new HandleSnapshot(typeid(handle.type), info.path)
    }

    return new HandleSnapshot(typeid(handle.type), handle.index)
  }

  /**
   * Restores a live handle from a snapshot value.
   *
   * @param {HandleSnapshot} snapshot
   * @param {World} world
   * @param {AssetId} [sceneAssetId]
   * @returns {UntypedHandle | undefined}
   */
  static fromSnapshot(snapshot, world, sceneAssetId) {
    const server = world.getResource(AssetServer)

    if (typeof snapshot.asset === 'string') {
      return server.loadUntyped(snapshot.type, snapshot.asset)
    }

    if (sceneAssetId !== undefined && world.hasResourceByTypeId(assetSceneMapId)) {

      /** @type {{ get: Function }} */
      const sceneMap = world.getResourceByTypeId(assetSceneMapId)
      const mapped = sceneMap.get(sceneAssetId, snapshot.type, snapshot.asset)

      if (mapped) {
        return mapped
      }
    }

    return undefined
  }

  /**
   * Queues this handle's release once.
   *
   * The first call marks this handle as dropped and queues its packed identity;
   * repeated calls do nothing. The owning {@linkcode Assets} pool applies the
   * release later, decrementing the matching generation's reference count and
   * recycling the slot when no references remain. A stale identity is ignored,
   * and this method does not change the pool immediately.
   *
   * @returns {void} Nothing; the release is deferred to the asset pool.
   */
  drop() {
    if (this.dropped) return

    this.channel.release(this.id())
    this.dropped = true
  }
}

/**
 * Represents serializable data used to restore a typed {@linkcode Handle}.
 *
 * It identifies an asset without retaining the live value. The snapshot is
 * data only: it does not load the asset, and scene-local data can be resolved
 * only with the owning scene context.
 *
 * @example
 * ```js
 * import { AssetServer, Assets, HandleSnapshot } from '@wimaengine/asset'
 * import { World } from '@wimaengine/ecs'
 *
 * class Texture {}
 * const world = new World()
 * const server = new AssetServer()
 * server.registerAsset(new Assets(Texture))
 * world.setResource(server)
 *
 * const handle = server.load(Texture, '/textures/player.png')
 * const serial = HandleSnapshot.serialize(Handle.toSnapshot(handle, world))
 * if (HandleSnapshot.validateSerial(serial)) {
 *   const restored = Handle.fromSnapshot(HandleSnapshot.deserialize(serial), world)
 *   restored?.drop()
 * }
 * ```
 *
 * This example uses a path-backed snapshot. An index-backed snapshot instead
 * stores a scene-local pool index and requires the owning scene asset ID during
 * restoration.
 */
export class HandleSnapshot {

  /**
   * Type ID of the asset family represented by this snapshot.
   *
   * {@linkcode Handle#fromSnapshot} uses this ID to select the asset
   * family when restoring the snapshot through {@linkcode AssetServer}.
   *
   * @type {TypeId}
   */
  type

  /**
   * Asset path or scene-local asset pool index.
   *
   * A string is an asset path resolved through {@linkcode AssetServer}. A number
   * is the source handle's pool index and requires a scene asset ID during
   * restoration; it is not a globally valid {@linkcode AssetId}.
   *
   * @type {number | string}
   */
  asset

  /**
   * Creates an asset handle snapshot from its type ID and locator.
   *
   * The values are stored directly. The constructor does not inspect
   * {@linkcode AssetServer}, validate the type ID, or verify a scene mapping. Use
   * {@linkcode Handle#toSnapshot} to convert a live handle and select a locator
   * from its available path metadata or pool index.
   *
   * @param {TypeId} typeId - Type ID of the asset family.
   * @param {number | string} asset - Asset server path or scene-local pool index.
   */
  constructor(typeId, asset) {
    this.type = typeId
    this.asset = asset
  }

  /**
   * Converts a snapshot to its plain serializable representation.
   *
   * This returns a new object rather than a JSON string. It copies `type` and
   * `asset` as-is; it does not validate them or resolve a live handle. The
   * `asset` field therefore remains either the path or the scene-local numeric
   * index.
   *
   * @param {HandleSnapshot} value - Snapshot to flatten.
   * @returns {HandleSnapshotSerial}
   */
  static serialize(value) {
    return {
      type: value.type,
      asset: value.asset
    }
  }

  /**
   * Rehydrates a snapshot from its plain serializable representation.
   *
   * The optional `out` value is updated and returned, allowing callers to reuse
   * an existing snapshot object. When omitted, a placeholder snapshot is
   * created first and immediately populated. This method copies the fields
   * directly; it does not restore a live handle, validate the type, path, pool
   * index, or scene mapping, or clone the locator. Call
   * {@linkcode HandleSnapshot.validateSerial} before deserializing untrusted data
   * when structural validation is needed.
   *
   * @param {HandleSnapshotSerial} value - Plain snapshot data.
   * @param {HandleSnapshot} [out] - Snapshot object to populate and return.
   * @returns {HandleSnapshot} The populated snapshot.
   */
  static deserialize(value, out = new HandleSnapshot(typeid(Object), '')) {
    out.type = value.type
    out.asset = value.asset

    return out
  }

  /**
   * Checks whether a value has the serializable shape expected by
   * {@linkcode HandleSnapshot.deserialize}.
   *
   * This is a structural check only. It accepts a non-null object with
   * accessible `type` and `asset` properties when `type` is a string and
   * `asset` is a string or number. It does not check registration, path
   * existence, pool bounds, scene mappings, or whether a numeric value is
   * finite. Invalid shapes return `false`; this method does not throw for
   * non-object values.
   *
   * @param {unknown} value - Value to inspect.
   * @returns {value is HandleSnapshotSerial} Whether the outer serial shape is accepted.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('type' in value) || !('asset' in value)) {
      return false
    }

    return typeof value.type === 'string' &&
      (typeof value.asset === 'number' || typeof value.asset === 'string')
  }
}

/**
 * @typedef {Handle<unknown>} UntypedHandle
 *
 * A {@linkcode Handle} whose asset value type is unknown at the call site.
 */

/**
 * @typedef {object} HandleSnapshotSerial
 * Plain serializable form of a {@linkcode HandleSnapshot}.
 *
 * `type` identifies the asset family. A string `asset` is an asset path; a
 * numeric `asset` is a scene-local pool index that requires a scene asset ID
 * during restoration. A numeric locator is not an {@linkcode AssetId} and cannot
 * be restored from the serial data alone.
 *
 * @property {TypeId} type - Type ID of the asset family.
 * @property {number | string} asset - Asset path or scene-local pool index.
 */
