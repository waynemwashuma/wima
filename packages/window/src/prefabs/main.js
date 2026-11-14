import { Window, MainWindow } from '../components'

/**
 * Creates the default component pair for a primary window entity.
 *
 * The returned tuple is ordered `[Window, MainWindow]`: a fresh
 * {@linkcode Window} with `width: 720`, `height: 360`, and an `undefined`
 * selector, followed by a fresh empty {@linkcode MainWindow} marker. Every call
 * constructs both objects, so component state is not shared between returned
 * pairs.
 *
 * This factory returns components; it does not spawn an entity or install the
 * {@linkcode Windows} resource. Pass the tuple to {@linkcode World#spawn} or an
 * entity command when {@linkcode WindowPlugin} is configured with
 * `initPrimaryWindow: false`. With the default configuration, the plugin
 * creates an equivalent primary-window pair automatically.
 *
 * @example
 * ```js
 * import { createMainWindow } from '@wimaengine/window'
 *
 * const components = createMainWindow()
 * console.log(components) // [Window, MainWindow]
 * ```
 *
 * @returns {[Window, MainWindow]} Ordered pair of fresh {@linkcode Window} and
 * {@linkcode MainWindow} components.
 */
export function createMainWindow() {

  return [new Window(), new MainWindow()]
}
