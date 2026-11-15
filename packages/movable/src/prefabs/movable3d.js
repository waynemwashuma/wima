import { createTransform3D, GlobalTransform3D, Orientation3D, Position3D, Scale3D } from '@wimaengine/transform'
import { Velocity3D, Rotation3D, Acceleration3D, Torque3D } from '../components'

/**
 * Creates an ordered 3D transform and motion component bundle.
 *
 * The returned tuple is ready for {@linkcode World#spawn} and contains, in
 * insertion order, {@linkcode Position3D}, {@linkcode Orientation3D},
 * {@linkcode Scale3D}, {@linkcode GlobalTransform3D}, {@linkcode Velocity3D},
 * {@linkcode Rotation3D}, {@linkcode Acceleration3D}, and {@linkcode Torque3D}.
 * Position defaults to `(0, 0, 0)`, orientation defaults to the identity,
 * scale defaults to `(1, 1, 1)`, and all motion components default to zero.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createMovable3D } from '@wimaengine/movable'
 *
 * const world = new World()
 * world.spawn(createMovable3D())
 * ```
 *
 * @returns {[Position3D, Orientation3D, Scale3D, GlobalTransform3D, Velocity3D, Rotation3D, Acceleration3D, Torque3D]} Ordered transform and motion components.
 */
export function createMovable3D() {
  return [...createTransform3D(), new Velocity3D(), new Rotation3D(), new Acceleration3D(), new Torque3D()]
}

/**
 * Creates an ordered 3D motion-only component bundle.
 *
 * The returned tuple contains {@linkcode Velocity3D}, {@linkcode Rotation3D},
 * {@linkcode Acceleration3D}, and {@linkcode Torque3D} in insertion order. Every
 * component starts at zero. Use {@linkcode createMovable3D} when the entity also
 * needs the standard 3D transform components.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createRawMovable3D } from '@wimaengine/movable'
 *
 * const world = new World()
 * world.spawn(createRawMovable3D())
 * ```
 *
 * @returns {[Velocity3D, Rotation3D, Acceleration3D, Torque3D]} Ordered motion components.
 */
export function createRawMovable3D() {
  return [new Velocity3D(), new Rotation3D(), new Acceleration3D(), new Torque3D()]
}
