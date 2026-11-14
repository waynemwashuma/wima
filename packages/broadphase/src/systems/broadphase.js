/** @import {App} from '@wimaengine/app' */
import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { intersectAABB2D } from '@wimaengine/geometry'
import { PhysicsHitbox } from '../components'
import { CollisionPair } from '../core'
import { Broadphase2D, CollisionPairs } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Rebuilds {@linkcode CollisionPairs} from every unique pair of entities with
 * {@linkcode EntityHandle} and {@linkcode PhysicsHitbox}.
 *
 * The system clears {@linkcode CollisionPairs} first, then tests each unordered
 * combination with the inclusive {@linkcode intersectAABB2D} check. Every
 * overlapping pair is appended as a {@linkcode CollisionPair}; this is broadphase
 * candidate data, not a narrowphase collision result. Register it directly with
 * {@linkcode App#registerSystem} in an update schedule.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { getCollisionPairs, updateBroadphase2D } from '@wimaengine/broadphase'
 *
 * app.registerSystem({ schedule: AppSchedule.Update, system: getCollisionPairs })
 * app.registerSystem({ schedule: AppSchedule.Update, system: updateBroadphase2D })
 * ```
 *
 * @param {World} world - {@linkcode World} whose {@linkcode CollisionPairs} resource is rebuilt.
 * @returns {void}
 * @category system
 */
export function getCollisionPairs(world) {
  const pairs = world.getResource(CollisionPairs)
  const query = new Query(world, [EntityHandle, PhysicsHitbox])

  pairs.clear()

  query.eachCombination(([entityA, boundA], [entityB, boundB]) => {
    if (intersectAABB2D(boundA, boundB)) pairs.push(new CollisionPair(entityA, entityB))
  })
}

/**
 * Rebuilds {@linkcode Broadphase2D} from every entity with {@linkcode EntityHandle}
 * and {@linkcode PhysicsHitbox}.
 *
 * The system clears {@linkcode Broadphase2D}, then pushes each entity together
 * with its current hitbox into the configured broadphase implementation. It
 * performs no overlap test itself. Register it directly with
 * {@linkcode App#registerSystem} in an update schedule.
 *
 * @param {World} world - {@linkcode World} whose {@linkcode Broadphase2D} resource is rebuilt.
 * @returns {void}
 * @category system
 */
export function updateBroadphase2D(world) {
  const broadphase = world.getResource(Broadphase2D)
  const query = new Query(world, [EntityHandle, PhysicsHitbox])

  broadphase.clear()

  query.each(([entity, bound]) => {
    broadphase.push(entity, bound)
  })
}
/* eslint-enable jsdoc/check-tag-names */
