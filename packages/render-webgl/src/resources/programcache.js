/** @import {TypeId} from "@wimaengine/type". */

import { WebglRenderPipeline } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores WebGL render pipelines by material type ID and fills entries lazily.
 *
 * {@linkcode WebglRendererPlugin} installs this resource in the world. It behaves
 * like a normal {@linkcode Map}: keys are material {@linkcode TypeId}s, such as the
 * value returned by `typeid(BasicMaterial)`, and values are initialized
 * {@linkcode WebglRenderPipeline} instances.
 *
 * Each {@linkcode WebglMaterialPlugin} can add the pipeline for its material type
 * when a compatible WebGL 2 context is available. An existing entry is reused;
 * a missing entry remains absent until the pipeline can be initialized.
 *
 * Use `get(materialTypeId)` to look up a material's pipeline before drawing.
 * A missing entry means that the pipeline is not ready, while an existing
 * entry provides the initialized {@linkcode WebglRenderPipeline} for that material.
 *
 * The cache does not compile shaders, create pipelines, or dispose WebGL
 * programs itself. Use inherited Map operations such as `get`, `has`, `size`,
 * `set`, `delete`, `clear`, and iteration when inspecting or managing entries.
 * Keys must be the same material type IDs used to register the material.
 *
 * @example
 * ```js
 * import { BasicMaterial } from '@wimaengine/render-core'
 * import { WebglProgramCache } from '@wimaengine/render-webgl'
 * import { typeid } from '@wimaengine/type'
 *
 * // WebglRendererPlugin installs this resource during app setup.
 * function inspectBasicMaterialPipeline(world) {
 *   const pipelines = world.getResource(WebglProgramCache)
 *   const materialTypeId = typeid(BasicMaterial)
 *   const pipeline = pipelines.get(materialTypeId)
 *
 *   if (!pipeline) {
 *     // The material pipeline is not ready yet.
 *     return
 *   }
 *
 *   console.log(pipelines.has(materialTypeId), pipelines.size)
 *   console.log(pipeline.program)
 * }
 * ```
 *
 * @augments {Map<TypeId,WebglRenderPipeline>}
 * @category resource
 */
export class WebglProgramCache extends Map {}
/* eslint-enable jsdoc/check-tag-names */
