import { Handle } from '@wimaengine/asset'
import {
  createTransform2D,
  createTransform3D,
  GlobalTransform2D,
  GlobalTransform3D,
  Orientation2D,
  Orientation3D,
  Position2D,
  Position3D,
  Scale2D,
  Scale3D
} from '@wimaengine/transform'
import { BasicMaterial, Mesh } from '../assets'
import { BasicMaterialInstance, Meshed } from '../components'

/**
 * Creates an ordered 2D mesh component tuple for {@linkcode World#spawn}.
 *
 * The tuple contains, in order, the four components returned by
 * {@linkcode createTransform2D}: {@linkcode Position2D}, {@linkcode Orientation2D},
 * {@linkcode Scale2D}, and {@linkcode GlobalTransform2D}; it then appends
 * {@linkcode Meshed} and {@linkcode BasicMaterialInstance}. The supplied `mesh` and
 * `material` handles are passed directly to those components, so this helper
 * does not create or clone either handle.
 *
 * Pass the returned tuple as the component array to {@linkcode World#spawn}, or
 * spread it into a larger component array when adding more components.
 *
 * @example
 * ```js
 * const entity = world.spawn([
 *   ...createBasicMesh2D(mesh, material, 0.25, 0.1)
 * ])
 * ```
 *
 * @param {Handle<Mesh>} [mesh] - Mesh handle passed to {@linkcode Meshed}.
 * @param {Handle<BasicMaterial>} [material] - Basic material handle passed to {@linkcode BasicMaterialInstance}.
 * @param {number} [x=0] - 2D position x-coordinate passed to {@linkcode createTransform2D}.
 * @param {number} [y=0] - 2D position y-coordinate passed to {@linkcode createTransform2D}.
 * @param {number} [a=0] - 2D orientation angle passed to {@linkcode createTransform2D}.
 * @param {number} [sx=1] - 2D x-axis scale passed to {@linkcode createTransform2D}.
 * @param {number} [sy=1] - 2D y-axis scale passed to {@linkcode createTransform2D}.
 * @returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D, Meshed, BasicMaterialInstance]} Ordered 2D transform, mesh, and material components.
 */
export function createBasicMesh2D(mesh, material, x = 0, y = 0, a = 0, sx = 1, sy = 1) {
  return [
    ...createTransform2D(x, y, a, sx, sy),
    new Meshed(mesh),
    new BasicMaterialInstance(material)
  ]
}

/**
 * Creates an ordered 3D mesh component tuple for {@linkcode World#spawn}.
 *
 * The tuple contains, in order, the four components returned by
 * {@linkcode createTransform3D}: {@linkcode Position3D}, {@linkcode Orientation3D},
 * {@linkcode Scale3D}, and {@linkcode GlobalTransform3D}; it then appends
 * {@linkcode Meshed} and {@linkcode BasicMaterialInstance}. The supplied `mesh` and
 * `material` handles are passed directly to those component constructors, so
 * this helper does not clone either handle.
 *
 * After the two handles, arguments are forwarded to {@linkcode createTransform3D}
 * in this order: `x`, `y`, `z`, `ox`, `oy`, `oz`, `sx`, `sy`, `sz`. Position
 * and Euler-angle arguments default to `0`; scale arguments default to `1`.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createBasicMesh3D } from '@wimaengine/render-core'
 *
 * const world = new World()
 * // `mesh` and `material` are existing asset handles.
 * const entity = world.spawn(createBasicMesh3D(mesh, material, 0, 0, -2))
 * ```
 *
 * @param {Handle<Mesh>} [mesh] - Mesh handle passed to {@linkcode Meshed}.
 * @param {Handle<BasicMaterial>} [material] - Basic material handle passed to {@linkcode BasicMaterialInstance}.
 * @param {number} [x=0] - 3D position x-coordinate passed to {@linkcode createTransform3D}.
 * @param {number} [y=0] - 3D position y-coordinate passed to {@linkcode createTransform3D}.
 * @param {number} [z=0] - 3D position z-coordinate passed to {@linkcode createTransform3D}.
 * @param {number} [ox=0] - Euler rotation around the x-axis passed to {@linkcode createTransform3D}.
 * @param {number} [oy=0] - Euler rotation around the y-axis passed to {@linkcode createTransform3D}.
 * @param {number} [oz=0] - Euler rotation around the z-axis passed to {@linkcode createTransform3D}.
 * @param {number} [sx=1] - 3D x-axis scale passed to {@linkcode createTransform3D}.
 * @param {number} [sy=1] - 3D y-axis scale passed to {@linkcode createTransform3D}.
 * @param {number} [sz=1] - 3D z-axis scale passed to {@linkcode createTransform3D}.
 * @returns {[Position3D, Orientation3D, Scale3D, GlobalTransform3D, Meshed, BasicMaterialInstance]} Ordered 3D transform, mesh, and material components.
 */
export function createBasicMesh3D(
  mesh,
  material,
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
    new Meshed(mesh),
    new BasicMaterialInstance(material)
  ]
}
