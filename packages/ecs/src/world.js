/** @import { Constructor, TypeId, TupleConstructor } from '@wimaengine/type'*/
/** @import { ArchetypeId, TableId, TableRow } from './typedef'*/
/** @import { Query } from './query' */

import { assert } from '@wimaengine/logger'
import { typeid } from '@wimaengine/type'
import { Archetypes, Archetype } from './archetype'
import { ComponentHooks } from './component'
import { Entities, EntityHandle, EntityLocation, EntityCell } from './entities'
import { Table, Tables } from './tables'
import { TypeStore } from './typestore'

/**
 * Represents an ECS world containing entities, their component values, and
 * world-scoped resources.
 *
 * Create entities with {@linkcode World#spawn}, change their component sets with
 * {@linkcode World#insert} and {@linkcode World#remove}, and read them directly or
 * through a {@linkcode Query}. Use the resource methods for world-scoped state
 * and {@linkcode World#setComponentHooks} to install lifecycle callbacks for
 * component types.
 *
 * @example
 * ```js
 * import { ComponentHooks, Query, World } from '@wimaengine/ecs'
 *
 * class Position {}
 * class Health {}
 *
 * const world = new World()
 * world.setComponentHooks(Position, new ComponentHooks(() => {
 *   console.log('position added')
 * }))
 *
 * const entity = world.spawn([new Position()])
 * world.insert(entity, [new Health()])
 * const position = world.get(entity, Position)
 *
 * const query = new Query(world, [Position])
 * query.each(([currentPosition]) => console.log(currentPosition))
 * ```
 */
export class World {

  /**
   * Tables containing component rows for each exact component layout.
   *
   * @private
   * @type {Tables}
   */
  tables = new Tables()

  /**
   * Archetype records that map component type sets to tables.
   *
   * @private
   * @type {Archetypes}
   */
  archetypes = new Archetypes()

  /**
   * Resource instances keyed by resource type ID.
   *
   * @private
   * @type {Map<TypeId,unknown>}
   */
  resources = new Map()

  /**
   * Resource alias type IDs mapped to the resource type IDs they refer to.
   *
   * @private
   * @type {Map<TypeId,TypeId>}
   */
  resourceAliases = new Map()

  /**
   * Component metadata, including configured lifecycle hooks.
   *
   * @private
   * @type {TypeStore}
   */
  typestore = new TypeStore()

  /**
   * Entity locations indexed by reusable entity slot index.
   *
   * @private
   * @type {Entities}
   */
  entities = new Entities()

  /**
   * Creates an empty world and registers {@linkcode EntityHandle} as its built-in
   * entity component type.
   */
  constructor() {
    this.typestore.set(EntityHandle)
  }

  /**
   * Returns the world's entity-location registry.
   *
   * This low-level view supports entity helpers. Entity validity still depends
   * on matching an {@linkcode EntityHandle} index and generation.
   *
   * @returns {Readonly<Entities>}
   */
  getEntities() {
    return this.entities
  }

  /**
   * @private
   * @param {EntityHandle} entity
   * @param {readonly TypeId[]} newIds
   */
  callAddComponentHook(entity, newIds) {
    for (let i = 0; i < newIds.length; i++) {
      const hook = this.typestore.getByTypeId(newIds[i])?.getHooks().add

      if (hook) hook(entity, this)
    }
  }

  /**
   * @private
   * @param {EntityHandle} entity
   * @param {readonly TypeId[]} newIds
   */
  callRemoveComponentHook(entity, newIds) {
    for (let i = 0; i < newIds.length; i++) {
      const hook = this.typestore.getByTypeId(newIds[i])?.getHooks().remove

      if (hook) hook(entity, this)
    }
  }

  /**
   * @private
   * @param {EntityHandle} entity
   * @param {readonly TypeId[]} newIds
   *
   */
  callInsertComponentHook(entity, newIds) {
    for (let i = 0; i < newIds.length; i++) {
      const hook = this.typestore.getByTypeId(newIds[i])?.getHooks().insert

      if (hook) hook(entity, this)
    }
  }

