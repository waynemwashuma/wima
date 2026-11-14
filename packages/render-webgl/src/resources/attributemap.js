import { MeshAttribute } from '@wimaengine/render-core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the WebGL attribute-descriptor resource used by the renderer.
 *
 * @example
 * ```js
 * import { GlDataType, MeshAttribute } from '@wimaengine/render-core'
 * import { AttributeMap } from '@wimaengine/render-webgl'
 *
 * // WebglRendererPlugin installs the resource and built-in descriptors.
 * const attributes = world.getResource(AttributeMap)
 * attributes.set(
 *   'weights',
 *   new MeshAttribute('weights', 9, GlDataType.Float, 1)
 * )
 *
 * // A mesh attribute named `weights` now uses location 9 and one float value
 * // per vertex when the WebGL renderer creates its program and VAO.
 * ```
 *
 * @augments {Map<string,MeshAttribute>}
 * @category resource
 */
export class AttributeMap extends Map {}
/* eslint-enable jsdoc/check-tag-names */
