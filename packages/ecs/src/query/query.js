/** @import { TableId, TableRow } from '../typedef'*/
/** @import { TypeId, TupleConstructor  } from '@wimaengine/type'*/
/** @import { ApplyFilters, Has, Optional, Without } from './filters' */

import { typeid } from '@wimaengine/type'
import { Archetype } from '../archetype'
import { EntityHandle } from '../entities'
import { Table } from '../tables'
import { World } from '../world'
import { QueryFilter } from './filters'

/**
 * @template {unknown[]} T
 * @template {QueryFilter[]} U
 * @typedef {ApplyFilters<T, U>} QueryComponents
 */

/**
 * Selects entities in a {@linkcode World} by component type and exposes their
 * component values as ordered tuples.
 *
 * Use a query for repeated component reads or iteration. Pass
 * {@linkcode QueryFilter} instances to refine which entities participate. The
 * query's matching component combinations are established when it is
 * constructed and refreshed only by {@linkcode Query#update}; entities using a
 * new component combination are not included until `update()` is called.
 *
 * @example
 * ```js
 * import { Query, World, optional } from '@wimaengine/ecs'
 *
 * class Position {
 *   constructor(x = 0) {
 *     this.x = x
 *   }
 * }
 * class Velocity {
 *   constructor(x = 0) {
 *     this.x = x
 *   }
 * }
 *
 * const world = new World()
 * const entity = world.spawn([new Position()])
 * const query = new Query(world, [Position, Velocity], [optional(Velocity)])
 *
 * world.spawn([new Position(10), new Velocity(1)])
 * query.update()
 *
 * query.each(([position, velocity]) => {
 *   position.x += velocity?.x ?? 0
 * })
 * const first = query.single()
 * const entityComponents = query.get(entity)
 * ```
 *
 * @template {unknown[]} T
 * @template {QueryFilter[]} [U = []]
 */
export class Query {

  /**
   * World whose entities this query reads.
   *
   * @private
   * @type {World}
   */
  world

  /**
   * Component type IDs in the order supplied to the constructor.
   *
   * Query results use this order, so each tuple entry corresponds to the
   * component constructor at the same position.
   *
   * @readonly
   * @type {TypeId[]}
   */
  descriptors = []

  /**
   * Component type IDs that an entity must have to match by default.
   *
   * A component type ID remains in this list only when every configured filter's
   * {@linkcode QueryFilter#isRequired} result is `true`. The built-in
   * {@linkcode Optional} filter makes its targeted component optional; filters
   * such as {@linkcode Has} and {@linkcode Without} still constrain which entities
   * match without changing the returned tuple.
   *
   * @readonly
   * @type {TypeId[]}
   */
  requiredDescriptors = []

  /**
   * Filters applied when the query's matching entities are refreshed.
   *
   * Every configured filter must accept an entity's component combination for
   * it to match. The supplied filters remain the query's configuration; call
   * {@linkcode Query#update} after changing the world in a way that creates a new
   * component combination.
   *
   * @readonly
   * @type {U}
   */
  filters

  /**
   * Matching component combinations identified by the most recent refresh.
   * Query operations use these matches until {@linkcode Query#update} replaces
   * them; combinations created later are not discovered implicitly.
   *
   * @private
   * @type {TableId[]}
   */
  tableIds = []

  /**
   * Creates a query for a world and an ordered component signature.
   *
   * Component constructors are converted to type IDs in the order supplied,
   * and that order is retained in every returned tuple. A component is
   * required when every filter reports it as required through
   * {@linkcode QueryFilter#isRequired}. The built-in {@linkcode Optional},
   * {@linkcode Has}, and {@linkcode Without} filters refine matching entities
   * without adding entries to the result tuple; all configured filters must
   * accept an entity's component combination for it to match.
   *
   * The query's matching selection is established immediately. Construction
   * does not add entities or components to the world, and the component types
   * do not need to have appeared in the world beforehand.
   *
   * @param {World} world - World whose entities the query reads.
   * @param {[...TupleConstructor<T>]} componentTypes - Component constructors in the order returned by query operations.
   * @param {[...U]} [filters=[]] - Filters that refine which component combinations match.
   */
  constructor(
    world,
    componentTypes,

    // SAFETY: The default value matches the default template value
    filters = /** @type {U}*/([])
  ) {
    this.world = world
    this.descriptors = componentTypes.map((c) => typeid(c))
    this.filters = filters
    this.requiredDescriptors = this.descriptors.filter((descriptor) => {
      return this.filters.every((entry) => entry.isRequired(descriptor))
    })
    this.update()
  }