  /**
   * Finds or creates the table and archetype for an exact component layout.
   *
   * The supplied type IDs are deduplicated before lookup. This is an internal
   * storage operation used by entity mutations.
   *
   * @private
   * @param {TypeId[]} typeIds
   * @returns {[TableId, Table, ArchetypeId, Archetype]}
   */
  resolve(typeIds) {
    const actualTypeIds = deduplicate(typeIds)

    const archetype = this.archetypes.getArchetypeWithOnly(actualTypeIds)

    if (archetype) {
      const [id, arch] = archetype
      const { tableId } = arch
      const table = this.tables.get(tableId)

      assert(table, `The archetype ${archetype[0]} has an invalid table.`)

      return [tableId, table, id, arch]
    }

    const [tableId, table] = this.tables.resolveTableFor(actualTypeIds)
    const newArchetype = new Archetype(tableId, actualTypeIds)
    const id = this.archetypes.set(newArchetype)

    return [tableId, table, id, newArchetype]
  }

  /**
   * Creates an entity with the supplied component instances.
   *
   * The returned {@linkcode EntityHandle} identifies the new entity by slot index
   * and generation. The handle is also stored as an `EntityHandle` component,
   * and this method appends it to the supplied `components` array. Registered
   * component `add` hooks run synchronously after the row is stored.
   *
   * @template {object[]} T
   * @param {[...T]} components - Component instances to store; the array is appended with the entity handle.
   * @returns {EntityHandle} The new entity's generation-safe handle.
   */
  spawn(components) {
    const entityIndex = this.entities.reserve()
    let location = this.entities.get(entityIndex)

    if (!location) {
      const newLocation = new EntityLocation()

      this.entities.set(entityIndex, newLocation)
      location = newLocation
    }

    location.generation += 1

    // SAFETY:Object constructors can be casted from `Function` to `Constructor`
    const newIds = (components.map((c) => typeid(/** @type {Constructor} */(c.constructor))))
    const entity = new EntityHandle(entityIndex, location.generation)

    newIds.push(typeid(EntityHandle))
    components.push(entity)

    const [tableId, table, archetypeId] = this.resolve(newIds)
    const tableRow = table.insert(newIds, components)

    location.tableId = tableId
    location.archetypeId = archetypeId
    location.index = tableRow
    this.callAddComponentHook(entity, newIds)

    return entity
  }

  /**
   * Adds or replaces component values on a live entity.
   *
   * A stale handle makes this method return without changing the world. The
   * supplied component instances are stored before their registered `add`
   * hooks run. Registered `insert` hooks then run for the component types that
   * were already present, even when the supplied types use the entity's
   * existing table. The method returns `undefined`.
   *
   * @template {object[]} T
   * @param {EntityHandle} entity
   * @param {[...T]} components - Component instances to add or replace.
   * @returns {void}
   */
  insert(entity, components) {
    const location = this.entities.get(entity.index)

    if (!location || location.generation !== entity.generation) {
      return
    }

    // SAFETY:Object constructors can be casted from `Function` to `Constructor`
    const { archetypeId: oldArchetypeId, index, tableId: oldTableId } = location
    const oldArchetype = this.archetypes.get(oldArchetypeId)
    const oldTable = this.tables.get(oldTableId)

    if (!oldTable) return

    const newIds = (components.map((c) => typeid(/** @type {Constructor} */ (c.constructor))))
    const existingIds = oldArchetype.types
    const combinedIds = [...existingIds, ...newIds]
    const [newTableId, newTable, newArchetypeId] = this.resolve(combinedIds)

    if (newTableId === oldTableId) {
      oldTable.insertUnchecked(index, newIds, components)
    } else {
      const newIndex = oldTable.moveTo(newTable, index)
      const swapped = /** @type {EntityHandle | null}*/ (oldTable.get(typeid(EntityHandle), index))

      newTable.insertUnchecked(newIndex, newIds, components)
      location.tableId = newTableId
      location.archetypeId = newArchetypeId
      location.index = newIndex

      if (swapped) {
        const swappedlocation = /** @type {EntityLocation} */ (this.entities.get(swapped.index))

        swappedlocation.index = index
      }
    }

    this.callAddComponentHook(entity, newIds)
    this.callInsertComponentHook(entity, existingIds)
  }

