/** @import { TypeId } from '@wimaengine/type' */
/** @import { TableId } from '../typedef' */

/**
 * Represents one exact ECS component layout and its associated table ID.
 *
 * Use {@linkcode Archetype#has} for subset matching: every requested component
 * TypeId must be present, but the layout may contain additional components.
 * Use {@linkcode Archetype#hasOnly} for exact-set matching. Both checks are
 * order-independent, and exact matching expects deduplicated TypeId lists.
 *
 * The table ID identifies the table associated with this component layout.
 *
 * @example
 * ```js
 * const tableId = 0
 * const archetype = new Archetype(tableId, [positionTypeId, velocityTypeId])
 *
 * archetype.has([positionTypeId]) // true: a required subset is present
 * archetype.hasOnly([positionTypeId]) // false: velocityTypeId is also present
 * archetype.hasOnly([velocityTypeId, positionTypeId]) // true: same set, new order
 * ```
 */
export class Archetype {

  /**
   * Component TypeIds that define this archetype's layout.
   *
   * Matching methods treat this collection as a set and do not depend on its
   * order.
   *
   * @readonly
   * @type {readonly TypeId[]}
   */
  types

  /**
   * ID of the table associated with this archetype's layout.
   *
   * This is the table's identity, not an ID assigned by an archetype registry.
   *
   * @readonly
   * @type {TableId}
   */
  tableId

  /**
   * Creates an archetype for a table and component TypeId set.
   *
   * @param {TableId} tableId
   * @param {TypeId[]} types - Component TypeIds in the table's layout.
   */
  constructor(tableId, types) {
    this.types = types
    this.tableId = tableId
  }

  /**
   * Checks whether this layout contains every requested component TypeId.
   *
   * This is subset matching. Extra component TypeIds in the layout do not
   * affect the result.
   *
   * @param {TypeId[]} typeids - Component TypeIds that must be present.
   * @returns {boolean} `true` when every requested TypeId is present.
   */
  has(typeids) {
    for (let i = 0; i < typeids.length; i++) {
      if (!this.types.includes(typeids[i])) return false
    }

    return true
  }

  /**
   * Checks whether this layout has exactly the requested component set.
   *
   * The lists must have the same length and every requested TypeId must be
   * present. Order does not matter, but callers should provide deduplicated
   * TypeId lists because the check uses length plus membership.
   *
   * @param {TypeId[]} typeIds - The complete component TypeId set to match.
   * @returns {boolean} `true` when the requested set exactly matches this archetype.
   */
  hasOnly(typeIds) {
    if (typeIds.length !== this.types.length) return false

    for (let i = 0; i < typeIds.length; i++) {
      if (!this.types.includes(typeIds[i])) return false
    }

    return true
  }
}