  /**
   * Refreshes the query's matching component combinations from the current
   * world.
   *
   * Matching component combinations are considered in their creation order.
   * A combination is selected only when it contains every required component
   * and every configured filter accepts it. The previous selection is
   * replaced, not appended to. The constructor calls this method once; call it
   * after a world mutation creates a new component combination that should be
   * considered. Entities added to a combination already selected are visible
   * without another update.
   *
   * This method changes only what the query selects. It does not change
   * entities, components, or the world.
   *
   * @returns {void}
   */
  update() {
    const { world } = this
    const archetypes = world.getArchetypes()

    const tableIds = filterMap(archetypes.values(), (archetype) => {
      if (!archetype.has(this.requiredDescriptors)) {
        return undefined
      }
      if (!filter(archetype, this.filters)) {
        return undefined
      }

      return archetype.tableId
    })

    this.tableIds = tableIds
  }

  /**
   * Gets the components of an entity when its current component combination
   * matches the query.
   *
   * The returned tuple follows the component order supplied to the constructor
   * and is a new array for each call. Values are read from the entity's current
   * component combination; an optional component is `undefined` when that
   * component is absent. Returns `null` for a stale or unknown
   * {@linkcode EntityHandle}, a non-matching entity, an unavailable matching
   * combination, or an invalid entity location. This method does not refresh
   * the query's selection.
   *
   * @param {EntityHandle} entity - Entity handle to check against the query.
   * @returns {QueryComponents<T,U> | null} The matching components, or `null`.
   */
  get(entity) {
    const { world, descriptors, tableIds } = this
    const cell = world.getEntity(entity)
    const { location } = cell

    if (!cell.exists()) return null

    const { tableId, index } = location
    const table = world.getTables().get(tableId)

    if (table === undefined) return null
    if (!tableIds.includes(tableId)) return null
    if (index >= table.size() || index < 0) return null

    const components = new Array(this.descriptors.length)

    // Safety: We check the bounds above
    mapComponents(table, descriptors, index, components)

    // SAFETY: Components are fetched in same order and types as the generic.
    return /** @type {QueryComponents<T,U>}*/ (components)
  }

  /**
   * Calls a callback once for every entity in the query's current matching
   * selection.
   *
   * Matching component combinations are visited in selection order, with
   * entities in increasing order within each combination. The callback
   * receives one component tuple in constructor order; the entity handle is
   * not passed separately, so include {@linkcode EntityHandle} in
   * `componentTypes` when it is needed. The same tuple array is reused and
   * overwritten for the next callback, so do not retain that array; the
   * component objects in it are the live values owned by the world. This
   * method does not refresh the query's selection.
   *
   * @param {EachFunc<QueryComponents<T,U>>} callback - Function called for each matching entity.
   * @returns {void}
   */
  each(callback) {
    const { tableIds, descriptors } = this
    const tables = this.world.getTables()

    // SAFETY: Components are fetched below.
    const components = /** @type {[...QueryComponents<T,U>]}*/(new Array(this.descriptors.length))

    for (let i = 0; i < tableIds.length; i++) {
      const table = tables.get(tableIds[i])

      if (!table) continue

      for (let row = 0; row < table.size(); row++) {

        // SAFETY: Row is in bounds
        mapComponents(table, descriptors, row, components)
        callback(components)
      }
    }
  }

