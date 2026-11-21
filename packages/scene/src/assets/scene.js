/** @import { EntityId } from '@wimaengine/ecs' */
/** @import { AssetId } from '@wimaengine/asset' */
/** @import { TypeEntry } from '@wimaengine/reflect' */
/** @import { Constructor, TypeId } from '@wimaengine/type' */
import { LiveType, SnapshotType } from '@wimaengine/core'
import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { Parent } from '@wimaengine/hierarchy'
import { warn } from '@wimaengine/logger'
import { TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { SceneInstance } from '../components'
import { AssetSceneMap } from '../resources'
import { SceneFilter } from './filter'

/**
 * Represents a scene snapshot asset that can capture world state and restore
 * it as new entities and resources.
 *
 * @example
 * ```js
 * import { Scene } from '@wimaengine/scene'
 *
 * const scene = Scene.fromWorld(world, typeRegistry)
 * console.log(scene.entityCount())
 *
 * for (const [entityId, components] of scene.entities) {
 *   console.log(entityId, components.length)
 * }
 * ```
 */
export class Scene {

  /**
   * Stores component snapshots by the packed ID of their source entity.
   *
   * This map is the scene's live entity storage. Each value is the component
   * snapshot array for its source entity, and the map and arrays are stored
   * directly so mutations are visible to the scene immediately. Capturing a
   * world keeps an entry even when none of that entity's component snapshots
   * can be stored, so an entry may have an empty array.
   *
   * @type {Map<EntityId, object[]>}
   */
  entities = new Map()

  /**
   * Stores resource snapshots by their live type ID.
   *
   * This map is the scene's live resource storage. Keys identify the snapshot
   * types used for registry lookup and filtering during {@linkcode Scene#toWorld}.
   * Snapshot objects are stored directly without cloning or validation.
   *
   * @type {Map<TypeId, object>}
   */
  resources = new Map()

  /**
   * Restores this scene snapshot into a world.
   *
   * One new world entity is spawned for each entry in {@linkcode Scene#entities},
   * even when filtering removes every snapshot in that entry. Stored entity
   * IDs identify the source entities only; the method maps each new world ID to
   * its source ID in {@linkcode SceneInstance#entityMap} and passes the reverse
   * mapping to registered snapshot mapping methods. Existing entries in
   * {@linkcode SceneInstance#entityMap} are not cleared.
   *
   * `EntityHandle` snapshots are ignored because each spawned entity already
   * has its live handle. Other component snapshots are restored through the
   * supplied {@linkcode TypeRegistry}. Snapshots whose type is disallowed by
   * `filter`, is not registered, or produces no restored value are skipped.
   * When a restored entity has no {@linkcode Parent} and no filter is supplied or
   * `filter` allows `Parent`'s type ID, a parent pointing to `instanceEntity`
   * is added. A filter that denies `Parent` prevents this automatic parent
   * component.
   *
   * Resource snapshots are filtered by their map keys. A registered `patch`
   * method handles a resource when it returns `true`; otherwise the resource
   * is restored through its registered `fromSnapshot` or `clone` method and
   * set in the world when restoration produces a value. Registered `map`
   * methods are called for restored components and resources with the
   * scene-to-world entity mapping. The instance's asset ID, when available,
   * is supplied to registered snapshot restoration and resource patch methods.
   *
   * @param {World} world
   * @param {SceneInstance} instance - Instance receiving restored-entity mappings.
   * @param {TypeRegistry} typeRegistry - Registry used to restore and map snapshots.
   * @param {EntityHandle} instanceEntity - Entity used as the default parent.
   * @param {SceneFilter} [filter] - Optional filter for component and resource snapshot types.
   * @returns {void}
   */
  toWorld(world, instance, typeRegistry, instanceEntity, filter) {
    const { entityMap: worldToSceneMap } = instance
    const sceneToWorldMap = new Map()
    const sceneAssetId = instance.handle?.id()

    if (sceneAssetId !== undefined && !world.hasResource(AssetSceneMap)) {
      world.setResource(new AssetSceneMap())
    }

    for (const entity of this.entities.keys()) {
      const worldEntity = world.spawn([])

      worldToSceneMap.set(worldEntity.id(), entity)
      sceneToWorldMap.set(entity, worldEntity.id())
    }

    for (const [typeId, resource] of this.resources) {
      const entry = typeRegistry.getByTypeId(typeId)
      const snapshotType = entry?.getAttribute(SnapshotType)
      const serializationEntry = snapshotType ?
        typeRegistry.getByTypeId(snapshotType.typeId) :
        entry

      if (filter && !filter.allows(typeId)) {
        continue
      }

      if (!serializationEntry) {
        warn(`The snapshot type of \`${typeId}\` is not registered in the type registry`)
        continue
      }

      if (patchResource(resource, world, serializationEntry, sceneAssetId)) {
        continue
      }

      const restoredResource = fromSnapshot(resource, world, typeRegistry, serializationEntry, sceneAssetId)

      if (!restoredResource) {
        continue
      }

      serializationEntry
        .getMethod('map')
        ?.method
        ?.call(restoredResource, sceneToWorldMap)

      world.setResource(restoredResource)
    }

    for (const [entity, components] of this.entities) {
      const worldEntity = sceneToWorldMap.get(entity)
      const clonedComponents = components.map((component) => {
        const { constructor } = component
        const componentType = /** @type {Constructor} */ (constructor)
        const snapshotTypeId = typeid(componentType)
        const snapshotEntry = typeRegistry.get(componentType)
        const liveTypeId = snapshotEntry?.getAttribute(LiveType)?.typeId ?? snapshotTypeId

        if (constructor === EntityHandle) {
          return undefined
        }

        if (filter && !filter.allows(liveTypeId)) {
          return undefined
        }

        if (!snapshotEntry) {
          warn(`The type \`${componentType.name}\` is not registered in the type registry`)

          return undefined
        }

        const clonedComponent = fromSnapshot(component, world, typeRegistry, snapshotEntry, sceneAssetId)

        if (!clonedComponent) {
          return undefined
        }

        snapshotEntry
          .getMethod('map')
          ?.method
          ?.call(clonedComponent, sceneToWorldMap)

        return clonedComponent
      }).filter((e) => e !== undefined)

      if (
        !clonedComponents.some((c) => c.constructor === Parent) &&
        (!filter || filter.allows(typeid(Parent)))
      ) {
        clonedComponents.push(new Parent(instanceEntity))
      }

      world.insert(EntityHandle.from(worldEntity), clonedComponents)
    }
  }

  /**
   * Captures a scene snapshot from a world.
   *
   * Each entity selected by the ECS {@linkcode Query} for {@linkcode EntityHandle}
   * receives an entry in {@linkcode Scene#entities}, keyed by its packed ID.
   * Each world resource with a matching {@linkcode TypeRegistry} entry is added
   * to {@linkcode Scene#resources} when its snapshot succeeds. A registered
   * `toSnapshot` method is preferred; when none is registered, the registered
   * `clone` method is used. Unknown types and values without either method are
   * skipped. Resource entries are keyed by the live resource type ID, and an
   * entity remains in the map even if its component array is empty.
   *
   * The source world is not modified.
   *
   * @param {World} world - World whose entities and resources are captured.
   * @param {TypeRegistry} typeRegistry - Registry used to snapshot values.
   * @returns {Scene} A new scene snapshot asset.
   */
  static fromWorld(world, typeRegistry) {
    const scene = new Scene()
    const entities = new Query(world, [EntityHandle])

    entities.each(([entity]) => {
      const cell = world.getEntity(entity)
      const typeIds = cell.components()
      const components = []

      for (let i = 0; i < typeIds.length; i++) {
        const typeId = /** @type {TypeId} */(typeIds[i])
        const component = /** @type {object} */(cell.getTypeId(typeId))
        const entry = typeRegistry.getByTypeId(typeId)

        if (!entry) {
          const name = component?.constructor?.name || 'Unknown'

          warn(`The type \`${name}\` is not registered in the type registry`)
          continue
        }

        const snapshot = toSnapshot(component, world, entry)

        if (snapshot) {
          components.push(/** @type {object} */(snapshot))
        }
      }

      scene.entities.set(entity.id(), components)
    })

    for (const [typeId, resource] of world.getResources()) {
      const resourceObject = /** @type {object} */ (resource)
      const entry = typeRegistry.getByTypeId(typeId)

      if (!entry) {
        warn(`The type \`${typeId}\` is not registered in the type registry`)
        continue
      }

      const snapshot = toSnapshot(resourceObject, world, entry)

      if (!snapshot) {
        continue
      }

      scene.resources.set(typeId, /** @type {object} */(snapshot))
    }

    return scene
  }

  /**
   * Converts a scene into its registry-aware, JSON-compatible representation.
   *
   * @param {Scene} scene - Scene snapshot to serialize.
   * @param {TypeRegistry} typeRegistry - Registry used for snapshot serialization.
   * @returns {{ entities: Record<string, Record<string, unknown>>, resources: Record<string, unknown> }}
   * JSON-compatible scene representation.
   */
  static serializeWithContext(scene, typeRegistry) {
    return {
      entities: Object.fromEntries(
        [...scene.entities].map(([entity, components]) => [
          entity,
          serializeSnapshots(components, typeRegistry)
        ])
      ),
      resources: Object.fromEntries(
        [...scene.resources].map(([typeId, resource]) => {
          const liveEntry = typeRegistry.getByTypeId(typeId)

          if (!liveEntry) {
            return [typeId, undefined]
          }

          const snapshotTypeId = liveEntry.getAttribute(SnapshotType)?.typeId
          const snapshotEntry = snapshotTypeId ?
            typeRegistry.getByTypeId(snapshotTypeId) :
            undefined

          return [typeId, (snapshotEntry || liveEntry).call('serialize', [resource]) ?? resource]
        }).filter((value) => value[1] !== undefined)
      )
    }
  }

  /**
   * Reconstructs a scene from its registry-aware serialized representation.
   *
   * @param {unknown} serial - Serialized scene representation.
   * @param {TypeRegistry} typeRegistry - Registry used for snapshot deserialization.
   * @returns {Scene} Reconstructed scene.
   */
  static deserializeWithContext(serial, typeRegistry) {
    const scene = new Scene()

    if (typeof serial !== 'object' || serial === null) {
      return scene
    }

    if ('entities' in serial && serial.entities && typeof serial.entities === 'object') {
      for (const [entityId, componentsSerial] of Object.entries(serial.entities)) {
        if (!componentsSerial || typeof componentsSerial !== 'object') continue

        const components = Object.entries(componentsSerial).map(([typeId, value]) => {
          const component = deserializeComponent(/** @type {TypeId} */(typeId), value, typeRegistry)

          if (typeof component !== 'object' || component === null) {
            warn(`Failed to deserialize scene snapshot with type id \`${typeId}\`.`)

            return undefined
          }

          return component
        })
          .filter((component) => component !== undefined)

        const numericEntityId = Number(entityId)

        if (!Number.isFinite(numericEntityId)) continue

        scene.entities.set(/** @type {EntityId} */(numericEntityId), components)
      }
    }

    if ('resources' in serial && serial.resources && typeof serial.resources === 'object') {
      for (const [typeId, value] of Object.entries(serial.resources)) {
        const resource = deserializeComponent(/** @type {TypeId} */(typeId), value, typeRegistry)

        if (typeof resource !== 'object' || resource === null) {
          warn(`Failed to deserialize scene snapshot with type id \`${typeId}\`.`)

          continue
        }

        scene.resources.set(/** @type {TypeId} */(typeId), resource)
      }
    }

    return scene
  }

  /**
   * Creates an empty scene asset.
   *
   * @returns {Scene} A new empty scene.
   */
  static default() {
    return new Scene()
  }

  /**
   * Returns the number of entity entries stored in this scene.
   *
   * This is the size of {@linkcode Scene#entities}. It counts entries even when
   * their component snapshot arrays are empty, but does not count individual
   * component snapshots or entries in {@linkcode Scene#resources}.
   *
   * @returns {number} The number of stored entity entries.
   */
  entityCount() {
    return this.entities.size
  }

  /**
   * Stores component snapshots for an entity ID.
   *
   * The entity's packed {@linkcode EntityId} is used as the map key; the handle
   * itself is not stored. An existing entry for the same ID is replaced. The
   * supplied array is stored by reference and is not cloned, merged, or
   * validated.
   *
   * @param {EntityHandle} entity - Entity whose packed ID identifies the entry.
   * @param {object[]} components - Component snapshot array to store directly.
   * @returns {void}
   */
  set(entity, components) {
    this.entities.set(entity.id(), components)
  }

  /**
   * Provides the scene iterator protocol method.
   *
   * This generator yields no values. Its first `next()` call completes with
   * {@linkcode Scene#entities} as the completion value, equivalent to
   * `{ value: scene.entities, done: true }`. Consequently, `for...of`, spread,
   * and other iterable consumers see no entity entries; use
   * `scene.entities` directly to iterate the stored snapshots.
   *
   * @returns {Generator<never, Map<EntityId, object[]>, void>} An empty
   * generator whose completion value is {@linkcode Scene#entities}.
   */
  * [Symbol.iterator]() {
    return this.entities
  }
}

/**
 * @param {object} component
 * @param {World} world
 * @param {TypeEntry} entry
 */
function toSnapshot(component, world, entry) {
  const method = entry.getMethod('toSnapshot')

  if (method) {
    return method.call([component, world])
  }

  const clone = entry.call('clone', [component])

  if (clone) {
    return /** @type {object} */ (clone)
  }

  const name = component?.constructor?.name || 'Unknown'

  warn(`The component \`${name}\` has not been snapshotted as there is no \`toSnapshot\` or \`clone\` method registered in the \`TypeRegistry\``)

  return undefined
}

/**
 * @param {object} component
 * @param {World} world
 * @param {TypeRegistry} typeRegistry
 * @param {TypeEntry} entry
 * @param {AssetId} [sceneAssetId]
 * @returns {object | undefined}
 */
function fromSnapshot(component, world, typeRegistry, entry, sceneAssetId) {
  const liveType = entry.getAttribute(LiveType)
  const liveEntry = liveType ?
    typeRegistry.getByTypeId(liveType.typeId) :
    entry
  const method = liveEntry?.getMethod('fromSnapshot')

  if (method) {
    return /** @type {object | undefined} */ (method.call([component, world, sceneAssetId]))
  }

  const clone = liveEntry === entry ?
    entry.call('clone', [component]) :
    undefined

  if (clone) {
    return /** @type {object} */ (clone)
  }

  const name = component?.constructor?.name || 'Unknown'

  warn(`The component \`${name}\` has not been restored as there is no \`fromSnapshot\` or \`clone\` method registered in the \`TypeRegistry\``)

  return undefined
}

/**
 * @param {object} resource
 * @param {World} world
 * @param {TypeEntry} entry
 * @param {AssetId} [sceneAssetId]
 * @returns {boolean}
 */
function patchResource(resource, world, entry, sceneAssetId) {
  const method = entry.getMethod('patch')

  if (!method) {
    return false
  }

  return entry.call('patch', [resource, world, sceneAssetId]) === true
}

/**
 * @param {object[]} snapshots
 * @param {TypeRegistry} typeRegistry
 * @returns {Record<string, unknown>}
 */
function serializeSnapshots(snapshots, typeRegistry) {

  /** @type {Record<string, unknown>} */
  const serial = {}

  for (const snapshot of snapshots) {
    const snapshotTypeId = typeid(/** @type {Constructor} */(snapshot.constructor))
    const snapshotEntry = typeRegistry.getByTypeId(snapshotTypeId)
    const liveTypeId = snapshotEntry?.getAttribute(LiveType)?.typeId ?? snapshotTypeId
    const value = snapshotEntry?.call('serialize', [snapshot])

    if (!value) continue

    serial[liveTypeId] = value
  }

  return serial
}

/**
 * @param {TypeId} typeId
 * @param {unknown} value
 * @param {TypeRegistry} typeRegistry
 * @returns {unknown}
 */
function deserializeComponent(typeId, value, typeRegistry) {
  const snapshotTypeId = typeRegistry.getByTypeId(typeId)?.getAttribute(SnapshotType)?.typeId ?? typeId
  const entry = typeRegistry.getByTypeId(snapshotTypeId)

  return entry?.call('deserialize', [value])
}
