/** @import { DefaultPlugin } from '@wimaengine/misc' */
/** @import { TypeId } from '@wimaengine/type' */
/** @import { Transform3DPlugin } from '@wimaengine/transform' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { warn } from '@wimaengine/logger'
import { ReflectPlugin } from '@wimaengine/reflect'
import { MeshAttribute, ProgramCache, BasicMaterial, RenderCorePlugin } from '@wimaengine/render-core'
import { typeid } from '@wimaengine/type'
import { MainWindow, Window, Windows, WindowPlugin } from '@wimaengine/window'
import { WebglMaterialPlugin } from './plugins'
import { AttributeMap, ClearColor, MeshCache, UBOCache, WebglProgramCache } from './resources'
import { basicMaterial3DFragment, basicMaterial3DVertex } from './shaders'
import { disposeDroppedMeshes, queueMeshes, registerWebglTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the WebGL 2 rendering backend for an {@linkcode App}.
 *
 * Register this plugin to render mesh and material assets through the WebGL 2
 * context associated with the app's main {@linkcode Window}. The main window
 * must provide a canvas with a WebGL 2 context; this plugin does not create a
 * canvas.
 *
 * The plugin includes a built-in 3D pipeline for {@linkcode BasicMaterial}.
 * Register another {@linkcode WebglMaterialPlugin} for a different material type
 * and matching shader pair. The built-in material configuration also requires
 * {@linkcode Transform3DPlugin}.
 *
 * Register {@linkcode DefaultPlugin} or the required dependencies before app
 * startup. Dependencies are checked but are not installed automatically.
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
 * ```
 *
 * @category plugin
 */
export class WebglRendererPlugin extends Plugin {

  /**
   * Stages the renderer resources and built-in material configuration in an
   * {@linkcode App}.
   *
   * The default world receives {@linkcode ProgramCache}, {@linkcode MeshCache},
   * {@linkcode UBOCache}, {@linkcode ClearColor}, {@linkcode AttributeMap}, and
   * {@linkcode WebglProgramCache}. The attribute map starts with built-in
   * {@linkcode MeshAttribute} descriptors for position, normal, tangent, UV, UVB,
   * and color data.
   *
   * The built-in {@linkcode BasicMaterial} configuration uses
   * {@linkcode WebglMaterialPlugin} with the bundled 3D shaders. Register another
   * {@linkcode WebglMaterialPlugin} when an app needs a different material and
   * shader pair. Rendering uses the canvas for the main {@linkcode Window} in
   * {@linkcode Windows}; the canvas must provide a WebGL 2 context.
   *
   * @param {App} app - The {@linkcode App} to configure with this renderer.
   * @returns {void}
   */
  register(app) {
    const attribute = new AttributeMap()

    registerDefaultAttributeLocs(attribute)
    app
      .setResource(new ProgramCache())
      .setResource(new MeshCache())
      .setResource(new UBOCache())
      .setResource(new ClearColor())
      .setResource(attribute)
      .setResource(new WebglProgramCache())
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerWebglTypes })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: registerBuffers })
      .registerPlugin(new WebglMaterialPlugin({
        material: BasicMaterial,
        vertex3d: basicMaterial3DVertex,
        fragment3d: basicMaterial3DFragment
      }))
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.PostMain, system: disposeDroppedMeshes })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.PostMain, system: queueMeshes })
  }

  /**
   * Returns this renderer's direct plugin dependencies.
   *
   * Register {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * {@linkcode RenderCorePlugin}, and {@linkcode WindowPlugin} before startup.
   * The nested {@linkcode WebglMaterialPlugin} registered for
   * {@linkcode BasicMaterial} separately requires {@linkcode Transform3DPlugin};
   * that dependency is not included in this return value. Dependencies are
   * checked but are not installed automatically.
   *
   * @returns {TypeId[]} Type IDs for {@linkcode CorePlugin},
   * {@linkcode ReflectPlugin}, {@linkcode RenderCorePlugin}, and
   * {@linkcode WindowPlugin}.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(RenderCorePlugin),
      typeid(WindowPlugin)
    ]
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @param {AttributeMap} attributeMap
 */
function registerDefaultAttributeLocs(attributeMap) {
  attributeMap
    .set(MeshAttribute.Position2D.name, MeshAttribute.Position2D)
    .set(MeshAttribute.Position3D.name, MeshAttribute.Position3D)
    .set(MeshAttribute.Normal2D.name, MeshAttribute.Normal2D)
    .set(MeshAttribute.Normal3D.name, MeshAttribute.Normal3D)
    .set(MeshAttribute.Tangent2D.name, MeshAttribute.Tangent2D)
    .set(MeshAttribute.Tangent3D.name, MeshAttribute.Tangent3D)
    .set(MeshAttribute.UV.name, MeshAttribute.UV)
    .set(MeshAttribute.UVB.name, MeshAttribute.UVB)
    .set(MeshAttribute.Color.name, MeshAttribute.Color)
}

/**
 * @param {World} world
 */
function registerBuffers(world) {
  const ubos = world.getResource(UBOCache)
  const canvases = world.getResource(Windows)
  const windows = new Query(world, [EntityHandle, Window, MainWindow])

  const window = windows.single()

  if (!window) return warn('Please define the main window for rendering.')

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const gl = canvas.getContext('webgl2')

  if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

  if (!ubos.get('Camera')) ubos.create(gl, 'Camera', 128)
}
