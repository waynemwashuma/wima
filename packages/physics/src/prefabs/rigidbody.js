import { PhysicsHitbox } from '@wimaengine/broadphase'
import { createMovable2D, Velocity2D, Rotation2D, Acceleration2D, Torque2D } from '@wimaengine/movable'
import { PhysicsProperties, PhysicsSettings } from '@wimaengine/narrowphase'
import { GlobalTransform2D, Orientation2D, Position2D, Scale2D } from '@wimaengine/transform'

/**
 * Creates the ordered component tuple for a 2D physics body.
 *
 * The returned tuple contains, in order, the components from
 * {@linkcode createMovable2D}: {@linkcode Position2D}, {@linkcode Orientation2D},
 * {@linkcode Scale2D}, {@linkcode GlobalTransform2D}, {@linkcode Velocity2D},
 * {@linkcode Rotation2D}, {@linkcode Acceleration2D}, and {@linkcode Torque2D}; it then
 * adds a fresh {@linkcode PhysicsHitbox} and {@linkcode PhysicsProperties}. Pass the
 * tuple directly to {@linkcode World#spawn}
 * or spread it into a larger component array.
 *
 * `x` and `y` initialize the position, and `a` is an angle in radians used to
 * initialize the orientation. The movable components otherwise use their
 * zero or identity defaults. A non-zero `mass` becomes `1 / mass` in
 * `PhysicsProperties.invmass`; a mass of `0` produces `invmass = 0`, making
 * the body immovable by collision impulses. `restitution` and
 * `kineticfriction` default to the current values of
 * {@linkcode PhysicsSettings} when the factory is called. `mask` and `group` are
 * copied to the body's collision filter fields.
 *
 * Every call creates new components. This factory does not add a
 * {@linkcode Collider2D}; attach one
 * when the body should participate in collision detection.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Collider2D } from '@wimaengine/narrowphase'
 * import { createRigidBody2D } from '@wimaengine/physics'
 *
 * const world = new World()
 * const body = world.spawn([
 *   ...createRigidBody2D(10, 20, Math.PI / 4, 2),
 *   Collider2D.rectangle(2, 1)
 * ])
 * ```
 *
 * @param {number} [x=0] - Initial x position.
 * @param {number} [y=0] - Initial y position.
 * @param {number} [a=0] - Initial orientation in radians.
 * @param {number} [mass=1] - Mass converted to inverse mass; `0` creates an
 * immovable body.
 * @param {number} [restitution=PhysicsSettings.restitution] - Bounciness
 * stored in {@linkcode PhysicsProperties}.
 * @param {number} [kineticfriction=PhysicsSettings.kineticFriction] - Kinetic
 * friction stored in {@linkcode PhysicsProperties}.
 * @param {bigint} [mask=0xFFFFFFFFn] - Collision mask bits.
 * @param {bigint} [group=0xFFFFFFFFn] - Collision group bits.
 * @returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D, Velocity2D, Rotation2D, Acceleration2D, Torque2D, PhysicsHitbox, PhysicsProperties]} Ordered, fresh components for {@linkcode World#spawn}.
 */
export function createRigidBody2D(
  x = 0,
  y = 0,
  a = 0,
  mass = 1,
  restitution = PhysicsSettings.restitution,
  kineticfriction = PhysicsSettings.kineticFriction,
  mask = 0xFFFFFFFFn,
  group = 0xFFFFFFFFn
) {
  const properties = new PhysicsProperties()

  properties.invmass = mass === 0 ? 0 : 1 / mass
  properties.group = group
  properties.mask = mask
  properties.restitution = restitution
  properties.kineticFriction = kineticfriction

  return [
    ...createMovable2D(x, y, a),
    new PhysicsHitbox(),
    properties
  ]
}
