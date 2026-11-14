/** @import { AssetServer, AssetServerPlugin, Handle } from '@wimaengine/asset' */
/** @import { TypeId } from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AssetExporterPlugin, AssetImporterPlugin, AssetPlugin, Assets } from '@wimaengine/asset'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { HierarchyPlugin } from '@wimaengine/hierarchy'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { Scene, SceneFilter } from './assets'
import { SceneInstance } from './components'
import { SceneAdded, SceneDropped, SceneModified } from './events'
import { initSceneInstance, dropSceneInstance } from './hooks'
import { JSONSceneExporter, JSONSceneImporter, SceneAssets, SceneFilterAssets, SceneSpawner } from './resources'
import { refreshModifiedScenes, registerSceneTypes, spawnScenes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds scene asset loading and scene instantiation support to an {@linkcode App}.
 *
 * `ScenePlugin` makes {@linkcode Scene} assets available through the asset
 * pipeline. It registers {@linkcode JSONSceneImporter} and
 * {@linkcode JSONSceneExporter} for JSON scene data, and makes
 * {@linkcode SceneFilter} available as an asset type for optional filtering
 * during scene restoration.
 *
 * The plugin provides the {@linkcode SceneSpawner} resource and the
 * {@linkcode SceneAssets} and {@linkcode SceneFilterAssets} resource aliases. Add a
 * {@linkcode SceneInstance} component to an entity to restore the referenced
 * scene beneath that entity when its asset becomes available. A
 * {@linkcode SceneFilter} handle can limit which component and resource types are
 * restored, and changes to a loaded scene are reflected in its live instances.
 * The component hooks track pending instances and release their asset handles
 * when an instance is removed.
 *
 * Use `world.getResource` with {@linkcode SceneAssets} for scene handles and with
 * {@linkcode SceneFilterAssets} for filter handles. The aliases refer to the
 * shared asset pools used by the scene pipeline.
 *
 * Register {@linkcode AssetServerPlugin}, {@linkcode CorePlugin},
 * {@linkcode ReflectPlugin}, and {@linkcode HierarchyPlugin} with the app alongside
 * {@linkcode ScenePlugin}. The app validates these dependencies but does not
 * install missing plugins automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetServerPlugin } from '@wimaengine/asset'
 * import { CorePlugin } from '@wimaengine/core'
 * import { HierarchyPlugin } from '@wimaengine/hierarchy'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { ScenePlugin } from '@wimaengine/scene'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new AssetServerPlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .registerPlugin(new ScenePlugin())
 *   .setRunner(() => {})
 *   .run()
 * ```
 *
 * Load a JSON {@linkcode Scene} through {@linkcode AssetServer}, obtain a scene
 * {@linkcode Handle} from the {@linkcode SceneAssets} pool, and add a
 * {@linkcode SceneInstance} component constructed with that handle to an entity.
 * The scene is restored when its asset becomes available.
 *
 * @category plugin
 */
export class ScenePlugin extends Plugin {

  /**
   * Adds scene asset adapters, resources, aliases, and component hooks to an
   * {@linkcode App}.
   *
   * JSON scene data is connected to the asset pipeline through
   * {@linkcode JSONSceneImporter} and {@linkcode JSONSceneExporter}. The plugin also
   * registers scene lifecycle events, makes {@linkcode SceneFilter} a loadable
   * asset type, and provides {@linkcode SceneSpawner} for pending scene
   * instances. {@linkcode SceneAssets} and {@linkcode SceneFilterAssets} identify
   * the corresponding typed asset pools.
   *
   * Hooks for {@linkcode SceneInstance} queue a referenced scene until its asset
   * is available, restore it beneath the instance entity, apply its optional
   * filter, and release its handles when the component is removed. Existing
   * instances are restored from the current scene asset when that asset is
   * modified.
   *
   * @param {App} app - App receiving scene support.
   * @returns {void}
   */
  register(app) {
    app
      .registerPlugin(new AssetImporterPlugin({
        asset: Scene,
        importer: new JSONSceneImporter()
      }))
      .registerPlugin(new AssetExporterPlugin({
        asset: Scene,
        exporter: new JSONSceneExporter()
      }))
      .registerPlugin(new AssetPlugin({
        asset: Scene,
        events: {
          added: SceneAdded,
          modified: SceneModified,
          dropped: SceneDropped
        }
      }))
      .registerPlugin(new AssetPlugin({
        asset: SceneFilter
      }))
      .setResource(new SceneSpawner())
      .setComponentHooks(SceneInstance, new ComponentHooks(
        initSceneInstance,
        dropSceneInstance
      ))
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerSceneTypes })
      .registerSystem({
        label: 'refreshModifiedScenes',
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.End,
        system: refreshModifiedScenes,
        after: [`clearEvents<${typeid(SceneModified)}>`],
        before: [spawnScenes]
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.End,
        system: spawnScenes,
        after: [`updateAssetEvents<${typeid(Scene)}>`]
      })
      .setResourceAlias(typeidGeneric(Assets, [Scene]), SceneAssets)
      .setResourceAlias(typeidGeneric(Assets, [SceneFilter]), SceneFilterAssets)
  }

  /**
   * Returns the plugins required directly by scene support.
   *
   * Scene restoration uses {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
   * {@linkcode HierarchyPlugin}. The JSON asset adapters registered by
   * {@linkcode register} also require {@linkcode AssetServerPlugin}, so that plugin
   * must be registered with the app as well. The app validates these
   * dependencies and does not install them automatically.
   *
   * @returns {TypeId[]} Type IDs for {@linkcode CorePlugin},
   * {@linkcode ReflectPlugin}, and {@linkcode HierarchyPlugin}.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(HierarchyPlugin)]
  }
}

/* eslint-enable jsdoc/check-tag-names */
