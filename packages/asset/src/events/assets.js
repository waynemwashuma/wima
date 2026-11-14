/** @import { AssetId } from '../types' */
/** @import { Handle } from '../core' */
/** @import { Constructor } from '@wimaengine/type' */
/** @import { Assets } from '../resources' */

/**
 * Defines the common base for typed asset-lifecycle events from an
 * {@linkcode Assets} pool.
 *
 * The pool creates one of the concrete subtypes when an asset becomes
 * available, is replaced, or is removed. Use the subtype to identify which
 * lifecycle transition occurred.
 *
 * Use {@linkcode AssetAdded}, {@linkcode AssetModified}, and {@linkcode AssetDropped}
 * when handling lifecycle events rather than constructing {@linkcode AssetEvent}
 * directly.
 *
 * @example
 * ```js
 * import { AssetAdded, Assets } from '@wimaengine/asset'
 *
 * class Texture {}
 * const textures = new Assets(Texture)
 * const handle = textures.add(new Texture())
 * const [event] = textures.flushEvents()
 *
 * console.log(event instanceof AssetAdded) // true
 * console.log(event.type === Texture) // true
 * console.log(event.id === handle.id()) // true
 * ```
 *
 * @abstract
 * @template T
 */
export class AssetEvent {

  /**
   * Packed asset ID associated with this lifecycle event.
   *
   * The ID identifies a slot and its generation in the typed {@linkcode Assets}
   * pool. It is not the asset object and may become stale after the slot is
   * recycled.
   *
   * @type {AssetId}
   */
  id

  /**
   * Constructor identifying the asset family for this event.
   *
   * This is the same constructor used to create the event's typed
   * {@linkcode Assets} pool.
   *
   * @type {Constructor<T>}
   */
  type

  /**
   * Creates the common payload for a typed asset-lifecycle event.
   *
   * The `handle` parameter is the packed asset ID stored in
   * {@linkcode AssetEvent#id}; concrete lifecycle subtypes inherit this
   * constructor.
   *
   * @param {Constructor<T>} type - Constructor of the affected asset family.
   * @param {AssetId} handle - Packed ID of the affected asset entry.
   */
  constructor(type, handle) {
    this.id = handle
    this.type = type
  }
}

/**
 * Identifies an asset becoming available in a typed {@linkcode Assets} pool.
 *
 * Use this subtype to distinguish an initial asset availability from
 * replacement or removal while processing the pool's lifecycle events. It
 * inherits the shared asset identity from {@linkcode AssetEvent}.
 *
 * {@linkcode Assets#add} queues this subtype for a newly inserted asset.
 * {@linkcode Assets#set} and {@linkcode Assets#setUsingAssetId} queue it when they
 * fill an entry that does not already contain an asset. Read the queued event
 * with {@linkcode Assets#flushEvents}.
 *
 * @example
 * ```js
 * import { AssetAdded, Assets } from '@wimaengine/asset'
 *
 * class Texture {}
 * const textures = new Assets(Texture)
 * textures.add(new Texture())
 * const [event] = textures.flushEvents()
 *
 * console.log(event instanceof AssetAdded) // true
 * console.log(event.type === Texture) // true
 * ```
 *
 * @inheritdoc
 * @template T
 * @augments AssetEvent<T>
 */
export class AssetAdded extends AssetEvent { }

/**
 * Identifies replacement of an existing asset in a typed {@linkcode Assets} pool.
 *
 * Use this subtype to distinguish replacement from initial availability or
 * removal while processing the pool's lifecycle events. It inherits the
 * shared asset identity from {@linkcode AssetEvent} and does not contain either
 * asset value.
 *
 * {@linkcode Assets#set} and {@linkcode Assets#setUsingAssetId} queue this subtype
 * when they replace an asset already held by the addressed entry. Read the
 * queued event with {@linkcode Assets#flushEvents}.
 *
 * @example
 * ```js
 * import { AssetModified, Assets } from '@wimaengine/asset'
 *
 * class Texture {}
 * const textures = new Assets(Texture)
 * const handle = textures.add(new Texture())
 * textures.flushEvents()
 * textures.set(handle, new Texture())
 * const [event] = textures.flushEvents()
 *
 * console.log(event instanceof AssetModified) // true
 * console.log(event.id === handle.id()) // true
 * ```
 *
 * @inheritdoc
 * @template T
 * @augments AssetEvent<T>
 */
export class AssetModified extends AssetEvent { }

/**
 * Identifies removal of an asset after its final reference is released.
 *
 * Use this subtype to distinguish removal from initial availability or
 * replacement while processing the pool's lifecycle events. It inherits the
 * shared asset identity from {@linkcode AssetEvent} and does not contain the
 * removed asset value.
 *
 * {@linkcode Assets#drop} queues this subtype when an immediate release removes
 * the entry. A release through {@linkcode Handle#drop} is applied by
 * {@linkcode Assets#update}, which queues the event when it removes the final
 * reference. Read the queued event with {@linkcode Assets#flushEvents}.
 *
 * @example
 * ```js
 * import { AssetDropped, Assets } from '@wimaengine/asset'
 *
 * class Texture {}
 * const textures = new Assets(Texture)
 * const handle = textures.add(new Texture())
 * textures.flushEvents()
 * handle.drop()
 * textures.update()
 * const [event] = textures.flushEvents()
 *
 * console.log(event instanceof AssetDropped) // true
 * console.log(event.id === handle.id()) // true
 * ```
 *
 * @inheritdoc
 * @template T
 * @augments AssetEvent<T>
 */
export class AssetDropped extends AssetEvent { }
