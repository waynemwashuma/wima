/** @import { TableId, TableRow } from '../typedef'*/
/** @import { TypeId } from '@wimaengine/type'*/

import { throws } from '@wimaengine/logger'
import { swapRemove } from '@wimaengine/utils'

/**
 * Stores component values for one exact ECS component layout.
 *
 * A `Table` organizes each configured component {@linkcode TypeId} in its own
 * column and addresses the values by row. Create it with the component TypeIds,
 * then use its row methods to add, read, update, move, or remove values. Rows
 * stay dense, so removing or moving a row can change another row's index.
 *
 * Use {@linkcode Table#insert} to append a complete row. Use
 * {@linkcode Table#reserve} with {@linkcode Table#insertUnchecked} when you need to
 * allocate and populate a row in separate steps.
 *
 * @example
 * ```ts
 * import { Table } from '@wimaengine/ecs'
 * import { typeid } from '@wimaengine/type'
 *
 * class Position {}
 * class Velocity {}
 *
 * const positionId = typeid(Position)
 * const velocityId = typeid(Velocity)
 * const table = new Table([positionId, velocityId])
 *
 * const row = table.insert(
 *   [positionId, velocityId],
 *   [new Position(), new Velocity()]
 * )
 *
 * table.set(positionId, row, new Position())
 * const velocity = table.get(velocityId, row)
 * ```
 */
export class Table {

  /**
   * Column arrays keyed by component type ID. Every column uses the same row
   * indexes, so values at one row belong to the same entity.
   *
   * The map reference is readonly in the generated type. Table operations
   * still write to the arrays when rows are inserted, updated, moved, or
   * removed.
   *
   * @readonly
   * @type {ReadonlyMap<TypeId,unknown[]>}
   */
  columns = new Map()

  /**
   * @private
   */
  length = 0

  /**
   * Creates an empty table with one column for each unique type ID.
   *
   * The type IDs define this table's exact component layout. Rows are added
   * later with {@linkcode Table#insert} or {@linkcode Table#reserve}.
   *
   * @param {TypeId[]} typeids - Type IDs for the columns this table stores.
   */
  constructor(typeids) {
    const map = new Map()

    for (let i = 0; i < typeids.length; i++) {
      map.set(typeids[i], [])
    }

    this.columns = map
  }

  /**
   * Writes a value into a configured column.
   *
   * If `row` is greater than or equal to {@linkcode Table#size}, this method
   * returns without changing the table. It also does nothing when `typeid` is
   * not one of the table's columns. The upper bound is the only row check;
   * negative rows are not rejected, so callers should pass a non-negative row
   * returned by {@linkcode Table#insert} or {@linkcode Table#reserve}.
   *
   * @param {TypeId} typeid
   * @param {TableRow} row
   * @param {unknown} value
   * @returns {void}
   */
  set(typeid, row, value) {
    if (row >= this.size()) return

    const column = this.columns.get(typeid)

    if (column) column[row] = value
  }

  /**
   * Reads a value from a configured column at a row.
   *
   * Returns `undefined` when the type ID is not configured. For a configured
   * column, this is a direct lookup; the method does not explicitly compare
   * `row` with {@linkcode Table#size}. Callers are responsible for
   * passing a valid allocated row, and an unpopulated array entry normally
   * reads as `undefined`.
   *
   * @param {TypeId} typeid
   * @param {TableRow} row
   * @returns {unknown | undefined}
   */
  get(typeid, row) {
    const column = this.columns.get(typeid)

    if (column) return column[row]

    return undefined
  }

  /**
   * Reserves the next row index without populating its columns.
   *
   * Returns the table's current size, then increments the logical row count.
   * The column arrays are not initialized by this method. Fill the returned
   * row immediately with {@linkcode Table#set} or
   * {@linkcode Table#insertUnchecked} before another operation
   * relies on the table being dense.
   *
   * @returns {TableRow}
   */
  reserve() {
    const index = this.length

    this.length += 1

    return /** @type {TableRow} */(index)
  }

  /**
   * Returns the number of logically reserved rows in the table.
   *
   * {@linkcode Table#insert} and {@linkcode Table#reserve} increase this count;
   * {@linkcode Table#remove} decreases it.
   *
   * @returns {number} The current row count.
   */
  size() {
    return this.length
  }

  /**
   * Appends a row and returns its new row index.
   *
   * `ids` and `components` are parallel arrays. This method first checks that
   * they have the same length, then reserves a row and writes each pair. Every
   * supplied ID must already be a column in this table or insertion throws an
   * `Error`. To keep the row complete, supply every column ID; this method does
   * not verify that the set is complete and cannot roll back a row after a
   * later insertion error.
   *
   * This is the safer insertion path for appending a row because it owns row
   * reservation and validates the parallel array lengths. Use
   * {@linkcode Table#insertUnchecked} only when those checks are
   * already guaranteed by the caller.
   *
   * @param {TypeId[]} ids - Column IDs corresponding to `components`.
   * @param {unknown[]} components - Values to store at the new row.
   * @returns {TableRow} The newly reserved row index.
   * @throws {Error} If the arrays have different lengths or an ID is unknown.
   */
  insert(ids, components) {
    if (ids.length !== components.length) {
      throws('The component list and id list should match!')
    }

    const index = this.reserve()

    this.insertUnchecked(index, ids, components)

    return index
  }

