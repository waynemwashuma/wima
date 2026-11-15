/** @import { SystemFunc } from '@wimaengine/ecs' */
/** @import { Constructor } from '@wimaengine/type' */
import { Query } from '@wimaengine/ecs'
import { GlobalTransform2D, GlobalTransform3D } from '@wimaengine/transform'
import { typeid } from '@wimaengine/type'
import { Material } from '../assets'
import { Camera, MaterialInstance, Meshed, RenderLists2D, RenderType, RenderLists3D } from '../components'

/**
 * Creates a system that rebuilds 2D opaque render passes for one
 * {@linkcode Material} type.
 *
 * `assettype` supplies the material type ID used as the pass key, while
 * `componenttype` identifies the matching {@linkcode MaterialInstance} component
 * for `T`. The returned system queries renderables with
 * {@linkcode GlobalTransform2D}, {@linkcode Meshed}, and `componenttype`, and
 * cameras with {@linkcode RenderLists2D}, {@linkcode GlobalTransform2D}, and
 * {@linkcode Camera}.
 *
 * Each matching camera's render lists are cleared before a new opaque pass is
 * created for the material type. Every matching renderable is then appended as
 * a {@linkcode RenderType} using its material handle ID, mesh handle ID, and
 * resolved transform. The same renderables are added to every matching camera;
 * this factory does not perform visibility or frustum filtering. With no
 * matching camera, the generated system does no work.
 *
 * {@linkcode MaterialInstancePlugin} normally installs this system for a
 * material/component pair. The factory itself only returns the system.
 *
 * @example
 * ```js
 * const bin2D = genBinRenderables2D(BasicMaterial, BasicMaterialInstance)
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: bin2D
 * })
 * ```
 *
 * @template {Material} T
 * @param {Constructor<T>} assettype - Material asset constructor used for the pass key.
 * @param {Constructor<MaterialInstance<T>>} componenttype - Material-instance component constructor.
 * @returns {SystemFunc} System that rebuilds 2D opaque render passes.
 */
export function genBinRenderables2D(assettype, componenttype) {
  const materialid = typeid(assettype)

  return function binRenders2D(world) {
    const renderables = new Query(world, [GlobalTransform2D, Meshed, componenttype])
    const cameras = new Query(world, [RenderLists2D, GlobalTransform2D, Camera])

    cameras.each(([renderLists]) => {
      renderLists.clear()
      const opaquePass = renderLists.getOpaquePass(materialid) || renderLists.setOpaquePass(materialid)

      renderables.each(([transform, mesh, material]) => {
        opaquePass.push(new RenderType(material.handle.id(), mesh.handle.id(), transform))
      })
    })
  }
}

/**
 * Creates a system that rebuilds 3D opaque render passes for one
 * {@linkcode Material} type.
 *
 * `assettype` supplies the material type ID used as the pass key, while
 * `componenttype` identifies the matching {@linkcode MaterialInstance} component
 * for `T`. The returned system queries renderables with
 * {@linkcode GlobalTransform3D}, {@linkcode Meshed}, and `componenttype`, and
 * cameras with {@linkcode RenderLists3D}, {@linkcode GlobalTransform3D}, and
 * {@linkcode Camera}.
 *
 * Each matching camera's render lists are cleared before a new opaque pass is
 * created for the material type. Every matching renderable is then appended as
 * a {@linkcode RenderType} using its material handle ID, mesh handle ID, and
 * resolved transform. The same renderables are added to every matching camera;
 * this factory does not perform visibility or frustum filtering. With no
 * matching camera, the generated system does no work.
 *
 * {@linkcode MaterialInstancePlugin} normally installs this system for a
 * material/component pair. The factory itself only returns the system.
 *
 * @example
 * ```js
 * const bin3D = genBinRenderables3D(BasicMaterial, BasicMaterialInstance)
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: bin3D
 * })
 * ```
 *
 * @template {Material} T
 * @param {Constructor<T>} assettype - Material asset constructor used for the pass key.
 * @param {Constructor<MaterialInstance<T>>} componenttype - Material-instance component constructor.
 * @returns {SystemFunc} System that rebuilds 3D opaque render passes.
 */
export function genBinRenderables3D(assettype, componenttype) {
  const materialid = typeid(assettype)

  return function binRenders3D(world) {
    const renderables = new Query(world, [GlobalTransform3D, Meshed, componenttype])
    const cameras = new Query(world, [RenderLists3D, GlobalTransform3D, Camera])

    cameras.each(([renderLists]) => {
      renderLists.clear()
      const opaquePass = renderLists.getOpaquePass(materialid) || renderLists.setOpaquePass(materialid)

      renderables.each(([transform, mesh, material]) => {
        opaquePass.push(new RenderType(material.handle.id(), mesh.handle.id(), transform))
      })
    })
  }
}
