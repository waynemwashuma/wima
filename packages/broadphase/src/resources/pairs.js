/** @import { App } from '@wimaengine/app' */
/** @import { World } from '@wimaengine/ecs' */
/** @import { Broadphase2DPlugin } from '../plugin' */
import { CollisionPair } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the entity pairs found by 2D broadphase collision detection.
 *
 * `CollisionPairs` is an array-backed world resource, so it supports the
 * inherited `length`, indexed access, iteration, and array mutation methods.
 * Each entry is a {@linkcode CollisionPair} containing the two candidate entity
 * handles. The pairs are broadphase candidates based on hitbox overlap; they
 * are not yet confirmed collisions between the entities' actual shapes.
 *
 * {@linkcode Broadphase2DPlugin} stages a fresh instance with
 * {@linkcode App#setResource}. The broadphase updates this resource on each
 * update, so callers can read the current candidates with
 * {@linkcode World#getResource} using `CollisionPairs`.
 *
 * @augments {Array<CollisionPair>}
 * @category resource
 * @example
 * ```js
 * import { CollisionPairs } from '@wimaengine/broadphase'
 *
 * function inspectBroadphase(world) {
 *   const pairs = world.getResource(CollisionPairs)
 *
 *   for (const { a, b } of pairs) {
 *     console.log('candidate pair', a, b)
 *   }
 * }
 * ```
 */
export class CollisionPairs extends Array {

  /**
   * Removes every stored candidate pair.
   *
   * This resets the inherited array length to zero and discards the current
   * entries. The broadphase refreshes this resource during updates by clearing
   * it before writing the candidates for the next update; call it yourself
   * when rebuilding an instance outside the update flow.
   *
   * @returns {void}
   */
  clear() {
    this.length = 0
  }
}
/* eslint-enable jsdoc/check-tag-names */
