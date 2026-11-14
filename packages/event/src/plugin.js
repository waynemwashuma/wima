/** @import { Constructor, TypeId } from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule, CoreSystems } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Events } from './core'
import { makeEventClear, registerEventTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers one typed {@linkcode Events} resource with an ECS {@linkcode App}.
 *
 * The configured payload constructor identifies both the {@linkcode Events}
 * resource and this plugin instance. By default, pending events become
 * readable automatically after each application update. Set
 * `autoClearEvent` to `false` and call {@linkcode Events#clear} when the
 * application wants to publish a batch. Use one plugin instance for each
 * payload constructor that the app publishes.
 *
 * @template T
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { EventPlugin } from '@wimaengine/event'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * class DamageEvent {}
 *
 * const app = new App()
 * app
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new EventPlugin({ event: DamageEvent }))
 *   .run()
 * ```
 *
 * Register {@linkcode ReflectPlugin} and {@linkcode CorePlugin} before this plugin;
 * the event plugin does not install either dependency automatically.
 *
 * @category plugin
 */
export class EventPlugin extends Plugin {

  /**
   * Constructor for the payload represented by this plugin.
   *
   * The constructor identifies the payload type for this plugin's typed
   * {@linkcode Events} resource and contributes to the plugin's identity.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  event

  /**
   * Whether pending events are published automatically after each application
   * update.
   *
   * This defaults to `true`. When `false`, application code controls when
   * pending events become readable by calling {@linkcode Events#clear}.
   *
   * @readonly
   * @type {boolean}
   */
  autoClearEvent

  /**
   * Creates an event plugin for one payload constructor.
   *
   * {@linkcode EventPlugin#autoClearEvent} defaults to `true`. The configured
   * {@linkcode Events} resource is staged when the plugin is registered with an
   * app.
   *
   * @param {EventPluginOptions<T>} options - Event constructor and optional
   * automatic-clear setting.
   */
  constructor(options) {
    super()
    const { event, autoClearEvent = true } = options

    this.event = event
    this.autoClearEvent = autoClearEvent
  }

  /**
   * Registers this plugin's typed {@linkcode Events} resource with an app.
   *
   * The method stages an empty {@linkcode Events} resource for the configured
   * payload constructor in the app's default world.
   *
   * If {@linkcode EventPlugin#autoClearEvent} is enabled, pending events are
   * published automatically after each application update. With the option
   * disabled, application code decides when to call {@linkcode Events#clear}.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    const { event } = this
    const name = typeidGeneric(Events, [event])

    app
      .registerSystem({
        label: `registerEventTypes<${typeid(event)}>`,
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerEventTypes(event)
      })
      .setResourceByTypeId(name, new Events())

    if (this.autoClearEvent) {
      app
        .registerSystem({
          label: `clearEvents<${typeid(event)}>`,
          schedule: AppSchedule.Update,
          systemGroup: CoreSystems.End,
          system: makeEventClear(name)
        })
    }
  }

  /**
   * Returns the plugin dependencies required by this plugin.
   *
   * The app checks these IDs before final setup. Register {@linkcode CorePlugin} and
   * {@linkcode ReflectPlugin} before this plugin; registering {@linkcode EventPlugin}
   * does not install them automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }

  /**
   * Returns this plugin's identity for its configured event payload.
   *
   * Event plugins configured with different payload constructors have distinct
   * identities. Registering a second plugin for the same payload constructor
   * is rejected by the app.
   *
   * @returns {TypeId} Generic plugin {@linkcode TypeId}.
   */
  name() {
    return typeidGeneric(EventPlugin, [this.event])
  }
}

/**
 * Options accepted by an {@linkcode EventPlugin} constructor.
 *
 * @template T
 * @typedef EventPluginOptions
 * @property {Constructor<T>} event - Constructor for the event payload.
 * @property {boolean} [autoClearEvent=true] - Whether {@linkcode EventPlugin}
 * automatically publishes pending events with {@linkcode Events#clear} after
 * each application update.
 */
/* eslint-enable jsdoc/check-tag-names */
