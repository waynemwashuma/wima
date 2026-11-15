/** @import {AppSchedule} from '@wimaengine/core' */
/** @import {Canvas2DRendererPlugin} from '../plugin' */
import { World } from '@wimaengine/ecs'
import { MapInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { TextureCache } from '@wimaengine/render-core'
import { setTypeId, typeid } from '@wimaengine/type'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the Canvas 2D reflection metadata needed by the renderer.
 *
 * {@linkcode Canvas2DRendererPlugin} registers this system in
 * {@linkcode AppSchedule.Startup}. It obtains the world's {@linkcode TypeRegistry},
 * assigns the runtime ID `HTMLImageElement` with {@linkcode setTypeId}, and
 * registers that ID with an empty {@linkcode StructInfo}. It then registers
 * {@linkcode TextureCache} with a {@linkcode MapInfo} whose key type is
 * {@linkcode typeid}(Number) and whose value type is the `HTMLImageElement` ID.
 * This reflects the cache as a map from numeric
 * asset IDs to browser image values before Canvas 2D material systems run.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { Canvas2DRendererPlugin } from '@wimaengine/render-canvas2d'
 *
 * new App()
 *   .registerPlugin(new Canvas2DRendererPlugin())
 *   .run()
 * // Startup runs registerCanvas2DTypes before Canvas 2D rendering systems.
 * ```
 *
 * @param {World} world - World containing the {@linkcode TypeRegistry} resource.
 * @returns {void}
 * @category system
 */
export function registerCanvas2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const htmlImageElementId = setTypeId('HTMLImageElement')

  registry.registerTypeId(htmlImageElementId, new StructInfo({}))
  registry.register(TextureCache, new MapInfo(typeid(Number), htmlImageElementId))
}
/* eslint-enable jsdoc/check-tag-names */
