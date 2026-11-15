import { Matrix4 } from '@wimaengine/math'

/**
 * Defines the polymorphic projection value contract used by {@linkcode Camera}.
 *
 * Use {@linkcode PerspectiveProjection} or {@linkcode OrthographicProjection} for
 * the built-in projection values; their type values are represented by
 * {@linkcode ProjectionType}.
 *
 * @example
 * ```js
 * import { Camera, OrthographicProjection } from '@wimaengine/render-core'
 *
 * const camera = new Camera(new OrthographicProjection(-1, 1, 1, -1))
 * const matrix = camera.projectionMatrix()
 * ```
 */
export class Projection {

  /**
   * Returns the base projection matrix.
   *
   * The base implementation ignores both clipping distances and returns a new
   * identity {@linkcode Matrix4}. The {@linkcode Camera} calls this method
   * polymorphically; concrete projection values provide their own transforms.
   *
   * @param {number} _near - Near clipping distance, ignored by the base implementation.
   * @param {number} _far - Far clipping distance, ignored by the base implementation.
   * @returns {Matrix4} A new identity matrix.
   */
  asProjectionMatrix(_near, _far) {
    return new Matrix4()
  }

  /**
   * Reports whether this base projection is perspective.
   *
   * The base implementation always returns `false`. A
   * {@linkcode PerspectiveProjection} overrides this predicate for perspective
   * values, while {@linkcode OrthographicProjection} leaves it false.
   *
   * @returns {boolean} Always `false` for a base projection.
   */
  isPerspective() {
    return false
  }

  /**
   * Reports whether this base projection is orthographic.
   *
   * The base implementation always returns `false`. An
   * {@linkcode OrthographicProjection} overrides this predicate for orthographic
   * values, while {@linkcode PerspectiveProjection} leaves it false.
   *
   * @returns {boolean} Always `false` for a base projection.
   */
  isOrthographic() {
    return false
  }

  /**
   * Serializes the base projection value.
   *
   * The base implementation ignores `_value` and returns a new empty object.
   * It does not select a {@linkcode ProjectionType} or persist concrete settings;
   * {@linkcode Camera.serialize} uses the built-in projection serializers for
   * camera data.
   *
   * @param {unknown} _value - Value ignored by the base serializer.
   * @returns {object} Empty serialized representation.
   */
  static serialize(_value) {
    return {}
  }

  /**
   * Deserializes the base projection value.
   *
   * The base implementation ignores `_value` and returns the supplied `out`
   * object unchanged, or a new {@linkcode Projection} when `out` is omitted. It
   * does not select a concrete projection; {@linkcode Camera.deserialize} chooses
   * the built-in projection from its serialized discriminator.
   *
   * @param {unknown} _value - Serialized value ignored by the base deserializer.
   * @param {Projection} [out] - Projection object to return, defaulting to a new base value.
   * @returns {Projection} The supplied output object or a new base projection.
   */
  static deserialize(_value, out = new Projection()) {
    return out
  }
}

/**
 * Represents the perspective variant of the {@linkcode Projection} contract used
 * by {@linkcode Camera}.
 *
 * This class identifies its variant with {@linkcode ProjectionType.Perspective}.
 *
 * @example
 * ```js
 * import { Camera, PerspectiveProjection } from '@wimaengine/render-core'
 *
 * const camera = new Camera(new PerspectiveProjection(Math.PI / 3, 16 / 9))
 * const matrix = camera.projectionMatrix()
 * ```
 *
 * @augments {Projection}
 */
export class PerspectiveProjection extends Projection {

  /**
   * Numeric projection discriminator for this value.
   *
   * @readonly
   * @type {ProjectionType}
   */
  type = ProjectionType.Perspective

  /**
   * Full vertical field-of-view angle used by the perspective frustum.
   *
   * The value is interpreted in radians by
   * {@linkcode Projection.asProjectionMatrix}.
   *
   * @type {number}
   */
  fov

  /**
   * Width-to-height aspect ratio used to size the near-plane frustum.
   *
   * @type {number}
   */
  aspect

