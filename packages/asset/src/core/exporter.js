/** @import { TypeRegistry } from '@wimaengine/reflect' */
/** @import { Constructor } from '@wimaengine/type' */
import { throws } from '@wimaengine/logger'

/**
 * Abstract contract for converting typed asset values into request bodies.
 *
 * Use a subclass for one asset constructor. Concrete exporters provide the
 * conversion for each request-body format they support and use
 * {@linkcode Exporter#getExtensions} to return the exact extension labels that
 * identify those formats. A conversion can use
 * {@linkcode TypeRegistry} for reflected or nested typed values.
 *
 * @example
 * ```js
 * import { Exporter } from '@wimaengine/asset'
 *
 * class TextAsset {
 *   constructor(value) {
 *     this.value = value
 *   }
 * }
 *
 * class TextExporter extends Exporter {
 *   constructor() {
 *     super(TextAsset)
 *   }
 *
 *   async serialize(asset, _typeRegistry) {
 *     return asset.value
 *   }
 *
 *   getExtensions() {
 *     return ['txt']
 *   }
 * }
 *
 * const exporter = new TextExporter()
 * ```
 *
 * @abstract
 * @template T
 */
export class Exporter {

  /**
   * Asset constructor associated with values handled by this exporter.
   *
   * The constructor is stored as supplied; this class does not validate it.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * Associates the exporter with an asset constructor.
   *
   * The constructor is assigned directly to {@linkcode Exporter#asset}. No
   * validation or other initialization is performed.
   *
   * @param {Constructor<T>} asset - Asset constructor associated with this
   * exporter.
   */
  constructor(asset) {
    this.asset = asset
  }

  /**
   * Converts an asset value into the body used by a save request.
   *
   * A concrete exporter should resolve a value accepted by {@linkcode BodyInit};
   * the resolved value is supplied as the request body. Use the
   * {@linkcode TypeRegistry} argument when the output format needs reflected or
   * nested typed values.
   *
   * The base implementation always rejects with an `Error` because it has no
   * serialization format to produce.
   *
   * @param {T} _asset - Asset value to convert into a request body.
   * @param {TypeRegistry} _typeRegistry - Registry available to the exporter.
   * @returns {Promise<BodyInit | undefined>} Promise resolving to the request
   * body, or to `undefined` when no body is returned. The base implementation
   * always rejects before resolving.
   * @throws {Error} The base implementation always rejects with an error.
   */
  async serialize(_asset, _typeRegistry) {
    throws(`Implement the method \`serialize\` on \`${this.constructor.name}\``)
  }

  /**
   * Returns the extension labels supported by this exporter.
   *
   * Each returned label is matched literally against the extension extracted
   * from a save path. Omit the leading dot; spelling and case must match
   * exactly, and no normalization is applied. Return one label for each
   * supported output format.
   *
   * The base implementation always throws an `Error` because it does not know
   * which formats the concrete exporter supports. The empty array below is
   * only an unreachable fallback after the throw.
   *
   * @returns {string[]} Supported extension labels, such as `['json']`.
   * @throws {Error} The base implementation always throws an error.
   */
  getExtensions() {
    throws(`Implement the method \`getExtensions\` on \`${this.constructor.name}\``)
  }
}
