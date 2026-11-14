/** @import { Events } from '@wimaengine/event' */
/** @import { ScenePlugin } from '../plugin' */

import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { Scene } from '../assets'

/**
 * Identifies a scene asset addition in the typed scene lifecycle stream.
 *
 * {@linkcode ScenePlugin} configures this constructor as the added event type for
 * the {@linkcode Scene} asset family. The inherited {@linkcode AssetAdded} payload
 * contains the scene asset's `id` and `type`; `type` identifies the
 * {@linkcode Scene} family, and `id` identifies the affected scene asset.
 * Consumers read that payload from the `data` field of each event in the
 * {@linkcode Events} resource configured for `SceneAdded`.
 *
 * This class adds no fields or constructor. It preserves the inherited
 * constructor and scene identity payload from {@linkcode AssetAdded}.
 *
 * @example
 * ```js
 * import { Events } from '@wimaengine/event'
 * import { Scene, SceneAdded } from '@wimaengine/scene'
 *
 * const events = new Events()
 * events.write(new SceneAdded(Scene, 17))
 * events.clear()
 *
 * console.log(events.readFirst().data.id) // 17
 * ```
 *
 * @inheritdoc
 * @augments AssetAdded<Scene>
 */
export class SceneAdded extends AssetAdded {}

/**
 * Identifies replacement of a scene asset in the typed scene lifecycle stream.
 *
 * {@linkcode ScenePlugin} configures this constructor as the modified event type
 * for the {@linkcode Scene} asset family. The inherited {@linkcode AssetModified}
 * payload identifies the replaced entry through its `id` and `type`; it does
 * not include either scene value. The {@linkcode Events} resource configured for
 * `SceneModified` publishes that payload for consumers.
 *
 * This class adds no fields or constructor. It preserves the inherited
 * constructor and scene identity payload from {@linkcode AssetModified}.
 *
 * @example
 * ```js
 * import { Events } from '@wimaengine/event'
 * import { Scene, SceneModified } from '@wimaengine/scene'
 *
 * const events = new Events()
 * events.write(new SceneModified(Scene, 17))
 * events.clear()
 *
 * console.log(events.readFirst().data.id) // 17
 * ```
 *
 * @inheritdoc
 * @augments AssetModified<Scene>
 */
export class SceneModified extends AssetModified {}

/**
 * Identifies a scene asset removal in the typed scene lifecycle stream.
 *
 * {@linkcode ScenePlugin} configures this constructor as the dropped event type
 * for the {@linkcode Scene} asset family. When the final reference to a scene
 * asset is released, the inherited {@linkcode AssetDropped} payload identifies
 * the removed entry through its `id` and `type`; it does not include the
 * dropped scene value. The {@linkcode Events} resource configured for
 * `SceneDropped` publishes that payload for consumers.
 *
 * This class adds no fields or constructor. It preserves the inherited
 * constructor and scene identity payload from {@linkcode AssetDropped}.
 *
 * @example
 * ```js
 * import { Events } from '@wimaengine/event'
 * import { Scene, SceneDropped } from '@wimaengine/scene'
 *
 * const events = new Events()
 * events.write(new SceneDropped(Scene, 17))
 * events.clear()
 *
 * console.log(events.readFirst().data.id) // 17
 * ```
 *
 * @inheritdoc
 * @augments AssetDropped<Scene>
 */
export class SceneDropped extends AssetDropped {}
