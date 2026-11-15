/** @import {ArchetypeId, TableId, TableRow} from '../typedef' */

/**
 * Records the storage location and generation for one entity slot.
 *
 * {@linkcode World} keeps one mutable record for each reusable entity-slot index.
 * The identifiers connect an {@linkcode EntityHandle} to the entity's row in a
 * {@linkcode Table} and to the matching {@linkcode Archetype}. World mutations
 * update the identifiers when a row moves, update another entity's row after
 * dense removal, and reset the identifiers to `-1` when an entity is
 * despawned. The generation is incremented on a later {@linkcode World#spawn}
 * when the slot is reused.
 */
export class EntityLocation {

  /**
   * Table containing the entity's current row.
   *
   * `-1` means that the location does not currently identify a table.
   *
   * @type {TableId}
   */
  tableId

  /**
   * Row containing the entity in {@linkcode Table}.
   *
   * `-1` means that the location does not currently identify a row. Because
   * tables use dense storage, this value can change when rows are moved or
   * removed.
   *
   * @type {TableRow}
   */
  index

  /**
   * Generation assigned to the entity slot.
   *
   * A new location starts at `0`. The world increments this value in
   * {@linkcode World#spawn} before creating the corresponding
   * {@linkcode EntityHandle}. It remains at its last value when
   * {@linkcode World#despawn} invalidates the location so a later reuse receives
   * a new generation.
   *
   * @type {number}
   */
  generation = 0

  /**
   * Archetype describing the entity's current component layout.
   *
   * This is the ID assigned by the world, not an {@linkcode Archetype} instance.
   * `-1` means that the location is invalid.
   *
   * @type {ArchetypeId}
   */
  archetypeId

  /**
   * Creates a location record.
   *
   * The storage identifiers default to `-1`, the invalid sentinel used for a
   * location without a current entity row. Supplied identifiers are assigned
   * as-is; the constructor does not register an entity or look up a table or
   * archetype.
   *
   * @param {ArchetypeId} [archetypeId=-1] - Current archetype registry ID.
   * @param {TableRow} [index=-1] - Current row in the table.
   * @param {TableId} [tableId=-1] - Current table ID.
   */
  constructor(

    // SAFETY: -1 Represents the invalid id for all of these identifiers
    archetypeId = /** @type { ArchetypeId }*/ (-1),
    index = /** @type { TableRow }*/ (-1),
    tableId = /** @type { TableId }*/ (-1)
  ) {
    this.archetypeId = archetypeId
    this.index = index
    this.tableId = tableId
  }
}
