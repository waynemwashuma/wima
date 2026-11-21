/** @import { AppSchedule } from '@wimaengine/core' */
/** @import { WebglRendererPlugin } from '../plugin' */
import { World } from '@wimaengine/ecs'
import { MapInfo, StructInfo, Field, OpaqueInfo, TypeRegistry } from '@wimaengine/reflect'
import { ProgramCache, MeshAttribute } from '@wimaengine/render-core'
import { setTypeId, typeid } from '@wimaengine/type'
import { WebglRenderPipeline } from '../core'
import { AttributeMap, ClearColor, MeshCache, UBOCache, WebglProgramCache } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the WebGL backend's reflection metadata during app startup.
 *
 * {@linkcode WebglRendererPlugin} registers this function directly as a one-shot
 * {@linkcode AppSchedule.Startup} system. It obtains the world's
 * {@linkcode TypeRegistry}, assigns explicit runtime IDs with {@linkcode setTypeId}
 * for `WebGLProgram` and `WebGLVertexArrayObject`, and registers both IDs with
 * {@linkcode OpaqueInfo}.
 *
 * The system registers {@linkcode MeshAttribute} as a struct with `name`, `id`,
 * `type`, and `size` fields, and attaches its
 * {@linkcode MeshAttribute.serialize} and {@linkcode MeshAttribute.deserialize}
 * methods. It registers {@linkcode WebglRenderPipeline} as a struct whose
 * `program` field uses the WebGL-program ID, {@linkcode ProgramCache} as a
 * numeric-keyed map to WebGL programs, {@linkcode MeshCache} as a numeric-keyed
 * map to WebGL vertex arrays, and {@linkcode UBOCache} as opaque metadata.
 *
 * It registers {@linkcode ClearColor} as an `r`/`g`/`b`/`a` numeric struct and
 * attaches {@linkcode ClearColor.serialize} and {@linkcode ClearColor.deserialize}.
 * Finally, it registers {@linkcode AttributeMap} as a string-keyed map of
 * {@linkcode MeshAttribute} values and {@linkcode WebglProgramCache} as a
 * string-keyed map of {@linkcode WebglRenderPipeline} values.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { DefaultPlugin } from '@wimaengine/misc'
 * import { WebglRendererPlugin } from '@wimaengine/render-webgl'
 *
 * new App()
 *   .registerPlugin(new DefaultPlugin())
 *   .registerPlugin(new WebglRendererPlugin())
 *   .run()
 * // Startup invokes registerWebglTypes before WebGL systems use these types.
 * ```
 *
 * @param {World} world - World containing the {@linkcode TypeRegistry} resource.
 * @returns {void}
 * @category system
 */
export function registerWebglTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const webglProgramId = setTypeId('WebGLProgram')
  const webglVaoId = setTypeId('WebGLVertexArrayObject')

  registry.registerTypeId(webglProgramId, new OpaqueInfo())
  registry.registerTypeId(webglVaoId, new OpaqueInfo())

  registry.register(MeshAttribute, new StructInfo({
    name: new Field(typeid(String)),
    id: new Field(typeid(Number)),
    type: new Field(typeid(Number)),
    size: new Field(typeid(Number))
  }))
  registry.get(MeshAttribute)?.setMethod(MeshAttribute.serialize)
  registry.get(MeshAttribute)?.setMethod(MeshAttribute.deserialize)
  registry.register(WebglRenderPipeline, new StructInfo({
    program: new Field(webglProgramId)
  }))

  registry.register(ProgramCache, new MapInfo(typeid(Number), webglProgramId))
  registry.register(MeshCache, new MapInfo(typeid(Number), webglVaoId))
  registry.register(UBOCache, new OpaqueInfo())
  registry.register(ClearColor, new StructInfo({
    r: new Field(typeid(Number)),
    g: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    a: new Field(typeid(Number))
  }))
  registry.get(ClearColor)?.setMethod(ClearColor.default)
  registry.get(ClearColor)?.setMethod(ClearColor.serialize)
  registry.get(ClearColor)?.setMethod(ClearColor.deserialize)
  registry.register(AttributeMap, new MapInfo(typeid(String), typeid(MeshAttribute)))
  registry.get(AttributeMap)?.setMethod(AttributeMap.default)
  registry.register(WebglProgramCache, new MapInfo(typeid(String), typeid(WebglRenderPipeline)))
}
/* eslint-enable jsdoc/check-tag-names */
