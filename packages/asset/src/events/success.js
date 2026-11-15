/** @import {TypeId} from '@wimaengine/type' */
/** @import {AssetId} from '../types' */
/** @import {AssetServer} from '../resources' */
/** @import {AssetLoadFail} from './fail' */

/**
 * Event data for an asset load that completed successfully.
 *
 * A {@linkcode AssetServer#load} request produces this
 * event after the response has been imported and stored in its typed asset
 * pool. The event becomes readable when the typed
 * `Events<AssetLoadSuccess>` resource publishes its pending batch. Failed
 * loads publish {@linkcode AssetLoadFail} instead.
 *
 * The payload identifies the requested asset family, its reserved or reused
 * packed pool ID, and the complete path used for the load. It does not carry
 * the imported asset; consumers can use the event's `typeId` and `assetId` to
 * locate that value in the matching typed `Assets` pool.
 *
 * @example
 * ```js
 * import { AssetLoadSuccess, Assets } from '@wimaengine/asset'
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
 * // The success event is available after the asset has been imported.
 * events.write(new AssetLoadSuccess(typeId, assetId, path))
 * events.clear()
 * events.each(({ data }) => {
 *   console.log(`Loaded ${data.path} as asset ${data.assetId}`)
 * })
 * ```
 */
export class AssetLoadSuccess {

  /**
   * Runtime type ID of the loaded asset's constructor.
   *
   * @type {TypeId}
   */
  typeId

  /**
   * Reserved or reused packed ID of the loaded asset in its typed pool.
   *
   * @type {AssetId}
   */
  assetId

  /**
   * Complete path used by the load request.
   *
   * @type {string}
   */
  path

  /**
   * Stores the type ID, asset ID, and path supplied for a completed asset load.
   *
   * @param {TypeId} typeId - Runtime ID of the loaded asset's constructor.
   * @param {AssetId} assetId - Reserved or reused ID in the typed asset pool.
   * @param {string} path - Complete path used by the load request.
   */
  constructor(typeId, assetId, path) {
    this.path = path
    this.typeId = typeId
    this.assetId = assetId
  }
}
