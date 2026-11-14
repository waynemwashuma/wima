import { Quaternion } from '@wimaengine/math'
import { Position3D, Orientation3D, Scale3D, GlobalTransform3D } from '../components'

/**
 * Creates the standard 3D transform component bundle for an entity.
 *
 * The returned tuple contains {@linkcode Position3D}, {@linkcode Orientation3D},
 * {@linkcode Scale3D}, and {@linkcode GlobalTransform3D} in insertion order.
 * Position defaults to `(0, 0, 0)`, Euler orientation defaults to `(0, 0, 0)`,
 * and scale defaults to `(1, 1, 1)`. The three orientation arguments are
 * converted to a quaternion through {@linkcode Quaternion.fromEuler} before
 * they are copied into {@linkcode Orientation3D}.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createTransform3D } from '@wimaengine/transform'
 *
 * const world = new World()
 * world.spawn(createTransform3D(0, 1, 0, 0, Math.PI / 2, 0))
 * ```
 *
 * @param {number} [x=0] - Initial x position.
 * @param {number} [y=0] - Initial y position.
 * @param {number} [z=0] - Initial z position.
 * @param {number} [ox=0] - Initial Euler rotation around x.
 * @param {number} [oy=0] - Initial Euler rotation around y.
 * @param {number} [oz=0] - Initial Euler rotation around z.
 * @param {number} [sx=1] - Initial x scale.
 * @param {number} [sy=1] - Initial y scale.
 * @param {number} [sz=1] - Initial z scale.
 * @returns {[Position3D, Orientation3D, Scale3D, GlobalTransform3D]} Ordered component bundle containing {@linkcode Position3D}, {@linkcode Orientation3D}, {@linkcode Scale3D}, and {@linkcode GlobalTransform3D}.
 */
export function createTransform3D(
  x = 0,
  y = 0,
  z = 0,
  ox = 0,
  oy = 0,
  oz = 0,
  sx = 1,
  sy = 1,
  sz = 1
) {
  const quaternion = Quaternion.fromEuler(ox, oy, oz)

  return [
    new Position3D(x, y, z),
    new Orientation3D().copy(quaternion),
    new Scale3D(sx, sy, sz),
    new GlobalTransform3D()
  ]
}
