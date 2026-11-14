/** @import {TypeId} from '@wimaengine/type' */
/** @import {AssetPlugin} from './asset' */
/** @import {AssetImporterPlugin} from './importer' */
/** @import {AssetExporterPlugin} from './exporter' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { EventPlugin } from '@wimaengine/event'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { AssetLoadFail, AssetLoadSuccess, AssetSaveSuccess } from '../events'
import { AssetServer } from '../resources'
import { updateAssets, logFailedLoads, registerAssetServerTypes } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Installs app-wide asset loading and saving support.
 *
 * This plugin has no options. It adds an {@linkcode AssetServer} resource to the
 * app's default world and makes typed result events available for
 * {@linkcode AssetLoadSuccess}, {@linkcode AssetSaveSuccess}, and
 * {@linkcode AssetLoadFail}. Use {@linkcode AssetPlugin},
 * {@linkcode AssetImporterPlugin}, and {@linkcode AssetExporterPlugin} to provide
 * the asset types and handlers that the server uses for loading and saving.
 *
 * Register {@linkcode CorePlugin} and {@linkcode ReflectPlugin} before this plugin.
 * Registering {@linkcode AssetServerPlugin} does not add either dependency.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetServerPlugin } from '@wimaengine/asset'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new AssetServerPlugin())
 *   .setRunner(() => {})
 *   .run()
 * ```
 *
 * The inherited {@linkcode Plugin#name}
 * identifies this plugin as `typeid(AssetServerPlugin)`, so an app can have
 * only one instance.
 *
 * @category plugin
 */
export class AssetServerPlugin extends Plugin {

  /**
   * Adds the asset server and its typed result events to the app.
   *
   * The app receives an {@linkcode AssetServer} resource in its default world
   * and typed event resources through {@linkcode EventPlugin} for
   * {@linkcode AssetLoadSuccess}, {@linkcode AssetSaveSuccess}, and
   * {@linkcode AssetLoadFail}.
   *
   * Requests made through {@linkcode AssetServer} are queued and processed in
   * order. A load fetches and imports asset data, while a save exports asset
   * data and sends it to its destination. Successful operations publish their
   * matching result event, and failed loads or saves publish
   * {@linkcode AssetLoadFail}.
   *
   * @param {App} app - {@linkcode App} receiving the asset runtime configuration.
   * @returns {void}
   */
  register(app) {
    app
      .setResource(new AssetServer())
      .registerPlugin(new EventPlugin({
        event: AssetLoadSuccess
      }))
      .registerPlugin(new EventPlugin({
        event: AssetSaveSuccess
      }))
      .registerPlugin(new EventPlugin({
        event: AssetLoadFail
      }))
      .registerSystem({
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerAssetServerTypes
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.PostMain,
        system: updateAssets
      })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: logFailedLoads })
  }

  /**
   * Declares the plugins required by the asset server.
   *
   * The asset server depends on {@linkcode CorePlugin} and
   * {@linkcode ReflectPlugin}. Register both plugins before using the asset
   * server; this plugin does not install them automatically.
   *
   * @returns {TypeId[]} Required plugin type IDs.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }

}

/* eslint-enable jsdoc/check-tag-names */