  /**
   * Creates a perspective projection value.
   *
   * The constructor stores `fov` and `aspect` as supplied. It does not
   * validate, clamp, or normalize either value.
   *
   * @param {number} [fov=Math.PI / 2] - Full vertical field-of-view angle in radians.
   * @param {number} [aspect=1] - Width-to-height aspect ratio.
   */
  constructor(fov = Math.PI / 2, aspect = 1) {
    super()
    this.fov = fov
    this.aspect = aspect
  }

  /**
   * Reports that this projection uses perspective mapping.
   *
   * @returns {boolean} Always `true` for a perspective projection.
   */
  isPerspective() {
    return true
  }

  /**
   * Builds a perspective matrix from this projection and clipping distances.
   *
   * The near-plane bounds are computed as `top = near * Math.tan(0.5 * fov)`,
   * `height = 2 * top`, `width = aspect * height`, and
   * `left = -0.5 * width`. The method then calls
   * {@linkcode PerspectiveProjection.from} with
   * `(left, left + width, top, top - height, near, far)` and returns its new
   * matrix. This projection object is not mutated.
   *
   * @param {number} near - Near clipping distance used to size the frustum.
   * @param {number} far - Far clipping distance used by the depth terms.
   * @returns {Matrix4} A new perspective projection matrix.
   */
  asProjectionMatrix(near, far) {
    const top = near * Math.tan(0.5 * this.fov)
    const height = 2 * top
    const width = this.aspect * height
    const left = -0.5 * width

    return PerspectiveProjection.from(left, left + width, top, top - height, near, far)
  }

  /**
   * Builds a perspective frustum matrix from explicit bounds and clipping distances.
   *
   * The scale and offset terms are computed as follows:
   * `x = 2 * near / (right - left)`,
   * `y = 2 * near / (top - bottom)`,
   * `a = (right + left) / (right - left)`,
   * `b = (top + bottom) / (top - bottom)`,
   * `c = -(far + near) / (far - near)`, and
   * `d = -2 * far * near / (far - near)`.
   * The method overwrites all entries of `out` with those terms and the
   * perspective constants, then returns `out`. It performs no bounds or
   * clipping-distance validation.
   *
   * @param {number} left - Left frustum bound at the near plane.
   * @param {number} right - Right frustum bound at the near plane.
   * @param {number} top - Top frustum bound at the near plane.
   * @param {number} bottom - Bottom frustum bound at the near plane.
   * @param {number} near - Near clipping distance.
   * @param {number} far - Far clipping distance.
   * @param {Matrix4} [out] - Matrix to overwrite; defaults to a new matrix.
   * @returns {Matrix4} The newly created or supplied matrix.
   */
  static from(left, right, top, bottom, near, far, out = new Matrix4()) {
    const x = 2 * near / (right - left)
    const y = 2 * near / (top - bottom)

    const a = (right + left) / (right - left)
    const b = (top + bottom) / (top - bottom)

    const c = -(far + near) / (far - near)
    const d = (-2 * far * near) / (far - near)

    out.a = x
    out.b = 0
    out.c = 0
    out.d = 0
    out.e = 0
    out.f = y
    out.g = 0
    out.h = 0
    out.i = a
    out.j = b
    out.k = c
    out.l = -1
    out.m = 0
    out.n = 0
    out.o = d
    out.p = 0

    return out
  }

  /**
   * Serializes a perspective projection's discriminator and settings.
   *
   * The returned object always has `type: 'perspective'` and copies `fov` and
   * `aspect` from `value` without validating them.
   *
   * @param {PerspectiveProjection} value - Projection value to serialize.
   * @returns {PerspectiveProjectionSerial} Serialized perspective settings.
   */
  static serialize(value) {
    return {
      type: 'perspective',
      fov: value.fov,
      aspect: value.aspect
    }
  }

