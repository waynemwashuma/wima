/** @import { TypeRegistry } from '@wimaengine/reflect' */
/** @import { Constructor } from '@wimaengine/type' */
/** @import { AssetImporterPlugin } from '../plugins' */
/** @import { AssetServer } from '../resources' */
import { throws } from '@wimaengine/logger'

/**
 * Defines how a response becomes a typed asset value.
 *
 * Extend this class for one asset constructor, implement
 * {@linkcode Importer#deserialize} to consume the response body, and implement
 * {@linkcode Importer#getExtensions} to declare the path labels it supports.
 * Register the concrete importer with {@linkcode AssetImporterPlugin} so
 * {@linkcode AssetServer} can select it by asset type and extension. The
 * {@linkcode TypeRegistry} argument is available when the response format needs
 * reflected or nested typed values; self-contained formats can ignore it.
 *
 * @example
 * ```js
 * import { Importer } from '@wimaengine/asset'
 *
 * class TextAsset {
 *   constructor(value) {
 *     this.value = value
 *   }
 * }
 *
 * class TextImporter extends Importer {
 *   constructor() {
 *     super(TextAsset)
 *   }
 *
 *   async deserialize(response, _typeRegistry) {
 *     return new TextAsset(await response.text())
 *   }
 *
 *   getExtensions() {
 *     return ['txt']
 *   }
 * }
 *
 * const importer = new TextImporter()
 * ```
 *
 * @abstract
 * @template T
 */
export class Importer {

  /**
   * Constructor for the asset values produced by this importer.
   *
   * {@linkcode AssetServer} uses this constructor to identify the asset type when
   * the importer is registered. Keep it aligned with the constructor supplied
   * to {@linkcode AssetImporterPlugin}; the base class does not validate the
   * association.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * Associates the importer with an asset constructor.
   *
   * The constructor is stored on {@linkcode Importer#asset} and identifies the
   * asset type handled by this importer. This constructor only records the
   * association; it does not parse responses or register the importer with
   * {@linkcode AssetServer}.
   *
   * @param {Constructor<T>} asset - Constructor of the asset value returned by
   * this importer.
   */
  constructor(asset) {
    this.asset = asset
  }

  /**
   * Converts a fetched response into the typed asset value.
   *
   * Override this method to read the response body, parse its contents, and
   * resolve a `T`. Use the {@linkcode TypeRegistry} argument when the format
   * stores reflected or nested values; a self-contained response can ignore
   * it. A concrete importer should resolve an asset value that can be stored
   * for the requested asset.
   *
   * The base implementation always rejects with an `Error` because it has no
   * response format to parse. The `undefined` return below is only an
   * unreachable fallback after that error.
   *
   * @param {Response} _response - Response whose body the importer reads.
   * @param {TypeRegistry} _typeRegistry - Registry available for typed values.
   * @returns {Promise<T | undefined>} A concrete importer should resolve the
   * imported asset. The base implementation always rejects before resolving.
   * @throws {Error} The base implementation always rejects with an error.
   */
  async deserialize(_response, _typeRegistry) {
    throws(`Implement the method \`deserialize\` on \`${this.constructor.name}\``)
  }

  /**
   * Lists the path extensions handled by this importer.
   *
   * {@linkcode AssetServer} indexes each returned label with the importer's
   * asset constructor. Labels must omit the leading dot and match the
   * extension extracted from a load path exactly, including case. Return one
   * label for each supported response format.
   *
   * The base implementation always throws an `Error` because it does not know
   * which formats the concrete importer supports. The empty array below is
   * only an unreachable fallback after that error.
   *
   * @returns {string[]} Supported extension labels, such as `['json']`.
   * @throws {Error} The base implementation always throws an error.
   */
  getExtensions() {
    throws(`Implement the method \`getExtensions\` on \`${this.constructor.name}\``)
  }
}
