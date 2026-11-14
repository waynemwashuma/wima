/** @import {Constructor, TypeId} from '@wimaengine/type' */
/** @import {UniformBind} from '@wimaengine/render-core' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { Material, RenderCorePlugin } from '@wimaengine/render-core'
import { Transform3DPlugin } from '@wimaengine/transform'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { WindowPlugin } from '@wimaengine/window'
import { WebglRendererPlugin } from '../plugin'
import { genRegisterBuffer, genRender, genRenderPipeline } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Configures one {@linkcode Material} asset type with a supplied 3D vertex and
 * fragment shader pair for WebGL rendering.
 *
 * The material type must satisfy {@linkcode UniformBind} so its instances can
 * provide the values used for WebGL uniforms through
 * {@linkcode UniformBind#asUniformBind}.
 *
 * @template {Material & UniformBind} T
 * @category plugin
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { DefaultPlugin } from '@wimaengine/misc'
 * import { WebglMaterialPlugin, WebglRendererPlugin } from '@wimaengine/render-webgl'
 * import { DOMWindowPlugin } from '@wimaengine/window-dom'
 * import { CustomMaterial } from './custom-material'
 *
 * const app = new App()
 * app
 *   .registerPlugin(new DefaultPlugin())
 *   .registerPlugin(new DOMWindowPlugin())
 *   .registerPlugin(new WebglRendererPlugin())
 *   .registerPlugin(new WebglMaterialPlugin({
 *     material: CustomMaterial, // extends Material and implements asUniformBind()
 *     vertex3d: vertexSource,
 *     fragment3d: fragmentSource
 *   }))
 *   .run()
 * ```
 */
export class WebglMaterialPlugin extends Plugin {

  /**
   * Material asset constructor configured for WebGL rendering.
   *
   * The material type must satisfy both {@linkcode Material} and
   * {@linkcode UniformBind}. Its {@linkcode UniformBind#asUniformBind} method
   * supplies the values bound to the material's WebGL uniforms.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  material

  /**
   * Vertex-stage shader source for the material's 3D WebGL pipeline.
   *
   * Provide a source compatible with the material and its matching
   * `fragment3d` shader.
   *
   * @readonly
   * @type {string}
   */
  vertex3d

  /**
   * Fragment-stage shader source for the material's 3D WebGL pipeline.
   *
   * Provide a source compatible with the material and its matching
   * `vertex3d` shader.
   *
   * @readonly
   * @type {string}
   */
  fragment3d

  /**
   * Creates a WebGL material configuration from a material constructor and
   * its matching 3D shader sources.
   *
   * `material` identifies the asset type; `vertex3d` and `fragment3d` provide
   * the shader stages used to render it. The material type must satisfy
   * {@linkcode Material} and {@linkcode UniformBind}.
   *
   * @param {WebglMaterialPluginOptions<T>} options - Material constructor and 3D shader source strings.
   */
  constructor({
    fragment3d,
    vertex3d,
    material
  }) {
    super()
    this.vertex3d = vertex3d
    this.fragment3d = fragment3d
    this.material = material
  }

  /**
   * Configures an {@linkcode App} to render the material's 3D opaque pass with
   * the supplied shader pair.
   *
   * Matching material assets use the material's
   * {@linkcode UniformBind#asUniformBind} values for WebGL uniforms.
   *
   * @param {App} app - {@linkcode App} receiving the material and shader configuration.
   * @returns {void}
   */
  register(app) {
    const { material, vertex3d, fragment3d } = this

    app
      .registerSystem({
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        label: `registerBuffers<${typeid(material)}>`,
        system: genRegisterBuffer(material)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.PostMain,
        label: `initRenderPipeline<${typeid(material)}>`,
        system: genRenderPipeline(material, vertex3d, fragment3d)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.PostMain,
        label: `renderToWebgl<${typeid(material)}>`,
        system: genRender(material)
      })
  }

  /**
   * Returns the plugin IDs required for WebGL material rendering.
   *
   * The app must already have {@linkcode CorePlugin},
   * {@linkcode WebglRendererPlugin}, {@linkcode RenderCorePlugin},
   * {@linkcode Transform3DPlugin}, and {@linkcode WindowPlugin} registered.
   * Registering this plugin does not install those dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(WebglRendererPlugin),
      typeid(RenderCorePlugin),
      typeid(Transform3DPlugin),
      typeid(WindowPlugin)
    ]
  }

  /**
   * Returns the generic plugin ID for this material constructor.
   *
   * The material constructor distinguishes this plugin's configuration from
   * configurations for other material types.
   *
   * @returns {TypeId} Generic plugin {@linkcode TypeId}.
   */
  name() {
    return typeidGeneric(WebglMaterialPlugin, [this.material])
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @template {Material & UniformBind} T
 * @typedef WebglMaterialPluginOptions
 * @property {string} vertex3d
 * @property {string} fragment3d
 * @property {Constructor<T>} material
 */
