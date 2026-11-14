/** @import {CorePlugin} from '@wimaengine/core' */
/** @import {ReflectPlugin} from '@wimaengine/reflect' */
/** @import {MathPlugin} from '@wimaengine/math' */
/** @import {WindowPlugin} from '@wimaengine/window' */
/** @import {DOMWindowPlugin} from '@wimaengine/window-dom' */
import { App, Plugin } from '@wimaengine/app'
import { KeyboardPlugin } from '@wimaengine/keyboard'
import { MousePlugin } from '@wimaengine/mouse'
import { TouchPlugin } from '@wimaengine/touch'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides keyboard, mouse, and touch input for an {@linkcode App} through one
 * plugin registration.
 *
 * {@linkcode InputPlugin} combines {@linkcode KeyboardPlugin}, {@linkcode MousePlugin},
 * and {@linkcode TouchPlugin} into a single input stack. Use it when an app needs
 * these device inputs together; use the individual plugins when it needs only
 * part of the stack.
 *
 * The optional `target` value is retained as input configuration and defaults
 * to `document.body`. Browser event delivery is provided by
 * {@linkcode DOMWindowPlugin} through the window layer.
 *
 * The stack expects {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
 * {@linkcode MathPlugin}, and {@linkcode WindowPlugin} to be registered before
 * {@linkcode App#run}. Browser applications should also register
 * {@linkcode DOMWindowPlugin}. These dependencies are not installed automatically
 * by {@linkcode InputPlugin}.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CommandsPlugin } from '@wimaengine/command'
 * import { CorePlugin } from '@wimaengine/core'
 * import { InputPlugin } from '@wimaengine/input'
 * import { MathPlugin } from '@wimaengine/math'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { DOMWindowPlugin } from '@wimaengine/window-dom'
 * import { WindowPlugin } from '@wimaengine/window'
 *
 * const input = new InputPlugin()
 * // In a browser, input.target defaults to document.body.
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new CommandsPlugin())
 *   .registerPlugin(new WindowPlugin())
 *   .registerPlugin(new DOMWindowPlugin())
 *   .registerPlugin(input)
 *   .run()
 * ```
 *
 * Registering {@linkcode DOMWindowPlugin} supplies the browser canvas event bridge
 * in this example. If the app already registers the individual device plugins,
 * use those registrations instead of also registering `InputPlugin`.
 *
 * @category plugin
 */
export class InputPlugin extends Plugin {

  /**
   * DOM element retained as this plugin's target configuration.
   *
   * The constructor defaults this field to `document.body`. The current
   * `register` implementation does not use the field or forward it to
   * `TouchPlugin`, `MousePlugin`, or `KeyboardPlugin`.
   *
   * @type {HTMLElement}
   */
  target

  /**
   * Creates the input plugin configuration.
   *
   * The value is stored as provided. The default expression reads
   * `document.body`, so omitting `target` requires a browser document to be
   * available.
   *
   * @param {HTMLElement} [target=document.body] - DOM element to retain as the
   * plugin target.
   */
  constructor(target = document.body) {
    super()
    this.target = target
  }

  /**
   * Adds the touch, mouse, and keyboard plugins to the app.
   *
   * The child plugins are added in touch, mouse, keyboard order. This method
   * does not read `this.target`; the child plugins obtain their event data
   * through the window event resources registered by the window layer.
   *
   * @param {App} app
   * @returns {void}
   */
  register(app) {
    app
      .registerPlugin(new TouchPlugin())
      .registerPlugin(new MousePlugin())
      .registerPlugin(new KeyboardPlugin())
  }
}
/* eslint-enable jsdoc/check-tag-names */