  /**
   * Calls a callback for every unique unordered pair of matching entities.
   *
   * Each callback receives two component tuples in constructor order. The
   * nested traversal visits later matching component combinations and, within
   * one combination, only entities after the first entity, so pairs are not
   * repeated with their order reversed and an entity is never paired with
   * itself. The two tuple arrays are reused and overwritten for the next
   * callback; do not retain them. This method does not refresh the query's
   * selection.
   *
   * @param {EachCombinationFunc<QueryComponents<T,U>>} callback - Function called for each distinct pair.
   * @returns {void}
   */
  eachCombination(callback) {
    const { tableIds, descriptors } = this
    const tables = this.world.getTables()

    // SAFETY: Components are filled below
    const components1 = /** @type {[...QueryComponents<T,U>]}*/(new Array(this.descriptors.length))
    const components2 = /** @type {[...QueryComponents<T,U>]}*/(new Array(this.descriptors.length))

    for (let i = 0; i < tableIds.length; i++) {
      const table1 = tables.get(tableIds[i])

      if (!table1) continue

      for (let j = i; j < tableIds.length; j++) {
        const table2 = tables.get(tableIds[j])

        if (!table2) continue

        for (let row1 = 0; row1 < table1.size(); row1++) {

          // SAFETY: Row is in bounds
          mapComponents(table1, descriptors, row1, components1)

          const nextup = i === j ? row1 + 1 : 0

          for (let row2 = nextup; row2 < table2.size(); row2++) {

            // SAFETY: Row is in bounds
            mapComponents(table2, descriptors, row2, components2)
            callback(components1, components2)
          }
        }

      }
    }
  }

  /**
   * Returns the components of the first matching entity.
   *
   * The first entity is the first available entity in query traversal order,
   * so this method does not require the query to contain exactly one entity.
   * It returns a new tuple array, does not refresh the selection, and returns
   * `null` when no matching entity is available. Use {@linkcode Query#count} when
   * the number of matches matters.
   *
   * @returns {QueryComponents<T,U> | null} The first matching components, or `null` when there are no matches.
   */
  single() {
    const { descriptors, world, tableIds } = this
    const tables = world.getTables()

    for (let i = 0; i < tableIds.length; i++) {
      const table = tables.get(tableIds[i])

      if (!table) continue
      if (table.size() < 1) continue

      // SAFETY: Components are fetched below.
      const components = /** @type {[...QueryComponents<T,U>]}*/(new Array(this.descriptors.length))

      // SAFETY: Table row is in bounds as checked above.
      mapComponents(table, descriptors, 0, components)

      return components
    }

    return null
  }

  /**
   * Counts entities in the query's current matching selection.
   *
   * It reflects current entity membership in matching component combinations,
   * but a new combination created after the last {@linkcode Query#update} is not
   * included. Missing matching combinations contribute zero, and this method
   * does not refresh or re-filter the selection.
   *
   * @returns {number} The number of entities in the current matching selection.
   */
  count() {
    const { tableIds } = this
    const tables = this.world.getTables()
    let sum = 0

    for (let i = 0; i < tableIds.length; i++) {
      const table = tables.get(tableIds[i])

      if (!table) continue

      sum += table.size()
    }

    return sum
  }
}

/**
 * @template T
 * @template U
 * @param { readonly T[] } arr
 * @param { (element:T, index:number) => U | undefined } callback
 * @returns { U[] }
 */
function filterMap(arr, callback) {
  const results = []

  for (let i = 0; i < arr.length; i++) {
    const result = callback(arr[i], i)

    if (result !== undefined) {
      results.push(result)
    }
  }

  return results
}

/**
 * ### Safety
 * The table row should be guaranteed to be in bounds by the caller.
 * The table should also contain all the components described by the descriptor.
 *
 * @template {unknown[]} T
 * @param {Table} table
 * @param {TypeId[]} descriptor
 * @param {number} row
 * @param {[...T]} list
 *
 */
function mapComponents(table, descriptor, row, list) {
  for (let i = 0; i < descriptor.length; i++) {
    const type = descriptor[i]

    // SAFETY:index guaranteed to be in bounds by the caller.The value should be there.
    list[i] = /** @type {unknown}*/ (table.get(type, /** @type {TableRow} */ (row)))
  }
}

/**
 * @param {Archetype} archetype
 * @param {QueryFilter[]} filters
 */
function filter(archetype, filters) {
  for (let i = 0; i < filters.length; i++) {
    if (!filters[i]?.archetype(archetype.types)) {
      return false
    }
  }

  return true
}

/**
 * @template {unknown[]} T
 * @callback EachFunc
 * @param {[...T]} components
 * @returns {void}
 */

/**
 * @template {unknown[]} T
 * @callback EachCombinationFunc
 * @param {[...T]} components1
 * @param {[...T]} components2
 * @returns {void}
 */
