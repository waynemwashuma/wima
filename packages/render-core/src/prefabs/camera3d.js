import { Orientation3D, Position3D, Scale3D, GlobalTransform3D, createTransform3D } from '@wimaengine/transform'
import { Camera, RenderLists3D } from '../components'
import { } from '../plugins'

/**
 * Creates the ordered component tuple for a 3D camera entity.
 *
 * The returned tuple contains {@linkcode Position3D}, {@linkcode Orientation3D},
 * {@linkcode Scale3D}, {@linkcode GlobalTransform3D}, {@linkcode Camera}, and
 * {@linkcode RenderLists3D}, in that order. The transform components are created
 * by {@linkcode createTransform3D}; `x`, `y`, and `z` set position, `ox`, `oy`, and
 * `oz` set Euler orientation, and `sx`, `sy`, and `sz` set scale. The camera
 * is created with `new Camera()`, so it uses its default
 * {@linkcode PerspectiveProjection}; the final component is a new
 * {@linkcode RenderLists3D}.
 *
 * Pass the returned tuple directly to
 * {@linkcode World#spawn} to create the camera entity.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createCamera3D } from '@wimaengine/render-core'
 *
 * const world = new World()
 * const cameraEntity = world.spawn(createCamera3D(0, 0, 5))
 * ```
 *
 * @param {number} [x=0] - X position passed to {@linkcode createTransform3D}.
 * @param {number} [y=0] - Y position passed to {@linkcode createTransform3D}.
 * @param {number} [z=0] - Z position passed to {@linkcode createTransform3D}.
 * @param {number} [ox=0] - X Euler orientation passed to {@linkcode createTransform3D}.
 * @param {number} [oy=0] - Y Euler orientation passed to {@linkcode createTransform3D}.
 * @param {number} [oz=0] - Z Euler orientation passed to {@linkcode createTransform3D}.
 * @param {number} [sx=1] - X scale passed to {@linkcode createTransform3D}.
 * @param {number} [sy=1] - Y scale passed to {@linkcode createTransform3D}.
 * @param {number} [sz=1] - Z scale passed to {@linkcode createTransform3D}.
 * @returns {[Position3D, Orientation3D, Scale3D, GlobalTransform3D, Camera, RenderLists3D]} Ordered 3D camera components for {@linkcode World#spawn}.
 */
export function createCamera3D(
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
  return [
    ...createTransform3D(x, y, z, ox, oy, oz, sx, sy, sz),
    new Camera(),
    new RenderLists3D()
  ]
}
