/** @import { AssetId } from '@wimaengine/asset' */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides a world resource for caching browser image values by numeric asset
 * ID.
 *
 * {@linkcode Canvas2DRendererPlugin} installs this resource in the app. It has
 * the ordinary map semantics of {@linkcode Map}: keys are numeric
 * {@linkcode AssetId} values, such as the identity returned by
 * {@linkcode Handle#id}, and values are cached browser image representations.
 * The cache does not load assets or populate entries automatically.
 *
 * @example
 * ```js
 * import { TextureCache } from '@wimaengine/render-core'
 *
 * // Canvas2DRendererPlugin must be registered before this lookup.
 * function lookupTexture(world, assetId) {
 *   const textures = world.getResource(TextureCache)
 *   return textures.get(assetId) // HTMLImageElement | undefined
 * }
 * ```
 *
 * @template T
 * @augments {Map<AssetId,T>}
 * @category resource
 */
export class TextureCache extends Map { }
/* eslint-enable jsdoc/check-tag-names */
