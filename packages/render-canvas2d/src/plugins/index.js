/** @import { Constructor, TypeId } from '@wimaengine/type' */
/** @import { Canvas2DFunction } from '../types' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { Material, RenderCorePlugin } from '@wimaengine/render-core'
import { Transform2DPlugin } from '@wimaengine/transform'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { WindowPlugin } from '@wimaengine/window'
import { Canvas2DRendererPlugin } from '../plugin'
import { genrender } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Connects one {@linkcode Material} asset type to one {@linkcode Canvas2DFunction}
 * draw function for Canvas 2D rendering.
 *
 * @template {Material} T
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetPlugin } from '@wimaengine/asset'
 * import { DefaultPlugin } from '@wimaengine/misc'
 * import { Material } from '@wimaengine/render-core'
 * import {
 *   Canvas2DMaterialPlugin,
 *   Canvas2DRendererPlugin
 * } from '@wimaengine/render-canvas2d'
 *
 * class OutlineMaterial extends Material {}
 * const drawOutline = (ctx, material, mesh, textures) => {
 *   // Draw `mesh` using `material` and the shared `textures` cache.
 * }
 *
 * new App()
 *   .registerPlugin(new DefaultPlugin())
 *   .registerPlugin(new AssetPlugin({ asset: OutlineMaterial }))
 *   .registerPlugin(new Canvas2DRendererPlugin())
 *   .registerPlugin(new Canvas2DMaterialPlugin({
 *     material: OutlineMaterial,
 *     update: drawOutline
 *   }))
 *   .run()
 * ```
 *
 * Together, the asset and material plugins make `OutlineMaterial` available
 * and connect it to `drawOutline` for Canvas 2D drawing.
 *
 * @category plugin
 */
export class Canvas2DMaterialPlugin extends Plugin {

  /**
   * Canvas 2D draw callback used for each opaque item of `T`.
   *
   * The callback follows {@linkcode Canvas2DFunction}.
   *
   * @readonly
   * @type {Canvas2DFunction<T>}
   */
  update

  /**
   * Constructor for the {@linkcode Material} asset type rendered by this plugin.
   *
   * The plugin uses this constructor to identify the material type it handles.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  material

  /**
   * Creates a Canvas 2D material plugin from one material constructor and draw function.
   *
   * The supplied values are stored in
   * {@linkcode Canvas2DMaterialPlugin#material} and
   * {@linkcode Canvas2DMaterialPlugin#update}; app registration occurs later
   * through {@linkcode Canvas2DMaterialPlugin#register}.
   *
   * @param {Canvas2DMaterialPluginOptions<T>} options - Material constructor and draw function.
   */
  constructor({ update, material }) {
    super()
    this.update = update
    this.material = material
  }

  /**
   * Connects this material type to its Canvas 2D draw callback for an app.
   *
   * Matching opaque items are drawn through
   * {@linkcode Canvas2DMaterialPlugin#update} using
   * {@linkcode Canvas2DFunction}.
   *
   * @param {App} app - App receiving this material renderer.
   * @returns {void}
   */
  register(app) {
    const { material, update } = this

    app.registerSystem({
      schedule: AppSchedule.Update,
      label: `renderToCanvas2d<${typeid(material)}>`,
      systemGroup: CoreSystems.PostMain,
      system: genrender(material, update)
    })
  }

  /**
   * Returns the plugin IDs required by this Canvas 2D material renderer.
   *
   * The IDs are returned in this order:
   * `typeid(CorePlugin)`, `typeid(Canvas2DRendererPlugin)`,
   * `typeid(RenderCorePlugin)`, `typeid(Transform2DPlugin)`, and
   * `typeid(WindowPlugin)`. The app validates these IDs through
   * {@linkcode Plugin#requires}; it does not install missing dependencies.
   *
   * @returns {TypeId[]} Required plugin type IDs.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(Canvas2DRendererPlugin),
      typeid(RenderCorePlugin),
      typeid(Transform2DPlugin),
      typeid(WindowPlugin)
    ]
  }

  /**
   * Returns this instance's generic plugin identity.
   *
   * The value is `typeidGeneric(Canvas2DMaterialPlugin, [this.material])`.
   * The material constructor is part of the identity; the `update` callback is
   * not, so instances configured with the same material constructor receive
   * the same plugin ID even when their callbacks differ.
   *
   * @returns {TypeId} Generic ID for this material asset type.
   */
  name() {
    return typeidGeneric(Canvas2DMaterialPlugin, [this.material])
  }
}

/**
 * Configuration for {@linkcode Canvas2DMaterialPlugin} with a material
 * constructor and Canvas 2D draw callback.
 *
 * @template {Material} T
 * @typedef Canvas2DMaterialPluginOptions
 * @property {Canvas2DFunction<T>} update - Canvas 2D draw callback.
 * @property {Constructor<T>} material - Constructor for the {@linkcode Material} asset type.
 */

/* eslint-enable jsdoc/check-tag-names */
