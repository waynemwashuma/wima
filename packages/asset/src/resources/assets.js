/** @import {AssetId} from '../types' */
/** @import {Constructor, TypeId} from '@wimaengine/type' */
/** @import {AssetPlugin} from '../plugins/asset' */
/** @import {AssetServer} from './assetserver' */
/** @import {World} from '@wimaengine/ecs' */

import { unpackFrom64Int, DenseList, IndexAllocator } from '@wimaengine/datastructures'
import { warn } from '@wimaengine/logger'
import { TypeEntry, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { AssetChannel, AssetChannelMessageType, Handle } from '../core'
import { AssetAdded, AssetDropped, AssetEvent, AssetModified } from '../events'

const assetSceneMapId = setTypeId('AssetSceneMap')

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides a typed pool for one family of assets.
 *
 * Each stored asset is identified by an asset ID and held through
 * reference-counted {@linkcode Handle} values. Use the pool to add, replace,
 * reserve, look up, and release assets. Releasing the last handle removes the
 * asset from the pool; additions, replacements, and removals produce
 * {@linkcode AssetAdded}, {@linkcode AssetModified}, and {@linkcode AssetDropped}
 * events.
 *
 * Create one pool for each asset constructor. Keep a handle while an asset is
 * in use and release it when that reference is no longer needed. A pool can be
 * exposed as a world resource when application code needs shared access.
 *
 * @example
 * ```ts
 * import { Assets } from '@wimaengine/asset'
 *
 * class Texture {}
 * const textures = new Assets(Texture)
 * const handle = textures.add(new Texture())
 * const assetId = handle.id()
 * const retained = textures.upgrade(assetId)
 * const texture = textures.getByAssetId(assetId)
 *
 * handle.drop()
 * retained?.drop()
 * textures.update()
 * const events = textures.flushEvents()
 * ```
 *
 * @template T
 * @category resource
 */
export class Assets {

  /**
   * Runtime constructor identifying the asset family in this pool.
   *
   * The constructor identifies the asset family used by typed
   * {@linkcode Handle} values and by {@linkcode AssetPlugin}.
   *
   * @type {Constructor<T>}
   */
  type

  /**
   * @private
   * @type {DenseList<AssetEntry<T>>}
   */
  assets = new DenseList(new IndexAllocator())

  /**
   * @private
   * @type {Map<string,Handle<T>>}
   */
  uuids = new Map()

  /**
   * @private
   * @type {AssetEvent<T>[]}
   */
  events = []

  /**
   * @readonly
   * @type {AssetChannel<T>}
   */
  channel = new AssetChannel()

  /**
   * Creates a typed asset pool for values identified by `type`.
   *
   * The supplied constructor is retained as the asset family's type identity
   * for handles and resource access.
   *
   * @param {Constructor<T>} type - Constructor for the asset values in this container.
   */
  constructor(type) {
    this.type = type
  }

  /**
   * Inserts an asset into this typed pool and returns its owning handle.
   *
   * The value is accepted as supplied; the pool does not perform a runtime
   * constructor check. The returned {@linkcode Handle} owns the first reference,
   * and an {@linkcode AssetAdded} event is pending for
   * {@linkcode Assets#flushEvents}. Release the handle with {@linkcode Handle#drop}
   * when it is no longer needed; {@linkcode Assets#update} applies that queued
   * release.
   *
   * @example
   * ```js
   * import { AssetAdded, Assets } from '@wimaengine/asset'
   *
   * class Texture {
   *   constructor(source) {
   *     this.source = source
   *   }
   * }
   *
   * const textures = new Assets(Texture)
   * const handle = textures.add(new Texture('/textures/player.png'))
   * const [event] = textures.flushEvents()
   *
   * console.log(textures.get(handle) instanceof Texture) // true
   * console.log(event instanceof AssetAdded) // true
   * console.log(event.type === Texture) // true
   * console.log(event.id === handle.id()) // true
   *
   * handle.drop()
   * textures.update()
   * ```
   *
   * @param {T} asset - Asset value to store in this pool.
   * @returns {Handle<T>} A handle owning the first reference to the new slot.
   */
  add(asset) {
    const handle = this.reserve()
    const entry = this.getEntry(handle)

    entry.asset = asset
    this.events.push(new AssetAdded(this.type, handle.id()))

    return handle
  }

  /**
   * Fills or replaces the asset held by a live handle.
   *
   * A handle from {@linkcode Assets#reserve} initially addresses an empty slot,
   * so its first fill queues {@linkcode AssetAdded}. If the previous value is
   * truthy, replacement queues {@linkcode AssetModified}; otherwise the pool
   * queues {@linkcode AssetAdded}. Each event contains the handle's asset ID,
   * not either asset value.
   *
   * A stale handle is ignored when its index or generation no longer matches
   * this pool, so no asset or event changes. For a live handle, this method
   * preserves the slot's reference count and generation. It always returns
   * `undefined`.
   *
   * @example
   * ```js
   * import { AssetAdded, AssetModified, Assets } from '@wimaengine/asset'
   *
   * class Texture {
   *   constructor(source) {
   *     this.source = source
   *   }
   * }
   *
   * const textures = new Assets(Texture)
   * const handle = textures.reserve()
   * console.log(textures.flushEvents().length) // 0: reserve queues nothing
   *
   * textures.set(handle, new Texture('first'))
   * const [added] = textures.flushEvents()
   * textures.set(handle, new Texture('second'))
   * const [modified] = textures.flushEvents()
   *
   * console.log(added instanceof AssetAdded) // true
   * console.log(modified instanceof AssetModified) // true
   * console.log(modified.id === handle.id()) // true
   * console.log(textures.get(handle).source) // 'second'
   *
   * handle.drop()
   * textures.update()
   * textures.flushEvents() // Clear the AssetDropped event.
   * textures.set(handle, new Texture('stale'))
   * console.log(textures.get(handle)) // undefined
   * console.log(textures.flushEvents().length) // 0: stale set is ignored
   * ```
   *
   * @param {Handle<T>} handle - Handle whose live slot should be filled or replaced.
   * @param {T} asset - Asset value to store in the slot.
   * @returns {void} Always returns `undefined`, including for a stale handle.
   *
   */
  set(handle, asset) {
    const entry = this.getEntry(handle)

    if (!entry) return

    const oldAsset = entry.asset

    entry.asset = asset

    if (oldAsset) {
      this.events.push(new AssetModified(this.type, handle.id()))
    } else {
      this.events.push(new AssetAdded(this.type, handle.id()))
    }
  }

  /**
   * Replaces the asset identified by an asset ID.
   *
   * If the slot currently contains a truthy value, the pool queues
   * {@linkcode AssetModified}; otherwise it queues {@linkcode AssetAdded}. A stale
   * ID is ignored, leaves the pool unchanged, and does not allocate a
   * replacement slot. The method returns `undefined`.
   *
   * @param {AssetId} assetId - Packed ID identifying the asset slot.
   * @param {T} asset - Asset value to store in the slot.
   * @returns {void} Always returns `undefined`.
   */
  setUsingAssetId(assetId, asset) {
    const entry = this.getEntryByAssetId(assetId)

    if (!entry) return

    const oldAsset = entry.asset

    entry.asset = asset

    if (oldAsset) {
      this.events.push(new AssetModified(this.type, assetId))
    } else {
      this.events.push(new AssetAdded(this.type, assetId))
    }
  }

  /**
   * Adds or replaces an asset associated with a UUID.
   *
   * If the UUID is already mapped, its stored handle is used for the
   * replacement and a cloned handle is returned. A live mapping queues the
   * same lifecycle event as {@linkcode Assets#set}; a stale mapping leaves the
   * pool unchanged but still returns a clone of the stale handle. Otherwise
   * the asset is added and the UUID keeps its own cloned handle. Release the
   * returned handle when it is no longer needed. UUID associations are not
   * removed automatically when an asset is dropped.
   *
   * @param {string} uuid
   * @param {T} asset
   * @returns {Handle<T>}
   */
  setWithUUID(uuid, asset) {
    const handle = this.uuids.get(uuid)

    if (handle) {
      this.set(handle, asset)

      return handle.clone()
    }

    const newHandle = this.add(asset)

    this.uuids.set(uuid, newHandle.clone())

    return newHandle
  }

  /**
   * Returns entry metadata for a handle whose slot identity is still valid.
   *
   * A reserved slot returns an entry even when its asset is `undefined`.
   * Returns `undefined` when the handle is stale because its slot identity no
   * longer matches the pool.
   *
   * @param {Handle<T>} handle
   * @returns {AssetEntry<T> | undefined}
   */
  getEntry(handle) {
    const { index, generation } = handle

    return this.getEntryInternal(index, generation)
  }

  /**
   * Returns entry metadata for a packed asset ID while its slot identity is
   * still valid.
   *
   * Returns `undefined` when the ID is stale, even if its former index now
   * stores another asset. A reserved slot still returns its entry while its
   * asset is `undefined`.
   *
   * @param {AssetId} assetId
   * @returns {AssetEntry<T> | undefined}
   */
  getEntryByAssetId(assetId) {
    const [index, generation] = unpackFrom64Int(assetId)

    return this.getEntryInternal(index, generation)
  }

  /**
   * @private
   * @param {number} index
   * @param {number} generation
   */
  getEntryInternal(index, generation) {
    const entry = this.assets.get(index)

    if (!entry) return undefined

    if (entry.generation !== generation) return undefined

    return entry
  }

  /**
   * Returns the asset addressed by a handle in this pool.
   *
   * Returns `undefined` when the handle is stale or its slot is reserved or
   * empty.
   *
   * @example
   * ```js
   * import { Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const textures = new Assets(Texture)
   * const handle = textures.add(new Texture())
   *
   * console.log(textures.get(handle) instanceof Texture) // true
   *
   * handle.drop()
   * textures.update()
   * console.log(textures.get(handle)) // undefined: the handle is stale
   * ```
   *
   * @param {Handle<T>} handle - Handle identifying the asset slot.
   * @returns {T | undefined} The asset, or `undefined` for a stale or empty slot.
   */
  get(handle) {
    const entry = this.getEntry(handle)

    if (!entry) return undefined

    return entry.asset
  }

  /**
   * Returns the asset associated with a UUID.
   *
   * Returns `undefined` when the UUID has not been registered or its entry is
   * no longer live.
   *
   * @param {string} uuid
   * @returns {T | undefined}
   */
  getByUUID(uuid) {
    const handle = this.getHandleByUUID(uuid)

    if (!handle) return undefined

    return this.get(handle)
  }

  /**
   * Returns the asset identified by a packed asset ID.
   *
   * Returns `undefined` when the ID is stale or its slot is reserved or empty.
   *
   * @example
   * ```js
   * import { Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const textures = new Assets(Texture)
   * const handle = textures.add(new Texture())
   * const assetId = handle.id()
   *
   * console.log(textures.getByAssetId(assetId) instanceof Texture) // true
   *
   * handle.drop()
   * textures.update()
   * console.log(textures.getByAssetId(assetId)) // undefined: the ID is stale
   * ```
   *
   * @param {AssetId} id - Packed ID identifying the asset slot.
   * @returns {T | undefined} The asset, or `undefined` for a stale or empty slot.
   */
  getByAssetId(id) {
    const entry = this.getEntryByAssetId(id)

    if (!entry) return undefined

    return entry.asset
  }

  /**
   * Returns a cloned handle for a UUID association.
   *
   * The returned {@linkcode Handle} is a separate reference whose acquisition is
   * applied by {@linkcode Assets#update}; release it with {@linkcode Handle#drop}
   * when it is no longer needed. Returns `undefined` when the UUID is not
   * mapped. If a mapping exists but its slot is empty or stale, this method
   * still returns a clone with that identity; use {@linkcode Assets#get} to check
   * the asset value.
   *
   * @example
   * ```js
   * import { Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const textures = new Assets(Texture)
   * const original = textures.setWithUUID('player', new Texture())
   * const lookup = textures.getHandleByUUID('player')
   *
   * console.log(lookup !== undefined) // true
   * console.log(lookup !== original) // true: the lookup is a clone
   * lookup?.drop()
   * original.drop()
   * textures.update()
   * ```
   *
   * @param {string} uuid - UUID associated with an asset.
   * @returns {Handle<T> | undefined} A cloned handle, or `undefined` when the
   * UUID is not mapped.
   */
  getHandleByUUID(uuid) {
    return this.uuids.get(uuid)?.clone()
  }

  /**
   * Returns the lifecycle events queued since the previous flush.
   *
   * A non-empty batch is detached before it is returned, so later mutations
   * are placed in a new batch. An empty flush keeps the current empty array.
   * Events may be {@linkcode AssetAdded}, {@linkcode AssetModified}, or
   * {@linkcode AssetDropped}.
   *
   * @example
   * ```js
   * import { AssetAdded, AssetModified, Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const textures = new Assets(Texture)
   * const empty = textures.flushEvents()
   * const handle = textures.add(new Texture())
   * console.log(empty.length) // 1: an empty flush does not rotate the buffer
   *
   * const added = textures.flushEvents()
   * textures.set(handle, new Texture())
   * const modified = textures.flushEvents()
   * console.log(added[0] instanceof AssetAdded) // true
   * console.log(modified[0] instanceof AssetModified) // true
   * console.log(added !== modified) // true
   * ```
   *
   * @returns {Readonly<AssetEvent<T>[]>} The pending event batch.
   */
  flushEvents() {
    const { events } = this

    if (events.length) this.events = []

    return events
  }

  /**
   * Releases one reference held by a handle immediately.
   *
   * For a valid handle, this method releases one reference synchronously. If
   * other references remain, the asset stays in the pool and no event is
   * queued. When the count reaches zero, the asset is cleared, its index is
   * recycled, and an {@linkcode AssetDropped} event is queued immediately. A
   * stale handle is ignored.
   *
   * Unlike {@linkcode Handle#drop}, this method does not mark the handle as
   * dropped or defer the release. Release each reference exactly once; calling
   * this method again on the same handle releases another reference while its
   * slot identity still matches.
   *
   * @example
   * ```js
   * import { AssetDropped, Assets } from '@wimaengine/asset'
   *
   * class Texture {
   *   constructor(name) {
   *     this.name = name
   *   }
   * }
   *
   * const textures = new Assets(Texture)
   * const owner = textures.add(new Texture('player'))
   * const assetId = owner.id()
   * textures.flushEvents() // Clear the AssetAdded event.
   * const retained = textures.upgrade(assetId)
   *
   * textures.drop(owner)
   * console.log(textures.getByAssetId(assetId).name) // 'player'
   * console.log(textures.flushEvents().length) // 0: one reference remains
   *
   * textures.drop(retained)
   * const [event] = textures.flushEvents()
   * console.log(event instanceof AssetDropped) // true
   * console.log(event.id === assetId) // true
   * console.log(textures.getByAssetId(assetId)) // undefined
   * ```
   *
   * @param {Handle<T>} handle - Handle whose reference should be released.
   * @returns {void} Always returns `undefined`.
   */
  drop(handle) {
    const entry = this.getEntry(handle)

    if (!entry) return

    entry.refCount -= 1

    if (entry.refCount <= 0) {
      entry.asset = undefined
      this.assets.recycle(handle.index)
      this.events.push(new AssetDropped(this.type, handle.id()))
    }
  }

  /**
   * Retains the entry identified by an asset ID and returns a new handle for
   * that reference.
   *
   * The reference count is incremented immediately; no queued operation is
   * needed. The returned {@linkcode Handle} has the same type, index, and
   * generation as the ID and owns one additional reference. Returns
   * `undefined` when the entry is missing or its generation does not match the
   * ID. A reserved entry is valid even while its asset is `undefined`, so an
   * ID for that slot can also be upgraded.
   *
   * Recycling clears an entry's asset but does not change its generation until
   * the index is reserved again. Therefore an ID can still resolve after
   * {@linkcode Assets#drop} has removed its asset and before that index is reused;
   * the resulting handle then refers to an empty entry. When the index is
   * reused, the incremented generation makes the old ID stale. Release the
   * returned handle with {@linkcode Handle#drop} when it is no longer needed.
   *
   * @example
   * ```js
   * import { Assets } from '@wimaengine/asset'
   *
   * class Texture {
   *   constructor(name) {
   *     this.name = name
   *   }
   * }
   *
   * const textures = new Assets(Texture)
   * const owner = textures.add(new Texture('player'))
   * const retained = textures.upgrade(owner.id())
   * if (!retained) throw new Error('The asset ID is stale')
   *
   * owner.drop()
   * textures.update() // The retained reference keeps the asset alive.
   * console.log(textures.get(retained).name) // 'player'
   *
   * retained.drop()
   * textures.update()
   * console.log(textures.get(retained)) // undefined
   * ```
   *
   * @param {AssetId} assetId - Packed ID of the entry to retain.
   * @returns {Handle<T> | undefined} A handle for the retained entry, or
   * `undefined` when the ID is stale.
   */
  upgrade(assetId) {
    const [index, generation] = unpackFrom64Int(assetId)
    const entry = this.getEntryInternal(index, generation)

    if (!entry) {
      return
    }

    entry.refCount += 1

    return new Handle(this.channel, this.type, index, generation)
  }

  /**
   * Reserves a slot for an asset that will be filled later.
   *
   * The returned {@linkcode Handle} owns the first reference even before the slot
   * contains an asset. The slot's asset is initially `undefined`, its
   * generation is incremented, and no lifecycle event is queued. Fill the slot
   * with {@linkcode Assets#set} or {@linkcode Assets#setUsingAssetId}; that
   * operation queues the first asset lifecycle event.
   *
   * If a slot index is reused, its incremented generation makes older handles
   * and asset IDs for that index stale. The reservation does not return an
   * asset value.
   *
   * @example
   * ```js
   * import { Assets } from '@wimaengine/asset'
   *
   * class Texture {
   *   constructor(name) {
   *     this.name = name
   *   }
   * }
   *
   * const textures = new Assets(Texture)
   * const handle = textures.reserve()
   * console.log(textures.get(handle)) // undefined: the slot is empty
   * console.log(textures.flushEvents().length) // 0: reserve queues no event
   *
   * textures.set(handle, new Texture('player'))
   * console.log(textures.get(handle).name) // 'player'
   *
   * handle.drop()
   * textures.update()
   * ```
   *
   * @returns {Handle<T>} Handle owning the first reference to the reserved
   * slot.
   */
  reserve() {
    const index = this.assets.reserve()
    const entry = this.assets.get(index)

    if (entry) {
      entry.generation += 1
      entry.refCount = 1

      return new Handle(this.channel, this.type, index, entry.generation)
    }

    const newEntry = new AssetEntry(undefined)

    newEntry.generation += 1
    newEntry.refCount = 1
    this.assets.set(index, newEntry)

    return new Handle(this.channel, this.type, index, newEntry.generation)
  }

  /**
   * Returns the pool's entries in slot-index order.
   *
   * Each position corresponds to the slot index used by a {@linkcode Handle}.
   * Released slots remain represented by an {@linkcode AssetEntry} with an
   * `undefined` asset, and a later reservation reuses that position with a new
   * generation. Use {@linkcode Assets#get} or {@linkcode Assets#getByAssetId} for
   * ordinary asset access. Treat the returned array as read-only.
   *
   * @returns {ReadonlyArray<AssetEntry<T>>} Entries at their pool indexes,
   * including recycled slots.
   */
  values() {
    return this.assets.values()
  }

  /**
   * Creates a snapshot of this pool's index-aligned asset values.
   *
   * The world must provide a {@linkcode TypeRegistry}. When the registry has an
   * entry for this asset constructor, each populated value is passed to that
   * entry's `serialize` hook. If the entry is missing, the original asset
   * value is kept as-is; if the entry exists without that hook, the populated
   * slot becomes `undefined`. Empty or reserved slots remain `undefined`,
   * preserving their indexes for restoration. The returned
   * {@linkcode AssetsSnapshot} stores the asset constructor's type ID.
   *
   * @example
   * ```js
   * import { Assets } from '@wimaengine/asset'
   * import { OpaqueInfo, TypeRegistry } from '@wimaengine/reflect'
   * import { World } from '@wimaengine/ecs'
   *
   * class Texture {
   *   constructor(source) {
   *     this.source = source
   *   }
   * }
   *
   * const registry = new TypeRegistry()
   * registry.register(Texture, OpaqueInfo.default())
   * registry.get(Texture).setMethod(function serialize(texture) {
   *   return { source: texture.source }
   * })
   *
   * const world = new World()
   * world.setResource(registry)
   * const textures = new Assets(Texture)
   * textures.add(new Texture('player.png'))
   * const reserved = textures.reserve()
   * const snapshot = Assets.toSnapshot(textures, world)
   *
   * console.log(snapshot.assets[0]) // { source: 'player.png' }
   * console.log(snapshot.assets[reserved.index]) // undefined
   * ```
   *
   * @param {Assets<unknown>} assets - Live asset pool being snapshotted.
   * @param {World} world - World containing the {@linkcode TypeRegistry} used for
   * optional asset serialization.
   * @returns {AssetsSnapshot<unknown>}
   */
  static toSnapshot(assets, world) {
    const typeRegistry = world.getResource(TypeRegistry)
    const typeEntry = typeRegistry.get(assets.type)
    const values = assets.assets.values().map((entry) => {
      if (
        typeEntry &&
        entry.asset !== undefined
      ) {
        return typeEntry.call('serialize', [entry.asset])
      }

      return entry.asset
    })

    return new AssetsSnapshot(typeid(assets.type), values)
  }

  /**
   * Restores an asset pool from a snapshot value.
   *
   * @param {AssetsSnapshot<unknown>} snapshot
   * @param {World} world
   * @param {AssetId} sceneAssetId
   * @returns {Assets<unknown> | undefined}
   */
  static fromSnapshot(snapshot, world, sceneAssetId) {

    /** @type {{ clear: Function, set: Function }} */
    const sceneMap = world.getResourceByTypeId(assetSceneMapId)
    const typeEntry = world.getResource(TypeRegistry).getByTypeId(snapshot.type)

    if (!typeEntry?.constructorFn) {
      return undefined
    }

    const assets = new Assets(typeEntry.constructorFn)

    patchInternal(snapshot, sceneMap, assets, sceneAssetId, typeEntry)

    return assets
  }

  /**
   * Applies queued reference operations from asset handles.
   *
   * {@linkcode Handle#clone} and {@linkcode Handle#drop} queue operations on the
   * shared {@linkcode AssetChannel}. This method applies the pending batch in
   * queue order. An acquisition increments the matching entry's reference
   * count; a release decrements it. An operation for a stale asset ID is
   * ignored. A release that removes the last reference clears and recycles the
   * slot and queues an {@linkcode AssetDropped} event.
   *
   * @example
   * ```js
   * import { AssetDropped, Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const textures = new Assets(Texture)
   * const owner = textures.add(new Texture())
   * textures.flushEvents() // Clear the AssetAdded event.
   *
   * const retained = owner.clone()
   * owner.drop()
   * textures.update() // Applies acquire, then release; the asset remains live.
   * console.log(textures.get(retained) instanceof Texture) // true
   *
   * retained.drop()
   * textures.update() // Applies the final release.
   * const [dropped] = textures.flushEvents()
   * console.log(dropped instanceof AssetDropped) // true
   * ```
   *
   * {@linkcode AssetPlugin} normally runs this operation during updates. Call it
   * directly when managing a pool without {@linkcode AssetPlugin}.
   *
   * @returns {void}
   */
  update() {
    const messages = this.channel.flush()

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]

      if (message.type === AssetChannelMessageType.Acquire) {
        this.acquire(message.assetId)
      } else if (message.type === AssetChannelMessageType.Release) {
        this.release(message.assetId)
      }
    }
  }

  /**
   * @private
   * @param {AssetId} assetId
   */
  acquire(assetId) {
    const entry = this.getEntryByAssetId(assetId)

    if (!entry) return

    entry.refCount += 1
  }

  /**
   * @private
   * @param {AssetId} assetId
   */
  release(assetId) {
    const entry = this.getEntryByAssetId(assetId)

    if (!entry) return

    entry.refCount -= 1

    if (entry.refCount <= 0) {
      const [index] = unpackFrom64Int(assetId)

      entry.asset = undefined
      this.assets.recycle(index)
      this.events.push(new AssetDropped(this.type, assetId))
    }
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * Represents one asset slot in an {@linkcode Assets} pool.
 *
 * Each entry holds one optional asset and remains represented when its slot is
 * reserved or empty, allowing the pool to preserve slot identity for
 * {@linkcode Handle} values.
 *
 * Applications normally access assets through {@linkcode Assets} rather than
 * constructing entries directly.
 *
 * @template T
 */
export class AssetEntry {

  /**
   * The asset currently stored in this slot, or `undefined` while the slot is
   * reserved or empty.
   *
   * @type {T | undefined}
   */
  asset

  /**
   * Number of references held for the asset in this slot, including the
   * reference owned by a reserved handle before its asset is filled.
   *
   * @type {number}
   */
  refCount = 0

  /**
   * Slot generation used to distinguish the current entry from stale handles
   * after the slot is recycled.
   *
   * @type {number}
   */
  generation = 0

  /**
   * Creates a slot entry for an optional asset.
   *
   * `Assets` creates entries as it reserves storage for a typed asset family.
   * The reference count and generation start at zero and are updated by the
   * container as the slot is used.
   *
   * @param {T | undefined} asset - Asset to store in the slot, if one is available.
   */
  constructor(asset) {
    this.asset = asset
  }
}

/**
 * Serializable representation of one typed {@linkcode Assets} pool.
 *
 * It preserves the asset type ID and index-aligned slots so a pool can be
 * serialized and restored with the same layout. Restored asset values use the
 * world's {@linkcode TypeRegistry}; scene restoration records handles in
 * the asset scene map for scene-local references.
 *
 * The asset type must be registered with a runtime constructor before
 * restoration. Populated serialized slots also need a `deserialize` method in
 * their {@linkcode TypeRegistry} entry.
 *
 * @example
 * ```js
 * import { Assets, AssetsSnapshot } from '@wimaengine/asset'
 * import { World } from '@wimaengine/ecs'
 * import { TypeRegistry } from '@wimaengine/reflect'
 *
 * const world = new World()
 * world.setResource(new TypeRegistry())
 *
 * const strings = new Assets(String)
 * strings.add('player')
 * const snapshot = Assets.toSnapshot(strings, world)
 * const serial = AssetsSnapshot.serialize(snapshot)
 *
 * if (AssetsSnapshot.validateSerial(serial)) {
 *   const restoredSnapshot = AssetsSnapshot.deserialize(serial)
 *   console.log(restoredSnapshot.assets[0]) // 'player'
 * }
 * ```
 *
 * @template T
 */
export class AssetsSnapshot {

  /**
   * Type ID of the asset constructor represented by this snapshot.
   *
   * {@linkcode Assets#fromSnapshot} and {@linkcode AssetsSnapshot.patch} use
   * this ID to find the constructor and reflection methods in the world's
   * {@linkcode TypeRegistry}. This is the asset type ID, not the generic snapshot
   * ID returned by {@linkcode AssetsSnapshot.typeId}.
   *
   * @type {TypeId}
   */
  type

  /**
   * Dense, index-aligned slots copied from the source {@linkcode Assets} pool.
   *
   * An `undefined` slot represents reserved or empty storage and is preserved
   * so restored handles keep their original indexes. Populated slots contain
   * the asset value or its serialized form, depending on whether the snapshot
   * was produced by {@linkcode Assets#toSnapshot} or supplied directly.
   *
   * @type {(T | undefined)[]}
   */
  assets

  /**
   * Creates a snapshot for an asset family.
   *
   * The supplied slot array is stored as provided; this constructor does not
   * clone or serialize it. Use {@linkcode Assets#toSnapshot} when capturing a
   * live pool so registered asset serialization methods are applied.
   *
   * @param {TypeId} type
   * @param {(T | undefined)[]} assets - Dense asset slots, including empty slots.
   */
  constructor(type, assets) {
    this.type = type
    this.assets = assets
  }

  /**
   * Builds the reflection type ID for one asset family's snapshot.
   *
   * The result is `AssetsSnapshot<assetType>`. Use this ID when associating
   * snapshot metadata and hooks with {@linkcode TypeRegistry}; this helper only
   * derives the ID and does not register anything.
   *
   * @example
   * ```js
   * import { AssetsSnapshot } from '@wimaengine/asset'
   * import { typeid } from '@wimaengine/type'
   *
   * class Texture {}
   * const snapshotType = AssetsSnapshot.typeId(typeid(Texture))
   *
   * console.log(snapshotType) // 'AssetsSnapshot<Texture>'
   * ```
   *
   * @param {TypeId} assetType - Type ID of the asset constructor.
   * @returns {TypeId} The type ID used for the asset family's snapshot entry.
   */
  static typeId(assetType) {
    return setTypeId(`AssetsSnapshot<${assetType}>`)
  }

  /**
   * Patches an existing typed {@linkcode Assets} pool from a scene snapshot.
   *
   * The method resolves the asset constructor through the world's
   * {@linkcode TypeRegistry}. If the type entry is missing or has no runtime
   * constructor, it returns `false` without clearing the scene map or changing
   * the asset pool. Otherwise the world must already contain the matching typed
   * {@linkcode Assets} resource and an asset scene map resource.
   *
   * The scene-map entries for `sceneAssetId` and this asset type are cleared,
   * then each snapshot index is restored by reserving an `undefined` slot or
   * adding a truthy result from the registered `deserialize` hook. The existing
   * `Assets` pool is not cleared; the method adds or reserves through that pool
   * and maps the snapshot indexes to the resulting handles. Missing or falsey
   * deserialization results are skipped with a warning. It returns `true` once
   * this patch process has run, even when some slots were skipped.
   *
   * The scene restoration flow invokes this method when a matching resource
   * already exists.
   *
   * @param {AssetsSnapshot<unknown>} snapshot
   * @param {World} world
   * @param {AssetId} sceneAssetId
   * @returns {boolean} Whether the snapshot type was registered and patched.
   */
  static patch(snapshot, world, sceneAssetId) {
    const typeEntry = world.getResource(TypeRegistry).getByTypeId(snapshot.type)

    if (!typeEntry || !typeEntry.constructorFn) {
      return false
    }

    const assets = world.getResourceByTypeId(typeidGeneric(Assets, [typeEntry.constructorFn]))

    /** @type {{ clear: Function, set: Function }} */
    const sceneMap = world.getResourceByTypeId(assetSceneMapId)

    sceneMap.clear(sceneAssetId, snapshot.type)
    patchInternal(snapshot, sceneMap, assets, sceneAssetId, typeEntry)

    return true
  }

  /**
   * Converts a snapshot to its plain serializable shape.
   *
   * The returned object contains the snapshot's `type` and `assets` values as
   * they are currently stored. It creates a new outer object but preserves the
   * exact `assets` array reference; neither the array nor its elements are
   * cloned. It does not invoke {@linkcode TypeRegistry}; call
   * {@linkcode Assets#toSnapshot} before this method when live asset values need
   * type-specific serialization.
   *
   * @example
   * ```js
   * import { AssetsSnapshot } from '@wimaengine/asset'
   * import { typeid } from '@wimaengine/type'
   *
   * class Texture {}
   * const slots = [undefined, { source: 'player.png' }]
   * const snapshot = new AssetsSnapshot(typeid(Texture), slots)
   * const serial = AssetsSnapshot.serialize(snapshot)
   *
   * console.log(serial.assets === slots) // true
   * ```
   *
   * @param {AssetsSnapshot<unknown>} value
   * @returns {AssetsSnapshotSerial}
   */
  static serialize(value) {
    return {
      type: value.type,
      assets: value.assets
    }
  }

  /**
   * Copies a serial snapshot into a new or supplied {@linkcode AssetsSnapshot}.
   *
   * This method assigns `type` and `assets` directly from `value` and returns
   * the output object. When `out` is supplied, that same snapshot is populated;
   * otherwise a new snapshot is created. It does not call
   * {@linkcode AssetsSnapshot.validateSerial}, clone the array, or deserialize
   * individual asset values. The default snapshot's initial `Object` type and
   * empty array are replaced immediately by the supplied fields.
   *
   * @param {AssetsSnapshotSerial} value
   * @param {AssetsSnapshot<unknown>} [out]
   * @returns {AssetsSnapshot<unknown>}
   */
  static deserialize(value, out = new AssetsSnapshot(typeid(Object), [])) {
    out.type = value.type
    out.assets = value.assets

    return out
  }

  /**
   * Performs the shallow shape check accepted as an assets snapshot serial.
   *
   * The check accepts a truthy value whose `typeof` is `object`, with `type`
   * and `assets` properties whose values are respectively a string and an
   * array. Property membership includes inherited properties, and arrays are
   * not rejected if they have the required properties. It does not inspect
   * array elements or confirm that the type is registered; restoration still
   * depends on the world's {@linkcode TypeRegistry}.
   *
   * @example
   * ```js
   * import { AssetsSnapshot } from '@wimaengine/asset'
   *
   * const serial = {
   *   type: 'Texture',
   *   assets: [{ source: 'player.png' }]
   * }
   *
   * console.log(AssetsSnapshot.validateSerial(serial)) // true
   * console.log(AssetsSnapshot.validateSerial({
   *   type: 'Texture',
   *   assets: 'not an array'
   * })) // false
   * ```
   *
   * @param {unknown} value - Value to check.
   * @returns {value is AssetsSnapshotSerial} Whether the outer shape is valid.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('type' in value) || !('assets' in value)) {
      return false
    }

    return typeof value.type === 'string' && Array.isArray(value.assets)
  }
}

/**
 * @template T
 * @param {AssetsSnapshot<T>} snapshot
 * @param {{ clear: Function, set: Function }} sceneMap
 * @param {Assets<T>} assetContainer
 * @param {AssetId} sceneAssetId
 * @param {TypeEntry} typeEntry
 */
function patchInternal(snapshot, sceneMap, assetContainer, sceneAssetId, typeEntry) {
  sceneMap.clear(sceneAssetId, snapshot.type)

  for (let i = 0; i < snapshot.assets.length; i++) {
    const asset = snapshot.assets[i]

    if (asset === undefined) {
      sceneMap.set(sceneAssetId, snapshot.type, i, assetContainer.reserve())
    } else {

      const actualAsset = /** @type {T | undefined} */(typeEntry.call('deserialize', [asset]))

      if (actualAsset) {
        sceneMap.set(sceneAssetId, snapshot.type, i, assetContainer.add(actualAsset))
      } else {
        warn(`No method to deserialize the asset type \`${snapshot.type}\``)
      }
    }
  }
}

/**
 * @typedef AssetsSnapshotSerial
 * @property {TypeId} type
 * @property {unknown[]} assets
 */
