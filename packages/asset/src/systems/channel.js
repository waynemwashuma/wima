/** @import { SystemFunc } from '@wimaengine/ecs' */
/** @import { World } from '@wimaengine/ecs' */
/** @import { Constructor } from '@wimaengine/type' */
/** @import { AssetChannel, Handle } from '../core' */
/** @import { AssetDropped } from '../events' */
/** @import { AssetPlugin } from '../plugins' */

import { typeidGeneric } from '@wimaengine/type'
import { Assets } from '../resources'

/**
 * Creates the Update system that applies queued reference operations for one
 * typed asset pool.
 *
 * The factory captures `asset` and computes the resource ID
 * `typeidGeneric(Assets, [asset])`. The returned function accepts a
 * {@linkcode World}; it resolves that typed {@linkcode Assets} resource with
 * `World#getResourceByTypeId` and calls {@linkcode Assets#update}. The
 * factory itself does not create, register, or update an asset pool. A missing
 * typed resource causes the returned function to throw when the world lookup
 * asserts.
 *
 * {@linkcode Assets#update} flushes the pool's shared
 * {@linkcode AssetChannel} and processes its messages in queue order. An acquire
 * increments the matching live entry's reference count; a release decrements
 * it and removes the entry when that was the final reference, recycling its
 * slot and queuing an {@linkcode AssetDropped} event. Stale asset IDs are
 * ignored. These deferred messages are produced by operations such as
 * {@linkcode Handle#clone} and {@linkcode Handle#drop}; calling the returned
 * function is what applies them to the pool.
 *
 * {@linkcode AssetPlugin} can install equivalent asset-pool processing for its
 * configured constructor. Register the returned function yourself when
 * managing the pool without that plugin.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetPlugin, updateAssetChannel } from '@wimaengine/asset'
 *
 * class Texture {}
 *
 * const system = updateAssetChannel(Texture)
 * const app = new App()
 * app.registerPlugin(new AssetPlugin({ asset: Texture }))
 * // AssetPlugin installs equivalent channel processing for Texture.
 * ```
 *
 * @template T
 * @param {Constructor<T>} asset - Constructor identifying the typed asset
 * pool and its `Assets<T>` resource ID.
 * @returns {SystemFunc} Update function that accepts a {@linkcode World} and
 * applies that pool's queued acquire and release messages.
 * @throws {Error} If the returned system cannot find the typed `Assets<T>`
 * resource in its world.
 */
export function updateAssetChannel(asset) {
  const assetsId = typeidGeneric(Assets, [asset])

  return function updateAssetChannel(world) {

    /** @type {Assets<T>} */
    const assets = world.getResourceByTypeId(assetsId)

    assets.update()
  }
}