  /**
   * Removes component types from a live entity.
   *
   * A stale handle makes this method return without changing the world. Remove
   * hooks run synchronously before the entity row moves, followed by `insert`
   * hooks for the types that remain in the new layout. A requested type that
   * is not present changes no storage, but its registered remove hook is still
   * called. The method returns `undefined`.
   *
   * @template {unknown[]} T
   * @param {EntityHandle} entity
   * @param {TupleConstructor<T>} components - Component constructors to remove.
   * @returns {void}
   */
  remove(entity, components) {
    const location = this.entities.get(entity.index)

    if (!location || location.generation !== entity.generation) {
      return
    }

    const { archetypeId: oldArchetypeId, index, tableId: oldTableId } = location
    const oldArchetype = this.archetypes.get(oldArchetypeId)
    const oldTable = this.tables.get(oldTableId)

    if (!oldTable) return

    const removedIds = (components.map((c) => typeid(c)))
    const existingIds = oldArchetype.types
    const newIds = removeElements(existingIds, removedIds)
    const [newTableId, newTable, newArchetypeId] = this.resolve(newIds)

    this.callRemoveComponentHook(entity, removedIds)

    const newIndex = oldTable.moveTo(newTable, index)
    const swapped = /** @type {EntityHandle | null}*/ (oldTable.get(typeid(EntityHandle), index))

    location.tableId = newTableId
    location.archetypeId = newArchetypeId
    location.index = newIndex

    if (swapped) {
      const swappedlocation = /** @type {EntityLocation} */ (this.entities.get(swapped.index))

      swappedlocation.index = index
    }

    this.callInsertComponentHook(entity, newIds)
  }

  /**
   * Creates one entity for every component list in `entities`.
   *
   * This calls {@linkcode World#spawn} for each list in order. Each input
   * list is therefore appended with its entity handle, and the handles are not
   * returned by this method.
   *
   * @template {{}[]} T
   * @param {[...T][]} entities - Component lists to pass to {@linkcode World#spawn}.
   * @returns {void}
   */
  createMany(entities) {
    for (let i = 0; i < entities.length; i++) {
      this.spawn(entities[i])
    }
  }

  /**
   * Removes an entity and all of its components from the world.
   *
   * Remove hooks run synchronously while the entity row still exists, before
   * the row is deleted. A stale handle is ignored. The entity's slot is then
   * recycled; a later {@linkcode World#spawn} may reuse its index with a new
   * generation, so the old {@linkcode EntityHandle} cannot access the replacement.
   *
   * @param {EntityHandle} entity - The entity to remove.
   * @returns {void}
   */
  despawn(entity) {
    const location = this.entities.get(entity.index)

    if (!location || location.generation !== entity.generation) {
      return
    }

    const { archetypeId, tableId, index } = location
    const archetype = this.archetypes.get(archetypeId)
    const table = this.tables.get(tableId)

    if (!archetype || !table) return

    this.callRemoveComponentHook(entity, archetype.types)
    table.remove(index)

    // SAFETY: The fetched component is an `Entity`.
    const swapped = /** @type {EntityHandle | null}*/ (table.get(typeid(EntityHandle), index))

    // SAFETY: -1 is the invalid identifier
    location.tableId = /** @type {TableId}*/ (-1)
    location.index = /** @type {TableRow}*/ (-1)
    location.archetypeId = /** @type {ArchetypeId}*/ (-1)
    this.entities.recycle(entity.index)

    if (swapped) {

      // SAFETY: The swapped entity still exists.
      const swappedlocation = /** @type {EntityLocation} */ (this.entities.get(swapped.index))

      swappedlocation.index = index
    }
  }

  /**
   * Reads a component from an entity handle.
   *
   * Returns `null` when the index is unknown or the handle's generation is
   * stale. Returns `undefined` when the handle matches a location that has no
   * table, including immediately after {@linkcode World#despawn}, or when
   * the live entity does not have the requested component.
   *
   * @template T
   * @param {EntityHandle} entity - Handle identifying the entity to read.
   * @param {Constructor<T>} type - Component constructor to read.
   * @returns {T | null | undefined} The component, or the missing/stale sentinel.
   */
  get(entity, type) {
    const location = this.entities.get(entity.index)

    if (!location || location.generation !== entity.generation) {
      return null
    }

    const { tableId, index } = location
    const table = this.tables.get(tableId)
    const component = table?.get(typeid(type), index)

    // SAFETY: Fetched component with the typeid of `T`
    return /** @type {T | undefined}*/(component)
  }

  /**
   * Creates an {@linkcode EntityCell} view for an entity handle.
   *
   * A stale or unknown handle produces an invalid cell. Check
   * {@linkcode EntityCell#exists} before reading from that cell.
   *
   * @param {EntityHandle} entity - Handle identifying the entity to view.
   * @returns {EntityCell} A cell backed by the matching entity location, when one exists.
   */
  getEntity(entity) {
    return new EntityCell(this, entity)
  }

