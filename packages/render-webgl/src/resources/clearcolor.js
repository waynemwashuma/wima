/** @import { ColorLike } from '@wimaengine/color' */
import { Color } from '@wimaengine/color'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the color that the WebGL renderer uses to clear its color buffer.
 *
 * `ClearColor` is a world resource built on {@linkcode Color}. Registering
 * {@linkcode WebglRendererPlugin} adds this world resource and
 * initializes it as opaque black with `{ r: 0, g: 0, b: 0, a: 1 }`. The
 * renderer reads the resource before drawing, so changing its color changes
 * the background used by subsequent WebGL frames.
 *
 * @category resource
 *
 * @example
 * ```js
 * import { ClearColor } from '@wimaengine/render-webgl'
 *
 * // WebglRendererPlugin must be registered so the resource exists.
 * function setBackground(world) {
 *   const clearColor = world.getResource(ClearColor)
 *   clearColor.set(0.08, 0.12, 0.2, 1)
 * }
 * ```
 */
export class ClearColor extends Color {
  constructor() {
    super(0, 0, 0)
  }

  /**
   * Converts a {@linkcode ClearColor} into plain serializable color data.
   *
   * The returned {@linkcode ColorLike} object contains the `r`, `g`, `b`, and `a`
   * channels without changing the source resource.
   * Use {@linkcode ClearColor.deserialize} to restore the returned
   * data to a clear-color resource.
   *
   * @param {ClearColor} value - {@linkcode ClearColor} to serialize.
   * @returns {ColorLike} Plain serialized color channels.
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * Restores serialized color channels in a {@linkcode ClearColor} resource.
   *
   * When `out` is supplied, its `r`, `g`, `b`, and `a` channels are replaced
   * and the same resource is returned. When it is omitted, a new
   * {@linkcode ClearColor} is created before its channels are restored.
   * Use {@linkcode ClearColor.serialize} to produce the corresponding
   * plain color data.
   *
   * @param {ColorLike} value - Serialized {@linkcode ColorLike} channel data.
   * @param {ClearColor} [out] - {@linkcode ClearColor} resource to populate.
   * @returns {ClearColor} The populated {@linkcode ClearColor} resource.
   */
  static deserialize(value, out = new ClearColor()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
