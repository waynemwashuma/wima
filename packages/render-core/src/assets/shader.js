import { ShaderStage } from '../core'

/**
 * Represents a render-core shader asset value as a shader-stage and source
 * pair.
 *
 * Use this value to keep shader-language source associated with a
 * {@linkcode ShaderStage} for storage and rendering.
 *
 * @example
 * ```js
 * import { Shader, ShaderStage } from '@wimaengine/render-core'
 *
 * const vertex = new Shader(
 *   ShaderStage.Vertex,
 *   'void main() { gl_Position = vec4(0.0); }'
 * )
 * const restored = Shader.deserialize(Shader.serialize(vertex))
 * console.log(restored.stage === ShaderStage.Vertex, restored.source)
 * ```
 */
export class Shader {

  /**
   * Shader stage represented by this asset.
   *
   * Use a value from {@linkcode ShaderStage}, such as
   * {@linkcode ShaderStage.Vertex} or {@linkcode ShaderStage.Fragment}. The
   * constructor stores the supplied value.
   *
   * @readonly
   * @type {ShaderStage}
   */
  stage

  /**
   * Shader-language source code for this stage.
   *
   * The string is stored as supplied; {@linkcode Shader} does not compile or
   * transform it.
   *
   * @type {string}
   */
  source

  /**
   * Creates a shader asset value from a stage and source string.
   *
   * This constructor stores both arguments without compiling or validating
   * the source.
   *
   * @param {ShaderStage} stage
   * @param {string} source
   */
  constructor(stage, source) {
    this.stage = stage
    this.source = source
  }

  /**
   * Creates an empty fragment-stage shader.
   *
   * @returns {Shader}
   */
  static default() {
    return new Shader(ShaderStage.Fragment, '')
  }

  /**
   * Converts a shader to its serializable stage/source pair.
   *
   * The returned object contains the current `stage` and `source` values
   * without compiling or otherwise transforming the source.
   *
   * @param {Shader} value
   * @returns {ShaderSerial}
   */
  static serialize(value) {
    return {
      stage: value.stage,
      source: value.source
    }
  }

  /**
   * Populates a shader from serialized stage/source data.
   *
   * When `out` is supplied, its two fields are replaced and the same object is
   * returned. Otherwise the method creates an empty shader with
   * {@linkcode Shader.default} and populates it. This method copies values only;
   * it does not compile or validate the source.
   *
   * @param {ShaderSerial} value
   * @param {Shader} [out]
   * @returns {Shader} The populated shader.
   */
  static deserialize(value, out = Shader.default()) {
    const target = /** @type {any} */ (out)

    target.stage = value.stage
    target.source = value.source

    return out
  }

  /**
   * Checks the shape and primitive field types accepted for shader data.
   *
   * The check requires a numeric `stage` and string `source`; it does not
   * verify that the stage number is one of the values in {@linkcode ShaderStage}.
   *
   * @param {unknown} value
   * @returns {value is ShaderSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('stage' in value) || !('source' in value)) {
      return false
    }

    return typeof value.stage === 'number' &&
      typeof value.source === 'string'
  }
}

/**
 * @typedef ShaderSerial
 * @property {number} stage
 * @property {string} source
 */
