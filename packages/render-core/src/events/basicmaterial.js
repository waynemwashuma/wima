/** @import { RenderCorePlugin } from '../plugin' */

import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { BasicMaterial } from '../assets'

/**
 * Type identity for the typed event resource that reports a basic-material
 * asset becoming available.
 *
 * {@linkcode RenderCorePlugin} configures this constructor as the `added` event
 * type for the {@linkcode BasicMaterial} asset pool. The inherited
 * {@linkcode AssetAdded} payload is available through `event.data`; this subclass
 * adds no fields or constructor. Read the inherited `id` and `type` fields from
 * `event.data`.
 *
 * @inheritdoc
 * @augments AssetAdded<BasicMaterial>
 */
export class BasicMaterialAdded extends AssetAdded {}

/**
 * Type identity for the typed event resource that reports a basic-material
 * asset replacement.
 *
 * {@linkcode RenderCorePlugin} configures this constructor as the `modified` event
 * type for the {@linkcode BasicMaterial} asset pool. The inherited
 * {@linkcode AssetModified} payload identifies the changed entry through its
 * `id` and `type`; it does not include either material value.
 *
 * @inheritdoc
 * @augments AssetModified<BasicMaterial>
 */
export class BasicMaterialModified extends AssetModified {}

/**
 * Type identity for the typed event resource that reports a basic-material
 * asset being dropped.
 *
 * {@linkcode RenderCorePlugin} configures this constructor as the `dropped` event
 * type for the {@linkcode BasicMaterial} asset pool. The inherited
 * {@linkcode AssetDropped} payload identifies the removed entry after the
 * material's final reference is released; its `id` and `type` identify that
 * entry, and the dropped material value is not included.
 *
 * @inheritdoc
 * @augments AssetDropped<BasicMaterial>
 */
export class BasicMaterialDropped extends AssetDropped {}
