import { Query, World } from '@wimaengine/ecs'
import { Vector2, Vector3 } from '@wimaengine/math'
import { Rotation2D, Rotation3D, Velocity2D, Velocity3D } from '@wimaengine/movable'
import { Angular2DDamping, Angular3DDamping } from '../resources/angulardampen'
import { Linear2DDamping, Linear3DDamping } from '../resources/lineardampen'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Damps the linear velocity of every matching 2D entity.
 *
 * {@linkcode Damping2DPlugin} registers
 * this exact function directly in the repeating
 * {@linkcode AppSchedule.Update}
 * schedule. The registration does not specify a system group, so the
 * schedule's default group is used. The plugin also installs the required
 * {@linkcode Linear2DDamping} resource.
 *
 * The query requires exactly {@linkcode Velocity2D}. Before iterating, the system
 * reads `world.getResource(Linear2DDamping).value` and calculates the
 * multiplier `1 - value`. It then scales each queried vector with
 * `Vector2.multiplyScalar` using the same vector as the output, so every
 * {@linkcode Velocity2D} component is mutated in place. The resource must exist;
 * a missing resource causes resource lookup to throw.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { dampenVelocity2D } from '@wimaengine/damping'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: dampenVelocity2D
 * })
 * // Damping2DPlugin already installs this system and Linear2DDamping.
 * ```
 *
 * @param {World} world - Update world containing `Velocity2D` and `Linear2DDamping`.
 * @returns {void}
 * @category system
 */
export function dampenVelocity2D(world) {
  const query = new Query(world, [Velocity2D])

  const linear = 1 - world.getResource(Linear2DDamping).value

  query.each(([velocity]) => {
    Vector2.multiplyScalar(velocity, linear, velocity)
  })
}

/**
 * Damps the linear velocity of every matching 3D entity.
 *
 * {@linkcode Damping3DPlugin} registers
 * this exact function directly in the repeating
 * {@linkcode AppSchedule.Update}
 * schedule. The registration does not specify a system group, so the
 * schedule's default group is used. The plugin also installs the required
 * {@linkcode Linear3DDamping} resource.
 *
 * The query requires exactly {@linkcode Velocity3D}. Before iterating, the system
 * reads `world.getResource(Linear3DDamping).value` and calculates the
 * multiplier `1 - value`. It then scales each queried vector with
 * `Vector3.multiplyScalar` using the same vector as the output, so every
 * {@linkcode Velocity3D} component is mutated in place. The resource must exist;
 * a missing resource causes resource lookup to throw.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { dampenVelocity3D } from '@wimaengine/damping'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: dampenVelocity3D
 * })
 * // Damping3DPlugin already installs this system and Linear3DDamping.
 * ```
 *
 * @param {World} world - Update world containing `Velocity3D` and `Linear3DDamping`.
 * @returns {void}
 * @category system
 */
export function dampenVelocity3D(world) {
  const query = new Query(world, [Velocity3D])
  const linear = 1 - world.getResource(Linear3DDamping).value

  query.each(([velocity]) => {
    Vector3.multiplyScalar(velocity, linear, velocity)
  })
}

/**
 * Damps the angular rotation of every matching 2D entity.
 *
 * {@linkcode Damping2DPlugin} registers
 * this exact function directly in the repeating
 * {@linkcode AppSchedule.Update}
 * schedule. The registration does not specify a system group, so the
 * schedule's default group is used. The plugin also installs the required
 * {@linkcode Angular2DDamping} resource.
 *
 * The query requires exactly {@linkcode Rotation2D}. Before iterating, the system
 * reads `world.getResource(Angular2DDamping).value` and calculates the
 * multiplier `1 - value`. It multiplies each rotation's scalar `value` by
 * that multiplier in place. The resource must exist; a missing resource
 * causes resource lookup to throw.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { dampenRotation2D } from '@wimaengine/damping'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: dampenRotation2D
 * })
 * // Damping2DPlugin already installs this system and Angular2DDamping.
 * ```
 *
 * @param {World} world - Update world containing `Rotation2D` and `Angular2DDamping`.
 * @returns {void}
 * @category system
 */
export function dampenRotation2D(world) {
  const query = new Query(world, [Rotation2D])
  const angular = 1 - world.getResource(Angular2DDamping).value

  query.each(([rotation]) => {
    rotation.value *= angular
  })
}

/**
 * Damps the angular rotation of every matching 3D entity.
 *
 * {@linkcode Damping3DPlugin} registers
 * this exact function directly in the repeating
 * {@linkcode AppSchedule.Update}
 * schedule. The registration does not specify a system group, so the
 * schedule's default group is used. The plugin also installs the required
 * {@linkcode Angular3DDamping} resource.
 *
 * The query requires exactly {@linkcode Rotation3D}. Before iterating, the system
 * reads `world.getResource(Angular3DDamping).value` and calculates the
 * multiplier `1 - value`. It multiplies the queried rotation's `x`, `y`, and
 * `z` fields by that multiplier directly, so the {@linkcode Rotation3D} component
 * is mutated in place. The resource must exist; a missing resource causes
 * resource lookup to throw.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { dampenRotation3D } from '@wimaengine/damping'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: dampenRotation3D
 * })
 * // Damping3DPlugin already installs this system and Angular3DDamping.
 * ```
 *
 * @param {World} world - Update world containing `Rotation3D` and `Angular3DDamping`.
 * @returns {void}
 * @category system
 */
export function dampenRotation3D(world) {

  const query = new Query(world, [Rotation3D])
  const angular = 1 - world.getResource(Angular3DDamping).value

  query.each(([rotation]) => {
    rotation.x *= angular
    rotation.y *= angular
    rotation.z *= angular
  })
}
/* eslint-enable jsdoc/check-tag-names */

export * from './types'
