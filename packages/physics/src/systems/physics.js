import { PhysicsHitbox } from '@wimaengine/broadphase'
import { Query, World } from '@wimaengine/ecs'
import { Rotary } from '@wimaengine/math'
import { CollisionManifold, Contacts, Collider2D, PhysicsSettings } from '@wimaengine/narrowphase'
import { Orientation2D, Position2D, Scale2D } from '@wimaengine/transform'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Applies each body's transform to its {@linkcode Collider2D} component.
 *
 * {@linkcode Physics2DPlugin}
 * registers this exact function directly in the repeating
 * {@linkcode AppSchedule.Update}
 * schedule. It has no explicit system group, so it uses the schedule's
 * default group and runs before the physics plugin's broadphase and collision
 * response systems, which are registered afterward.
 *
 * The query requires all four components in this order:
 * {@linkcode Position2D}, {@linkcode Orientation2D}, {@linkcode Scale2D}, and
 * {@linkcode Collider2D}. For each matching entity, it calls
 * {@linkcode Collider2D.update} with the collider, the entity's position,
 * the angle returned by {@linkcode Rotary.toAngle}, and the entity's scale. An
 * entity missing any of these components is not updated.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { updateBodies } from '@wimaengine/physics'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: updateBodies
 * })
 * // Physics2DPlugin already registers this system for its app.
 * ```
 *
 * @param {World} world
 * @returns {void}
 * @category system
 */
export function updateBodies(world) {
  const query = new Query(world, [Position2D, Orientation2D, Scale2D, Collider2D])

  query.each(([position, orientation, scale, shape]) => {
    Collider2D.update(
      shape,
      position,
      Rotary.toAngle(orientation),
      scale
    )
  })
}

/**
 * Rebuilds each queried entity's axis-aligned {@linkcode PhysicsHitbox} from its
 * current world-space {@linkcode Collider2D}.
 *
 * {@linkcode Physics2DPlugin}
 * registers this function directly in the repeating
 * {@linkcode AppSchedule.Update}
 * schedule when `autoUpdateBounds` is enabled. The query requires both
 * components, so entities without either a collider or a hitbox are skipped.
 *
 * Circle colliders use `vertices[0]` as the center and the `x` and `y` values
 * of `vertices[1]` as the radii. Other colliders derive their bounds by
 * visiting every vertex. The system updates the existing `min` and `max`
 * vectors on each {@linkcode PhysicsHitbox} in place; it does not replace the
 * component or calculate bounds from transforms itself.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { updateBounds } from '@wimaengine/physics'
 *
 * // Physics2DPlugin registers this automatically unless autoUpdateBounds is
 * // disabled. Custom pipelines can register it directly:
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: updateBounds
 * })
 * ```
 *
 * @param {World} world
 * @returns {void}
 * @category system
 */
export function updateBounds(world) {

  const query = new Query(world, [Collider2D, PhysicsHitbox])

  query.each(([shape, bound]) => {
    let minX = Number.MAX_SAFE_INTEGER,
      minY = Number.MAX_SAFE_INTEGER,
      maxX = -Number.MAX_SAFE_INTEGER,
      maxY = -Number.MAX_SAFE_INTEGER

    if (shape.type === Collider2D.Circle) {
      const position = shape.vertices[0]
      const radiusX = shape.vertices[1].x
      const radiusY = shape.vertices[1].y
      const idx = position.x - radiusX,
        idy = position.y - radiusY,
        mdx = position.x + radiusX,
        mdy = position.y + radiusY

      if (idx < minX) minX = idx
      if (mdx > maxX) maxX = mdx
      if (idy < minY) minY = idy
      if (mdy > maxY) maxY = mdy
    } else {
      for (let j = 0; j < shape.vertices.length; j++) {
        const vertex = shape.vertices[j]

        if (vertex.x < minX) minX = vertex.x
        if (vertex.x > maxX) maxX = vertex.x
        if (vertex.y < minY) minY = vertex.y
        if (vertex.y > maxY) maxY = vertex.y
      }
    }

    bound.min.x = minX
    bound.max.x = maxX
    bound.min.y = minY
    bound.max.y = maxY
  })
}

/**
 * Resolves the current collision contacts with the configured velocity solver.
 *
 * {@linkcode Physics2DPlugin}
 * registers this function directly in the repeating
 * {@linkcode AppSchedule.Update}
 * schedule. The narrowphase populates the world's {@linkcode Contacts} resource
 * before this system runs; this function does not find new contacts.
 *
 * It first calls {@linkcode CollisionManifold.prepare} for every current contact,
 * passing the contact's positions, velocities, rotations, and a fixed inverse
 * timestep of `60`. It then makes
 * {@linkcode PhysicsSettings.velocitySolverIterations} passes over the same
 * contacts, calling {@linkcode CollisionManifold.solve} once per contact in each
 * pass. Changing that shared setting changes the number of solver passes for
 * later updates.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { collisionResponse } from '@wimaengine/physics'
 *
 * // Physics2DPlugin registers this automatically. Custom pipelines can use
 * // the same repeating update schedule:
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: collisionResponse
 * })
 * ```
 *
 * @param {World} world
 * @returns {void}
 * @category system
 */
export function collisionResponse(world) {
  const invDt = 60
  const contacts = world.getResource(Contacts)

  for (let i = 0; i < contacts.length; i++) {
    const {
      positionA,
      positionB,
      velocityA,
      velocityB,
      rotationA,
      rotationB
    } = contacts[i]

    CollisionManifold.prepare(
      contacts[i],
      positionA,
      positionB,
      velocityA,
      velocityB,
      rotationA,
      rotationB,
      invDt
    )
  }

  for (let i = 0; i < PhysicsSettings.velocitySolverIterations; i++) {
    for (let j = 0; j < contacts.length; j++) {
      CollisionManifold.solve(
        contacts[j]
      )
    }
  }
}
/* eslint-enable jsdoc/check-tag-names */