  /**
   * Deserializes perspective settings into a projection value.
   *
   * The method copies `value.fov` and `value.aspect` directly. It does not
   * validate the input or copy its `type` field. Without `out`, it creates a
   * new {@linkcode PerspectiveProjection}; with `out`, it updates and returns that
   * same object.
   *
   * @param {PerspectiveProjectionSerial} value - Serialized perspective settings.
   * @param {PerspectiveProjection} [out] - Projection value to update.
   * @returns {PerspectiveProjection} The new or supplied projection value.
   */
  static deserialize(value, out = new PerspectiveProjection()) {
    out.fov = value.fov
    out.aspect = value.aspect

    return out
  }

  /**
   * Checks whether a value has the serialized perspective shape.
   *
   * The value must be a non-null object containing `type`, `fov`, and
   * `aspect`, with `type === 'perspective'` and both settings having the
   * `number` JavaScript type. Extra properties are allowed; numeric values are
   * not required to be finite or within a projection-specific range.
   *
   * @param {unknown} value - Value to check.
   * @returns {value is PerspectiveProjectionSerial} `true` when the required serialized fields match.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('type' in value) || !('fov' in value) || !('aspect' in value)) {
      return false
    }

    return value.type === 'perspective' &&
      typeof value.fov === 'number' &&
      typeof value.aspect === 'number'
  }
}

/**
 * Represents the orthographic variant of the {@linkcode Projection} contract used
 * by {@linkcode Camera}.
 *
 * This class identifies its variant with
 * {@linkcode ProjectionType.Orthographic}.
 *
 * @example
 * ```js
 * import { Camera, OrthographicProjection } from '@wimaengine/render-core'
 *
 * const camera = new Camera(new OrthographicProjection(-4, 4, 3, -3))
 * const matrix = camera.projectionMatrix()
 * ```
 *
 * @augments {Projection}
 */
export class OrthographicProjection extends Projection {

  /**
   * Numeric projection discriminator for this value.
   *
   * @readonly
   * @type {ProjectionType}
   */
  type = ProjectionType.Orthographic

  /**
   * Creates an orthographic projection value from rectangular view bounds.
   *
   * The constructor stores the four bounds as supplied. It does not validate,
   * clamp, normalize, or reorder them. Defaults are `left = -1`, `right = 1`,
   * `top = 1`, and `bottom = -1`.
   *
   * @param {number} [left=-1] - Left view bound.
   * @param {number} [right=1] - Right view bound.
   * @param {number} [top=1] - Top view bound.
   * @param {number} [bottom=-1] - Bottom view bound.
   */
  constructor(left = -1, right = 1, top = 1, bottom = -1) {
    super()
    this.left = left
    this.right = right
    this.top = top
    this.bottom = bottom
  }

  /**
   * Reports that this projection uses orthographic mapping.
   *
   * @returns {boolean} Always `true` for an orthographic projection.
   */
  isOrthographic() {
    return true
  }

  /**
   * Builds an orthographic matrix from the stored bounds and clipping distances.
   *
   * This method delegates to {@linkcode OrthographicProjection.from} with
   * `(left, right, top, bottom, near, far)` from this value and returns the
   * new matrix created by that call. It does not mutate the projection.
   *
   * @param {number} near - Near clipping distance.
   * @param {number} far - Far clipping distance.
   * @returns {Matrix4} A new orthographic projection matrix.
   */
  asProjectionMatrix(near, far) {
    return OrthographicProjection.from(this.left, this.right, this.top, this.bottom, near, far)
  }

  /**
   * Builds an orthographic matrix from explicit bounds and clipping distances.
   *
   * The method computes `w = 1 / (right - left)`,
   * `h = 1 / (top - bottom)`, and `p = 1 / (far - near)`. It then computes
   * `x = (right + left) * w`, `y = (top + bottom) * h`,
   * `z = (far + near) * p`, and `zInv = -2 * p`, and writes the resulting
   * scale, translation, and depth terms into `out`. The supplied matrix is
   * overwritten and returned; when omitted, a new {@linkcode Matrix4} is used.
   * No bounds or clipping-distance validation is performed.
   *
   * @param {number} left - Left view bound.
   * @param {number} right - Right view bound.
   * @param {number} top - Top view bound.
   * @param {number} bottom - Bottom view bound.
   * @param {number} near - Near clipping distance.
   * @param {number} far - Far clipping distance.
   * @param {Matrix4} [out] - Matrix to overwrite; defaults to a new matrix.
   * @returns {Matrix4} The newly created or supplied matrix.
   */
  static from(left, right, top, bottom, near, far, out = new Matrix4()) {

    const w = 1.0 / (right - left)
    const h = 1.0 / (top - bottom)
    const p = 1.0 / (far - near)

    const x = (right + left) * w
    const y = (top + bottom) * h

    const z = (far + near) * p
    const zInv = -2 * p

    out.a = 2 * w
    out.b = 0
    out.c = 0
    out.d = 0

    out.e = 0
    out.f = 2 * h
    out.g = 0
    out.h = 0

    out.i = 0
    out.j = 0
    out.k = zInv
    out.l = 0

    out.m = -x
    out.n = -y
    out.o = -z
    out.p = 1

    return out
  }

