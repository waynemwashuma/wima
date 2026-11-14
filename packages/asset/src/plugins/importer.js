/** @import {Constructor} from '@wimaengine/type' */
/** @import {TypeId} from '@wimaengine/type' */
/** @import {AssetServer} from '../resources' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Importer } from '../core'
import { registerAssetImporterOnAssetServer } from '../systems'
import { AssetServerPlugin } from './assetServer'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers one typed {@linkcode Importer} with an app so the
 * {@linkcode AssetServer} can use it for matching load requests.
 *
 * Keep `options.asset` equal to {@linkcode Importer#asset}. The asset server uses
 * the importer's constructor and the exact labels from
 * {@linkcode Importer#getExtensions} to select a converter. Use this plugin with
 * {@linkcode AssetServerPlugin}; it registers the importer but does not fetch or
 * deserialize assets itself.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetImporterPlugin, AssetServerPlugin, Importer } from '@wimaengine/asset'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * class TextAsset {
 *   constructor(value) {
 *     this.value = value
 *   }
 * }
 *
 * class TextImporter extends Importer {
 *   constructor() {
 *     super(TextAsset)
 *   }
 *
 *   async deserialize(response, _typeRegistry) {
 *     return new TextAsset(await response.text())
 *   }
 *
 *   getExtensions() {
 *     return ['txt']
 *   }
 * }
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new AssetServerPlugin())
 *   .registerPlugin(new AssetImporterPlugin({
 *     asset: TextAsset,
 *     importer: new TextImporter()
 *   }))
 *   .setRunner(() => {})
 *   .run()
 * // The app can now load TextAsset values from `.txt` files.
 * ```
 *
 * @template T
 * @category plugin
 */

export class AssetImporterPlugin extends Plugin {

  /**
   * Asset constructor paired with this plugin's importer.
   *
   * Pass the same constructor stored in {@linkcode Importer#asset}. The
   * importer's constructor controls asset-server lookup, while this value also
   * contributes to the plugin's identity.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * Importer registered by this plugin.
   *
   * Its {@linkcode Importer#asset} and {@linkcode Importer#getExtensions} values
   * identify the asset type and exact path-extension labels handled by the
   * asset server.
   *
   * @readonly
   * @type {Importer<T>}
   */
  importer

  /**
   * Creates a plugin for one asset constructor and its importer.
   *
   * The `asset` and `importer` values are stored unchanged. Keep `asset` equal
   * to {@linkcode Importer#asset} because the importer's constructor identifies
   * the type selected by the asset server.
   *
   * @param {AssetImporterPluginOptions<T>} options - Asset/importer pair to
   * register.
   */
  constructor(options) {
    super()
    const { asset, importer } = options

    this.asset = asset
    this.importer = importer
  }

  /**
   * Registers the configured {@linkcode Importer} with the app's
   * {@linkcode AssetServer} during app startup.
   *
   * The server uses {@linkcode Importer#asset} and
   * {@linkcode Importer#getExtensions} to match load requests. The app must
   * provide {@linkcode AssetServer}, typically through
   * {@linkcode AssetServerPlugin}, and include {@linkcode CorePlugin}.
   *
   * @param {App} app - {@linkcode App} receiving the importer configuration.
   * @returns {void}
   */
  register(app) {
    const { asset, importer } = this

    app
      .registerSystem({
        label: `registerAssetImporterOnAssetServer<${typeid(asset)}>`,
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerAssetImporterOnAssetServer(asset, importer)
      })
  }

  /**
   * Returns the plugins required before this plugin can register its importer.
   *
   * The app validates these dependencies but does not install them
   * automatically.
   *
   * @returns {TypeId[]} Type IDs for {@linkcode CorePlugin} and
   * {@linkcode AssetServerPlugin}.
   */
  requires() {
    return [typeid(CorePlugin), typeid(AssetServerPlugin)]
  }

  /**
   * Returns this plugin's identity for its asset constructor.
   *
   * Different asset constructors receive different identities. Registering a
   * second importer plugin for the same constructor produces a duplicate
   * identity rejected by the app.
   *
   * @returns {TypeId} Plugin identity as a {@linkcode TypeId}.
   */
  name() {
    return typeidGeneric(AssetImporterPlugin, [this.asset])
  }
}

/**
 * @template T
 * @typedef AssetImporterPluginOptions
 * @property {Constructor<T>} asset - Asset constructor used for the plugin
 * identity. It should match {@linkcode Importer#asset} so both values describe
 * the same asset family.
 * @property {Importer<T>} importer - Importer whose {@linkcode Importer#asset}
 * and {@linkcode Importer#getExtensions} values select load requests.
 */
/* eslint-enable jsdoc/check-tag-names */
