/** @import { TypeId } from '@wimaengine/type' */
/** @import { ArchetypeId } from '../typedef' */
import { Archetype } from './archetype'

/**
 * Registers {@linkcode Archetype} instances under zero-based {@linkcode ArchetypeId}
 * values in insertion order.
 *
 * Use {@linkcode Archetypes#set} to append an archetype, {@linkcode Archetypes#get}
 * to retrieve one by ID, and {@linkcode Archetypes#has} or
 * {@linkcode Archetypes#getArchetypeWithOnly} to search by component TypeIds.
 *
 * @example
 * ```js
 * import { Archetype, Archetypes } from '@wimaengine/ecs'
 * import { typeid } from '@wimaengine/type'
 *
 * class Position {}
 * class Velocity {}
 *
 * const archetypes = new Archetypes()
 * const position = typeid(Position)
 * const velocity = typeid(Velocity)
 * const id = archetypes.set(new Archetype(0, [position, velocity]))
 *
 * archetypes.has([position]) // true: subset lookup allows velocity too
 * archetypes.getArchetypeWithOnly([position, velocity]) // [id, Archetype]
 * ```
 */
export class Archetypes {

  /**
   * Archetypes indexed by their zero-based {@linkcode ArchetypeId}.
   *
   * Entries are appended by {@linkcode Archetypes#set}; the index of an entry
   * is the ID returned for it.
   *
   * @private
   * @type {Archetype[]}
   */
  archetypes = []

  /**
   * Checks whether any registered archetype contains every requested TypeId.
   *
   * This is subset lookup through {@linkcode Archetype#has}: an archetype may
   * contain additional component types. The method returns only a boolean; use
   * {@linkcode Archetypes#getArchetypeWithOnly} when the
   * matching archetype and its ID are needed.
   *
   * @param {TypeId[]} types - Component TypeIds that must all be present.
   * @returns {boolean} `true` when at least one registered archetype contains the requested types.
   */
  has(types) {
    for (let i = 0; i < this.archetypes.length; i++) {
      if (this.archetypes[i].has(types)) return true
    }

    return false
  }

  /**
   * Returns the archetype stored at an allocated ID.
   *
   * IDs are zero-based insertion indexes assigned by {@linkcode Archetypes#set}. An
   * ID that has not been allocated returns
   * `undefined` because the lookup reads the backing array directly.
   *
   * @param {ArchetypeId} id - Zero-based archetype ID to look up.
   * @returns {Archetype | undefined} The archetype at `id`, or `undefined` when no entry exists there.
   */
  get(id) {
    return this.archetypes[id]
  }

  /**
   * Appends an archetype and assigns its next zero-based ID.
   *
   * Every call appends the supplied object, even when an equivalent archetype
   * is already registered. The returned ID is the new entry's index and is
   * also the value accepted by {@linkcode Archetypes#get}.
   *
   * @param {Archetype} archetype - Archetype record to append to the registry.
   * @returns {ArchetypeId} The newly allocated zero-based ID.
   */
  set(archetype) {
    const id = this.archetypes.length

    this.archetypes.push(archetype)

    // SAFETY: This class is the one allocating ids.
    return /** @type {ArchetypeId}*/ (id)
  }

  /**
   * Returns the number of archetypes currently registered.
   *
   * @returns {number} Current entry count and the next ID for {@linkcode Archetypes#set}.
   */
  size() {
    return this.archetypes.length
  }

  /**
   * Returns the live, ID-ordered collection of registered archetypes.
   *
   * The returned collection is the registry's backing array, typed as
   * read-only. Entries added by {@linkcode Archetypes#set} are visible through the
   * same returned reference, so callers should treat it as read-only rather
   * than modifying it directly.
   *
   * @returns {readonly Archetype[]} The live archetype collection.
   */
  values() {
    return this.archetypes
  }

  /**
   * Finds the first archetype whose component TypeIds exactly match the input.
   *
   * Matching delegates to {@linkcode Archetype#hasOnly}: the lists must
   * have the same length and contain the same TypeIds, regardless of order.
   * Pass a deduplicated set of TypeIds, as the exact check uses length plus
   * membership. The search follows allocation order and returns the matching
   * ID together with its archetype.
   *
   * @param {TypeId[]} typeIds - Complete, deduplicated component TypeId set to match.
   * @returns {[ArchetypeId, Archetype] | undefined} The first matching ID and archetype, or `undefined` when no exact set is registered.
   */
  getArchetypeWithOnly(typeIds) {
    for (let i = 0; i < this.archetypes.length; i++) {
      const archetype = this.archetypes[i]

      if (archetype.hasOnly(typeIds)) {

        // SAFETY: This class is the one allocating ids.
        const id = /** @type {ArchetypeId} */ (i)

        return [id, archetype]
      }
    }

    return undefined
  }
}
