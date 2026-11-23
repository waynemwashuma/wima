/** @import { Matrix4 } from '@wimaengine/math' */
/** @import { ProjectionSerial } from '../core' */
/** @import { RenderLists2D, RenderLists3D } from './renderlists' */
import { Affine2, Affine3, Vector2, Vector3 } from '@wimaengine/math'
import { OrthographicProjection, Projection, PerspectiveProjection } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Camera component that maps view-space coordinates into clip space and defines
 * the visible depth range for an entity.
 *
 * Add {@linkcode Camera} to an entity with a transform and either a
 * {@linkcode RenderLists2D} or {@linkcode RenderLists3D} component. The default
 * {@linkcode PerspectiveProjection} uses a field of view of `Math.PI / 2` and an
 * aspect ratio of `1`; choose an {@linkcode OrthographicProjection} for fixed
 * view bounds, as the 2D camera prefab does.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createCamera3D } from '@wimaengine/render-core'
 *
 * const world = new World()
 * const cameraEntity = world.spawn(createCamera3D(0, 0, 5))
 * ```
 */
export class Camera {

  /**
   * Projection used to build this camera's projection matrix.
   *
   * Accepts {@linkcode Projection} values, including the built-in
   * {@linkcode PerspectiveProjection} and {@linkcode OrthographicProjection}
   * implementations.
   *
   * @type {Projection}
   */
  projection

  /**
   * Near clipping distance passed to the active projection's
   * {@linkcode Projection.asProjectionMatrix} method.
   *
   * @type {number}
   */
  near

  /**
   * Far clipping distance passed to the active projection's
   * {@linkcode Projection.asProjectionMatrix} method.
   *
   * @type {number}
   */
  far

  /**
   * Creates a camera configuration with the supplied projection and clipping
   * distances.
   *
   * Defaults to a {@linkcode PerspectiveProjection} with `fov = Math.PI / 2`,
   * `aspect = 1`, `near = 0.1`, and `far = 1000`.
   *
   * @param {Projection} [projection=new PerspectiveProjection()] - Projection used to build the camera matrix.
   * @param {number} [near=0.1] - Near clipping distance.
   * @param {number} [far=1000] - Far clipping distance.
   */
  constructor(projection = new PerspectiveProjection(), near = 0.1, far = 1000) {
    this.projection = projection
    this.near = near
    this.far = far
  }

  /**
   * Projects a 2D position from camera view space into screen-space NDC.
   *
   * Returns `undefined` when this camera uses perspective projection.
   *
   * @param {Vector2} position
   * @returns {Vector2 | undefined}
   */
  viewToScreen2D(position) {
    const { projection } = this

    if (!(projection instanceof OrthographicProjection)) return undefined

    const ndcX = ((position.x - projection.left) / (projection.right - projection.left)) * 2 - 1
    const ndcY = ((position.y - projection.bottom) / (projection.top - projection.bottom)) * 2 - 1

    return new Vector2(ndcX, ndcY)
  }

  /**
   * Projects a 3D position from camera view space into screen-space NDC.
   *
   * The returned vector stores screen-space X and Y in `x` and `y`, with
   * normalized device-coordinate depth in `z`.
   *
   * @param {Vector3} position
   * @returns {Vector3}
   */
  viewToScreen3D(position) {
    const matrix = this.projectionMatrix()
    const clipX = matrix.a * position.x + matrix.e * position.y + matrix.i * position.z + matrix.m
    const clipY = matrix.b * position.x + matrix.f * position.y + matrix.j * position.z + matrix.n
    const clipZ = matrix.c * position.x + matrix.g * position.y + matrix.k * position.z + matrix.o
    const clipW = matrix.d * position.x + matrix.h * position.y + matrix.l * position.z + matrix.p
    const inverseW = 1 / clipW

    return new Vector3(clipX * inverseW, clipY * inverseW, clipZ * inverseW)
  }

  /**
   * Converts screen-space NDC into a 2D position in camera view space.
   *
   * Returns `undefined` when this camera uses perspective projection.
   *
   * @param {Vector2} point
   * @returns {Vector2 | undefined}
   */
  screenToView2D(point) {
    const { projection } = this

    if (!(projection instanceof OrthographicProjection)) return undefined

    return new Vector2(
      projection.left + ((point.x + 1) / 2) * (projection.right - projection.left),
      projection.bottom + ((point.y + 1) / 2) * (projection.top - projection.bottom)
    )
  }

  /**
   * Converts screen-space NDC into a ray in camera view space.
   *
   * Orthographic rays start on the near clipping plane. Perspective rays start
   * at the camera origin.
   *
   * @param {Vector2} point
   * @returns {{origin: Vector3, direction: Vector3} | undefined}
   */
  screenToView3D(point) {
    const { projection } = this

    if (projection instanceof OrthographicProjection) {
      return {
        origin: new Vector3(
          projection.left + ((point.x + 1) / 2) * (projection.right - projection.left),
          projection.bottom + ((point.y + 1) / 2) * (projection.top - projection.bottom),
          -this.near
        ),
        direction: new Vector3(0, 0, -1)
      }
    }

    if (projection instanceof PerspectiveProjection) {
      const scale = Math.tan(projection.fov / 2)

      return {
        origin: new Vector3(),
        direction: new Vector3(point.x * projection.aspect * scale, point.y * scale, -1).normalize()
      }
    }

    return undefined
  }

  /**
   * Projects a world-space 2D position into screen-space NDC.
   *
   * Returns `undefined` when this camera uses perspective projection because a
   * perspective camera does not define a single 2D world plane.
   *
   * @param {Vector2} position
   * @param {Affine2} cameraTransform
   * @returns {Vector2 | undefined}
   */
  worldToScreen2D(position, cameraTransform) {
    const view = Affine2.invert(cameraTransform, new Affine2()).transform(position.clone())

    return this.viewToScreen2D(view)
  }

  /**
   * Projects a world-space 3D position into screen-space NDC.
   *
   * The returned vector stores screen-space X and Y in `x` and `y`, with
   * normalized device-coordinate depth in `z`. The camera transform is inverted
   * with {@linkcode Affine3} before applying the active projection.
   *
   * @param {Vector3} position
   * @param {Affine3} cameraTransform
   * @returns {Vector3}
   */
  worldToScreen3D(position, cameraTransform) {
    const view = Affine3.invert(cameraTransform, new Affine3()).transform(position.clone())

    return this.viewToScreen3D(view)
  }

  /**
   * Converts screen-space NDC into a world-space 2D position.
   *
   * Returns `undefined` when this camera uses perspective projection.
   *
   * @param {Vector2} point
   * @param {Affine2} cameraTransform
   * @returns {Vector2 | undefined}
   */
  screenToWorld2D(point, cameraTransform) {
    const viewPosition = this.screenToView2D(point)

    if (!viewPosition) return undefined

    return cameraTransform.transform(viewPosition)
  }

  /**
   * Converts screen-space NDC into a world-space ray.
   *
   * Orthographic rays start on the near clipping plane. Perspective rays start
   * at the camera position. The returned ray is transformed by the supplied
   * camera affine.
   *
   * @param {Vector2} point
   * @param {Affine3} cameraTransform
   * @returns {{origin: Vector3, direction: Vector3} | undefined}
   */
  screenToWorld3D(point, cameraTransform) {
    const ray = this.screenToView3D(point)

    if (!ray) return undefined

    cameraTransform.transform(ray.origin)
    cameraTransform.transformWithoutTranslation(ray.direction).normalize()

    return ray
  }

  static default() {
    return new Camera()
  }

  /**
   * Copies a camera into a target camera.
   *
   * The near and far distances are copied directly. Built-in
   * {@linkcode PerspectiveProjection} and {@linkcode OrthographicProjection}
   * values are recreated with their current settings, so the copied camera
   * does not share those projection objects with its source. For another
   * {@linkcode Projection} implementation, no projection-specific copy is
   * performed: the default target retains the source projection object, while
   * an explicitly supplied target retains its own projection object.
   *
   * @param {Camera} source
   * @param {Camera} [target]
   * @returns {Camera}
   */
  static copy(source, target = new Camera(source.projection, source.near, source.far)) {
    const { projection } = source

    if (projection instanceof PerspectiveProjection) {
      target.projection = new PerspectiveProjection(projection.fov, projection.aspect)
    } else if (projection instanceof OrthographicProjection) {
      target.projection = new OrthographicProjection(projection.left, projection.right, projection.top, projection.bottom)
    }

    target.near = source.near
    target.far = source.far

    return target
  }

  /**
   * Creates a copied camera with the same clipping distances and projection
   * settings as the supplied camera.
   *
   * This calls {@linkcode Camera.copy} without an explicit target. For the
   * built-in projection classes, the returned camera owns a new projection
   * object. Custom {@linkcode Projection} implementations retain their source
   * projection object.
   *
   * @param {Camera} target
   * @returns {Camera}
   */
  static clone(target) {
    return Camera.copy(target)
  }

  /**
   * Converts a camera to its {@linkcode CameraSerial} representation.
   *
   * {@linkcode OrthographicProjection} values are serialized with the
   * `orthographic` shape. Every other projection is passed to
   * {@linkcode PerspectiveProjection.serialize} and is therefore represented
   * with the `perspective` shape. The returned object contains exactly the
   * nested `projection`, `near`, and `far` fields.
   *
   * @param {Camera} value
   * @returns {CameraSerial}
   */
  static serialize(value) {

    /** @type {ProjectionSerial} */
    // @ts-ignore The projection serializers infer their discriminant as `string`.
    const projection = value.projection instanceof OrthographicProjection ?
      OrthographicProjection.serialize(value.projection) :

    // @ts-ignore
      PerspectiveProjection.serialize(value.projection)

    return {
      projection,
      near: value.near,
      far: value.far
    }
  }

  /**
   * Reconstructs a {@linkcode Camera} from {@linkcode CameraSerial} data.
   *
   * A nested `type` of `perspective` or `orthographic` selects the matching
   * built-in projection deserializer. Any other nested projection type replaces
   * the output projection with a default {@linkcode PerspectiveProjection}. The
   * method expects `value.projection` to exist and copies `near` and `far` as
   * provided; it does not validate or fill in missing clipping values.
   *
   * When `out` is supplied, that camera object is updated and returned, but
   * its projection is replaced with a newly deserialized or fallback
   * projection.
   *
   * @param {CameraSerial} value
   * @param {Camera} [out]
   * @returns {Camera}
   */
  static deserialize(value, out = new Camera()) {
    if (value.projection.type === 'perspective') {
      out.projection = PerspectiveProjection.deserialize(value.projection)
    } else if (value.projection.type === 'orthographic') {
      out.projection = OrthographicProjection.deserialize(value.projection)
    } else {
      out.projection = new PerspectiveProjection()
    }

    out.near = value.near
    out.far = value.far

    return out
  }

  /**
   * Builds a {@linkcode Matrix4} projection matrix for the current clipping
   * distances.
   *
   * This calls {@linkcode Projection.asProjectionMatrix} with the current
   * `near` and `far` values each time, so the result reflects the active
   * projection and clipping distances. The camera does not cache or mutate a
   * matrix.
   *
   * @returns {Matrix4}
   */
  projectionMatrix() {
    return this.projection.asProjectionMatrix(this.near, this.far)
  }
}

/**
 * Serialized form produced by {@linkcode Camera.serialize}.
 *
 * @typedef CameraSerial
 * @property {ProjectionSerial} projection
 * @property {number} near
 * @property {number} far
 */
/* eslint-enable jsdoc/check-tag-names */
