/** @import { App } from '@wimaengine/app' */
/** @import { EntityHandle } from '@wimaengine/ecs' */
/** @import { MainWindow, WindowResize, Windows } from '@wimaengine/window' */
/** @import { TypeId } from '@wimaengine/type' */
import { Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'
import { Window, WindowPlugin } from '@wimaengine/window'
import { closeWindow } from './hooks'
import { resizeWindow, updateWindow } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds browser canvas integration for ECS window entities in an {@linkcode App}.
 *
 * For each {@linkcode Window} component, the browser integration uses the
 * matching canvas when its selector resolves. A window without a selector gets
 * a new canvas appended to `document.body`. A selector that does not resolve to
 * a canvas is retried on a later update. A malformed selector is passed to
 * `querySelector` and can throw its DOM exception.
 *
 * When a canvas is attached, it is recorded in the {@linkcode Windows} resource,
 * made focusable with `tabIndex = -1`,
 * focused, and connected to keyboard, pointer, and file input events. Removing
 * the component or despawning its entity removes the canvas and its resource
 * entry synchronously. The plugin does not create window entities itself; the default
 * {@linkcode WindowPlugin} configuration creates the primary entity with
 * {@linkcode Window} and {@linkcode MainWindow} for it to attach.
 *
 * Attached canvases stay synchronized with their displayed size while the app
 * is running. When the rounded dimensions from a bounding rectangle differ,
 * the plugin updates the canvas backing size and the {@linkcode Window}
 * dimensions, then writes a {@linkcode WindowResize} event. Unchanged dimensions
 * do not produce an event.
 *
 * This plugin requires {@linkcode CorePlugin} and {@linkcode WindowPlugin}. Register
 * both dependencies on the app before starting it; dependencies are checked but
 * are not installed automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CommandsPlugin } from '@wimaengine/command'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { DOMWindowPlugin } from '@wimaengine/window-dom'
 * import { WindowPlugin } from '@wimaengine/window'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new CommandsPlugin())
 *   .registerPlugin(new WindowPlugin({
 *     primaryWindowOptions: { width: 1280, height: 720 }
 *   }))
 *   .registerPlugin(new DOMWindowPlugin())
 *   .run() // CorePlugin supplies the default requestAnimationFrame runner.
 * ```
 *
 * With the default {@linkcode WindowPlugin} setup, the plugin creates and appends
 * the primary window's canvas. To attach an existing canvas instead, pass its
 * selector in `primaryWindowOptions` or add a {@linkcode Window} component with
 * that selector to another entity.
 *
 * @category plugin
 */
export class DOMWindowPlugin extends Plugin {

  /**
   * Registers browser canvas behavior for {@linkcode Window} components in an
   * {@linkcode App}.
   *
   * Attached canvases receive keyboard, pointer, and file input events and are
   * tracked in {@linkcode Windows}. Removing a window component removes its
   * canvas. Displayed canvas dimensions are synchronized with the
   * {@linkcode Window} component and changes produce {@linkcode WindowResize}
   * events.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setComponentHooks(Window, new ComponentHooks(null, closeWindow))
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.Start,
        system: updateWindow
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.End,
        system: resizeWindow
      })
  }

  /**
   * Returns the plugins required for browser window support.
   *
   * Register {@linkcode CorePlugin} and {@linkcode WindowPlugin} before
   * {@linkcode DOMWindowPlugin}. The app checks these dependencies, but does not
   * install them automatically.
   *
   * @returns {TypeId[]} IDs for {@linkcode CorePlugin} and {@linkcode WindowPlugin}.
   */
  requires() {
    return [typeid(CorePlugin), typeid(WindowPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
