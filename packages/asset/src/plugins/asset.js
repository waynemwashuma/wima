/** @import { Constructor, TypeId } from '@wimaengine/type' */
/** @import {AssetEvents} from '../systems' */
/** @import {AssetServer} from '../resources' */
/** @import {AssetServerPlugin} from './assetServer' */
/** @import {Events} from '@wimaengine/event' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { EventPlugin } from '@wimaengine/event'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Assets } from '../resources'
import { registerAssetTypes, registerAssetOnAssetServer, unloadDroppedAssets, updateAssetChannel, updateAssetEvents } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds typed asset storage and optional lifecycle events to an {@linkcode App}.
 *
 * Register one instance for each asset constructor the app should manage. The
 * plugin provides a typed {@linkcode Assets} pool for that asset family and
 * connects the pool to the app's {@linkcode AssetServer} resource.
 *
 * The optional `events` option accepts the three constructors in
 * {@linkcode AssetEvents} and provides typed {@linkcode Events} resources for
 * asset-added, asset-modified, and asset-dropped values. Without `events`, no
 * lifecycle event resources are provided.
 *
 * `AssetPlugin` does not create the {@linkcode AssetServer}; register
 * {@linkcode AssetServerPlugin}, or provide a compatible server resource
 * yourself.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetPlugin, AssetServerPlugin } from '@wimaengine/asset'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * class Texture {}
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new AssetServerPlugin())
 *   .registerPlugin(new AssetPlugin({ asset: Texture }))
 *   .setRunner(() => {})
 *   .run()
 * ```
 *
 * @template T
 * @category plugin
 */

export class AssetPlugin extends Plugin {

  /**
   * Asset constructor identifying the family managed by this plugin.
   *
   * It specializes the plugin's typed {@linkcode Assets} pool and identifies the
   * asset constructor used by the plugin's generic identity. Registering
   * another `AssetPlugin` for the same constructor produces the same plugin ID
   * and is rejected by the app.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * Optional constructors for the asset family's lifecycle event resources.
   *
   * When present, {@linkcode register} exposes typed {@linkcode Events}
   * resources for asset-added, asset-modified, and asset-dropped values. All
   * three constructors are required together; when omitted, the plugin does
   * not create lifecycle event resources.
   *
   * @readonly
   * @type {AssetEvents<T> | undefined}
   */
  events

  /**
   * Creates runtime support for one asset constructor.
   *
   * The options are stored until the app invokes {@linkcode register}.
   * Supply the complete `events` object to expose typed added, modified, and
   * dropped lifecycle events for this asset family.
   *
   * @param {AssetPluginOptions<T>} options - Asset constructor and optional
   * lifecycle event constructors.
   */
  constructor(options) {
    super()
    const { asset, events } = options

    this.asset = asset
    this.events = events
  }

  /**
   * Adds the configured typed asset pool and optional lifecycle event resources
   * to an app.
   *
   * The plugin creates an {@linkcode Assets} pool for the configured asset
   * constructor and makes it available through the app's typed resource store.
   * The pool connects to the app's {@linkcode AssetServer} so server-managed
   * assets can use the typed pool.
   *
   * If `events` is configured, the plugin creates typed {@linkcode Events}
   * resources for added, modified, and dropped values. Lifecycle events from
   * the pool are exposed through those resources, and dropped asset metadata is
   * removed from the server.
   *
   * An {@linkcode AssetServer} resource must be available to the app. Register
   * {@linkcode AssetServerPlugin}, or provide that resource yourself, in addition
   * to this plugin. This plugin does not install an asset importer or exporter.
   *
   * @example
   * ```js
   * import { App } from '@wimaengine/app'
   * import { AssetAdded, AssetDropped, AssetModified, AssetPlugin, AssetServerPlugin } from '@wimaengine/asset'
   * import { CorePlugin } from '@wimaengine/core'
   * import { ReflectPlugin } from '@wimaengine/reflect'
   *
   * class Texture {}
   *
   * new App()
   *   .registerPlugin(new ReflectPlugin())
   *   .registerPlugin(new CorePlugin())
   *   .registerPlugin(new AssetServerPlugin())
   *   .registerPlugin(new AssetPlugin({
   *     asset: Texture,
   *     events: { added: AssetAdded, modified: AssetModified, dropped: AssetDropped }
   *   }))
   *   .setRunner(() => {})
   *   .run()
   * // The plugin stages Assets<Texture> and the three typed event resources.
   * ```
   *
   * @param {App} app - {@linkcode App} receiving the asset pool and lifecycle
   * integration.
   * @returns {void}
   */
  register(app) {
    const { asset, events } = this

    app.registerSystem({
      label: `updateAssetChannel<${typeid(asset)}>`,
      schedule: AppSchedule.Update,
      systemGroup: CoreSystems.End,
      system: updateAssetChannel(asset)
    })
      .registerSystem({
        label: `registerAssetOnAssetServer<${typeid(asset)}>`,
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerAssetOnAssetServer(asset)
      })
      .registerSystem({
        label: `registerAssetTypes<${typeid(asset)}>`,
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerAssetTypes(asset)
      })
      .setResourceByTypeId(
        typeidGeneric(Assets, [asset]),
        new Assets(asset)
      )

    if (events) {
      app
        .registerPlugin(new EventPlugin({
          event: events.added
        }))
        .registerPlugin(new EventPlugin({
          event: events.modified
        }))
        .registerPlugin(new EventPlugin({
          event: events.dropped
        }))
        .registerSystem({
          label: `updateAssetEvents<${typeid(asset)}>`,
          schedule: AppSchedule.Update,
          systemGroup: CoreSystems.End,
          system: updateAssetEvents(asset, events)
        })
        .registerSystem({
          label: `unloadDroppedAssets<${typeid(events.dropped)}>`,
          schedule: AppSchedule.Update,
          systemGroup: CoreSystems.End,
          system: unloadDroppedAssets(events.dropped)
        })
    }
  }

  /**
   * Returns the plugin type IDs required by this asset support.
   *
   * The IDs identify {@linkcode CorePlugin} and {@linkcode ReflectPlugin} as direct
   * dependencies. The app validates these dependencies but does not install
   * them automatically. {@linkcode AssetServerPlugin} is not included because
   * the required {@linkcode AssetServer} resource may be supplied by another
   * plugin or directly by the app.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }

  /**
   * Returns the generic plugin identity for this asset constructor.
   *
   * The returned {@linkcode TypeId} is derived from `AssetPlugin` and the
   * configured asset constructor. The app can therefore register one plugin
   * for each asset constructor while rejecting duplicate registration for the
   * same constructor.
   *
   * @returns {TypeId} Generic plugin {@linkcode TypeId}.
   */
  name() {
    return typeidGeneric(AssetPlugin, [this.asset])
  }
}

/* eslint-enable jsdoc/check-tag-names */

/**
 * @template T
 * @typedef AssetPluginOptions
 * @property {Constructor<T>} asset - Constructor identifying the asset family.
 * @property {AssetEvents<T>} [events] - Optional complete set of constructors
 * for the added, modified, and dropped lifecycle events.
 */
