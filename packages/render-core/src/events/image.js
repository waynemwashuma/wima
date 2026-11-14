/** @import { RenderCorePlugin } from '../plugin' */

import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { Image } from '../assets'

/**
 * Type identity for the typed event resource that reports an image asset
 * becoming available.
 *
 * {@linkcode RenderCorePlugin} configures this constructor as the `added` event
 * type for the {@linkcode Image} asset pool. The inherited {@linkcode AssetAdded}
 * payload is available through `event.data`; this subclass adds no fields or
 * constructor. Read the inherited `id` and `type` fields from `event.data`.
 *
 * @inheritdoc
 * @augments AssetAdded<Image>
 */
export class ImageAdded extends AssetAdded {}

/**
 * Type identity for the typed event resource that reports an image asset
 * replacement.
 *
 * {@linkcode RenderCorePlugin} configures this constructor as the `modified` event
 * type for the {@linkcode Image} asset pool. The inherited
 * {@linkcode AssetModified} payload identifies the changed entry through its
 * `id` and `type`; it does not include either image value.
 *
 * @inheritdoc
 * @augments AssetModified<Image>
 */
export class ImageModified extends AssetModified {}

/**
 * Type identity for the typed event resource that reports an image asset
 * being dropped.
 *
 * {@linkcode RenderCorePlugin} configures this constructor as the `dropped` event
 * type for the {@linkcode Image} asset pool. The inherited
 * {@linkcode AssetDropped} payload identifies the removed entry after the
 * image's final reference is released; its `id` and `type` identify that
 * entry, and the dropped image value is not included.
 *
 * @inheritdoc
 * @augments AssetDropped<Image>
 */
export class ImageDropped extends AssetDropped {}
