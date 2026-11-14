import { createTransform2D, GlobalTransform2D, Orientation2D, Position2D, Scale2D } from '@wimaengine/transform'
import { Camera, RenderLists2D } from '../components'
import { OrthographicProjection } from '../core'

/**
 * Creates the ordered component tuple for a 2D camera entity.
 *
 * The returned tuple contains {@linkcode Position2D}, {@linkcode Orientation2D},
 * {@linkcode Scale2D}, {@linkcode GlobalTransform2D}, {@linkcode Camera}, and
 * {@linkcode RenderLists2D}, in that order. The transform components are created
 * by {@linkcode createTransform2D} from the position, angle, and scale
 * arguments. The camera uses a new {@linkcode OrthographicProjection} with its
 * default bounds (`left = -1`, `right = 1`, `top = 1`, and `bottom = -1`), and
 * the render-list component starts empty.
 *
 * Pass the returned tuple directly to {@linkcode World#spawn}; the world adds the
 * entity handle while storing the components.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createCamera2D } from '@wimaengine/render-core'
 *
 * const world = new World()
 * const cameraEntity = world.spawn(createCamera2D(2, 3, Math.PI / 4, 1, 1))
 * ```
 *
 * @param {number} [x=0] - X position passed to {@linkcode createTransform2D}.
 * @param {number} [y=0] - Y position passed to {@linkcode createTransform2D}.
 * @param {number} [a=0] - Rotation angle in radians.
 * @param {number} [sx=1] - X scale.
 * @param {number} [sy=1] - Y scale.
 * @returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D, Camera, RenderLists2D]} Ordered camera components for {@linkcode World#spawn}.
 */
export function createCamera2D(x = 0, y = 0, a = 0, sx = 1, sy = 1) {
  return [
    ...createTransform2D(x, y, a, sx, sy),
    new Camera(new OrthographicProjection()),
    new RenderLists2D()
  ]
}
