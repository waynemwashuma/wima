/** @import {Constructor} from '@wimaengine/type' */
/** @import {Canvas2DFunction} from '../types' */
/** @import {SystemFunc} from '@wimaengine/ecs' */
import { Assets } from '@wimaengine/asset'
import { EntityHandle, Query } from '@wimaengine/ecs'
import { warn } from '@wimaengine/logger'
import { Material, Mesh, TextureCache, RenderLists2D, Camera, OrthographicProjection } from '@wimaengine/render-core'
import { GlobalTransform2D } from '@wimaengine/transform'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { MainWindow, Windows, Window } from '@wimaengine/window'

/**
 * Creates a Canvas 2D render system for one material constructor.
 *
 * The returned system expects typed {@linkcode Assets} resources for
 * {@linkcode Mesh} and the generic `T` material, a {@linkcode TextureCache} for
 * image textures, a {@linkcode Windows} resource, and a main-window entity with
 * {@linkcode EntityHandle}, {@linkcode Window}, and {@linkcode MainWindow}. It visits cameras that have
 * {@linkcode GlobalTransform2D}, {@linkcode RenderLists2D}, and {@linkcode Camera}.
 *
 * For each camera, the system applies its orthographic projection and view
 * transform, then resolves or creates the camera's opaque pass for `type`. It
 * calls `renderMaterial` for entries whose mesh and material handles resolve,
 * passing the drawing context, material, mesh, and shared texture cache.
 * Missing asset values are skipped, and the existing render list is not
 * cleared or rebuilt by this system.
 *
 * If no main-window entity is found, the system warns and stops. It also stops
 * when the window has no registered canvas. A canvas without a 2D context
 * produces a warning. A camera using a non-orthographic projection throws
 * because this renderer supports {@linkcode OrthographicProjection} only.
 * Missing required resources cause the returned system's resource lookup to
 * fail.
 *
 * @example
 * ```js
 * const renderSystem = genrender(BasicMaterial, (ctx, material, mesh, textures) => {
 *   // Draw `mesh` with `material`, using `textures` when needed.
 * })
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: renderSystem
 * })
 * ```
 *
 * @template {Material} T
 * @param {Constructor<T>} type - Material constructor whose opaque pass is rendered.
 * @param {Canvas2DFunction<T>} renderMaterial - Callback that draws one material and mesh.
 * @returns {SystemFunc} System that renders the material's 2D opaque pass.
 */
export function genrender(type, renderMaterial) {
  const meshid = typeidGeneric(Assets, [Mesh])
  const materialid = typeidGeneric(Assets, [type])

  return function renderToCanvas2d(world) {

    /** @type {Assets<Mesh>} */
    const meshes = world.getResourceByTypeId(meshid)

    /** @type {Assets<T>} */
    const materials = world.getResourceByTypeId(materialid)

    /** @type {TextureCache<HTMLImageElement>} */
    const textures = world.getResourceByTypeId(typeid(TextureCache))
    const cameras = new Query(world, [GlobalTransform2D, RenderLists2D, Camera])
    const windows = new Query(world, [EntityHandle, Window, MainWindow])
    const canvases = world.getResource(Windows)
    const window = windows.single()

    if (!window) return warn('Please define the main window before.')

    const canvas = canvases.getWindow(window[0])

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const width = window[1].getWidth()
    const height = window[1].getHeight()
    const offsetX = width / 2
    const offsetY = height / 2

    if (!ctx) return warn('2d context could not be created on the canvas.')

    cameras.each(([cameraTransform, renderList, camera]) => {
      const view = GlobalTransform2D.invert(cameraTransform)

      ctx.save()

      if (camera.projection instanceof OrthographicProjection) {
        const { projection } = camera
        const projectionWidth = projection.right - projection.left
        const projectionHeight = projection.top - projection.bottom
        const projectionOffsetX = -(projection.right + projection.left) / projectionWidth
        const projectionOffsetY = -(projection.top + projection.bottom) / projectionHeight

        ctx.translate(offsetX, offsetY)
        ctx.scale(offsetX, -offsetY)
        ctx.transform(
          2 / projectionWidth,
          0,
          0,
          2 / projectionHeight,
          projectionOffsetX,
          projectionOffsetY
        )
      } else {
        throw new Error('Unsupported camera projection for 2d camera')
      }

      ctx.transform(
        view.a,
        view.b,
        view.c,
        view.d,
        view.x,
        view.y
      )

      const list = renderList.getOpaquePass(typeid(type)) || renderList.setOpaquePass(typeid(type))

      for (let i = 0; i < list.length; i++) {
        const { materialid, meshid, transform } = list[i]
        const mesh = meshes.getByAssetId(meshid)
        const material = materials.getByAssetId(materialid)

        if (!material || !mesh) continue

        ctx.save()
        ctx.beginPath()
        ctx.transform(
          transform.a,
          transform.b,
          transform.c,
          transform.d,
          transform.x,
          transform.y
        )

        renderMaterial(ctx, material, mesh, textures)

        ctx.closePath()
        ctx.restore()
      }

      ctx.restore()
    })
  }
}

export * from './clear'
export * from './types'
