/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the scalar damping value for 2D linear motion.
 *
 * Add {@linkcode Damping2DPlugin} to an app's world to provide this resource.
 * Set `value` to control how strongly matching {@linkcode Velocity2D} values are
 * damped. The damping multiplier is `1 - value`: `0` leaves velocity unchanged
 * and `0.01` retains 99 percent of it. New instances default to `0`, while the
 * plugin-provided resource starts at `0.01`.
 *
 * The resource serializes to an object with one numeric `value` field and can
 * be restored from that form. Serialized data must be a non-null object with a
 * numeric `value`; no damping range is required.
 *
 * Use the resource directly when an app needs to tune linear damping or save
 * and restore its configuration.
 *
 * @example
 * ```js
 * import { Linear2DDamping } from '@wimaengine/damping'
 * import { World } from '@wimaengine/ecs'
 *
 * const world = new World()
 * world.setResource(new Linear2DDamping(0.02))
 *
 * const damping = world.getResource(Linear2DDamping)
 * damping.value = 0.01
 * ```
 *
 * @category resource
 */
export class Linear2DDamping {

  static default() {
    return new Linear2DDamping()
  }

  /**
   * Scalar damping value for matching 2D velocities.
   *
   * The damping multiplier is `1 - value`; for example, `0.01` retains 99
   * percent of the velocity.
   *
   * @type {number}
   */
  value

  /**
   * Creates a 2D linear damping resource.
   *
   * @param {number} [value=0] - Fraction removed from each 2D velocity update.
   */
  constructor(value = 0) {
    this.value = value
  }

  /**
   * Converts a 2D linear damping resource to `{value}`.
   *
   * @param {Linear2DDamping} value
   * @returns {Linear2DDampingSerial}
   */
  static serialize(value) {
    return {
      value: value.value
    }
  }

  /**
   * Restores a 2D linear damping resource from its serialized value.
   *
   * The method copies `value.value` without applying a range check. When
   * `out` is supplied it is mutated and returned; otherwise a new resource is
   * created.
   *
   * @param {Linear2DDampingSerial} value
   * @param {Linear2DDamping} [out=new Linear2DDamping()]
   * @returns {Linear2DDamping}
   */
  static deserialize(value, out = new Linear2DDamping()) {
    out.value = value.value

    return out
  }

  /**
   * Checks whether a value has the serialized 2D damping shape.
   *
   * This guard requires a non-null object with a `value` property whose type
   * is `number`; it does not check whether the number is within a damping
   * range.
   *
   * @param {unknown} value
   * @returns {value is Linear2DDampingSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('value' in value)) {
      return false
    }

    return typeof value.value === 'number'
  }
}

/**
 * Serialized form of `Linear2DDamping`.
 *
 * @typedef Linear2DDampingSerial
 * @property {number} value - Damping fraction stored by the resource.
 */

/**
 * Stores the scalar damping value for 3D linear motion.
 *
 * Add {@linkcode Damping3DPlugin} to an app's world to provide this resource.
 * Set `value` to control how strongly matching {@linkcode Velocity3D} values are
 * damped. The damping multiplier is `1 - value`: `0` leaves velocity unchanged
 * and `0.01` retains 99 percent of it. New instances default to `0`, while the
 * plugin-provided resource starts at `0.01`.
 *
 * The resource serializes to an object with one numeric `value` field and can
 * be restored from that form. Serialized data must be a non-null object with a
 * numeric `value`; no damping range is required.
 *
 * Use the resource directly when an app needs to tune linear damping or save
 * and restore its configuration.
 *
 * @example
 * ```js
 * import { Linear3DDamping } from '@wimaengine/damping'
 * import { World } from '@wimaengine/ecs'
 *
 * const world = new World()
 * world.setResource(new Linear3DDamping(0.02))
 *
 * const damping = world.getResource(Linear3DDamping)
 * damping.value = 0.01
 * ```
 *
 * @category resource
 */
export class Linear3DDamping {

  static default() {
    return new Linear3DDamping()
  }

  /**
   * Scalar damping value for matching 3D velocities.
   *
   * The damping multiplier is `1 - value`; for example, `0.01` retains 99
   * percent of the velocity.
   *
   * @type {number}
   */
  value

  /**
   * Creates a 3D linear damping resource.
   *
   * @param {number} [value=0] - Fraction removed from each 3D velocity update.
   */
  constructor(value = 0) {
    this.value = value
  }

  /**
   * Converts a 3D linear damping resource to `{value}`.
   *
   * @param {Linear3DDamping} value
   * @returns {Linear3DDampingSerial}
   */
  static serialize(value) {
    return {
      value: value.value
    }
  }

  /**
   * Restores a 3D linear damping resource from its serialized value.
   *
   * The method copies `value.value` without applying a range check. When
   * `out` is supplied it is mutated and returned; otherwise a new resource is
   * created.
   *
   * @param {Linear3DDampingSerial} value
   * @param {Linear3DDamping} [out=new Linear3DDamping()]
   * @returns {Linear3DDamping}
   */
  static deserialize(value, out = new Linear3DDamping()) {
    out.value = value.value

    return out
  }

  /**
   * Checks whether a value has the serialized 3D damping shape.
   *
   * This guard requires a non-null object with a `value` property whose type
   * is `number`; it does not check whether the number is within a damping
   * range.
   *
   * @param {unknown} value
   * @returns {value is Linear3DDampingSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('value' in value)) {
      return false
    }

    return typeof value.value === 'number'
  }
}

/**
 * Serialized form of `Linear3DDamping`.
 *
 * @typedef Linear3DDampingSerial
 * @property {number} value - Damping fraction stored by the resource.
 */