  /**
   * Returns the world's low-level table store.
   *
   * Queries and entity cells use this store to read component rows. Mutating
   * the returned store bypasses the world's entity-location bookkeeping.
   *
   * @returns {Tables} The table store.
   */
  getTables() {
    return this.tables
  }

  /**
   * Returns the world's resource map keyed by resource type ID.
   *
   * This low-level view does not resolve aliases; use
   * {@linkcode World#getResource} or {@linkcode World#getOptionalResource} for
   * typed lookup.
   *
   * @returns {ReadonlyMap<TypeId, unknown>} The resource map.
   */
  getResources() {
    return this.resources
  }

  /**
   * Returns the resource alias map.
   *
   * Each key is an alias type ID and each value is the resource type ID used
   * for the underlying lookup.
   *
   * @returns {ReadonlyMap<TypeId, TypeId>} Alias-to-resource type IDs.
   */
  getResourceAliases() {
    return this.resourceAliases
  }

  /**
   * Returns the world's low-level archetype store.
   *
   * Archetypes describe the exact component layouts used by the table store.
   * Mutating the returned store bypasses the world's entity-location
   * bookkeeping.
   *
   * @returns {Archetypes} The archetype store.
   */
  getArchetypes() {
    return this.archetypes
  }

  /**
   * Looks up a resource by its constructor or a registered alias constructor.
   *
   * A missing resource or alias causes an assertion error. Use
   * {@linkcode World#getOptionalResource} when absence is a
   * valid state.
   *
   * @template T
   * @param {Constructor<T>} resourceType - Resource or alias constructor.
   * @returns {T} The stored resource instance.
   * @throws {Error} If the resource or alias is not available.
   */
  getResource(resourceType) {
    return this.getResourceByTypeId(typeid(resourceType))
  }

  /**
   * Looks up a resource by its constructor or a registered alias constructor
   * without asserting when it is absent.
   *
   * An alias resolves to the resource stored under the type ID supplied to
   * {@linkcode World#setResourceAlias}.
   *
   * @template T
   * @param {Constructor<T>} resourceType - Resource or alias constructor.
   * @returns {T | undefined} The resource, or `undefined` when it is missing.
   */
  getOptionalResource(resourceType) {
    return this.getOptionalResourceByTypeId(typeid(resourceType))
  }

  /**
   * Looks up a resource by raw type ID and asserts when it is unavailable.
   *
   * The ID may be a resource type ID or an alias type ID. This is the raw-ID
   * form of {@linkcode World#getResource}.
   *
   * @template T
   * @param {TypeId} id - Resource or alias type ID.
   * @returns {T} The stored resource instance.
   * @throws {Error} If the resource or alias is not available.
   */
  getResourceByTypeId(id) {
    const resource = this.getOptionalResourceByTypeId(id)

    assert(resource, `The resource or resource alias \`${id}\` is non existent.`)

    // SAFETY: The typeid should match the type, caller's responsibility
    return /** @type {T}*/(resource)
  }

  /**
   * Looks up a resource by raw type ID without asserting when it is absent.
   *
   * If `id` is an alias type ID, the alias is followed to the resource type ID
   * stored in the world. Missing IDs and aliases return `undefined`.
   *
   * @template T
   * @param {TypeId} id - Resource or alias type ID.
   * @returns {T | undefined} The resource, or `undefined` when it is missing.
   */
  getOptionalResourceByTypeId(id) {
    const resource = this.resources.get(id)

    if (resource !== undefined) {

      // SAFETY: The typeid should match the type, caller's responsibility
      return /** @type {T}*/(resource)
    }

    const aliasedid = this.resourceAliases.get(id)

    if (aliasedid === undefined) return undefined

    const aliasedResource = this.resources.get(aliasedid)

    if (aliasedResource === undefined) return undefined

    // SAFETY: The aliased typeid should match the type, caller's responsibility
    return /** @type {T}*/(aliasedResource)
  }

  /**
   * Checks whether a resource or alias resolves to a stored resource value.
   *
   * The constructor is converted to its type ID before direct or alias lookup.
   *
   * @template T
   * @param {Constructor<T>} resourceType - Resource or alias constructor.
   * @returns {boolean} Whether a resource value is available.
   */
  hasResource(resourceType) {
    return this.hasResourceByTypeId(typeid(resourceType))
  }