  /**
   * Writes component values into a chosen row without reserving it.
   *
   * This low-level path does not change {@linkcode Table#size}, check the row
   * bounds, compare the lengths of `ids` and `components`, or ensure that every
   * table column is filled. It writes one value for each item in `components`;
   * `ids[i]` must name a configured column or the method throws after any prior
   * pairs have already been written.
   *
   * Use it only for an existing row, or for a row returned by
   * {@linkcode Table#reserve}, when the caller can guarantee the IDs and complete
   * the row itself. Use {@linkcode Table#insert} for normal row
   * insertion.
   *
   * @param {TableRow} index - Existing or reserved row to populate.
   * @param {TypeId[]} ids - Column IDs corresponding to `components`.
   * @param {unknown[]} components - Values to write into the chosen row.
   * @throws {Error} If a supplied ID is not a column in this table.
   */
  insertUnchecked(index, ids, components) {

    for (let i = 0; i < components.length; i++) {
      const list = this.columns.get(ids[i])

      if (list) {
        list[index] = components[i]
      } else {
        throws('Invalid table insertion!')
      }
    }
  }

  /**
   * Removes a row using swap removal and keeps the columns dense.
   *
   * When the removed row is not the last row, the last value in each column may
   * take its place, so row order is not preserved and another row's index can
   * change. The logical table size is then decremented. If other records store
   * row indexes, the caller must update any index affected by the swap.
   *
   * Pass a valid row index. This method does not validate row bounds.
   *
   * @param {TableRow} row - Row to remove.
   * @returns {void}
   */
  remove(row) {
    for (const list of this.columns.values()) {
      swapRemove(list, row)
    }

    this.length -= 1
  }

  /**
   * Reads every column value at a row without removing it.
   *
   * Returns parallel arrays in the table's column order: the first array
   * contains the type IDs and the second contains the value from each matching
   * column. The table is unchanged. The row must be valid; this method does
   * not perform a bounds check.
   *
   * @param {TableRow} row - Row whose complete component set should be read.
   * @returns {[TypeId[],unknown[]]} Column IDs and their values at `row`.
   */
  extract(row) {
    const components = []
    const keys = []

    for (const [key, list] of this.columns) {
      keys.push(key)
      components.push(list[row])
    }

    return [keys, components]
  }

  /**
   * Tests whether a list describes exactly this table's column set.
   *
   * The order of `ids` does not matter. The list must have the same length as
   * the table's columns, and every supplied ID must be present. Pass one
   * occurrence of each ID; this method does not reject duplicates. Row
   * contents are not inspected.
   *
   * @param {TypeId[]} ids - Type IDs to compare with this table's columns.
   * @returns {boolean} `true` when the column sets are exactly equal.
   */
  hasOnly(ids) {
    if (ids.length !== this.columns.size) return false

    for (let i = 0; i < ids.length; i++) {
      if (!this.columns.has(ids[i])) return false
    }

    return true
  }

  /**
   * Copies a row into another table, then removes it from this table.
   *
   * The destination reserves a new row first. Values for this table's columns
   * are copied with {@linkcode Table#set}; a source column missing from the
   * destination is therefore ignored. Columns that exist only in the
   * destination remain unpopulated, so the caller must fill them afterward.
   * The source row is then removed with swap removal, which can change another
   * row's index. The source row index is not preserved.
   *
   * Use this when moving a row between tables with different component
   * layouts. Pass a valid source row and update any other row indexes affected
   * by the source table's swap.
   *
   * @example
   * ```ts
   * const destinationRow = source.moveTo(destination, sourceRow)
   * destination.insertUnchecked(destinationRow, [healthId], [new Health()])
   * ```
   *
   * @param {Table} newTable - Table receiving the row.
   * @param {TableRow} row - Source row to move.
   * @returns {TableRow} The newly reserved row in `newTable`.
   */
  moveTo(newTable, row) {
    const newIndex = newTable.reserve()

    for (const [id, column] of this.columns) {
      newTable.set(id, newIndex, column[row])
    }

    this.remove(row)

    return newIndex
  }
}

