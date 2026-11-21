/** @import { TypeRegistry } from '@wimaengine/reflect' */
import { Exporter } from '@wimaengine/asset'
import { Scene } from '../../assets'

/**
 * Exports {@linkcode Scene} snapshot assets as JSON through the inherited
 * {@linkcode Exporter} contract.
 *
 * The serialized document contains entity component snapshots under `entities`
 * and world resource snapshots under `resources`. Registry-backed snapshot
 * methods are applied while building those sections; this class does not
 * restore scenes or mutate the source asset.
 *
 * @augments {Exporter<Scene>}
 */
export class JSONSceneExporter extends Exporter {

  /**
   * Associates this exporter with {@linkcode Scene} assets.
   *
   * The constructor passes {@linkcode Scene} to the inherited {@linkcode Exporter} contract
   * so the exporter is associated with that asset type.
   */
  constructor() {
    super(Scene)
  }

  /**
   * Serializes a {@linkcode Scene} snapshot asset to JSON text.
   *
   * Entity snapshots are written under `entities` as object properties keyed
   * by the entity IDs in {@linkcode Scene#entities}. Each entity's component
   * snapshots become properties keyed by their live type IDs. Resource
   * snapshots are written under `resources`, keyed by the live type IDs in
   * {@linkcode Scene#resources}.
   *
   * For each component or resource snapshot, the matching
   * {@linkcode TypeRegistry} entry's `serialize` method is used when it returns a
   * non-nullish value; otherwise the original snapshot is passed through.
   * Because this method is `async`, the final
   * `JSON.stringify` result is returned as a `Promise<string>`; serialization
   * errors from the registry method or JSON conversion are not caught here.
   *
   * @example
   * ```js
   * const exporter = new JSONSceneExporter()
   * const json = await exporter.serialize(scene, typeRegistry)
   * console.log(exporter.getExtensions()) // ['json']
   * ```
   *
   * @param {Scene} asset - Scene snapshot to serialize.
   * @param {TypeRegistry} typeRegistry - Registry used for snapshot serialization methods.
   * @returns {Promise<string>} JSON text containing the entity and resource snapshots.
   */
  async serialize(asset, typeRegistry) {
    return JSON.stringify(Scene.serializeWithContext(asset, typeRegistry))
  }

  /**
   * Returns the extension labels supported by this exporter.
   *
   * This exporter supports JSON output through the `json` label, without a
   * leading dot.
   *
   * @returns {string[]} The supported extension labels: `['json']`.
   */
  getExtensions() {
    return ['json']
  }
}
