import { Query, World } from '@wimaengine/ecs'
import { Quaternion, Rotary, Vector2, Vector3 } from '@wimaengine/math'
import { Acceleration2D, Acceleration3D, Rotation2D, Rotation3D, Torque2D, Torque3D, Velocity2D, Velocity3D } from '@wimaengine/movable'
import { Orientation2D, Orientation3D, Position2D, Position3D } from '@wimaengine/transform'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Advances each matching 2D linear velocity with its accumulated acceleration.
 *
 * {@linkcode EulerIntegrator2DPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. The registration does not specify a system
 * group, so the schedule's default group is used.
 *
 * The query requires {@linkcode Velocity2D} and {@linkcode Acceleration2D}, in that
 * order. Each matching velocity is updated in place with `acceleration *
 * (1 / 60)`, then the acceleration is reset to zero in place. Entities
 * missing either component are skipped. This implementation uses the fixed
 * `1 / 60` step in the source; it does not read `Time.delta` or
 * {@linkcode VirtualClock}.
 *
 * @example
 * ```js
 * import { EulerIntegrator2DPlugin } from '@wimaengine/integrator'
 *
 * app.registerPlugin(new EulerIntegrator2DPlugin())
 * // Velocity2D entities are integrated during each Update pass.
 * ```
 *
 * @param {World} world - Update world containing velocity and acceleration components.
 * @returns {void}
 * @category system
 */
export function updateVelocityEuler2D(world) {
  const query = new Query(world, [Velocity2D, Acceleration2D])
  const dt = 1 / 60

  query.each(([velocity, acceleration]) => {
    Vector2.set(
      velocity.x + acceleration.x * dt,
      velocity.y + acceleration.y * dt,
      velocity
    )
    Vector2.set(0, 0, acceleration)
  })
}

/**
 * Advances each matching 2D angular rotation with its accumulated torque.
 *
 * {@linkcode EulerIntegrator2DPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. The registration does not specify a system
 * group, so the schedule's default group is used.
 *
 * The query requires {@linkcode Rotation2D} and {@linkcode Torque2D}, in that order.
 * Each matching rotation receives `torque.value * (1 / 60)` in its mutable
 * `value` field, and the torque value is then cleared to `0` in place.
 * Entities missing either component are skipped. This implementation uses
 * the fixed `1 / 60` step in the source; it does not read `Time.delta` or
 * {@linkcode VirtualClock}.
 *
 * @example
 * ```js
 * import { EulerIntegrator2DPlugin } from '@wimaengine/integrator'
 *
 * app.registerPlugin(new EulerIntegrator2DPlugin())
 * // Rotation2D and Torque2D entities are integrated during Update.
 * ```
 *
 * @param {World} world - Update world containing rotation and torque components.
 * @returns {void}
 * @category system
 */
export function updateAngularEuler2D(world) {
  const query = new Query(world, [Rotation2D, Torque2D])
  const dt = 1 / 60

  query.each(([rotation, torque]) => {
    rotation.value += torque.value * dt
    torque.value = 0
  })
}

/**
 * Advances each matching 2D position with its linear velocity.
 *
 * {@linkcode EulerIntegrator2DPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. The registration does not specify a system
 * group, so the schedule's default group is used.
 *
 * The query requires {@linkcode Position2D} and {@linkcode Velocity2D}, in that
 * order. For each matching entity, the system adds each velocity coordinate
 * multiplied by the fixed `1 / 60` step to the existing position and writes
 * the result back into that same {@linkcode Position2D} component. Velocity is
 * read but not cleared or replaced. Entities missing either component are
 * skipped, and the system does not read `Time.delta` or
 * {@linkcode VirtualClock}.
 *
 * @example
 * ```js
 * import { EulerIntegrator2DPlugin } from '@wimaengine/integrator'
 *
 * app.registerPlugin(new EulerIntegrator2DPlugin())
 * // Position2D is advanced from Velocity2D during Update.
 * ```
 *
 * @param {World} world - Update world containing position and velocity components.
 * @returns {void}
 * @category system
 */
export function updatePositionEuler2D(world) {
  const query = new Query(world, [Position2D, Velocity2D])
  const dt = 1 / 60

  query.each(([position, velocity]) => {
    Vector2.set(
      position.x + velocity.x * dt,
      position.y + velocity.y * dt,
      position
    )
  })
}

/**
 * Computes a 2D orientation step from each matching angular rotation.
 *
 * {@linkcode EulerIntegrator2DPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. The registration does not specify a system
 * group, so the schedule's default group is used.
 *
 * The query requires {@linkcode Orientation2D} and {@linkcode Rotation2D}, in that
 * order. For each matching entity, the system creates a rotary increment
 * from `rotation.value * (1 / 60)` and passes it to
 * {@linkcode Orientation2D#multiply}. The returned rotary value is ignored by
 * the current implementation, so this function does not write a new
 * orientation back in place; it also leaves `Rotation2D` unchanged. Entities
 * missing either component are skipped. The step is fixed at `1 / 60`; the
 * system does not read `Time.delta` or
 * {@linkcode VirtualClock}.
 *
 * @example
 * ```js
 * import { EulerIntegrator2DPlugin } from '@wimaengine/integrator'
 *
 * app.registerPlugin(new EulerIntegrator2DPlugin())
 * // The orientation system runs during the app's Update schedule.
 * ```
 *
 * @param {World} world - Update world containing orientation and rotation components.
 * @returns {void}
 * @category system
 */
export function updateOrientationEuler2D(world) {
  const query = new Query(world, [Orientation2D, Rotation2D])
  const dt = 1 / 60

  query.each(([orientation, rotation]) => {
    const angle = Rotary.fromAngle(rotation.value * dt)

    orientation.multiply(angle)
  })
}

/**
 * Advances each matching 3D linear velocity with its accumulated acceleration.
 *
 * {@linkcode EulerIntegrator3DPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. The registration does not specify a system
 * group, so the schedule's default group is used.
 *
 * The query requires {@linkcode Velocity3D} and {@linkcode Acceleration3D}, in that
 * order. Each matching velocity is updated in place with `acceleration *
 * (1 / 60)` for all three coordinates, then the acceleration is reset to
 * `(0, 0, 0)` in place. Entities missing either component are skipped. This
 * implementation uses the fixed `1 / 60` step in the source; it does not
 * read `Time.delta` or {@linkcode VirtualClock}.
 *
 * @example
 * ```js
 * import { EulerIntegrator3DPlugin } from '@wimaengine/integrator'
 *
 * app.registerPlugin(new EulerIntegrator3DPlugin())
 * // Velocity3D entities are integrated during each Update pass.
 * ```
 *
 * @param {World} world - Update world containing velocity and acceleration components.
 * @returns {void}
 * @category system
 */
export function updateVelocityEuler3D(world) {
  const query = new Query(world, [Velocity3D, Acceleration3D])
  const dt = 1 / 60

  query.each(([velocity, acceleration]) => {
    Vector3.set(
      velocity.x + acceleration.x * dt,
      velocity.y + acceleration.y * dt,
      velocity.z + acceleration.z * dt,
      velocity
    )
    Vector3.set(0, 0, 0, acceleration)
  })
}

/**
 * Applies each matching 3D torque step to the angular rotation state.
 *
 * {@linkcode EulerIntegrator3DPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. The registration does not specify a system
 * group, so the schedule's default group is used.
 *
 * The query requires {@linkcode Rotation3D} and {@linkcode Torque3D}, in that order.
 * For each matching entity, the system creates a torque step scaled by the
 * fixed `1 / 60` value and passes it to {@linkcode Rotation3D.add}. The current
 * implementation ignores the new vector returned by `add`, so it does not
 * write the rotation back in place; it does clear the queried torque with
 * `set(0, 0, 0)`. Entities missing either component are skipped. The system
 * does not read `Time.delta` or {@linkcode VirtualClock}.
 *
 * @example
 * ```js
 * import { EulerIntegrator3DPlugin } from '@wimaengine/integrator'
 *
 * app.registerPlugin(new EulerIntegrator3DPlugin())
 * // Torque3D is consumed during the app's Update schedule.
 * ```
 *
 * @param {World} world - Update world containing rotation and torque components.
 * @returns {void}
 * @category system
 */
export function updateAngularEuler3D(world) {
  const query = new Query(world, [Rotation3D, Torque3D])
  const dt = 1 / 60

  query.each(([rotation, torque]) => {
    const temp = Vector3.multiplyScalar(torque, dt)

    rotation.add(temp)
    torque.set(0, 0, 0)
  })
}

/**
 * Advances each matching 3D position with its linear velocity.
 *
 * {@linkcode EulerIntegrator3DPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. The registration does not specify a system
 * group, so the schedule's default group is used.
 *
 * The query requires {@linkcode Position3D} and {@linkcode Velocity3D}, in that
 * order. For each matching entity, the system adds each velocity coordinate
 * multiplied by the fixed `1 / 60` step to the existing position and writes
 * all three results back into that same {@linkcode Position3D} component.
 * Velocity is read but not cleared or replaced. Entities missing either
 * component are skipped, and the system does not read `Time.delta` or
 * {@linkcode VirtualClock}.
 *
 * @example
 * ```js
 * import { EulerIntegrator3DPlugin } from '@wimaengine/integrator'
 *
 * app.registerPlugin(new EulerIntegrator3DPlugin())
 * // Position3D is advanced from Velocity3D during Update.
 * ```
 *
 * @param {World} world - Update world containing position and velocity components.
 * @returns {void}
 * @category system
 */
export function updatePositionEuler3D(world) {
  const query = new Query(world, [Position3D, Velocity3D])
  const dt = 1 / 60

  query.each(([position, velocity]) => {
    Vector3.set(
      position.x + velocity.x * dt,
      position.y + velocity.y * dt,
      position.z + velocity.z * dt,
      position
    )
  })
}

/**
 * Computes a 3D orientation step from each matching angular rotation.
 *
 * {@linkcode EulerIntegrator3DPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. The registration does not specify a system
 * group, so the schedule's default group is used.
 *
 * The query requires {@linkcode Orientation3D} and {@linkcode Rotation3D}, in that
 * order. For each matching entity, the system scales the rotation vector by
 * the fixed `1 / 60` step, converts it to a quaternion with
 * {@linkcode Quaternion.fromEuler}, then calls {@linkcode Orientation3D#multiply} and
 * {@linkcode Orientation3D#normalize}. Both returned quaternions are ignored by
 * the current implementation, so it does not write or normalize the
 * orientation in place; `Rotation3D` is also unchanged. Entities missing
 * either component are skipped. The system does not read `Time.delta` or
 * {@linkcode VirtualClock}.
 *
 * @example
 * ```js
 * import { EulerIntegrator3DPlugin } from '@wimaengine/integrator'
 *
 * app.registerPlugin(new EulerIntegrator3DPlugin())
 * // The orientation system runs during the app's Update schedule.
 * ```
 *
 * @param {World} world - Update world containing orientation and rotation components.
 * @returns {void}
 * @category system
 */
export function updateOrientationEuler3D(world) {
  const query = new Query(world, [Orientation3D, Rotation3D])
  const dt = 1 / 60

  query.each(([orientation, rotation]) => {
    const temp1 = Vector3.multiplyScalar(rotation, dt)
    const temp = Quaternion.fromEuler(temp1.x, temp1.y, temp1.z)

    orientation.multiply(temp)
    orientation.normalize()

  })
}
/* eslint-enable jsdoc/check-tag-names */
