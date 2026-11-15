import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { Shader } from '../assets'

/**
 * Type identity for the typed event resource that reports a shader asset
 * becoming available.
 *
 * {@linkcode ShaderAdded} identifies an addition in the {@linkcode Shader} asset family. This
 * class adds no fields or constructor; it inherits the `id` and `type` payload
 * from {@linkcode AssetAdded}. Read those inherited values from `event.data`.
 *
 * @inheritdoc
 * @augments AssetAdded<Shader>
 */
export class ShaderAdded extends AssetAdded {}

/**
 * Type identity for the typed event resource that reports a shader asset
 * replacement.
 *
 * {@linkcode ShaderModified} identifies a replacement in the {@linkcode Shader} asset family.
 * This class adds no fields or constructor; it inherits the `id` and `type`
 * payload from {@linkcode AssetModified}. Those values identify the changed entry;
 * the payload does not include either shader value.
 *
 * @inheritdoc
 * @augments AssetModified<Shader>
 */
export class ShaderModified extends AssetModified {}

/**
 * Type identity for the typed event resource that reports a shader asset
 * being dropped.
 *
 * {@linkcode ShaderDropped} identifies removal from the {@linkcode Shader} asset family
 * after the shader's final reference is released. This class adds no fields or
 * constructor; it inherits the `id` and `type` payload from {@linkcode AssetDropped}.
 * Those values identify the removed entry; the dropped shader value is not
 * included.
 *
 * @inheritdoc
 * @augments AssetDropped<Shader>
 */
export class ShaderDropped extends AssetDropped {}
