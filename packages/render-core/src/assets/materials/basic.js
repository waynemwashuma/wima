/** @import { ColorLike } from '@wimaengine/color' */
import { Color } from '@wimaengine/color'
import { Material } from '../material'

/**
 * Represents a basic color material asset for rendering geometry.
 *
 * @example
 * ```js
 * import { BasicMaterial, BasicMaterialAssets } from '@wimaengine/render-core'
 * import { Color } from '@wimaengine/color'
 *
 * // RenderCorePlugin must be registered before this resource is used.
 * const material = new BasicMaterial({
 *   color: new Color(0.2, 0.6, 1, 1)
 * })
 * const handle = world.getResource(BasicMaterialAssets).add(material)
 * ```
 */
export class BasicMaterial extends Material {

  /**
   * Color value stored by this material.
   *
   * The constructor stores a supplied {@linkcode Color} reference as-is. When no
   * color is supplied, it creates a new default {@linkcode Color}. Mutate this
   * value before calling {@linkcode BasicMaterial#asUniformBind} to include its
   * current channels in the returned uniform buffer.
   *
   * @type {Color}
   */
  color = new Color()

  /**
   * Creates a basic material with an optional {@linkcode Color}.
   *
   * If `color` is omitted, the constructor creates a new default
   * {@linkcode Color}. A supplied color is stored as-is.
   *
   * @param {BasicMaterialOptions} [options={}] - Constructor options.
   */
  constructor({
    color = new Color()
  } = {}) {
    super()
    this.color = color
  }

  /**
   * Returns the current color as RGBA uniform data.
   *
   * The method spreads the color's iterable channels in RGBA order into a new
   * `Float32Array` and returns that array's `ArrayBuffer`. Each call creates a
   * new buffer, so later mutations to {@linkcode BasicMaterial#color} do not
   * change an existing result and separate calls do not share storage.
   *
   * @returns {ArrayBuffer} A new buffer containing the color's four RGBA values.
   */
  asUniformBind() {
    return new Float32Array([...this.color]).buffer
  }

  /**
   * Creates a default {@linkcode BasicMaterial} with a new default {@linkcode Color}.
   *
   * @inheritdoc
   * @returns {BasicMaterial}
   */
  static default() {
    return new BasicMaterial()
  }

  /**
   * Serializes a {@linkcode BasicMaterial} to a plain object containing its
   * color's `r`, `g`, `b`, and `a` channels.
   *
   * Color conversion delegates to {@linkcode Color.serialize}. The material and
   * its color are not mutated.
   *
   * @inheritdoc
   * @param {BasicMaterial} value - Material to serialize.
   * @returns {BasicMaterialSerial} Serialized material color.
   */
  static serialize(value) {
    return {
      color: Color.serialize(value.color)
    }
  }

  /**
   * Restores a {@linkcode BasicMaterial} from its plain color representation.
   *
   * When `out` is supplied, its existing color is updated in place and the same
   * material is returned. Without `out`, deserialization creates a default
   * {@linkcode BasicMaterial} first. Color restoration delegates to
   * {@linkcode Color.deserialize}.
   *
   * @inheritdoc
   * @param {BasicMaterialSerial} value - Serialized material color.
   * @param {BasicMaterial} [out] - Material to populate.
   * @returns {BasicMaterial} The populated material.
   */
  static deserialize(value, out = new BasicMaterial()) {
    out.color = Color.deserialize(value.color, out.color)

    return out
  }

  /**
   * Checks whether a value has the serialized basic-material shape.
   *
   * The value must be an object with a `color` property accepted by
   * {@linkcode Color.validateSerial}. This checks that the color channels are
   * numbers, but does not construct a material, enforce channel ranges, or
   * reject non-finite numbers.
   *
   * @param {unknown} value
   * @returns {value is BasicMaterialSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('color' in value)) {
      return false
    }

    return Color.validateSerial(value.color)
  }
}

/**
 * Options accepted by the {@linkcode BasicMaterial} constructor.
 *
 * @typedef BasicMaterialOptions
 * @property {Color} [color] Color value to store on the material.
 */

/**
 * Plain serialized representation produced by
 * {@linkcode BasicMaterial.serialize} and accepted by
 * {@linkcode BasicMaterial.deserialize}.
 * Its `color` field contains the numeric `r`, `g`, `b`, and `a` channels.
 *
 * @typedef BasicMaterialSerial
 * @property {ColorLike} color Serialized {@linkcode Color} channel data.
 */
