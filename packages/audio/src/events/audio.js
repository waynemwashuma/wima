/** @import { Events } from '@wimaengine/event' */
/** @import { AudioPlugin } from '../plugin' */

import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { Audio } from '../assets'

/**
 * Identifies an audio asset addition in the typed audio lifecycle stream.
 *
 * {@linkcode AudioPlugin} configures this constructor as the added event type for
 * the {@linkcode Audio} asset family. The inherited {@linkcode AssetAdded} payload
 * contains the audio asset's `id` and `type`; `type` identifies the
 * {@linkcode Audio} family, and `id` identifies the affected audio asset.
 * Consumers read that payload from the `data` field of each event in the
 * {@linkcode Events} resource configured for `AudioAdded`.
 *
 * This class adds no fields or constructor. It preserves the inherited
 * constructor and audio identity payload from {@linkcode AssetAdded}.
 *
 * @example
 * ```js
 * function inspectAudioAdded(event) {
 *   console.log(event.type === Audio) // true
 *   console.log(event.id) // ID assigned to the added audio asset
 * }
 * ```
 *
 * @inheritdoc
 * @augments AssetAdded<Audio>
 */
export class AudioAdded extends AssetAdded {}

/**
 * Identifies replacement of an audio asset in the typed audio lifecycle stream.
 *
 * {@linkcode AudioPlugin} configures this constructor as the modified event type
 * for the {@linkcode Audio} asset family. The inherited {@linkcode AssetModified}
 * payload identifies the replaced entry through its `id` and `type`; it does
 * not include the replacement audio buffer. The {@linkcode Events} resource
 * configured for `AudioModified` publishes that payload for consumers.
 *
 * This class adds no fields or constructor. It preserves the inherited
 * constructor and audio identity payload from {@linkcode AssetModified}.
 *
 * @example
 * ```js
 * function inspectAudioModified(event) {
 *   console.log(event.type === Audio) // true
 *   console.log(event.id) // ID assigned to the modified audio asset
 * }
 * ```
 *
 * @inheritdoc
 * @augments AssetModified<Audio>
 */
export class AudioModified extends AssetModified {}

/**
 * Identifies an audio asset removal in the typed audio lifecycle stream.
 *
 * {@linkcode AudioPlugin} configures this constructor as the dropped event type
 * for the {@linkcode Audio} asset family. When the final reference to an audio
 * asset is released, the inherited {@linkcode AssetDropped} payload identifies
 * the removed entry through its `id` and `type`; it does not include the
 * dropped audio value. The {@linkcode Events} resource configured for
 * `AudioDropped` publishes that payload for consumers.
 *
 * This class adds no fields or constructor. It preserves the inherited
 * constructor and audio identity payload from {@linkcode AssetDropped}.
 *
 * @example
 * ```js
 * function inspectAudioDropped(event) {
 *   console.log(event.type === Audio) // true
 *   console.log(event.id) // ID assigned to the removed audio asset
 * }
 * ```
 *
 * @inheritdoc
 * @augments AssetDropped<Audio>
 */
export class AudioDropped extends AssetDropped {}
