/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the dimensions and canvas selector for a window component.
 *
 * With the default {@linkcode WindowPlugin} configuration, the primary window
 * entity includes a {@linkcode Window} and {@linkcode MainWindow} component. Set
 * `initPrimaryWindow` to `false` when the application will create its own
 * window entities.
 *
 * `selector` defaults to `undefined` and identifies an existing canvas by CSS
 * selector when one is available; without a matching canvas, a new one is
 * used. `width` and `height` default to `720` and `360`. They are the
 * dimensions stored by the component. When the entity's canvas is opened,
 * these values are synchronized with it, and a resize operation updates them
 * after the canvas is resized.
 * Calling `set()` only changes the component's stored dimensions; it does not
 * resize the canvas by itself. Use {@linkcode WindowCommands} to queue operations
 * such as resizing, fullscreen, pointer lock, or pointer capture.
 *
 * The {@linkcode Windows} resource maps window entity ids to their active
 * `HTMLCanvasElement`. Window operations use that resource to find the canvas
 * for this component's entity. If the entity has no registered canvas, the
 * operation does nothing.
 *
 * `serialize()` includes `width`, `height`, and `selector`, and
 * `deserialize()` restores all three fields. The current `copy()` implementation
 * copies only `width` and `height`; it leaves the target's `selector` unchanged.
 * `clone()` delegates to `copy()` with a new `Window`, so a clone has an
 * `undefined` selector even when the source has one.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Window } from '@wimaengine/window'
 *
 * const world = new World()
 * const entity = world.spawn([
 *   new Window({ selector: '#game', width: 1280, height: 720 })
 * ])
 *
 * const window = world.get(entity, Window)
 * window?.set(1024, 576)
 * console.log(window?.getWidth(), window?.getHeight()) // 1024 576
 * ```
 */
export class Window {

  /**
   * @private
   * @type {number}
   */
  width = 0

  /**
   * @private
   * @type {number}
   */
  height = 0

  /**
   * @readonly
   * @type {string | undefined}
   */
  selector

  /**
   * Creates window state for a canvas-backed entity.
   *
   * When no options are supplied, the component starts with a width of `720`,
   * a height of `360`, and no selector.
   *
   * @param {WindowOptions} [options={}] - Initial dimensions and optional CSS selector.
   */
  constructor({ selector, width = 720, height = 360 } = {}) {
    this.selector = selector
    this.width = width
    this.height = height
  }

  /**
   * Copies the stored dimensions from one window component to another.
   *
   * Only `width` and `height` are copied. The target's `selector` is retained;
   * an omitted target therefore keeps the default `undefined` selector.
   *
   * @param {Window} source - Component whose dimensions are copied.
   * @param {Window} [target=new Window()] - Component to update.
   * @returns {Window} The updated target component.
   */
  static copy(source, target = new Window()) {
    target.width = source.width
    target.height = source.height

    return target
  }

  /**
   * Creates a new component with the source window's stored dimensions.
   *
   * This delegates to {@linkcode Window.copy}, so the source selector is not
   * copied and the returned component has an `undefined` selector.
   *
   * @param {Window} target - Component whose dimensions are cloned.
   * @returns {Window} A new component with copied dimensions.
   */
  static clone(target) {
    return Window.copy(target)
  }

  /**
   * Serializes the window state for persistence.
   *
   * The returned value contains the stored width, height, and selector.
   *
   * @param {Window} value - Component to serialize.
   * @returns {WindowSerial} The serialized window state.
   */
  static serialize(value) {
    return {
      width: value.width,
      height: value.height,
      selector: value.selector
    }
  }

  /**
   * Restores serialized window state into a component.
   *
   * All three serialized fields are assigned to `out`. When `out` is omitted,
   * a new `Window` is created.
   *
   * @param {WindowSerial} value - Serialized width, height, and selector.
   * @param {Window} [out=new Window()] - Component to populate.
   * @returns {Window} The populated component.
   */
  static deserialize(value, out = new Window()) {
    const target = /** @type {any} */ (out)

    target.width = value.width
    target.height = value.height
    target.selector = value.selector

    return out
  }

  /**
   * Returns the width currently stored by the component.
   *
   * @returns {number} The stored width.
   */
  getWidth() {
    return this.width
  }

  /**
   * Returns the height currently stored by the component.
   *
   * @returns {number} The stored height.
   */
  getHeight() {
    return this.height
  }

  /**
   * Updates the dimensions stored by the component.
   *
   * This method does not resize the associated canvas. A queued resize through
   * {@linkcode WindowCommands} performs the window operation and then synchronizes
   * the resulting dimensions with this component.
   *
   * @param {number} width - New stored width.
   * @param {number} height - New stored height.
   * @returns {void}
   */
  set(width, height) {
    this.width = width
    this.height = height
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @typedef WindowSerial
 * @property {number} width
 * @property {number} height
 * @property {string | undefined} selector
 */

/**
 * @typedef WindowOptions
 * @property {number} [width]
 * @property {number} [height]
 * @property {string} [selector]
 */
