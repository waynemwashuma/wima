/** @import {BoundingBox2DSerial} from '@wimaengine/geometry' */
/** @import {Vector2Like} from '@wimaengine/math' */

import { BoundingBox2D } from '@wimaengine/geometry'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides an ECS component for an entity's 2D world-space axis-aligned bounds.
 * Use {@linkcode PhysicsHitbox} when broadphase collision or spatial queries need
 * the entity's current bounds. It extends {@linkcode BoundingBox2D} and stores
 * the lower and upper coordinates in its inherited `min` and `max` vectors.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { PhysicsHitbox } from '@wimaengine/broadphase'
 *
 * const world = new World()
 * world.spawn([new PhysicsHitbox(-1, -1, 1, 1)])
 *
 * new Query(world, [PhysicsHitbox]).each(([hitbox]) => {
 *   // These values reflect the collider's current world-space bounds.
 *   console.log(hitbox.min.x, hitbox.min.y, hitbox.max.x, hitbox.max.y)
 * })
 * ```
 */
export class PhysicsHitbox extends BoundingBox2D {

  /**
   * @inheritdoc
   * @param {PhysicsHitbox} source - Hitbox to copy.
   * @param {PhysicsHitbox} [target=new PhysicsHitbox()] - Hitbox to populate.
   * @returns {PhysicsHitbox} The populated hitbox.
   */
  static copy(source, target = new PhysicsHitbox()) {
    return super.copy(source, target)
  }

  /**
   * Creates an independent hitbox with the same bound coordinates.
   *
   * @param {PhysicsHitbox} target - Hitbox to clone.
   * @returns {PhysicsHitbox} A new hitbox containing the source coordinates.
   */
  static clone(target) {
    return PhysicsHitbox.copy(target)
  }

  /**
   * Serializes a hitbox to its plain `max` and `min` vector data.
   *
   * @inheritdoc
   * @param {PhysicsHitbox} value - Hitbox to serialize.
   * @returns {{max: Vector2Like, min: Vector2Like}} Serialized bound coordinates.
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * Restores serialized `max` and `min` vectors into a hitbox.
   *
   * @inheritdoc
   * @param {BoundingBox2DSerial} value - Serialized bound coordinates.
   * @param {PhysicsHitbox} [out=new PhysicsHitbox()] - Hitbox to populate.
   * @returns {PhysicsHitbox} The populated hitbox.
   */
  static deserialize(value, out = new PhysicsHitbox()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
