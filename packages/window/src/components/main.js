/* eslint-disable jsdoc/check-tag-names */
/**
 * Marks the entity that represents the primary window.
 *
 * {@linkcode MainWindow} is an empty component marker. With the default
 * {@linkcode WindowPlugin} configuration, the primary-window entity contains
 * both {@linkcode Window} and {@linkcode MainWindow}. The `primaryWindowOptions`
 * passed to the plugin configure that entity's `Window` component;
 * {@linkcode MainWindow} has no dimensions, canvas reference, or other state of
 * its own.
 *
 * Query this marker with the entity handle to find the primary-window entity.
 * A query such as `[EntityHandle, Window, MainWindow]` provides the handle for
 * looking up the canvas in the `Windows` resource and the associated `Window`
 * component. If `initPrimaryWindow` is `false`, {@linkcode WindowPlugin} does
 * not create this entity; callers can create their own entity with
 * `new MainWindow()` or use {@linkcode createMainWindow} for the default
 * `[Window, MainWindow]` pair.
 *
 * @category component
 * @example
 * ```js
 * import { EntityHandle, Query } from '@wimaengine/ecs'
 * import { MainWindow } from '@wimaengine/window'
 *
 * const match = new Query(world, [EntityHandle, MainWindow]).single()
 * const primaryEntity = match?.[0]
 *
 * if (primaryEntity) {
 *   console.log('primary window entity', primaryEntity)
 * }
 * ```
 */
export class MainWindow {

  static default() {
    return new MainWindow()
  }

  /**
   * Copies an empty marker into the target component.
   *
   * `MainWindow` has no fields, so `source` is not read. When `target` is
   * omitted, a new marker is returned; otherwise the same target is returned
   * unchanged.
   *
   * @param {MainWindow} source - Marker to copy.
   * @param {MainWindow} [target=new MainWindow()] - Component to return.
   * @returns {MainWindow} The target marker.
   */
  static copy(source, target = new MainWindow()) {
    return target
  }

  /**
   * Creates a new empty marker.
   *
   * This delegates to {@linkcode MainWindow.copy} without a target, so the result
   * is a new `MainWindow` instance.
   *
   * @param {MainWindow} target - Marker to clone.
   * @returns {MainWindow} A new empty marker.
   */
  static clone(target) {
    return MainWindow.copy(target)
  }

  /**
   * Serializes the marker as an empty object.
   *
   * There is no marker state to persist.
   *
   * @param {MainWindow} _value - Marker to serialize.
   * @returns {{}} The marker's empty serialized representation.
   */
  static serialize(_value) {
    return {}
  }

  /**
   * Deserializes the marker without reading serialized data.
   *
   * Since the serialized representation is empty, this returns the supplied
   * output marker or creates a new one when `out` is omitted.
   *
   * @param {unknown} _value - Empty serialized marker data.
   * @param {MainWindow} [out=new MainWindow()] - Component to return.
   * @returns {MainWindow} The output marker.
   */
  static deserialize(_value, out = new MainWindow()) {
    return out
  }
}
