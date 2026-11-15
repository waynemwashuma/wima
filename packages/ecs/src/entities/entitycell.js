/** @import { Constructor,TypeId } from '@wimaengine/type' */
/** @import {World} from '../world' */
import { typeid } from '@wimaengine/type'
import { Archetypes } from '../archetype'
import { Tables } from '../tables'
import { EntityHandle } from './entity'
import { EntityLocation } from './location'

/**
 * Provides a view of one {@linkcode EntityHandle} in a {@linkcode World}.
 *
 * A cell combines the requested handle with the {@linkcode EntityLocation}
 * selected by its index and generation. Use {@linkcode World#getEntity} to create
 * a cell, then use it to inspect the entity's current component layout or read
 * component values from its table row.
 *
 * If the handle is missing, already despawned, or has a stale generation, the
 * cell uses an invalid location. In that state {@linkcode EntityCell#exists}
 * returns `false` and {@linkcode EntityCell#components} returns an empty list.
 * Call {@linkcode EntityCell#exists} before {@linkcode EntityCell#get} or
 * {@linkcode EntityCell#has}; those methods access the cell's table or archetype
 * directly and are not guarded for an invalid location.
 *
 * When a matching location exists, the cell keeps the world's location record
 * and observes its table, row, and archetype updates. A cell does not perform
 * a fresh generation check on every method call, so discard and reacquire it
 * after despawning an entity or reusing its storage slot.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 *
 * class Position {
 *   constructor(x = 0) {
 *     this.x = x
 *   }
 * }
 *
 * const world = new World()
 * const entity = world.spawn([new Position(1)])
 * const cell = world.getEntity(entity)
 *
 * if (cell.exists() && cell.has([Position])) {
 *   const position = cell.get(Position)
 *   if (position) position.x += 1
 * }
 *
 * world.despawn(entity)
 * console.log(world.getEntity(entity).exists()) // false
 * ```
 */
export class EntityCell {

  /**
   * @private
   * @type {EntityHandle}
   */
  entity

  /**
   * Storage location for this cell's entity.
   *
   * A matching live handle uses the location record owned by the world. A
   * missing or stale handle gets a new location whose identifiers are `-1`.
   * The world updates this record when the entity changes tables or is
   * despawned.
   *
   * @type {EntityLocation}
   */
  location

  /**
   * World table store used to read component values.
   *
   * @type {Tables}
   */
  tables

  /**
   * World archetype store used to inspect the entity's component types.
   *
   * @type {Archetypes}
   */
  archetypes

  /**
   * Creates a cell view for an entity in a world.
   *
   * The entity index and generation are checked against the world's entity
   * registry. If they do not identify a matching location, the cell is still
   * created with an invalid location; use {@linkcode EntityCell#exists} to test
   * it before reading or checking components.
   *
   * @param {World} world
   * @param {EntityHandle} entity
   */
  constructor(world, entity) {
    const entities = world.getEntities()
    const location = entities.get(entity.index)

    if (location && location.generation === entity.generation) {
      this.location = location
    } else {
      this.location = new EntityLocation()
    }

    this.tables = world.getTables()
    this.archetypes = world.getArchetypes()
    this.entity = entity
  }

  /**
   * Checks whether this cell currently points at a valid storage location.
   *
   * The check succeeds when the location has a table id, row index, and
   * archetype id other than `-1`. It does not perform a new lookup or compare
   * the location's generation with the handle, so reacquire a cell after its
   * entity is despawned or its slot is reused.
   *
   * @returns {boolean} `true` when the location can identify an entity row.
   */
  exists() {
    return (
      this.location.archetypeId !== -1 &&
      this.location.tableId !== -1 &&
      this.location.index !== -1
    )
  }

  /**
   * Reads a component by its constructor.
   *
   * The constructor is converted to its {@linkcode TypeId} and the component is
   * read from this cell's table row. A live entity that does not contain the
   * requested component returns `undefined`. Call {@linkcode EntityCell#exists}
   * first; an invalid cell has no table and is not handled by this method.
   *
   * @template T
   * @param {Constructor<T>} type
   * @returns {T | undefined} The component value, or `undefined` when it is not present.
   */
  get(type) {
    const component = this.getTypeId(typeid(type))

    // SAFETY: Component has same `TypeId` as the `type`
    return /** @type {T} */(component)
  }

  /**
   * Reads a component by its raw {@linkcode TypeId}.
   *
   * This is the type-ID form of {@linkcode EntityCell#get}. It returns the
   * value stored in the cell's table row, or `undefined` when the live entity
   * has no column for `typeid`. Call {@linkcode EntityCell#exists} before using
   * it because an invalid cell has no table.
   *
   * @param {TypeId} typeid
   * @returns {unknown | undefined} The component value, or `undefined` when it is not present.
   */
  getTypeId(typeid) {
    const { tableId, index } = this.location
    const table = this.tables.get(tableId)

    return table.get(typeid, index)
  }

  /**
   * Checks whether the entity has every requested component type.
   *
   * Constructors are converted to {@linkcode TypeId} values and checked against
   * the cell's current archetype. An empty list matches any valid archetype.
   * Call {@linkcode EntityCell#exists} first; an invalid cell has no archetype.
   *
   * @template T
   * @param {Constructor<T>[]} types
   * @returns {boolean} `true` when every requested type is present.
   */
  has(types) {
    return this.hasTypeid(types.map((type) => typeid(type)))
  }

  /**
   * Checks whether the entity has every requested type ID.
   *
   * This is the raw type-ID form of {@linkcode EntityCell#has}. It checks the
   * cell's current archetype without reading component values. Call
   * {@linkcode EntityCell#exists} first; an invalid cell has no archetype.
   *
   * @param {TypeId[]} typeids
   * @returns {boolean} `true` when every requested type ID is present.
   */
  hasTypeid(typeids) {
    const { archetypeId } = this.location
    const archetype = this.archetypes.get(archetypeId)

    return archetype.has(typeids)
  }

  /**
   * Lists the type IDs in the entity's current archetype.
   *
   * This returns component type IDs, not component values or constructors. A
   * live entity spawned by {@linkcode World#spawn} also includes
   * {@linkcode EntityHandle} as a component. If the cell has no archetype,
   * including for a stale or missing entity, this returns an empty list.
   *
   * @returns {readonly TypeId[]} The component type IDs, or `[]` without an archetype.
   */
  components() {
    const archetype = this.archetypes.get(this.location.archetypeId)

    if (archetype) {
      return archetype.types
    }

    return []

  }

  /**
   * Returns the handle associated with this cell.
   *
   * The returned handle is the one supplied when the cell was created. This
   * method does not check whether the handle is still live, so a stale cell
   * returns its stale handle.
   *
   * @returns {EntityHandle} The cell's entity handle.
   */
  id() {
    return this.entity
  }
}