  /**
   * Checks whether a raw resource or alias type ID resolves to a stored value.
   *
   * @template T
   * @param {TypeId} id - Resource or alias type ID.
   * @returns {boolean} Whether a resource value is available.
   */
  hasResourceByTypeId(id) {
    const resource = this.resources.get(id)

    if (resource) {
      return true
    }

    const aliasedid = this.resourceAliases.get(id)

    if (!aliasedid) return false

    const aliasedResource = this.resources.get(aliasedid)

    if (!aliasedResource) return false

    return true
  }

  /**
   * Stores a resource value under an explicit type ID.
   *
   * An existing value under the same ID is replaced. This method does not
   * create or validate resource aliases.
   *
   * @template T
   * @param {TypeId} id - Type ID used as the storage key.
   * @param {T} resource - Resource value to store.
   * @returns {void}
   */
  setResourceByTypeId(id, resource) {
    this.resources.set(id, resource)
  }

  /**
   * Stores a resource under the type ID of its constructor.
   *
   * An existing resource with the same constructor type ID is replaced. Use
   * {@linkcode World#setResourceByTypeId} for an explicit ID.
   *
   * @template {object} T
   * @param {T} resource - Resource instance to store.
   * @returns {void}
   */
  setResource(resource) {

    // SAFETY: An object's costructor is constructible
    const id = typeid(/** @type {Constructor<T>} */(resource.constructor))

    this.setResourceByTypeId(id, resource)
  }

  /**
   * Removes the resource stored under a constructor's type ID.
   *
   * This also deletes an alias entry whose key is the same type ID. It does not
   * remove other aliases that point to the resource ID; those aliases simply
   * stop resolving until that resource is stored again.
   *
   * @template T
   * @param {Constructor<T>} type - Resource constructor whose value is removed.
   * @returns {void}
   */
  removeResource(type) {
    this.removeResourceByTypeId(typeid(type))
  }

  /**
   * Removes a resource and alias entry stored under a raw type ID.
   *
   * Aliases whose keys differ from `typeId` are retained, even when they point
   * to the removed resource ID.
   *
   * @param {TypeId} typeId
   * @returns {void}
   */
  removeResourceByTypeId(typeId) {
    this.resources.delete(typeId)
    this.resourceAliases.delete(typeId)
  }

  /**
   * Registers an alias constructor for a resource type ID.
   *
   * The alias may be registered before the resource exists. A later alias
   * registration with the same alias constructor replaces the previous target.
   *
   * @template T
   * @param {TypeId} id - Type ID of the resource the alias names.
   * @param {Constructor<T>} alias - Constructor used to look up the resource.
   * @returns {void}
   */
  setResourceAlias(id, alias) {
    this.resourceAliases.set(typeid(alias), id)
  }

  /**
   * Installs lifecycle hooks for a component type in this world.
   *
   * The component is registered in the world's type store automatically. A
   * later call for the same component replaces its previous
   * {@linkcode ComponentHooks} value. The hooks run synchronously during entity
   * mutations; see {@linkcode ComponentHooks} for each callback's timing.
   *
   * @template T
   * @param {Constructor<T>} component - Component constructor to configure.
   * @param {ComponentHooks} hooks - Lifecycle callbacks for the component.
   * @returns {void}
   */
  setComponentHooks(component, hooks) {
    const id = this.typestore.getOrSet(component)
    const info = this.typestore.getById(id)

    assert(info, `Internal error:The component "${component.name}" has not been registered somehow.`)
    info.setHooks(hooks)
  }

  /**
   * Clears the world's table list.
   *
   * This low-level operation does not clear resources, resource aliases,
   * archetypes, component metadata, or entity locations. Existing entity
   * handles therefore no longer have readable table rows after this call, and
   * callers should treat the world as requiring reinitialization rather than
   * as a fully reset resource container.
   *
   * @returns {void}
   */
  clear() {
    this.tables.clear()
  }
}

/**
 * @private
 * @param {TypeId[]} newIds
 * @returns {TypeId[]}
 */
function deduplicate(newIds) {
  return [...new Set(newIds)]
}

/**
 * @private
 * @param {readonly TypeId[]} arr
 * @param {readonly TypeId[]} remove
 * @returns {TypeId[]}
 */
function removeElements(arr, remove) {
  return arr.filter((e) => !remove.includes(e))
}
