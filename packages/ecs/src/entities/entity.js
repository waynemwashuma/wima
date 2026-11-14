/** @import {World} from '../world' */

import { packInto64Int, unpackFrom64Int } from 'vifaa'

/**
 * Identifies one entity in a {@linkcode World} with a reusable slot index and
 * generation.
 *
 * The `index` selects an entity slot. The `generation` changes when the slot is
 * reused after despawn, so a handle identifies an entity only when both values
 * match. {@linkcode World} checks both values before resolving a handle; a stale
 * handle therefore does not refer to a replacement entity.
 * {@linkcode EntityHandle#equals} compares the two fields only and does not check
 * whether the handle is currently alive.
 *
 * Use {@linkcode EntityHandle#id} to pack the pair into an {@linkcode EntityId} and
 * {@linkcode EntityHandle.from} to unpack it. {@linkcode EntityHandle.serialize}
 * returns the index and generation fields, while
 * {@linkcode EntityHandle.deserialize} reconstructs a handle from a packed
 * numeric {@linkcode EntityId} and can reuse an output handle.
 *
 * @example
 * ```ts
 * import { EntityHandle, World } from '@wimaengine/ecs'
 *
 * const world = new World()
 * const player = world.spawn([])
 * const copy = EntityHandle.from(player.id())
 *
 * console.log(copy.equals(player)) // true
 *
 * world.despawn(player)
 * const replacement = world.spawn([])
 * console.log(replacement.index === player.index) // true
 * console.log(replacement.generation !== player.generation) // true
 * console.log(world.get(player, EntityHandle)) // null: stale generation
 *
 * const serial = EntityHandle.serialize(replacement)
 * const restored = EntityHandle.deserialize(replacement.id())
 * console.log(serial.index === restored.index) // true
 * ```
 */
export class EntityHandle {

  /**
   * Slot index used to locate the entity in a world.
   *
   * @readonly
   * @type {number}
   */
  index

  /**
   * Generation of the entity currently assigned to `index`.
   *
   * A world increments this value when it reuses a despawned entity slot.
   * Handles from an earlier generation are stale for that slot.
   *
   * @readonly
   * @type {number}
   */
  generation

  /**
   * @param {number} index - Entity slot index.
   * @param {number} generation - Generation associated with the slot.
   */
  constructor(index, generation) {
    this.index = index
    this.generation = generation
  }

  /**
   * Compares this handle's index and generation with another handle.
   *
   * This is a value comparison only; it does not query a world to determine
   * whether either handle still refers to a live entity.
   *
   * @param {EntityHandle} other - Handle to compare.
   * @returns {boolean} Whether both handles identify the same generation.
   */
  equals(other) {
    return (
      this.index === other.index &&
      this.generation === other.generation
    )
  }

  /**
   * Packs the index and generation into a numeric entity identity.
   *
   * The packed value preserves both parts of the handle and can be passed to
   * {@linkcode EntityHandle.from} or {@linkcode EntityHandle.deserialize}.
   *
   * @returns {EntityId} Packed numeric identity.
   */
  id() {
    const { index, generation } = this

    return packInto64Int(index, generation)
  }

  /**
   * Creates a handle from a packed numeric entity identity.
   *
   * @param {EntityId} id - Packed index and generation.
   * @returns {EntityHandle} Handle reconstructed from `id`.
   */
  static from(id) {
    const [index, generation] = unpackFrom64Int(id)

    return new EntityHandle(index, generation)
  }

  /**
   * Converts a handle to its plain serialized field representation.
   *
   * @param {EntityHandle} value - Handle to serialize.
   * @returns {EntityHandleSerial} Object containing the index and generation.
   */
  static serialize(value) {
    return {
      index: value.index,
      generation: value.generation
    }
  }

  /**
   * Reconstructs a handle from a packed numeric entity identity.
   *
   * If `out` is provided, its index and generation are updated in place and
   * the same object is returned. Otherwise, a new handle is created.
   *
   * @param {EntityId} value - Packed index and generation.
   * @param {EntityHandle} [out] - Optional handle to populate.
   * @returns {EntityHandle} The populated or newly created handle.
   */
  static deserialize(value, out = new EntityHandle(0, 0)) {
    const [index, generation] = unpackFrom64Int(value)
    const target = /** @type {any} */ (out)

    target.index = index
    target.generation = generation

    return out
  }

  /**
   * Checks whether a value is a numeric entity identity.
   *
   * This is the validation accepted by {@linkcode EntityHandle.deserialize}; it
   * checks the value's type, not whether the identity is live in a particular
   * {@linkcode World}.
   *
   * @param {unknown} value - Value to validate.
   * @returns {value is EntityId} Whether `value` is a number.
   */
  static validateSerial(value) {
    return typeof value === 'number'
  }
}

/**
 * Plain serialized value produced by {@linkcode EntityHandle.serialize}.
 *
 * The value stores an entity handle's slot index and generation. It is not a
 * live {@linkcode EntityHandle} and does not indicate whether an entity is alive.
 *
 * @typedef EntityHandleSerial
 * @property {number} index - Entity slot index.
 * @property {number} generation - Generation associated with the slot.
 */

/**
 * Packed numeric identity for an entity handle.
 *
 * {@linkcode EntityHandle#id} produces this value, and
 * {@linkcode EntityHandle.from} or {@linkcode EntityHandle.deserialize} can restore
 * the index and generation it contains.
 *
 * @typedef {number} EntityId
 */
