/** @import {EntityHandle} from '@wimaengine/ecs' */
import { BoundingBox2D, BoundingCircle, intersectAABB2D, intersectAABB2DvsCircle } from '@wimaengine/geometry'
import { Vector2 } from '@wimaengine/math'
import { PhysicsHitbox } from '../../components'

/**
 * Provides a simple in-memory 2D broadphase for a small number of bodies.
 *
 * The implementation keeps each {@linkcode EntityHandle} beside its
 * {@linkcode PhysicsHitbox} and scans every stored entry for each query. It is
 * intended for small collections, such as a scene with fewer than about 100
 * bodies, where a linear scan is sufficient.
 *
 * Box and circle queries test the stored bounds against their respective
 * regions. Rebuild the index by calling {@linkcode NaiveBroadphase2D#clear}
 * and then adding the current entity bounds with
 * {@linkcode NaiveBroadphase2D#push}. The point-query method currently does
 * not perform a point test and returns its target array unchanged.
 *
 * @example
 * ```js
 * import { BoundingBox2D } from '@wimaengine/geometry'
 * import { World } from '@wimaengine/ecs'
 * import { NaiveBroadphase2D, PhysicsHitbox } from '@wimaengine/broadphase'
 *
 * const world = new World()
 * const entity = world.spawn([])
 * const broadphase = new NaiveBroadphase2D()
 *
 * broadphase.push(entity, new PhysicsHitbox(-1, -1, 1, 1))
 * const candidates = broadphase.queryBox(new BoundingBox2D(-2, -2, 2, 2))
 * ```
 */
export class NaiveBroadphase2D {

  /**
   * @private
   * @type {EntityHandle[]}
   */
  entities = []

  /**
   * @private
   * @type {PhysicsHitbox[]}
   */
  bounds = []

  /**
   * Finds stored entities whose bounds overlap an axis-aligned box.
   *
   * Matches are appended to `target`, so an existing result array can be
   * reused across queries.
   *
   * @param {BoundingBox2D} bound - {@linkcode BoundingBox2D} region to check.
   * @param {EntityHandle[]} [target=[]] - Array to append matching entities to.
   * @returns {EntityHandle[]} The supplied or newly created result array.
   */
  queryBox(bound, target = []) {
    for (let i = 0; i < this.entities.length; i++) if (intersectAABB2D(bound, this.bounds[i])) target.push(this.entities[i])

    return target
  }

  /**
   * Finds stored entities whose bounds overlap a circle.
   *
   * Matches are appended to `target`, so an existing result array can be
   * reused across queries.
   *
   * @param {BoundingCircle} bound - {@linkcode BoundingCircle} region to check.
   * @param {EntityHandle[]} [target=[]] - Array to append matching entities to.
   * @returns {EntityHandle[]} The supplied or newly created result array.
   */
  queryCircle(bound, target = []) {
    for (let i = 0; i < this.entities.length; i++) if (intersectAABB2DvsCircle(this.bounds[i], bound)) target.push(this.entities[i])

    return target
  }

  /**
   * Returns the point-query target without testing stored bounds.
   *
   * Point matching is not implemented yet. The supplied point is ignored and
   * no entities are appended.
   *
   * @param {Vector2} _point - Point to check; currently unused.
   * @param {EntityHandle[]} [target=[]] - Array returned without modification.
   * @returns {EntityHandle[]} The supplied or newly created target array.
   */
  queryPoint(_point, target = []) {
    for (let i = 0; i < this.entities.length; i++) {

      // TODO: Actually implement this
    }

    return target
  }

  /**
   * Removes all entities and bounds from the in-memory index.
   *
   * Call this before pushing the current broadphase entries when rebuilding
   * the index for a new world state.
   *
   * @returns {void}
   */
  clear() {
    this.entities = []
    this.bounds = []
  }

  /**
   * Adds an entity and its current {@linkcode PhysicsHitbox} to the index.
   *
   * The bound is retained by reference until the index is cleared or the
   * entry is replaced by a new rebuild.
   *
   * @param {EntityHandle} entity - Entity represented by the bound.
   * @param {PhysicsHitbox} bound - Bound stored for the entity.
   * @returns {void}
   */
  push(entity, bound) {
    this.entities.push(entity)
    this.bounds.push(bound)
  }
}