/**
 * Registers {@linkcode Table} instances under allocated {@linkcode TableId} values.
 *
 * `Tables` assigns zero-based IDs in insertion order. Use
 * {@linkcode Tables#resolveTableFor} to reuse a table with an exact component
 * TypeId set, or {@linkcode Tables#createTable} to always append a new table.
 * Matching table IDs can be collected with {@linkcode Tables#getTableIds}.
 *
 * @example
 * ```js
 * import { Tables } from '@wimaengine/ecs'
 * import { typeid } from '@wimaengine/type'
 *
 * class Position {}
 * const tables = new Tables()
 * const position = typeid(Position)
 * const [id, table] = tables.resolveTableFor([position])
 * tables.get(id) === table // true
 * tables.getTableIds([position], []) // [id]
 * ```
 */
export class Tables {

  /**
   * Tables indexed by their zero-based {@linkcode TableId}.
   *
   * Entries are appended by {@linkcode Tables#createTable}; because
   * the array is dense and private, an entry's index is its allocated ID.
   * The {@linkcode Tables#clear} method replaces this array with a new empty one.
   *
   * @private
   * @type {Table[]}
   */
  list = []

  /**
   * Appends a new empty table and assigns its next table ID.
   *
   * The ID is the current list length, so IDs are zero-based and follow
   * allocation order. This method always creates a new {@linkcode Table}; it does
   * not search for an existing layout. Use {@linkcode Tables#resolveTableFor} when
   * an exact layout should be reused.
   *
   * @param {TypeId[]} typeIds - Component TypeIds for the new table's columns.
   * @returns {[TableId, Table]} The new table's ID and table instance.
   */
  createTable(typeIds) {
    const table = new Table(typeIds)

    // SAFETY: `Tables` allocates the table id
    const id = /** @type {TableId}*/(this.list.length)

    this.list.push(table)

    return [id, table]
  }

  /**
   * Returns the table stored at an allocated ID.
   *
   * IDs are direct indexes into the registry. An unallocated or cleared ID
   * therefore returns `undefined`; this lookup does not create a table or
   * validate the table's contents.
   *
   * @param {TableId} id - Zero-based table ID to look up.
   * @returns {Table | undefined} The table at `id`, or `undefined` when none exists.
   */
  get(id) {
    return this.list[id]
  }

  /**
   * Returns the live, ID-ordered table collection.
   *
   * The returned value is the registry's backing array, typed as read-only.
   * Tables appended by {@linkcode Tables#createTable} are visible
   * through the same reference. The {@linkcode Tables#clear} method replaces the
   * backing array, so a reference obtained before clearing remains a snapshot
   * of the old array and does not receive later tables.
   *
   * @returns {readonly Table[]} The live table collection.
   */
  values() {
    return this.list
  }

  /**
   * Finds or creates the table for an exact component TypeId layout.
   *
   * The search follows table-ID order and delegates exact matching to
   * {@linkcode Table#hasOnly}: the input and table column sets must have
   * the same length and every input ID must be present, regardless of order.
   * Pass one occurrence of each TypeId. The first exact match is returned;
   * when none exists, this method delegates to {@linkcode Tables#createTable} and
   * returns the newly allocated pair.
   *
   * @param {TypeId[]} ids - Complete, deduplicated TypeId set for the layout.
   * @returns {[TableId, Table]} The existing or newly created table ID and table.
   */
  resolveTableFor(ids) {
    for (let i = 0; i < this.list.length; i++) {
      const table = this.list[i]
      const hasit = table.hasOnly(ids)

      if (hasit) {

        // SAFETY: `Tables` allocates the table id
        const id = /** @type {TableId} */(i)

        return [id, table]
      }
    }

    return this.createTable(ids)
  }

  /**
   * Appends IDs of tables containing every requested component TypeId.
   *
   * This is subset filtering: a table may contain additional columns. The
   * registry is scanned in ID order, matching IDs are appended to the supplied
   * `filtered` array, and that same array is returned. Existing entries in
   * `filtered` are preserved; this method does not clear or deduplicate it and
   * does not inspect table rows.
   *
   * @param {TypeId[]} comps - Component TypeIds that every selected table must contain.
   * @param {TableId[]} filtered - Accumulator to which matching IDs are appended.
   * @returns {TableId[]} The same `filtered` array after matching IDs are appended.
   */
  getTableIds(comps, filtered) {
    for (let i = 0; i < this.list.length; i++) {
      let hasComponents = true

      for (let j = 0; j < comps.length; j++) {
        if (!this.list[i].columns.has(comps[j])) {
          hasComponents = false
          break
        }
      }

      if (hasComponents) {

        // SAFETY: `Tables` allocates the table id
        const id = /** @type {TableId} */(i)

        filtered.push(id)
      }
    }

    return filtered
  }

  /**
   * Removes all tables from the registry.
   *
   * Clearing replaces the backing list with a new empty array. Future tables
   * therefore start again at table ID `0`; table objects or arrays returned
   * before the clear are not mutated, but they are no longer registered here.
   *
   * @returns {void}
   */
  clear() {
    this.list = []
  }
}
