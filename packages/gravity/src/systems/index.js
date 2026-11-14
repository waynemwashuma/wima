import { Query, World } from '@wimaengine/ecs'
import { Vector2, Vector3 } from '@wimaengine/math'
import { Acceleration2D, Acceleration3D } from '@wimaengine/movable'
import { PhysicsProperties } from '@wimaengine/narrowphase'
import { Gravity2D, Gravity3D } from '../resources/gravity'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Applies the world's 2D gravity to every eligible body.
 *
 * {@linkcode Gravity2DPlugin} registers
 * this exact function directly in the repeating
 * {@linkcode AppSchedule.Update}
 * schedule. The registration does not specify a system group, so the
 * schedule's default group is used. The plugin also installs the required
 * {@linkcode Gravity2D} resource.
 *
 * The query requires {@linkcode Acceleration2D} and {@linkcode PhysicsProperties}, in
 * that order. The system reads {@linkcode Gravity2D} once from the world, then
 * skips an entity when `PhysicsProperties.invmass === 0`. Every other matching
 * entity receives the gravity vector through `Vector2.add` with the existing
 * {@linkcode Acceleration2D} passed as the output, so acceleration is mutated in
 * place and the gravity resource is not changed. A world without `Gravity2D`
 * fails during resource lookup.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { applyGravity2D } from '@wimaengine/gravity'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: applyGravity2D
 * })
 * // Gravity2DPlugin already installs this system and its Gravity2D resource.
 * ```
 *
 * @param {World} world - Update world containing `Gravity2D` and body components.
 * @returns {void}
 * @throws {Error} If the world does not contain {@linkcode Gravity2D}.
 * @category system
 */
export function applyGravity2D(world) {
  const gravity = world.getResource(Gravity2D)
  const query = new Query(world, [Acceleration2D, PhysicsProperties])

  query.each(([acceleration, properties]) => {
    if (properties.invmass === 0) return

    Vector2.add(
      acceleration,
      gravity,
      acceleration
    )
  })
}

/**
 * Applies the world's 3D gravity to every eligible body.
 *
 * {@linkcode Gravity3DPlugin} registers
 * this exact function directly in the repeating
 * {@linkcode AppSchedule.Update}
 * schedule. The registration does not specify a system group, so the
 * schedule's default group is used. The plugin also installs the required
 * {@linkcode Gravity3D} resource.
 *
 * The query requires {@linkcode Acceleration3D} and {@linkcode PhysicsProperties}, in
 * that order. The system reads {@linkcode Gravity3D} once from the world, then
 * skips an entity when `PhysicsProperties.invmass === 0`. Every other matching
 * entity receives the gravity vector through `Vector3.add` with the existing
 * {@linkcode Acceleration3D} passed as the output, so acceleration is mutated in
 * place and the gravity resource is not changed. A world without `Gravity3D`
 * fails during resource lookup.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { applyGravity3D } from '@wimaengine/gravity'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: applyGravity3D
 * })
 * // Gravity3DPlugin already installs this system and its Gravity3D resource.
 * ```
 *
 * @param {World} world - Update world containing `Gravity3D` and body components.
 * @returns {void}
 * @throws {Error} If the world does not contain {@linkcode Gravity3D}.
 * @category system
 */
export function applyGravity3D(world) {
  const gravity = world.getResource(Gravity3D)
  const query = new Query(world, [Acceleration3D, PhysicsProperties])

  query.each(([acceleration, properties]) => {
    if (properties.invmass === 0) return

    Vector3.add(
      acceleration,
      gravity,
      acceleration
    )
  })
}
/* eslint-enable jsdoc/check-tag-names */

export * from './types'
