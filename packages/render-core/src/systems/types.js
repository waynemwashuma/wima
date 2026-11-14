/** @import {AppSchedule, CoreSystems} from '@wimaengine/core' */
/** @import {SystemFunc} from '@wimaengine/ecs' */
/** @import {TypeEntry} from '@wimaengine/reflect' */
/** @import { Constructor } from '@wimaengine/type' */
/** @import {MaterialInstancePlugin} from '../plugins' */
/** @import {RenderCorePlugin} from '../plugin' */

import { Handle, HandleSnapshot } from '@wimaengine/asset'
import { Color } from '@wimaengine/color'
import { World } from '@wimaengine/ecs'
import { Vector2 } from '@wimaengine/math'
import { EnumInfo, Field, MapInfo, OpaqueInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { BasicMaterial, Image, Material, Mesh, Shader } from '../assets'
import { BasicMaterialInstance, BasicMaterialInstanceSnapshot, Camera, Meshed, MeshedSnapshot, RenderLists2D, RenderLists3D } from '../components'
import { MeshAttributeData, Projection, ShaderStage } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers render-core reflection metadata in a world's
 * {@linkcode TypeRegistry}.
 *
 * {@linkcode RenderCorePlugin} registers this function directly as a one-shot
 * {@linkcode AppSchedule.Startup}
 * system in {@linkcode CoreSystems.Start}. It obtains the world's registry
 * through {@linkcode TypeRegistry}, then creates
 * these runtime IDs before registering the constructor-backed entries:
 *
 * - `meshAttributeMapId` is
 *   `typeidGeneric(Map, [String, MeshAttributeData])`, whose value is the
 *   exact ID `Map<String,MeshAttributeData>`. It is registered with
 *   {@linkcode MapInfo} using `typeid(String)` and `typeid(MeshAttributeData)`.
 * - `shaderStageId` is `setTypeId('ShaderStage')` and is registered with
 *   {@linkcode EnumInfo} for {@linkcode ShaderStage}.
 * - `basicMaterialHandleId` is
 *   `typeidGeneric(Handle, [BasicMaterial])`, whose value is the exact ID
 *   `Handle<BasicMaterial>` used by the {@linkcode BasicMaterialInstance} handle
 *   field. This function creates the field ID; the material registration
 *   system supplies its handle metadata.
 *
 * The constructor-backed entries use {@linkcode TypeRegistry#register} with
 * {@linkcode StructInfo}, except for the render lists, which use
 * {@linkcode OpaqueInfo}:
 *
 * - {@linkcode MeshAttributeData}: `data: typeid(Float32Array)`.
 * - {@linkcode Image}: `raw: typeid(Uint8ClampedArray)`, `dimensions: typeid(Vector2)`.
 * - {@linkcode Mesh}: optional `indices: typeid(Uint16Array)`, `attributes: meshAttributeMapId`.
 * - {@linkcode Shader}: `stage: shaderStageId`, `source: typeid(String)`.
 * - {@linkcode BasicMaterial}: `color: typeid(Color)`.
 * - {@linkcode Meshed}: `handle: typeidGeneric(Handle, [Mesh])`.
 * - {@linkcode MeshedSnapshot}: `handle: typeid(HandleSnapshot)`.
 * - {@linkcode BasicMaterialInstance}: `handle: basicMaterialHandleId`.
 * - {@linkcode BasicMaterialInstanceSnapshot}: `handle: typeid(HandleSnapshot)`.
 * - {@linkcode Camera}: `projection: typeid(Projection)`, `near: typeid(Number)`,
 *   `far: typeid(Number)`.
 * - {@linkcode RenderLists2D} and {@linkcode RenderLists3D}: opaque metadata entries.
 *
 * The registered entries receive these exact methods through
 * {@linkcode TypeEntry#setMethod}: {@linkcode MeshAttributeData} gets
 * `serialize` and `deserialize`; {@linkcode Image}, {@linkcode Mesh}, {@linkcode Shader},
 * and {@linkcode BasicMaterial} each get `serialize` and `deserialize`;
 * {@linkcode Meshed} gets `copy`, `clone`, and `prototype.toSnapshot`;
 * {@linkcode MeshedSnapshot} gets `serialize`, `deserialize`, and
 * `prototype.fromSnapshot`; {@linkcode BasicMaterialInstance} gets `copy`, `clone`,
 * and `prototype.toSnapshot`; {@linkcode BasicMaterialInstanceSnapshot} gets
 * `serialize`, `deserialize`, and `prototype.fromSnapshot`; and {@linkcode Camera},
 * {@linkcode RenderLists2D}, and {@linkcode RenderLists3D} each get `copy`, `clone`,
 * `serialize`, and `deserialize`.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { DefaultPlugin } from '@wimaengine/misc'
 *
 * new App()
 *   .registerPlugin(new DefaultPlugin())
 *   .run()
 * // DefaultPlugin includes RenderCorePlugin; Startup registers the metadata.
 * ```
 *
 * @param {World} world - World containing the {@linkcode TypeRegistry} resource.
 * @returns {void}
 * @category system
 */
export function registerRenderCoreTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const meshAttributeMapId = typeidGeneric(Map, [String, MeshAttributeData])
  const shaderStageId = setTypeId('ShaderStage')
  const basicMaterialHandleId = typeidGeneric(Handle, [BasicMaterial])

  registry.registerTypeId(meshAttributeMapId, new MapInfo(typeid(String), typeid(MeshAttributeData)))
  registry.registerTypeId(shaderStageId, new EnumInfo(ShaderStage))

  registry.register(MeshAttributeData, new StructInfo({
    data: new Field(typeid(Float32Array))
  }))
  registry.get(MeshAttributeData)?.setMethod(MeshAttributeData.serialize)
  registry.get(MeshAttributeData)?.setMethod(MeshAttributeData.deserialize)
  registry.register(Image, new StructInfo({
    raw: new Field(typeid(Uint8ClampedArray)),
    dimensions: new Field(typeid(Vector2))
  }))
  registry.get(Image)?.setMethod(Image.serialize)
  registry.get(Image)?.setMethod(Image.deserialize)
  registry.register(Mesh, new StructInfo({
    indices: new Field(typeid(Uint16Array), true),
    attributes: new Field(meshAttributeMapId)
  }))
  registry.get(Mesh)?.setMethod(Mesh.serialize)
  registry.get(Mesh)?.setMethod(Mesh.deserialize)
  registry.register(Shader, new StructInfo({
    stage: new Field(shaderStageId),
    source: new Field(typeid(String))
  }))
  registry.get(Shader)?.setMethod(Shader.serialize)
  registry.get(Shader)?.setMethod(Shader.deserialize)
  registry.register(BasicMaterial, new StructInfo({
    color: new Field(typeid(Color))
  }))
  registry.get(BasicMaterial)?.setMethod(BasicMaterial.serialize)
  registry.get(BasicMaterial)?.setMethod(BasicMaterial.deserialize)
  registry.register(Meshed, new StructInfo({
    handle: new Field(typeidGeneric(Handle, [Mesh]))
  }))
  registry.get(Meshed)?.setMethod(Meshed.copy)
  registry.get(Meshed)?.setMethod(Meshed.clone)
  registry.get(Meshed)?.setMethod(Meshed.prototype.toSnapshot)
  registry.register(MeshedSnapshot, new StructInfo({
    handle: new Field(typeid(HandleSnapshot))
  }))
  registry.get(MeshedSnapshot)?.setMethod(MeshedSnapshot.serialize)
  registry.get(MeshedSnapshot)?.setMethod(MeshedSnapshot.deserialize)
  registry.get(MeshedSnapshot)?.setMethod(MeshedSnapshot.prototype.fromSnapshot)
  registry.register(BasicMaterialInstance, new StructInfo({
    handle: new Field(basicMaterialHandleId)
  }))
  registry.get(BasicMaterialInstance)?.setMethod(BasicMaterialInstance.copy)
  registry.get(BasicMaterialInstance)?.setMethod(BasicMaterialInstance.clone)
  registry.get(BasicMaterialInstance)?.setMethod(BasicMaterialInstance.prototype.toSnapshot)
  registry.register(BasicMaterialInstanceSnapshot, new StructInfo({
    handle: new Field(typeid(HandleSnapshot))
  }))
  registry.get(BasicMaterialInstanceSnapshot)?.setMethod(BasicMaterialInstanceSnapshot.serialize)
  registry.get(BasicMaterialInstanceSnapshot)?.setMethod(BasicMaterialInstanceSnapshot.deserialize)
  registry.get(BasicMaterialInstanceSnapshot)?.setMethod(BasicMaterialInstanceSnapshot.prototype.fromSnapshot)
  registry.register(Camera, new StructInfo({
    projection: new Field(typeid(Projection)),
    near: new Field(typeid(Number)),
    far: new Field(typeid(Number))
  }))
  registry.get(Camera)?.setMethod(Camera.copy)
  registry.get(Camera)?.setMethod(Camera.clone)
  registry.get(Camera)?.setMethod(Camera.serialize)
  registry.get(Camera)?.setMethod(Camera.deserialize)

  registry.register(RenderLists2D, new OpaqueInfo())
  registry.get(RenderLists2D)?.setMethod(RenderLists2D.copy)
  registry.get(RenderLists2D)?.setMethod(RenderLists2D.clone)
  registry.get(RenderLists2D)?.setMethod(RenderLists2D.serialize)
  registry.get(RenderLists2D)?.setMethod(RenderLists2D.deserialize)

  registry.register(RenderLists3D, new OpaqueInfo())
  registry.get(RenderLists3D)?.setMethod(RenderLists3D.copy)
  registry.get(RenderLists3D)?.setMethod(RenderLists3D.clone)
  registry.get(RenderLists3D)?.setMethod(RenderLists3D.serialize)
  registry.get(RenderLists3D)?.setMethod(RenderLists3D.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * Creates a {@linkcode SystemFunc} that
 * registers reflection metadata for one material component and its asset type.
 *
 * {@linkcode MaterialInstancePlugin} supplies the component and material
 * constructors, then registers the returned system for
 * {@linkcode AppSchedule.Startup} in {@linkcode CoreSystems.Start}; this
 * factory does not register the system itself. When the generated system runs,
 * it obtains the world's {@linkcode TypeRegistry}, creates the typed
 * {@linkcode Handle} ID for `Handle<U>`, and registers that ID with a
 * {@linkcode StructInfo} containing `type`, `index`, and `generation` fields. It
 * then registers `component` with a {@linkcode StructInfo} whose only field is
 * `handle`, using that typed handle ID.
 *
 * The component's optional static `copy`, `clone`, `serialize`, and
 * `deserialize` methods are checked independently. A method is added to the
 * component's reflection entry with {@linkcode TypeEntry#setMethod} only when the
 * corresponding property exists on the component and is a function; absent or
 * non-function properties are ignored.
 *
 * @example
 * ```js
 * const registerTypes = registerMaterialTypes(MyMaterialInstance, MyMaterial)
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Startup,
 *   systemGroup: CoreSystems.Start,
 *   system: registerTypes
 * })
 * // MaterialInstancePlugin performs this startup registration for a plugin pair.
 * ```
 *
 * @template T
 * @template {Material} U
 * @param {Constructor<T>} component - Component constructor whose handle field is reflected.
 * @param {Constructor<U>} material - Material asset constructor used for the typed handle ID.
 * @returns {SystemFunc} Startup system that registers the component and handle metadata.
 */
export function registerMaterialTypes(component, material) {
  return function registerMaterialTypes(world) {
    const registry = world.getResource(TypeRegistry)

    const handleTypeId = typeidGeneric(Handle, [material])

    registry.registerTypeId(handleTypeId, new StructInfo({
      type: new Field(typeid(Function)),
      index: new Field(typeid(Number)),
      generation: new Field(typeid(Number))
    }))
    registry.register(component, new StructInfo({
      handle: new Field(handleTypeId)
    }))

    if ('copy' in component && typeof component.copy === 'function') {
      registry.get(component)?.setMethod(component.copy)
    }
    if ('clone' in component && typeof component.clone === 'function') {
      registry.get(component)?.setMethod(component.clone)
    }
    if ('serialize' in component && typeof component.serialize === 'function') {
      registry.get(component)?.setMethod(component.serialize)
    }
    if ('deserialize' in component && typeof component.deserialize === 'function') {
      registry.get(component)?.setMethod(component.deserialize)
    }
  }
}
