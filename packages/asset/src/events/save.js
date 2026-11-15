/** @import {TypeId} from '@wimaengine/type' */
/** @import {AssetId} from '../types' */
/** @import {AssetServer} from '../resources' */
/** @import {AssetLoadFail} from './fail' */

/**
 * Event data for an asset save that completed successfully.
 *
 * A {@linkcode AssetServer#save} request produces this event after the asset is
 * serialized by its registered exporter and the `POST` request to `path`
 * receives a successful response. The event becomes readable when the typed
 * `Events<AssetSaveSuccess>` resource publishes its pending batch. Failed
 * saves publish {@linkcode AssetLoadFail} instead.
 *
 * The payload identifies the asset family, the packed ID from the saved
 * handle, and the destination path. It does not include the serialized body
 * or the response; consumers that need those values must handle them during
 * their own save workflow.
 *
 * @example
 * ```js
 * import { AssetSaveSuccess, Assets } from '@wimaengine/asset'
 * import { Events } from '@wimaengine/event'
 * import { typeid } from '@wimaengine/type'
 *
 * class Texture {}
 * const assets = new Assets(Texture)
 * const assetId = assets.add(new Texture()).id()
 * const typeId = typeid(Texture)
 * const path = '/textures/player.bin'
 * const events = new Events()
 *
 * // The success event is available after the save response succeeds.
 * events.write(new AssetSaveSuccess(typeId, assetId, path))
 * events.clear()
 * events.each(({ data }) => {
 *   console.log(`Saved ${data.path} for asset ${data.assetId}`)
 * })
 * ```
 */
export class AssetSaveSuccess {

  /**
   * Runtime type ID of the saved asset's constructor.
   *
   * @type {TypeId}
   */
  typeId

  /**
   * Packed asset ID from the handle that was saved.
   *
   * @type {AssetId}
   */
  assetId

  /**
   * Destination path used by the successful save request.
   *
   * @type {string}
   */
  path

  /**
   * Creates success event data for a saved asset.
   *
   * @param {TypeId} typeId - Runtime type ID of the saved asset's constructor.
   * @param {AssetId} assetId - Packed asset ID from the saved handle.
   * @param {string} path - Destination path used by the save request.
   */
  constructor(typeId, assetId, path) {
    this.path = path
    this.typeId = typeId
    this.assetId = assetId
  }
}
