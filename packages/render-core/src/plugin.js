/** @import {AssetServer, AssetServerPlugin} from '@wimaengine/asset' */
/** @import {defaultRunner} from '@wimaengine/core' */
/** @import {HierarchyPlugin} from '@wimaengine/hierarchy' */
/** @import {TypeId} from '@wimaengine/type' */
/** @import {Transform2DPlugin, Transform3DPlugin} from '@wimaengine/transform' */

import { App, Plugin } from '@wimaengine/app'
import { AssetImporterPlugin, AssetPlugin, Assets } from '@wimaengine/asset'
import { ColorPlugin } from '@wimaengine/color'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { Mesh, Shader, Image, BasicMaterial } from './assets'
import {
  BasicMaterialInstance,
  Meshed,
  removeMeshedHandle
} from './components'
import {
  ImageAdded,
  ImageDropped,
  ImageModified,
  ShaderAdded,
  ShaderDropped,
  ShaderModified,
  BasicMaterialAdded,
  BasicMaterialDropped,
  BasicMaterialModified,
  MeshAdded,
  MeshDropped,
  MeshModified
} from './events'
import { MaterialInstancePlugin } from './plugins'
import { BasicMaterialAssets, ImageAssets, ImageImporter, MeshAssets } from './resources'
import { registerRenderCoreTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds shared rendering asset support to an {@linkcode App}.
 *
 * The plugin provides {@linkcode Image}, {@linkcode Mesh}, {@linkcode Shader}, and
 * {@linkcode BasicMaterial} as render asset types with their lifecycle events.
 * {@linkcode ImageImporter} supports `png` and `jpeg` image assets through
 * {@linkcode AssetServerPlugin}.
 *
 * Typed access to the image, mesh, and basic-material pools is available
 * through {@linkcode ImageAssets}, {@linkcode MeshAssets}, and
 * {@linkcode BasicMaterialAssets}. These aliases refer to the corresponding
 * {@linkcode Assets} pools.
 *
 * The plugin also connects {@linkcode Meshed} and
 * {@linkcode BasicMaterialInstance} to the built-in material integration. Use
 * {@linkcode MaterialInstancePlugin} to configure additional material and
 * component pairs.
 *
 * Register {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, {@linkcode ColorPlugin},
 * {@linkcode MathPlugin}, {@linkcode AssetServerPlugin}, {@linkcode HierarchyPlugin},
 * {@linkcode Transform2DPlugin}, and {@linkcode Transform3DPlugin} with the app.
 * These dependencies are not installed automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetServerPlugin } from '@wimaengine/asset'
 * import { ColorPlugin } from '@wimaengine/color'
 * import { CorePlugin, defaultRunner } from '@wimaengine/core'
 * import { HierarchyPlugin } from '@wimaengine/hierarchy'
 * import { MathPlugin } from '@wimaengine/math'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { RenderCorePlugin } from '@wimaengine/render-core'
 * import { Transform2DPlugin, Transform3DPlugin } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new ColorPlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new AssetServerPlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .registerPlugin(new Transform2DPlugin())
 *   .registerPlugin(new Transform3DPlugin())
 *   .registerPlugin(new RenderCorePlugin())
 *   .setRunner(defaultRunner)
 *   .run()
 * ```
 *
 * @category plugin
 */
export class RenderCorePlugin extends Plugin {

  /**
   * Installs render assets, typed asset-pool aliases, a component hook, and
   * built-in material integration in an {@linkcode App}.
   *
   * The app receives {@linkcode Image}, {@linkcode Mesh}, {@linkcode Shader}, and
   * {@linkcode BasicMaterial} support, together with the typed pools
   * {@linkcode ImageAssets}, {@linkcode MeshAssets}, and
   * {@linkcode BasicMaterialAssets}. The {@linkcode ImageImporter} handles `png`
   * and `jpeg` image assets. The {@linkcode Meshed} component hook releases its
   * mesh handle when the component or its entity is removed, and the built-in
   * {@linkcode BasicMaterialInstance} integration supports material rendering.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setComponentHooks(Meshed, new ComponentHooks(
        null,
        removeMeshedHandle
      ))
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerRenderCoreTypes })
      .registerPlugin(new AssetPlugin({
        asset: Image,
        events: {
          added: ImageAdded,
          modified: ImageModified,
          dropped: ImageDropped
        }
      }))
      .registerPlugin(new AssetImporterPlugin({
        asset: Image,
        importer: new ImageImporter()
      }))
      .registerPlugin(new AssetPlugin({
        asset: Mesh,
        events: {
          added: MeshAdded,
          modified: MeshModified,
          dropped: MeshDropped
        }
      }))
      .registerPlugin(new AssetPlugin({
        asset: Shader,
        events: {
          added: ShaderAdded,
          modified: ShaderModified,
          dropped: ShaderDropped
        }
      }))
      .registerPlugin(new AssetPlugin({
        asset: BasicMaterial,
        events: {
          added: BasicMaterialAdded,
          modified: BasicMaterialModified,
          dropped: BasicMaterialDropped
        }
      }))
      .registerPlugin(new MaterialInstancePlugin({
        asset: BasicMaterial,
        component: BasicMaterialInstance
      }))
      .setResourceAlias(typeidGeneric(Assets, [Image]), ImageAssets)
      .setResourceAlias(typeidGeneric(Assets, [Mesh]), MeshAssets)
      .setResourceAlias(typeidGeneric(Assets, [BasicMaterial]), BasicMaterialAssets)
  }

  /**
   * Returns the plugin IDs required directly by this renderer.
   *
   * The returned IDs identify {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * {@linkcode ColorPlugin}, and {@linkcode MathPlugin}. The app validates these
   * dependencies but does not install missing plugins automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values for
   * {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, {@linkcode ColorPlugin}, and
   * {@linkcode MathPlugin}.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(ColorPlugin),
      typeid(MathPlugin)
    ]
  }
}
/* eslint-enable jsdoc/check-tag-names */
