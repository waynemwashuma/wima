/** @import { World } from '@wimaengine/ecs' */

import { abstractMethod } from '@wimaengine/utils'

/**
 * Defines how a live component or resource produces a snapshot.
 *
 * Implementations convert their current value into a snapshot. Scene APIs can
 * store and later restore that value through a matching {@linkcode FromSnapshot}
 * implementation. When {@linkcode Scene.fromWorld} captures a scene,
 * `toSnapshot` receives the owning {@linkcode World}; the world argument lets an
 * implementation represent world-scoped references when it needs to.
 *
 * This contract is intentionally separate from serialization. A snapshot can
 * be a plain value or a dedicated snapshot class, as long as the corresponding
 * restoration path understands it.
 *
 * @example
 * ```js
 * class Position extends ToSnapshot {
 *   constructor(x, y) {
 *     super()
 *     this.x = x
 *     this.y = y
 *   }
 *
 *   toSnapshot(_world) {
 *     return { x: this.x, y: this.y }
 *   }
 * }
 *
 * const snapshot = new Position(10, 20).toSnapshot(world)
 * console.log(snapshot.x, snapshot.y)
 * ```
 *
 * @template T
 * @interface
 */
export class ToSnapshot {

  /**
   * Creates the snapshot value for this live component or resource.
   *
   * When {@linkcode Scene.fromWorld} uses this contract, it invokes this method
   * to obtain the value that the matching {@linkcode FromSnapshot} contract will
   * restore. Override this method to provide that value. The base
   * implementation always throws a string: calling it on a direct
   * `ToSnapshot` instance throws the abstract-class "not callable" message,
   * while calling it on a subclass that has not overridden it throws the
   * subclass "not implemented" message.
   *
   * @param {World} _world - World containing the live value being captured.
   * @returns {T} Snapshot representation of the live value.
   * @throws {string} Always in the base implementation.
   */
  toSnapshot(_world) {
    throw abstractMethod(this, ToSnapshot, ToSnapshot.prototype.toSnapshot)
  }
}

/**
 * Defines the restoration contract for a snapshot value.
 *
 * Implementations turn stored snapshot data into a live component or resource
 * for a {@linkcode World}. Scene restoration uses this contract to rebuild values
 * captured by the matching {@linkcode ToSnapshot} implementation.
 *
 * @example
 * ```js
 * class PositionSnapshot extends FromSnapshot {
 *   constructor(x, y) {
 *     super()
 *     this.x = x
 *     this.y = y
 *   }
 *
 *   fromSnapshot(_world) {
 *     return { x: this.x, y: this.y }
 *   }
 * }
 *
 * const position = new PositionSnapshot(10, 20).fromSnapshot(world)
 * ```
 *
 * @template T
 * @interface
 */
export class FromSnapshot {

  /**
   * Restores the live value represented by this snapshot.
   *
   * When {@linkcode Scene.toWorld} restores a scene, it calls this method with the
   * target {@linkcode World}. Override this method to construct the component or
   * resource value from the snapshot. Concrete implementations may accept
   * additional restoration context supplied by a scene-specific API.
   *
   * The base implementation always throws a string, so it never returns.
   * Calling it on a direct `FromSnapshot` instance throws the abstract-class
   * "not callable" message; inheriting it without overriding, or calling it
   * through `super`, throws the subclass "method not implemented" message.
   *
   * @param {World} _world - World receiving or used to restore the live value.
   * @returns {T} Restored live component or resource value.
   * @throws {string} Always in the base implementation.
   */
  fromSnapshot(_world) {
    throw abstractMethod(this, FromSnapshot, FromSnapshot.prototype.fromSnapshot)
  }
}
