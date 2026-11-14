/** @import { TypeRegistry } from '@wimaengine/reflect' */
/** @import { TypeId } from '@wimaengine/type' */
/** @import { EntityId } from '@wimaengine/ecs' */
import { Importer } from '@wimaengine/asset'
import { warn } from '@wimaengine/logger'
import { Scene } from '../../assets'

/**
 * Imports JSON-backed {@linkcode Scene} assets through the {@linkcode Importer}
 * contract.
 *
 * {@linkcode ScenePlugin} installs this importer for the `json` extension.
 *
 * @example
 * ```js
 * const importer = new JSONSceneImporter()
 * const scene = await importer.deserialize(response, typeRegistry)
 * ```
 *
 * @augments {Importer<Scene>}
 */
export class JSONSceneImporter extends Importer {

  /**
   * Associates this importer with the {@linkcode Scene} asset type for the base
   * {@linkcode Importer} implementation.
   */
  constructor() {
    super(Scene)
  }

  /**
   * Parses a response body and reconstructs a {@linkcode Scene} from its JSON
   * representation. API users can pass the response from a scene asset request
   * together with the app's {@linkcode TypeRegistry} to restore the serialized
   * component and resource values.
   *
   * The response JSON is awaited, then each entity component and scene resource
   * is resolved through the supplied {@linkcode TypeRegistry}: its runtime type ID
   * selects the registry entry, whose `deserialize` method receives the stored
   * value. Unknown types, non-object deserialization results, invalid entity IDs,
   * and malformed entity/component/resource shapes are warned about or skipped,
   * so the result can be empty or partial while valid data is retained. A valid
   * JSON value that is not an object produces an empty {@linkcode Scene}.
   *
   * Malformed JSON causes `response.json()` to reject, and an exception thrown
   * by a registered deserializer also propagates because this method does not
   * catch either failure.
   *
   * @param {Response} response - Response containing the serialized scene JSON.
   * @param {TypeRegistry} typeRegistry - Registry
   * used to deserialize component and resource values by runtime type ID.
   * @returns {Promise<Scene>} The reconstructed scene, which may be empty or
   * partial when the JSON contains unsupported or malformed scene data.
   * @throws If `response.json()` rejects or a registered deserializer throws;
   * neither failure is caught here.
   */
  async deserialize(response, typeRegistry) {
    const serial = await response.json()

    return deserializeScene(serial, typeRegistry)
  }

  /**
   * Returns the file extension handled by this importer.
   *
   * @returns {string[]} The supported extension labels: `['json']`.
   */
  getExtensions() {
    return ['json']
  }
}

/**
 * @param {unknown} serial
 * @param {TypeRegistry} typeRegistry
 * @returns {Scene}
 */
function deserializeScene(serial, typeRegistry) {
  const scene = new Scene()

  if (typeof serial !== 'object' || serial === null) {
    return scene
  }

  if ('entities' in serial && serial.entities && typeof serial.entities === 'object') {
    for (const [entityId, componentsSerial] of Object.entries(serial.entities)) {
      if (!componentsSerial || typeof componentsSerial !== 'object') continue

      const components = Object.entries(componentsSerial).map(([typeId, value]) => {
        const component = deserializeComponent(/** @type {TypeId} */ (typeId), value, typeRegistry)

        if (typeof component !== 'object' || component === null) {
          warn(`Failed to deserialize scene snapshot with type id \`${typeId}\`.`)

          return undefined
        }

        return component
      })
        .filter((component) => component !== undefined)

      const numericEntityId = Number(entityId)

      if (!Number.isFinite(numericEntityId)) continue

      scene.entities.set(/** @type {EntityId} */ (numericEntityId), components)
    }
  }

  if ('resources' in serial && serial.resources && typeof serial.resources === 'object') {
    for (const [typeId, value] of Object.entries(serial.resources)) {
      const resource = deserializeComponent(/** @type {TypeId} */ (typeId), value, typeRegistry)

      if (typeof resource !== 'object' || resource === null) {
        warn(`Failed to deserialize scene snapshot with type id \`${typeId}\`.`)

        continue
      }

      scene.resources.set(/** @type {TypeId} */ (typeId), resource)
    }
  }

  return scene
}

/**
 * @param {TypeId} typeId
 * @param {unknown} value
 * @param {TypeRegistry} typeRegistry
 * @returns {unknown}
 */
function deserializeComponent(typeId, value, typeRegistry) {
  const entry = typeRegistry.getByTypeId(typeId)
  const component = entry?.call('deserialize', [value])

  return component
}
