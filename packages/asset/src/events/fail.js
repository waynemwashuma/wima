/** @import {TypeId} from '@wimaengine/type' */
/** @import {AssetId} from '../types' */

/**
 * Provides operation labels for identifying the kind of request represented by
 * an {@linkcode AssetLoadFail} event.
 *
 * @readonly
 * @enum {number}
 *
 * @example
 * ```js
 * import { AssetLoadFail, AssetLoadOperation } from '@wimaengine/asset'
 *
 * const typeId = 'Texture' // TypeId for the asset family
 * const assetId = 0 // AssetId for the asset entry
 * const path = '/textures/player.png'
 * const reason = 'Network request failed'
 * const failure = new AssetLoadFail(
 *   typeId,
 *   assetId,
 *   path,
 *   reason,
 *   AssetLoadOperation.Saving
 * )
 * console.log(failure.operation === AssetLoadOperation.Saving) // true
 * ```
 */
export const AssetLoadOperation = {

  /**
   * Label for a failed asset load request. This is the default operation for
   * {@linkcode AssetLoadFail}.
   *
   * @readonly
   */
  Loading: 1,

  /**
   * Label for a failed asset save request.
   *
   * @readonly
   */
  Saving: 2
}

/**
 * Event data for an asset load or save request that could not be completed.
 *
 * The asset API publishes this payload through its event stream when a request
 * fails. Use the operation label from {@linkcode AssetLoadOperation} to
 * distinguish load and save failures, then use the event data to decide how to
 * handle the failed request.
 *
 * @example
 * ```js
 * import { AssetLoadFail, AssetLoadOperation } from '@wimaengine/asset'
 *
 * const typeId = 'Texture' // TypeId for the asset family
 * const assetId = 0 // AssetId for the asset entry
 * const path = '/textures/player.png'
 * const reason = 'Network request failed'
 * const failure = new AssetLoadFail(typeId, assetId, path, reason)
 *
 * console.log(failure.operation === AssetLoadOperation.Loading) // true
 * console.log(failure.path, failure.reason) // /textures/player.png Network request failed
 * ```
 */
export class AssetLoadFail {

  /**
   * Runtime type ID of the asset family involved in the failed request.
   *
   * @type {TypeId}
   */
  typeId

  /**
   * Packed asset ID associated with the failed request.
   *
   * @type {AssetId}
   */
  assetId

  /**
   * Path used by the failed load or save request.
   *
   * @type {string}
   */
  path

  /**
   * Failure message or reason stored by the event.
   *
   * @type {string}
   */
  reason

  /**
   * Numeric operation label from {@linkcode AssetLoadOperation} for the failed
   * request.
   *
   * @type {number}
   */
  operation

  /**
   * Creates failure event data for an asset load or save operation.
   *
   * The constructor stores every argument on the event. The `operation`
   * defaults to {@linkcode AssetLoadOperation.Loading}. Pass
   * {@linkcode AssetLoadOperation.Saving} when constructing a save failure.
   *
   * @param {TypeId} typeId - Runtime type ID of the affected asset family.
   * @param {AssetId} assetId - Asset ID associated with the request.
   * @param {string} path - Path used by the load or save request.
   * @param {string} reason - Failure message or reason.
   * @param {number} [operation=AssetLoadOperation.Loading] - Failed operation
   * from {@linkcode AssetLoadOperation}.
   */
  constructor(typeId, assetId, path, reason, operation = AssetLoadOperation.Loading) {
    this.typeId = typeId
    this.assetId = assetId
    this.path = path
    this.reason = reason
    this.operation = operation
  }
}
