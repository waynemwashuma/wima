/** @import {DefaultPlugin} from '@wimaengine/misc' */
/** @import {TypeId} from '@wimaengine/type' */
/** @import {Camera, OrthographicProjection, RenderCorePlugin, RenderLists2D} from '@wimaengine/render-core' */
/** @import {GlobalTransform2D, Transform2DPlugin} from '@wimaengine/transform' */
/** @import {MainWindow, Window, Windows} from '@wimaengine/window' */
/** @import {DOMWindowPlugin} from '@wimaengine/window-dom' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { TextureCache, BasicMaterial } from '@wimaengine/render-core'
import { typeid } from '@wimaengine/type'
import { WindowPlugin } from '@wimaengine/window'
import { renderBasicMaterial } from './core'
import { Canvas2DMaterialPlugin } from './plugins'
import { clearCanvas2d, registerCanvas2DTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Installs the Canvas 2D rendering backend in an {@linkcode App}.
 *
 * The plugin prepares {@linkcode TextureCache} for image assets and registers
 * {@linkcode Canvas2DMaterialPlugin} for {@linkcode BasicMaterial}. The default
 * renderer uses {@linkcode GlobalTransform2D}, {@linkcode RenderLists2D},
 * {@linkcode Camera}, and {@linkcode OrthographicProjection} to draw visible 2D
 * meshes as filled paths using their material color. Meshes without position
 * data are skipped. Register another {@linkcode Canvas2DMaterialPlugin} when an
 * application needs a different material type or draw function.
 *
 * Before drawing, the renderer clears the main {@linkcode Window} canvas. If no
 * main window, canvas, or 2D context is available, it does not draw.
 * {@linkcode WindowPlugin} provides the window state, and
 * {@linkcode DOMWindowPlugin} connects that state to a browser canvas stored in
 * {@linkcode Windows}.
 *
 * The plugin directly requires {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
 * and {@linkcode WindowPlugin}. Its material support also uses
 * {@linkcode RenderCorePlugin} and {@linkcode Transform2DPlugin} through
 * {@linkcode Canvas2DMaterialPlugin}. Register the required plugins before
 * starting the app; missing dependencies are not installed automatically.
 *
 * @example
 * ```js
 * import {
 *   App,
 *   Canvas2DRendererPlugin,
 *   DefaultPlugin,
 *   DOMWindowPlugin
 * } from 'wima'
 *
 * new App()
 *   .registerPlugin(new DefaultPlugin())
 *   .registerPlugin(new DOMWindowPlugin())
 *   .registerPlugin(new Canvas2DRendererPlugin())
 *   .run()
 * ```
 *
 * {@linkcode DefaultPlugin} includes the core, reflection, window, render-core,
 * and transform plugins required by this backend and its nested basic-material
 * plugin. {@linkcode DOMWindowPlugin} supplies the browser canvas integration;
 * without it, the renderer can find the ECS window but has no DOM canvas to
 * clear or draw into.
 *
 * @category plugin
 */
export class Canvas2DRendererPlugin extends Plugin {

  /**
   * Adds Canvas 2D rendering resources and basic material support to an app.
   *
   * The plugin provides a shared {@linkcode TextureCache}, connects
   * {@linkcode BasicMaterial} to Canvas 2D drawing, and clears the main window's
   * canvas before a frame is drawn. Applications can add another
   * {@linkcode Canvas2DMaterialPlugin} for a custom material and draw callback.
   *
   * @param {App} app - {@linkcode App} receiving the Canvas 2D renderer.
   * @returns {void}
   */
  register(app) {
    app
      .setResource(new TextureCache())
      .registerSystem({ schedule: AppSchedule.Startup, system: registerCanvas2DTypes })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.Start,
        system: clearCanvas2d
      })
      .registerPlugin(new Canvas2DMaterialPlugin({
        material:BasicMaterial,
        update:renderBasicMaterial
      }))
  }

  /**
   * Returns the plugins required directly by this Canvas 2D renderer.
   *
   * {@linkcode Canvas2DMaterialPlugin} has additional rendering dependencies,
   * but they are not part of this method's direct return value.
   *
   * @returns {TypeId[]} Type IDs for {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * and {@linkcode WindowPlugin}.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(WindowPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
