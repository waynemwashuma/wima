/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the collision and mass properties for a physics body component.
 *
 * Attach {@linkcode PhysicsProperties} alongside a {@linkcode Collider2D} to describe how
 * a body participates in collision detection and response. Inverse mass and
 * inverse inertia control linear and angular response.
 * A zero inverse mass makes the body immovable by collision impulses.
 * A zero inverse inertia prevents angular response.
 *
 * `group` and `mask` are BigInt bit fields.
 * Two bodies pass the collision filter only when both intersections are non-zero: `a.group & b.mask` and `b.group & a.mask`.
 * The default values enable all lower 32 filter bits.
 * `sleep` causes a pair to be skipped when both bodies are sleeping. For an
 * accepted contact, the lower restitution and lower kinetic-friction value
 * from the pair is used.
 *
 * A new instance has these defaults:
 *
 * - `invinertia`: `0`
 * - `invmass`: `0`
 * - `mask`: `0xffffffffn`
 * - `group`: `0xffffffffn`
 * - `sleep`: `false`
 * - `restitution`: `0.7`
 * - `kineticFriction`: `0.6`.
 *
 * The component stores the supplied values as-is; it does not clamp material
 * values or validate physical ranges.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Collider2D, PhysicsProperties } from '@wimaengine/narrowphase'
 *
 * const world = new World()
 * const properties = new PhysicsProperties()
 * properties.invmass = 1 / 2
 * properties.group = 0b01n
 * properties.mask = 0b01n
 * properties.restitution = 0.4
 *
 * const body = world.spawn([
 *   Collider2D.rectangle(1, 1),
 *   properties
 * ])
 * ```
 */
export class PhysicsProperties {

  /**
   * Inverse moment of inertia used for angular collision response.
   *
   * @type {number}
   */
  invinertia = 0

  /**
   * Inverse mass used for linear collision response; `0` makes a body
   * immovable by collision impulses.
   *
   * @type {number}
   */
  invmass = 0

  /**
   * Collision-category bits tested against another body's `group`.
   *
   * @type {bigint}
   */
  mask = 0xffffffffn

  /**
   * Collision-category bits tested against another body's `mask`.
   *
   * @type {bigint}
   */
  group = 0xffffffffn

  /**
   * Whether this body is sleeping; two sleeping bodies are skipped as a pair.
   *
   * @type {boolean}
   */
  sleep = false

  /**
   * Bounciness used by collision response; contacts use the lower pair value.
   *
   * @type {number}
   */
  restitution = 0.7

  /**
   * Kinetic friction used by collision response; contacts use the lower pair
   * value.
   *
   * @type {number}
   */
  kineticFriction = 0.6

  /**
   * Copies all seven fields from `source` into `target`.
   *
   * When `target` is omitted, the method creates a new `PhysicsProperties`.
   * Values are assigned as-is, including BigInt filter fields.
   *
   * @param {PhysicsProperties} source - Properties to copy.
   * @param {PhysicsProperties} [target] - Object to update.
   * @returns {PhysicsProperties} The updated target.
   */
  static copy(source, target = new PhysicsProperties()) {
    target.invinertia = source.invinertia
    target.invmass = source.invmass
    target.mask = source.mask
    target.group = source.group
    target.sleep = source.sleep
    target.restitution = source.restitution
    target.kineticFriction = source.kineticFriction

    return target
  }

  /**
   * Creates a new component with the same seven field values as `target`.
   *
   * @param {PhysicsProperties} target - Properties to clone.
   * @returns {PhysicsProperties} A new component containing the copied values.
   */
  static clone(target) {
    return PhysicsProperties.copy(target)
  }

  static default() {
    return new PhysicsProperties()
  }

  /**
   * Converts a component to its plain serialized field object.
   *
   * BigInt `mask` and `group` values remain BigInt values; this method does not
   * convert them to numbers or strings.
   *
   * @param {PhysicsProperties} value - Component to serialize.
   * @returns {PhysicsPropertiesSerial} The seven serialized fields.
   */
  static serialize(value) {
    return {
      invinertia: value.invinertia,
      invmass: value.invmass,
      mask: value.mask,
      group: value.group,
      sleep: value.sleep,
      restitution: value.restitution,
      kineticFriction: value.kineticFriction
    }
  }

  /**
   * Writes serialized fields into a component.
   *
   * The method does not validate `value` before reading it. Call
   * {@linkcode PhysicsProperties.validateSerial} first when input
   * comes from an external source. If `out` is omitted, a new component is
   * created; otherwise the supplied component is updated and returned.
   *
   * @param {PhysicsPropertiesSerial} value - Serialized fields to read.
   * @param {PhysicsProperties} [out] - Component to update.
   * @returns {PhysicsProperties} The updated output component.
   */
  static deserialize(value, out = new PhysicsProperties()) {
    out.invinertia = value.invinertia
    out.invmass = value.invmass
    out.mask = value.mask
    out.group = value.group
    out.sleep = value.sleep
    out.restitution = value.restitution
    out.kineticFriction = value.kineticFriction

    return out
  }

  /**
   * Checks whether a non-null object has all serialized fields with the
   * required primitive types.
   *
   * `invinertia`, `invmass`, `restitution`, and `kineticFriction` must be
   * numbers. `mask` and `group` must be BigInts, and `sleep` must be a
   * boolean. The check does not enforce finite numbers, bit width, sign, or
   * any other physical constraints. It checks field presence with the `in`
   * operator, so inherited fields also satisfy the presence check.
   *
   * @param {unknown} value - Candidate serialized value.
   * @returns {value is PhysicsPropertiesSerial} `true` when all seven fields are present with the required types.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('invinertia' in value) ||
      !('invmass' in value) ||
      !('mask' in value) ||
      !('group' in value) ||
      !('sleep' in value) ||
      !('restitution' in value) ||
      !('kineticFriction' in value)
    ) {
      return false
    }

    return typeof value.invinertia === 'number' &&
      typeof value.invmass === 'number' &&
      typeof value.mask === 'bigint' &&
      typeof value.group === 'bigint' &&
      typeof value.sleep === 'boolean' &&
      typeof value.restitution === 'number' &&
      typeof value.kineticFriction === 'number'
  }
}

/**
 * Plain serialized representation returned by
 * {@linkcode PhysicsProperties.serialize}.
 *
 * @typedef PhysicsPropertiesSerial
 * @property {number} invinertia - Inverse moment of inertia.
 * @property {number} invmass - Inverse mass.
 * @property {bigint} mask - Collision-category bits.
 * @property {bigint} group - Collision-category bits.
 * @property {boolean} sleep - Sleeping state.
 * @property {number} restitution - Restitution coefficient.
 * @property {number} kineticFriction - Kinetic-friction coefficient.
 */
/* eslint-enable jsdoc/check-tag-names */
