import { Query, World } from '@wimaengine/ecs'
import { Rotary, Vector2 } from '@wimaengine/math'
import { Acceleration2D, Rotation2D, Torque2D, Velocity2D } from '@wimaengine/movable'
import { Orientation2D, Position2D } from '@wimaengine/transform'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Advances matching 2D positions and velocities with the engine's Verlet
 * position step.
 *
 * {@linkcode VerletIntegrator2DPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. The registration does not specify a system
 * group, so the schedule's default group is used.
 *
 * The query requires {@linkcode Position2D}, {@linkcode Velocity2D}, and
 * {@linkcode Acceleration2D}, in that order. Entities missing any of these
 * components are skipped. The system uses the fixed `1 / 60` step in the
 * source; it does not read `Time.delta` or
 * {@linkcode VirtualClock}.
 *
 * For each matching entity, the system mutates the components in this order:
 * it scales `Acceleration2D` by `dt * 0.5` in place, adds that half-step to
 * `Velocity2D`, writes `Position2D` as the updated velocity step plus the
 * scaled acceleration step, adds the same half-step to velocity again, and
 * finally clears acceleration to `(0, 0)`. The static `Vector2` helper return
 * values are ignored; their explicit output arguments write into the queried
 * components. `Velocity2D` is not otherwise replaced or cleared.
 *
 * @example
 * ```js
 * import { VerletIntegrator2DPlugin } from '@wimaengine/integrator'
 *
 * app.registerPlugin(new VerletIntegrator2DPlugin())
 * // Position2D, Velocity2D, and Acceleration2D entities update during Update.
 * ```
 *
 * @param {World} world - Update world containing position, velocity, and acceleration components.
 * @returns {void}
 * @category system
 */
export function updatePositionVerlet2D(world) {
  const query = new Query(world, [Position2D, Velocity2D, Acceleration2D])
  const dt = 1 / 60

  query.each(([position, velocity, acceleration]) => {
    Vector2.multiplyScalar(acceleration, dt * 0.5, acceleration)
    Vector2.add(velocity, acceleration, velocity)
    Vector2.set(
      position.x + velocity.x * dt + acceleration.x * dt,
      position.y + velocity.y * dt + acceleration.y * dt,
      position
    )
    Vector2.add(velocity, acceleration, velocity)
    Vector2.set(0, 0, acceleration)
  })
}

/**
 * Advances matching 2D rotation state with the engine's Verlet torque step.
 *
 * {@linkcode VerletIntegrator2DPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. The registration does not specify a system
 * group, so the schedule's default group is used.
 *
 * The query requires {@linkcode Orientation2D}, {@linkcode Rotation2D}, and
 * {@linkcode Torque2D}, in that order. Entities missing any of these components
 * are skipped. The system uses the fixed `1 / 60` step in the source; it does
 * not read `Time.delta` or
 * {@linkcode VirtualClock}.
 *
 * For each matching entity, the system first scales `Torque2D.value` by
 * `dt * 0.5`, adds that half-step to `Rotation2D.value`, and constructs a
 * rotary increment with {@linkcode Rotary.fromAngle} using `rotation.value * dt + torque.value * dt`. It then
 * calls {@linkcode Orientation2D#multiply}, but discards the returned rotary
 * value. Because the current `multiply()` operation returns a new value rather
 * than writing into the component, `Orientation2D` is unchanged by this
 * function. The system then adds `torque.value * dt * 0.5` to rotation and
 * clears `Torque2D.value` to `0`.
 *
 * @example
 * ```js
 * import { VerletIntegrator2DPlugin } from '@wimaengine/integrator'
 *
 * app.registerPlugin(new VerletIntegrator2DPlugin())
 * // Rotation2D and Torque2D are consumed during the app's Update pass.
 * ```
 *
 * @param {World} world - Update world containing orientation, rotation, and torque components.
 * @returns {void}
 * @category system
 */
export function updateOrientationVerlet2D(world) {
  const query = new Query(world, [Orientation2D, Rotation2D, Torque2D])
  const dt = 1 / 60

  query.each(([orientation, rotation, torque]) => {
    torque.value *= dt * 0.5
    rotation.value += torque.value
    orientation.multiply(Rotary.fromAngle(rotation.value * dt + torque.value * dt))
    rotation.value += torque.value * dt * 0.5
    torque.value = 0
  })
}
/* eslint-enable jsdoc/check-tag-names */
