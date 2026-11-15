/** @import {WindowOptions} from './components' */
/** @import { SystemFunc } from '@wimaengine/ecs' */
/** @import { TypeId } from '@wimaengine/type' */
/** @import { WindowRequest } from './commands' */
import { App, Plugin } from '@wimaengine/app'
import { CommandsPlugin } from '@wimaengine/command'
import { EntityCommands } from '@wimaengine/commands'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { EventPlugin } from '@wimaengine/event'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Window, MainWindow } from './components'
import {
  FileDrag,
  FileDrop,
  KeyDown,
  KeyUp,
  PointerCancel,
  PointerDown,
  PointerEnter,
  PointerLeave,
  PointerMove,
  PointerWheel,
  PointerUp,
  WindowMove,
  WindowResize
} from './events'
import { Windows } from './resources'
import { registerWindowTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds ECS window support to an {@linkcode App}.
 *
 * {@linkcode WindowPlugin} adds a {@linkcode Windows} resource to the app's default
 * world and provides typed window, keyboard, pointer, and file events such as
 * {@linkcode WindowMove}, {@linkcode KeyDown}, {@linkcode PointerDown}, and
 * {@linkcode FileDrop}. The window state types, including
 * {@linkcode WindowRequest}, {@linkcode Window}, {@linkcode MainWindow}, and
 * {@linkcode Windows}, are available to persistence-facing features.
 *
 * By default, the plugin creates one primary-window entity with a
 * {@linkcode Window} initialized from `primaryWindowOptions` and a
 * {@linkcode MainWindow} marker. An optional browser integration layer can connect
 * {@linkcode Window} components to browser {@linkcode HTMLCanvasElement} instances
 * and keep the associated {@linkcode Windows} resource in sync. Set
 * `initPrimaryWindow` to `false` when your code will create and manage window
 * entities itself; the resource, events, and persistence-facing support remain
 * available.
 *
 * The plugin requires {@linkcode CorePlugin} and {@linkcode ReflectPlugin}. When
 * `initPrimaryWindow` is enabled, it also requires {@linkcode CommandsPlugin}.
 * These dependencies are checked by the app and are not installed
 * automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CommandsPlugin } from '@wimaengine/command'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { WindowPlugin } from '@wimaengine/window'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new CommandsPlugin())
 *   .registerPlugin(new WindowPlugin({
 *     primaryWindowOptions: {
 *       selector: '#game',
 *       width: 1280,
 *       height: 720
 *     }
 *   }))
 *   .run()
 * ```
 *
 * To create the window entity yourself, use `new WindowPlugin({
 * initPrimaryWindow: false })`, then spawn an entity with {@linkcode Window} and
 * {@linkcode MainWindow} (or another component combination) from your own code.
 *
 * @category plugin
 */
export class WindowPlugin extends Plugin {

  /**
   * Whether the plugin creates the default primary-window entity.
   *
   * When `true`, the plugin creates one entity with {@linkcode Window} and
   * {@linkcode MainWindow}. When `false`, the application is responsible for
   * creating and managing its own window entities.
   *
   * @readonly
   * @type {boolean}
   */
  initPrimaryWindow

  /**
   * Options forwarded to the primary entity's `Window` component.
   *
   * These options are used only when `initPrimaryWindow` is `true`.
   *
   * @readonly
   * @type {WindowOptions | undefined}
   */
  primaryWindowOptions

  /**
   * Creates the window plugin configuration.
   *
   * The default configuration creates a primary window entity. Set
   * `initPrimaryWindow` to `false` when your code manages its own window
   * entities.
   *
   * @param {WindowPluginOptions} [options={}] - Primary-window options.
   */
  constructor({
    initPrimaryWindow = true,
    primaryWindowOptions
  } = {}) {
    super()
    this.initPrimaryWindow = initPrimaryWindow
    this.primaryWindowOptions = primaryWindowOptions
  }

  /**
   * Configures an {@linkcode App} with the window layer.
   *
   * Adds a {@linkcode Windows} resource to the app's default world and registers
   * typed window movement and resize, keyboard, pointer, and file drag/drop
   * events, including {@linkcode WindowMove}, {@linkcode WindowResize},
   * {@linkcode KeyDown}, {@linkcode PointerMove}, and {@linkcode FileDrop}. It also
   * makes {@linkcode WindowRequest}, {@linkcode Window}, {@linkcode MainWindow}, and
   * {@linkcode Windows} available to persistence-facing features.
   *
   * When `initPrimaryWindow` is enabled, the plugin creates one primary-window
   * entity with {@linkcode Window} and {@linkcode MainWindow}, using
   * `primaryWindowOptions`. When it is disabled, no default primary-window
   * entity is created and your code can create its own window entities.
   * A browser integration layer can connect those entities to browser canvases.
   *
   * @param {App} app
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerWindowTypes })
      .registerPlugin(new EventPlugin({
        event:WindowMove
      }))
      .registerPlugin(new EventPlugin({
        event:WindowResize
      }))
      .registerPlugin(new EventPlugin({
        event:KeyDown
      }))
      .registerPlugin(new EventPlugin({
        event:KeyUp
      }))
      .registerPlugin(new EventPlugin({
        event:PointerWheel
      }))
      .registerPlugin(new EventPlugin({
        event:PointerDown
      }))
      .registerPlugin(new EventPlugin({
        event:PointerUp
      }))
      .registerPlugin(new EventPlugin({
        event:PointerMove
      }))
      .registerPlugin(new EventPlugin({
        event:PointerEnter
      }))
      .registerPlugin(new EventPlugin({
        event:PointerLeave
      }))
      .registerPlugin(new EventPlugin({
        event:PointerCancel
      }))
      .registerPlugin(new EventPlugin({
        event:FileDrag
      }))
      .registerPlugin(new EventPlugin({
        event:FileDrop
      }))
      .setResource(new Windows())

    if (this.initPrimaryWindow) app.registerSystem({ schedule: AppSchedule.Startup, system: initPrimaryWindow(this.primaryWindowOptions) })
  }

  /**
   * Lists the plugin type IDs required by this configuration.
   *
   * The returned IDs always include {@linkcode CorePlugin} and
   * {@linkcode ReflectPlugin}. When `initPrimaryWindow` is `true`, the list also
   * includes {@linkcode CommandsPlugin} for the default primary-window entity.
   *
   * @returns {TypeId[]} Required plugin type IDs.
   */
  requires() {
    const requires = [typeid(CorePlugin), typeid(ReflectPlugin)]

    if (this.initPrimaryWindow) {
      requires.push(typeid(CommandsPlugin))
    }

    return requires
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @param {WindowOptions | undefined} settings
 * @returns {SystemFunc}
 */
function initPrimaryWindow(settings) {
  return function initPrimaryWindow(world) {

    const commands = new EntityCommands(world)

    commands
      .spawn()
      .insertPrefab([
        new Window(settings),
        new MainWindow()
      ])
      .build()
  }
}

/**
 * @typedef WindowPluginOptions
 * @property {boolean} [initPrimaryWindow = true] - Whether the plugin creates the primary `[Window, MainWindow]` entity.
 * @property {WindowOptions | undefined} [primaryWindowOptions] - Options for that entity's `Window` component.
 */
