/** @import { World } from '@wimaengine/ecs' */
/** @import { TypeId } from '@wimaengine/type' */

/**
 * Describes the snapshot representation associated with a live type.
 *
 * This is a type-only interface. Concrete implementations live on the live
 * constructor and are registered with the live type's reflection entry. The
 * values are passed explicitly because both conversion methods are static.
 *
 * @interface
 */
export class Snapshot {

  /**
   * Creates a snapshot value from a live value.
   *
   * @template TLive
   * @template TSnapshot
   * @param {TLive} _live
   * @param {World} _world
   * @returns {TSnapshot}
   * @throws {Error} Always; the interface has no implementation.
   */
  static toSnapshot(_live, _world) {
    throw new Error('Snapshot.toSnapshot must be implemented by the live type')
  }

  /**
   * Restores a live value from a snapshot value.
   *
   * @template TLive
   * @template TSnapshot
   * @param {TSnapshot} _snapshot
   * @param {World} _world
   * @param {...unknown} _context
   * @returns {TLive}
   * @throws {Error} Always; the interface has no implementation.
   */
  static fromSnapshot(_snapshot, _world, ..._context) {
    throw new Error('Snapshot.fromSnapshot must be implemented by the live type')
  }
}

/**
 * Reflection attribute stored on a live type entry to identify its snapshot
 * type.
 */
export class SnapshotType {

  /**
   * Type ID of the snapshot counterpart.
   *
   * @type {TypeId}
   */
  typeId

  /**
   * @param {TypeId} typeId
   */
  constructor(typeId) {
    this.typeId = typeId
  }
}

/**
 * Reflection attribute stored on a snapshot type entry to identify its live
 * type.
 */
export class LiveType {

  /**
   * Type ID of the live counterpart.
   *
   * @type {TypeId}
   */
  typeId

  /**
   * @param {TypeId} typeId
   */
  constructor(typeId) {
    this.typeId = typeId
  }
}
