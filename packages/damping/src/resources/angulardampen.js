/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the scalar damping value for 2D angular motion.
 *
 * Register {@linkcode Damping2DPlugin} to add this resource to an app's world.
 * Set `value` to control how strongly matching {@linkcode Rotation2D} values are
 * damped. New instances default to `0`, while the plugin-provided resource
 * starts at `0.01`.
 *
 * The damping multiplier is `1 - value`: `0` leaves a matching rotation
 * unchanged, and `0.01` retains 99 percent of it. The resource serializes to
 * an object with one numeric `value` field and can be restored from that form.
 * Serialized data must be a non-null object with a numeric `value`; no damping
 * range or finiteness check is required.
 *
 * @example
 * ```js
 * import { Angular2DDamping } from '@wimaengine/damping'
 *
 * const damping = new Angular2DDamping(0.02)
 * const serial = Angular2DDamping.serialize(damping)
 * const restored = Angular2DDamping.deserialize(serial)
 * console.log(restored.value) // 0.02
 * // Damping2DPlugin installs its own resource with a default value of 0.01.
 * ```
 *
 * @category resource
 */
export class Angular2DDamping {

  static default() {
    return new Angular2DDamping()
  }

  /**
   * Scalar damping value for matching 2D rotations.
   *
   * The damping multiplier is `1 - value`; `0` leaves a matching rotation
   * unchanged and `0.01` retains 99 percent of it.
   *
   * @type {number}
   */
  value

  /**
   * Creates a 2D angular damping resource.
   *
   * @param {number} [value=0] - Fraction removed from each matching 2D rotation.
   */
  constructor(value = 0) {
    this.value = value
  }

  /**
   * Converts a 2D angular damping resource to `{value}`.
   *
   * @param {Angular2DDamping} value
   * @returns {Angular2DDampingSerial}
   */
  static serialize(value) {
    return {
      value: value.value
    }
  }

  /**
   * Restores a 2D angular damping resource from its serialized value.
   *
   * The method copies `value.value` without applying a range or finiteness
   * check. When `out` is supplied, it updates and returns that instance;
   * otherwise it creates a new resource.
   *
   * @param {Angular2DDampingSerial} value
   * @param {Angular2DDamping} [out=new Angular2DDamping()]
   * @returns {Angular2DDamping}
   */
  static deserialize(value, out = new Angular2DDamping()) {
    out.value = value.value

    return out
  }

  /**
   * Checks whether a value has the serialized 2D damping shape.
   *
   * This guard requires a non-null object with a `value` property whose type
   * is `number`; it does not check whether the number is within a damping
   * range or finite.
   *
   * @param {unknown} value
   * @returns {value is Angular2DDampingSerial}
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
 * Serialized form of `Angular2DDamping`.
 *
 * @typedef Angular2DDampingSerial
 * @property {number} value - Serialized damping amount.
 */
/**
 * Stores the scalar damping value for 3D angular motion.
 *
 * Register {@linkcode Damping3DPlugin} to add this resource to an app's world.
 * Set `value` to control how strongly matching {@linkcode Rotation3D} values are
 * damped. New instances default to `0`, while the plugin-provided resource
 * starts at `0.01`.
 *
 * The damping multiplier is `1 - value`: `0` leaves a matching rotation
 * unchanged, and `0.01` retains 99 percent of each rotation coordinate. The
 * resource serializes to an object with one numeric `value` field and can be
 * restored from that form. Serialized data must be a non-null object with a
 * numeric `value`; no damping range or finiteness check is required.
 *
 * @example
 * ```js
 * import { Angular3DDamping } from '@wimaengine/damping'
 *
 * const damping = new Angular3DDamping(0.02)
 * const serial = Angular3DDamping.serialize(damping)
 * const restored = Angular3DDamping.deserialize(serial)
 * console.log(restored.value) // 0.02
 * // Damping3DPlugin installs its own resource with a default value of 0.01.
 * ```
 *
 * @category resource
 */
export class Angular3DDamping {

  /**
   * Scalar damping value for matching 3D rotations.
   *
   * The damping multiplier is `1 - value`; `0` leaves each matching rotation
   * coordinate unchanged and `0.01` retains 99 percent of it.
   *
   * @type {number}
   */
  value

  /**
   * Creates a 3D angular damping resource.
   *
   * @param {number} [value=0] - Fraction removed from each matching 3D rotation.
   */
  constructor(value = 0) {
    this.value = value
  }

  /**
   * Converts a 3D angular damping resource to `{value}`.
   *
   * @param {Angular3DDamping} value
   * @returns {Angular3DDampingSerial}
   */
  static serialize(value) {
    return {
      value: value.value
    }
  }

  /**
   * Restores a 3D angular damping resource from its serialized value.
   *
   * The method copies `value.value` without applying a range or finiteness
   * check. When `out` is supplied, it updates and returns that instance;
   * otherwise it creates a new resource.
   *
   * @param {Angular3DDampingSerial} value
   * @param {Angular3DDamping} [out=new Angular3DDamping()]
   * @returns {Angular3DDamping}
   */
  static deserialize(value, out = new Angular3DDamping()) {
    out.value = value.value

    return out
  }

  /**
   * Checks whether a value has the serialized 3D damping shape.
   *
   * This guard requires a non-null object with a `value` property whose type
   * is `number`; it does not check whether the number is within a damping
   * range or finite.
   *
   * @param {unknown} value
   * @returns {value is Angular3DDampingSerial}
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
 * Serialized form of `Angular3DDamping`.
 *
 * @typedef Angular3DDampingSerial
 * @property {number} value - Serialized damping amount.
 */
/* eslint-enable jsdoc/check-tag-names */