  /**
   * Serializes an orthographic projection's discriminator and bounds.
   *
   * The returned object always has `type: 'orthographic'` and copies `left`,
   * `right`, `top`, and `bottom` from `value` without validating them.
   *
   * @param {OrthographicProjection} value - Projection value to serialize.
   * @returns {OrthographicProjectionSerial} Serialized orthographic settings.
   */
  static serialize(value) {
    return {
      type: 'orthographic',
      left: value.left,
      right: value.right,
      top: value.top,
      bottom: value.bottom
    }
  }

  /**
   * Deserializes orthographic bounds into a projection value.
   *
   * The method copies `value.left`, `value.right`, `value.top`, and
   * `value.bottom` directly. It does not validate the input or copy its `type`
   * field. Without `out`, it creates a new {@linkcode OrthographicProjection}; with
   * `out`, it updates and returns that same object.
   *
   * @param {OrthographicProjectionSerial} value - Serialized orthographic settings.
   * @param {OrthographicProjection} [out] - Projection value to update.
   * @returns {OrthographicProjection} The new or supplied projection value.
   */
  static deserialize(value, out = new OrthographicProjection()) {
    out.left = value.left
    out.right = value.right
    out.top = value.top
    out.bottom = value.bottom

    return out
  }

  /**
   * Checks whether a value has the serialized orthographic shape.
   *
   * The value must be a non-null object containing `type`, `left`, `right`,
   * `top`, and `bottom`, with `type === 'orthographic'` and all four bounds
   * having the `number` JavaScript type. Extra properties are allowed; numeric
   * values are not required to be finite or ordered.
   *
   * @param {unknown} value - Value to check.
   * @returns {value is OrthographicProjectionSerial} `true` when the required serialized fields match.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('type' in value) || !('left' in value) || !('right' in value) || !('top' in value) || !('bottom' in value)) {
      return false
    }

    return value.type === 'orthographic' &&
      typeof value.left === 'number' &&
      typeof value.right === 'number' &&
      typeof value.top === 'number' &&
      typeof value.bottom === 'number'
  }
}

/**
 * @typedef PerspectiveProjectionSerial
 * @property {'perspective'} type
 * @property {number} fov
 * @property {number} aspect
 */

/**
 * @typedef OrthographicProjectionSerial
 * @property {'orthographic'} type
 * @property {number} left
 * @property {number} right
 * @property {number} top
 * @property {number} bottom
 */

/**
 * Identifies the built-in projection variant stored in a projection's `type`
 * field.
 *
 * Compare a projection's `type` field with these values when code needs to
 * distinguish {@linkcode PerspectiveProjection} from
 * {@linkcode OrthographicProjection}.
 *
 * @example
 * ```js
 * import { PerspectiveProjection, ProjectionType } from '@wimaengine/render-core'
 *
 * const projection = new PerspectiveProjection()
 * const isPerspective = projection.type === ProjectionType.Perspective
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const ProjectionType = {

  /** Identifies a {@linkcode PerspectiveProjection} value. */
  Perspective: 0,

  /** Identifies an {@linkcode OrthographicProjection} value. */
  Orthographic: 1
}

/**
 * @typedef {PerspectiveProjectionSerial | OrthographicProjectionSerial} ProjectionSerial
 */
