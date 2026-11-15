/** @import {Vector2Like} from '@wimaengine/math' */

import { Vector2 } from '@wimaengine/math'

// This is supposed to be `Image()` but that is already taken.
/**
 * Represents image data as a render-core asset value.
 *
 * @example
 * ```js
 * import { Image } from '@wimaengine/render-core'
 *
 * const image = Image.default()
 * console.log(image.dimensions.x, image.dimensions.y) // 1 1
 * ```
 */
export class Image {

  /**
   * Raw bytes associated with the image.
   *
   * The value stores these bytes in a clamped 8-bit typed array.
   *
   * @type {Uint8ClampedArray}
   */
  raw

  /**
   * Image width and height.
   *
   * The dimensions are represented by a {@linkcode Vector2}.
   *
   * @type {Vector2}
   */
  dimensions

  /**
   * Creates an image value from raw bytes and dimensions.
   *
   * The supplied buffer and dimensions are stored directly without copying or
   * validation.
   *
   * @param {Uint8ClampedArray} buffer - Raw image bytes to store.
   * @param {Vector2} dimensions - Image width and height to store.
   */
  constructor(buffer, dimensions) {
    this.raw = buffer
    this.dimensions = dimensions
  }

  /**
   * Creates a default one-by-one image value.
   *
   * Each call creates a new image with a new `Uint8ClampedArray` containing
   * `[1, 0, 1, 1]` and a new {@linkcode Vector2} with `x` and `y` set to `1`.
   * {@linkcode Image.deserialize} uses this value when `out` is omitted.
   *
   * @returns {Image} A new default image value.
   */
  static default() {
    const array = new Uint8ClampedArray([1, 0, 1, 1])

    return new Image(array, new Vector2(1, 1))
  }

  /**
   * Serializes an image value to a plain object.
   *
   * `raw` is copied to a regular number array with `Array.from`, and
   * `dimensions` is converted with {@linkcode Vector2.serialize}. The image value
   * is not mutated.
   *
   * @param {Image} value - Image value to serialize.
   * @returns {ImageSerial} The serialized image data.
   */
  static serialize(value) {
    return {
      raw: Array.from(value.raw),
      dimensions: Vector2.serialize(value.dimensions)
    }
  }

  /**
   * Deserializes a plain object into an image value.
   *
   * `raw` is replaced with a new `Uint8ClampedArray` created from the serial
   * array. `dimensions` is passed to {@linkcode Vector2.deserialize} with the
   * output image's existing dimensions object, so that object is updated and
   * reused. When `out` is omitted, a new value from {@linkcode Image.default} is
   * populated. The output image value is returned.
   *
   * @param {ImageSerial} value - Serialized image data to restore.
   * @param {Image} [out] - Image value to populate and return.
   * @returns {Image} The populated output image value.
   */
  static deserialize(value, out = Image.default()) {
    out.raw = new Uint8ClampedArray(value.raw)
    out.dimensions = Vector2.deserialize(value.dimensions, out.dimensions)

    return out
  }

  /**
   * Checks whether a value has the serialized image structure.
   *
   * The value must be an object with `raw` and `dimensions` properties. `raw`
   * must be an array, and `dimensions` must pass
   * {@linkcode Vector2.validateSerial}. The elements of `raw` are not inspected;
   * this method does not construct an {@linkcode Image} or validate image bytes.
   *
   * @param {unknown} value - Value to check.
   * @returns {value is ImageSerial} Whether the value has the required structure.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('raw' in value) || !('dimensions' in value)) {
      return false
    }

    return Array.isArray(value.raw) &&
      Vector2.validateSerial(value.dimensions)
  }
}

/**
 * Plain serialized representation accepted by {@linkcode Image.deserialize}.
 *
 * @typedef ImageSerial
 * @property {number[]} raw - Raw image bytes as a regular number array.
 * @property {Vector2Like} dimensions - Serialized image width and height.
 */
