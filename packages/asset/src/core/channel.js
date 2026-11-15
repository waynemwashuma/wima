/** @import { AssetId } from '../types' */

/**
 * Labels the reference-count operation carried by an
 * {@linkcode AssetChannelMessage}.
 *
 * {@linkcode AssetChannel} writes one of these labels into each queued message.
 * `Acquire` has the numeric value `0`, and `Release` has the numeric value
 * `1`.
 *
 * @readonly
 * @enum {number}
 *
 * @example
 * ```js
 * import { AssetChannel, AssetChannelMessageType } from '@wimaengine/asset'
 *
 * const assetId = 17
 * const channel = new AssetChannel()
 * channel.acquire(assetId)
 * const [message] = channel.flush()
 * console.log(message.type === AssetChannelMessageType.Acquire) // true
 * ```
 */
export const AssetChannelMessageType = {

  /**
   * Identifies an acquire operation for one reference.
   *
   * The numeric value is `0`.
   *
   * @readonly
   */
  Acquire: 0,

  /**
   * Identifies a release operation for one reference.
   *
   * The numeric value is `1`.
   *
   * @readonly
   */
  Release: 1
}

/**
 * Collects deferred reference-count operations for a typed asset pool in queue
 * order.
 *
 * @example
 * ```js
 * import { AssetChannel, AssetChannelMessageType } from '@wimaengine/asset'
 *
 * // An asset ID normally comes from a Handle<T>.id() call.
 * const assetId = 17
 * const channel = new AssetChannel()
 *
 * channel.acquire(assetId)
 * const acquired = channel.flush()
 * channel.release(assetId)
 * const released = channel.flush()
 *
 * console.log(acquired[0].type === AssetChannelMessageType.Acquire) // true
 * console.log(released[0].type === AssetChannelMessageType.Release) // true
 * ```
 *
 * @template T
 */
export class AssetChannel {

  /**
   * Pending messages in the order they were queued.
   *
   * The channel owns this private array. A non-empty {@linkcode AssetChannel#flush}
   * replaces it with a new empty array; flushing an empty queue leaves the same
   * empty array in place.
   *
   * @private
   * @type {AssetChannelMessage<T>[]}
   */
  queue = []

  /**
   * Queue a reference acquisition for an asset ID.
   *
   * Appends a new {@linkcode AssetChannelMessage} with the
   * {@linkcode AssetChannelMessageType.Acquire} label. Messages remain in call
   * order until {@linkcode AssetChannel#flush} returns them; this method does not
   * apply the operation or change a reference count.
   *
   * @param {AssetId} assetId - Packed asset identity to acquire.
   * @returns {void} Always returns `undefined`.
   */
  acquire(assetId) {
    this.queue.push(new AssetChannelMessage(AssetChannelMessageType.Acquire, assetId))
  }

  /**
   * Queue a reference release for an asset ID.
   *
   * Appends a new {@linkcode AssetChannelMessage} with the
   * {@linkcode AssetChannelMessageType.Release} label. Messages remain in call
   * order until {@linkcode AssetChannel#flush} returns them; this method does not
   * apply the operation or change a reference count.
   *
   * @param {AssetId} assetId - Packed asset identity to release.
   * @returns {void} Always returns `undefined`.
   */
  release(assetId) {
    this.queue.push(new AssetChannelMessage(AssetChannelMessageType.Release, assetId))
  }

  /**
   * Return the pending message batch.
   *
   * Returns the current queue array in append order. If the queue is non-empty,
   * this channel replaces it with a new empty array, so later messages do not
   * appear in the returned batch. If the queue is empty, the same empty array
   * remains the channel's queue and is returned. This method does not interpret
   * the operation labels.
   *
   * @returns {Readonly<AssetChannelMessage<T>[]>} The pending message array.
   */
  flush() {
    const { queue } = this

    if (queue.length) this.queue = []

    return queue
  }
}

/**
 * Represents one deferred reference-count operation for a typed asset pool.
 *
 * {@linkcode AssetChannel} queues these operation values for later processing.
 *
 * @template T
 *
 * @example
 * ```js
 * import { AssetChannel, AssetChannelMessageType } from '@wimaengine/asset'
 *
 * const channel = new AssetChannel()
 * channel.acquire(17)
 *
 * const [message] = channel.flush()
 * console.log(message.type === AssetChannelMessageType.Acquire) // true
 * console.log(message.assetId) // 17
 * ```
 */
export class AssetChannelMessage {

  /**
   * Read-only operation label for this message.
   *
   * The value is one of the labels in {@linkcode AssetChannelMessageType}.
   *
   * @readonly
   * @type {AssetChannelMessageType}
   */
  type

  /**
   * Read-only packed {@linkcode AssetId} identifying the asset slot and generation.
   *
   * @readonly
   * @type {AssetId}
   */
  assetId

  /**
   * Creates a message by assigning the supplied operation label and asset
   * identity directly to the message.
   *
   * The constructor does not validate, enqueue, or apply the supplied values.
   *
   * @param {AssetChannelMessageType} type - Operation label to store.
   * @param {AssetId} assetId - Packed asset identity to store.
   */
  constructor(type, assetId) {
    this.type = type
    this.assetId = assetId
  }
}
