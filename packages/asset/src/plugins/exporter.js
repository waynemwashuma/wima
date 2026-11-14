/** @import {Constructor, TypeId} from '@wimaengine/type' */
/** @import {AssetServer} from '../resources' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Exporter } from '../core'
import { registerAssetExporterOnAssetServer } from '../systems'
import { AssetServerPlugin } from './assetServer'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers one typed {@linkcode Exporter} with an app's {@linkcode AssetServer}.
 *
 * Supply the same asset constructor in both plugin options and
 * {@linkcode Exporter#asset}. The {@linkcode AssetServer} uses that constructor and
 * the labels from {@linkcode Exporter#getExtensions} to select an exporter for
 * matching save requests. Include {@linkcode AssetServerPlugin} and
 * {@linkcode CorePlugin} in the app when using this plugin.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetExporterPlugin, AssetServerPlugin, Exporter } from '@wimaengine/asset'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * class TextAsset {
 *   constructor(value) {
 *     this.value = value
 *   }
 * }
 *
 * class TextExporter extends Exporter {
 *   constructor() {
 *     super(TextAsset)
 *   }
 *
 *   async serialize(asset, _typeRegistry) {
 *     return JSON.stringify(asset)
 *   }
 *
 *   getExtensions() {
 *     return ['json']
 *   }
 * }
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new AssetServerPlugin())
 *   .registerPlugin(new AssetExporterPlugin({
 *     asset: TextAsset,
 *     exporter: new TextExporter()
 *   }))
 *   .setRunner(() => {})
 *   .run()
 * // The asset server can use TextExporter for TextAsset values and `json` paths.
 * ```
 *
 * @template T
 * @category plugin
 */
export class AssetExporterPlugin extends Plugin {

  /**
   * Asset constructor paired with this plugin's exporter.
   *
   * Pass the same constructor stored in {@linkcode Exporter#asset}. The
   * {@linkcode AssetServer} uses the exporter's constructor and extensions when
   * selecting a save handler.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * Exporter instance registered for {@linkcode asset}.
   *
   * Its {@linkcode Exporter#asset} and {@linkcode Exporter#getExtensions} values
   * identify the asset type and path extensions handled by the
   * {@linkcode AssetServer}.
   *
   * @readonly
   * @type {Exporter<T>}
   */
  exporter

  /**
   * Creates a plugin that registers one exporter for one asset type.
   *
   * The typed `asset` and `exporter` values are stored unchanged. Pass matching
   * values so the plugin identity and {@linkcode Exporter#asset} describe the
   * same asset type.
   *
   * @param {AssetExporterPluginOptions<T>} options - Asset constructor and
   * matching exporter.
   */
  constructor(options) {
    super()
    const { asset, exporter } = options

    this.asset = asset
    this.exporter = exporter
  }

  /**
   * Makes the configured {@linkcode Exporter} available through the app's
   * {@linkcode AssetServer}.
   *
   * The {@linkcode AssetServer} uses the exporter for values whose constructor
   * matches {@linkcode Exporter#asset} and for paths with labels returned by
   * {@linkcode Exporter#getExtensions}. Pass the same constructor as
   * {@linkcode Exporter#asset}. The app must provide {@linkcode AssetServer} through
   * {@linkcode AssetServerPlugin} and include {@linkcode CorePlugin}.
   *
   * @param {App} app - {@linkcode App} receiving the exporter configuration.
   * @returns {void}
   */
  register(app) {
    const { asset, exporter } = this

    app
      .registerSystem({
        label: `registerAssetExporterOnAssetServer<${typeid(asset)}>`,
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerAssetExporterOnAssetServer(asset, exporter)
      })
  }

  /**
   * Returns the plugins required by this exporter plugin.
   *
   * This plugin requires {@linkcode CorePlugin} and
   * {@linkcode AssetServerPlugin}. The app validates these dependencies; it does
   * not install them automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(AssetServerPlugin)]
  }

  /**
   * Returns this plugin's identity for its asset constructor.
   *
   * Different asset constructors receive different identities, so an app can
   * register one exporter plugin per asset type. A second plugin for the same
   * constructor has the same identity and is rejected by the app.
   *
   * @returns {TypeId} Plugin {@linkcode TypeId}.
   */
  name() {
    return typeidGeneric(AssetExporterPlugin, [this.asset])
  }
}

/* eslint-enable jsdoc/check-tag-names */

/**
 * @template T
 * @typedef AssetExporterPluginOptions
 * @property {Constructor<T>} asset - Asset constructor paired with the
 * exporter. It should match {@linkcode Exporter#asset}.
 * @property {Exporter<T>} exporter - Exporter whose asset constructor and
 * extension labels are used by {@linkcode AssetServer}.
 */
