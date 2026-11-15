import { Position2D, Orientation2D, Scale2D, GlobalTransform2D } from '../components'

/**
 * Creates the standard 2D transform component bundle for an entity.
 *
 * The returned tuple contains {@linkcode Position2D}, {@linkcode Orientation2D},
 * {@linkcode Scale2D}, and {@linkcode GlobalTransform2D} in insertion order.
 * Position defaults to `(0, 0)`, the angle defaults to `0`, and scale defaults
 * to `(1, 1)`. The angle is converted to the cosine/sine representation used
 * by {@linkcode Orientation2D}.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createTransform2D } from '@wimaengine/transform'
 *
 * const world = new World()
 * world.spawn(createTransform2D(10, 20, Math.PI / 4))
 * ```
 *
 * @param {number} [dx=0] - Initial x position.
 * @param {number} [dy=0] - Initial y position.
 * @param {number} [a=0] - Initial 2D angle.
 * @param {number} [sx=1] - Initial x scale.
 * @param {number} [sy=1] - Initial y scale.
 * @returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D]} Ordered component bundle containing {@linkcode Position2D}, {@linkcode Orientation2D}, {@linkcode Scale2D}, and {@linkcode GlobalTransform2D}.
 */
export function createTransform2D(
  dx = 0,
  dy = 0,
  a = 0,
  sx = 1,
  sy = 1
) {
  return [
    new Position2D(dx, dy),
    new Orientation2D(Math.cos(a), Math.sin(a)),
    new Scale2D(sx, sy),
    new GlobalTransform2D()
  ]
}
