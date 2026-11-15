/** @import { AssetId } from '@wimaengine/asset' */
/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the renderer's mesh-to-GPU-value cache resource.
 *
 * @example
 * ```js
 * import { MeshCache } from '@wimaengine/render-webgl'
 *
 * // WebglRendererPlugin installs and populates this resource.
 * const meshes = world.getResource(MeshCache)
 * const gpuMesh = meshes.get(meshHandle.id())
 *
 * // The lookup can be empty until the mesh queue processes the asset event.
 * if (gpuMesh) gl.bindVertexArray(gpuMesh)
 * ```
 *
 * @template T
 * @augments {Map<AssetId,T>}
 * @category resource
 */
export class MeshCache extends Map {}
/* eslint-enable jsdoc/check-tag-names */
