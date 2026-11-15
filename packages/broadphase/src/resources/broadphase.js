/** @import { EntityHandle, World } from '@wimaengine/ecs' */
/** @import { Broadphase2DPlugin } from '../plugin' */
import { BoundingBox2D, BoundingCircle } from '@wimaengine/geometry'
import { Vector2 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the configured 2D broadphase as a world resource.
 *
 * The resource delegates storage and query behavior to the implementation
 * supplied by {@linkcode Broadphase2DPlugin}. It does not choose an indexing
 * algorithm or maintain a second index. Retrieve it from a world with
 * {@linkcode World#getResource}.
 *
 * Each query receives an optional target array and returns the result provided
 * by the wrapped implementation. When no target is supplied, the facade
 * provides a new array. Matching semantics are defined by
 * {@linkcode Broadphasable2D}.
 *
 * @example
 * ```js
 * import { BoundingBox2D } from '@wimaengine/geometry'
 * import { Broadphase2D } from '@wimaengine/broadphase'
 *
 * const broadphase = world.getResource(Broadphase2D)
 * const candidates = broadphase.queryBox(new BoundingBox2D(-1, -1, 1, 1))
 * ```
 *
 * @category resource
 */
export class Broadphase2D {

  /**
   * Configured implementation that receives this resource's operations.
   *
   * @private
   * @type {Broadphasable2D}
   */
  inner

  /**
   * Creates a resource facade over a broadphase implementation.
   *
   * The implementation is retained by reference and is responsible for the
   * broadphase index and matching behavior.
   *
   * @param {Broadphasable2D} broadphasable - Implementation to wrap.
   */
  constructor(broadphasable) {
    this.inner = broadphasable
  }

  /**
   * Delegates an axis-aligned box query to the configured implementation.
   *
   * The target defaults to a new array and is passed to the implementation,
   * allowing callers to reuse result storage when supported by that
   * implementation.
   *
   * @param {BoundingBox2D} bound - Box region to query.
   * @param {EntityHandle[]} [target=[]] - Array to supply for query results.
   * @returns {EntityHandle[]} The result returned by the implementation.
   */
  queryBox(bound, target = []) {
    return this.inner.queryBox(bound, target)
  }

  /**
   * Delegates a circle query to the configured implementation.
   *
   * The target defaults to a new array and is passed to the implementation,
   * allowing callers to reuse result storage when supported by that
   * implementation.
   *
   * @param {BoundingCircle} bound - Circle region to query.
   * @param {EntityHandle[]} [target=[]] - Array to supply for query results.
   * @returns {EntityHandle[]} The result returned by the implementation.
   */
  queryCircle(bound, target = []) {
    return this.inner.queryCircle(bound, target)
  }

  /**
   * Delegates a point query to the configured implementation.
   *
   * The facade does not apply a point test of its own. Matching behavior,
   * including whether the point is tested, belongs to the implementation.
   *
   * @param {Vector2} point - Point region to query.
   * @param {EntityHandle[]} [target=[]] - Array to supply for query results.
   * @returns {EntityHandle[]} The result returned by the implementation.
   */
  queryPoint(point, target = []) {
    return this.inner.queryPoint(point, target)
  }

  /**
   * Delegates removal of all entries to the configured implementation.
   *
   * @returns {void}
   */
  clear() {
    this.inner.clear()
  }

  /**
   * Delegates insertion of an entity and its broadphase bound.
   *
   * @param {EntityHandle} entity - Entity represented by the bound.
   * @param {BoundingBox2D} broadphase - Bound to store for the entity.
   * @returns {void}
   */
  push(entity, broadphase) {
    this.inner.push(entity, broadphase)
  }
}

/**
 * Contract for an implementation wrapped by {@linkcode Broadphase2D}.
 *
 * Pass an object with this contract to {@linkcode Broadphase2DPlugin} to choose
 * how entity bounds are indexed. Query operations receive an optional target
 * array and return entity handles; `push` adds an entity-bound entry and
 * `clear` removes all stored entries.
 *
 * @typedef Broadphasable2D
 * @property {(bound:BoundingBox2D,target?:EntityHandle[])=>EntityHandle[]} queryBox
 * @property {(bound:BoundingCircle,target?:EntityHandle[])=>EntityHandle[]} queryCircle
 * @property {(point:Vector2,target?:EntityHandle[])=>EntityHandle[]} queryPoint
 * @property {(entity:EntityHandle,bound:BoundingBox2D)=>void} push
 * @property {()=>void} clear
 */
/* eslint-enable jsdoc/check-tag-names */
