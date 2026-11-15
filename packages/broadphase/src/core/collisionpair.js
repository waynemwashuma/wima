/** @import { EntityHandle } from '@wimaengine/ecs'*/

/**
 * Represents two entity handles selected as a 2D broadphase collision
 * candidate.
 *
 * A pair generated from {@linkcode PhysicsHitbox} bounds identifies entities
 * whose axis-aligned bounds overlap. It is candidate data, not confirmation
 * that the entities' shapes collide. The broadphase normally stores instances
 * in {@linkcode CollisionPairs} for the current candidate set.
 */
export class CollisionPair {

  /**
   * Entity handle stored in the first position of this candidate pair.
   *
   * When generated from overlapping {@linkcode PhysicsHitbox} bounds, this is
   * the first entity in the unordered combination. Its presence does not
   * confirm that the entities' shapes collide.
   *
   * @type {EntityHandle}
   */
  a

  /**
   * Entity handle stored in the second position of this candidate pair.
   *
   * When generated from overlapping {@linkcode PhysicsHitbox} bounds, this is
   * the second entity in the unordered combination. Its presence does not
   * confirm that the entities' shapes collide.
   *
   * @type {EntityHandle}
   */
  b

  /**
   * Creates a candidate pair from two entity handles.
   *
   * The handles are assigned to `a` and `b` as supplied, preserving their
   * references and order. The constructor performs no validation and does not
   * test bounds overlap or confirm a collision.
   *
   * @param {EntityHandle} a - Handle stored in `a`.
   * @param {EntityHandle} b - Handle stored in `b`.
   */
  constructor(a, b) {
    this.a = a
    this.b = b
  }
}
