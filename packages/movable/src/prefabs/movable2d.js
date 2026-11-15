import { createTransform2D, GlobalTransform2D, Orientation2D, Position2D, Scale2D } from '@wimaengine/transform'
import { Velocity2D, Rotation2D, Acceleration2D, Torque2D } from '../components'

/**
 * Creates an ordered 2D transform and motion component bundle.
 *
 * The returned tuple is ready for {@linkcode World#spawn} and contains, in
 * insertion order, {@linkcode Position2D}, {@linkcode Orientation2D},
 * {@linkcode Scale2D}, {@linkcode GlobalTransform2D}, {@linkcode Velocity2D},
 * {@linkcode Rotation2D}, {@linkcode Acceleration2D}, and {@linkcode Torque2D}.
 * Position defaults to `(0, 0)`, the angle defaults to `0` radians, scale
 * defaults to `(1, 1)`, and all motion components default to zero.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createMovable2D } from '@wimaengine/movable'
 *
 * const world = new World()
 * world.spawn(createMovable2D(10, 20, Math.PI / 4))
 * ```
 *
 * @param {number} [x=0] - Initial x position.
 * @param {number} [y=0] - Initial y position.
 * @param {number} [a=0] - Initial 2D angle in radians.
 * @returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D, Velocity2D, Rotation2D, Acceleration2D, Torque2D]} Ordered transform and motion components.
 */
export function createMovable2D(x = 0, y = 0, a = 0) {
  return [...createTransform2D(x, y, a), new Velocity2D(), new Rotation2D(), new Acceleration2D(), new Torque2D()]
}

/**
 * Creates an ordered 2D motion-only component bundle.
 *
 * The returned tuple contains {@linkcode Velocity2D}, {@linkcode Rotation2D},
 * {@linkcode Acceleration2D}, and {@linkcode Torque2D} in insertion order. The
 * supplied `x` and `y` values initialize velocity, `a` initializes angular
 * motion in radians, and acceleration and torque start at zero. Use
 * {@linkcode createMovable2D} when the entity also needs the standard 2D
 * transform components.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createRawMovable2D } from '@wimaengine/movable'
 *
 * const world = new World()
 * world.spawn(createRawMovable2D(2, 0, 0.1))
 * ```
 *
 * @param {number} [x=0] - Initial x velocity.
 * @param {number} [y=0] - Initial y velocity.
 * @param {number} [a=0] - Initial angular motion in radians.
 * @returns {[Velocity2D, Rotation2D, Acceleration2D, Torque2D]} Ordered motion components.
 */
export function createRawMovable2D(x = 0, y = 0, a = 0) {
  return [new Velocity2D(x, y), new Rotation2D(a), new Acceleration2D(), new Torque2D()]
}
