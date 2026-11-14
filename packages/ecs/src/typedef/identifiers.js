/**
 * Numeric identifier type for a system entry.
 *
 * This is a type-level distinction only: runtime values are ordinary numbers,
 * and this type does not define system behavior.
 *
 * @typedef {number} SystemId
 */

/**
 * Numeric identifier type for a registered component type.
 *
 * Component IDs are dense, zero-based values assigned as component types are
 * registered. This alias is a type-level distinction only; runtime values are
 * ordinary numbers.
 *
 * @typedef {number} ComponentId
 */

/**
 * String name or type ID stored with component metadata.
 *
 * The value is kept as supplied; this alias does not validate or normalize the
 * string.
 *
 * @typedef {string} ComponentName
 */

/**
 * Branded numeric identifier for an archetype registry entry.
 *
 * IDs are zero-based indexes allocated in insertion order and used to look up
 * an {@linkcode Archetype} through {@linkcode Archetypes}. The brand is a type-level
 * distinction only; runtime values are ordinary numbers.
 *
 * @typedef {number & {__brand: "ArchetypeId"}} ArchetypeId
 */

/**
 * Branded numeric identifier for a table registry entry.
 *
 * IDs are zero-based indexes allocated in insertion order; {@linkcode Tables}
 * uses them to retrieve {@linkcode Table} instances. The brand is a type-level
 * distinction only; runtime values are ordinary numbers.
 *
 * @typedef {number & {__brand: "TableId"}} TableId
 */

/**
 * Branded numeric index for a row in a {@linkcode Table}.
 *
 * Rows are zero-based and table-local. {@linkcode Table#insert} and
 * {@linkcode Table#reserve} return allocated rows, while dense removal can move
 * another row into a previous index. The brand is a type-level distinction
 * only; runtime values are ordinary numbers.
 *
 * @typedef {number & {__brand: "TableRow"}} TableRow
 */
export {}
