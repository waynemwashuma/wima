/* eslint-disable jsdoc/check-tag-names */
/**
 * Marks an entity with the 2D soft-body component type.
 *
 * {@linkcode SoftBody2D} is an empty marker component with no instance fields.
 * Use its presence to identify an entity as a 2D soft body; the marker carries
 * no additional state of its own.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { SoftBody2D } from '@wimaengine/narrowphase'
 *
 * const world = new World()
 * const entity = world.spawn([new SoftBody2D()])
 * const marker = world.get(entity, SoftBody2D)
 * console.log(marker instanceof SoftBody2D) // true
 * ```
 */
export class SoftBody2D {

  static default() {
    return new SoftBody2D()
  }

  /**
   * Copies an empty marker into a target component.
   *
   * {@linkcode SoftBody2D} has no instance fields, so `source` is not read. When
   * `target` is omitted, a new marker is created; otherwise the exact target
   * is returned unchanged.
   *
   * @param {SoftBody2D} source - Marker to copy; it has no state to read.
   * @param {SoftBody2D} [target=new SoftBody2D()] - Marker to return unchanged.
   * @returns {SoftBody2D} The supplied target or a new empty marker.
   */
  static copy(source, target = new SoftBody2D()) {
    return target
  }

  /**
   * Creates a new empty marker because there is no state to clone.
   *
   * This delegates to {@linkcode SoftBody2D.copy} without a target, so the
   * supplied marker is not read and the result is always a new instance.
   *
   * @param {SoftBody2D} target - Marker to clone; it has no state to read.
   * @returns {SoftBody2D} A new empty marker.
   */
  static clone(target) {
    return SoftBody2D.copy(target)
  }

  /**
   * Serializes the marker as an empty object.
   *
   * There is no instance state to persist, so `_value` is not read.
   *
   * @param {SoftBody2D} _value - Marker to serialize; it has no state to read.
   * @returns {{}} The marker's empty serialized representation.
   */
  static serialize(_value) {
    return {}
  }

  /**
   * Deserializes an empty marker without reading serialized data.
   *
   * The input is not validated or read. This returns `out` when supplied, or
   * creates and returns a new marker.
   *
   * @param {unknown} _value - Serialized marker data; it is ignored.
   * @param {SoftBody2D} [out=new SoftBody2D()] - Marker to return.
   * @returns {SoftBody2D} The supplied output marker or a new empty marker.
   */
  static deserialize(_value, out = new SoftBody2D()) {
    return out
  }
}

/**
 * Marks an entity with the 3D soft-body component type.
 *
 * {@linkcode SoftBody3D} is an empty marker component with no instance fields.
 * Use its presence to identify an entity as a 3D soft body; the marker carries
 * no additional state of its own.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { SoftBody3D } from '@wimaengine/narrowphase'
 *
 * const world = new World()
 * const entity = world.spawn([new SoftBody3D()])
 * const marker = world.get(entity, SoftBody3D)
 * console.log(marker instanceof SoftBody3D) // true
 * ```
 */
export class SoftBody3D {

  static default() {
    return new SoftBody3D()
  }

  /**
   * Copies an empty marker into a target component.
   *
   * {@linkcode SoftBody3D} has no instance fields, so `source` is not read. When
   * `target` is omitted, a new marker is created; otherwise the exact target
   * is returned unchanged.
   *
   * @param {SoftBody3D} source - Marker to copy; it has no state to read.
   * @param {SoftBody3D} [target=new SoftBody3D()] - Marker to return unchanged.
   * @returns {SoftBody3D} The supplied target or a new empty marker.
   */
  static copy(source, target = new SoftBody3D()) {
    return target
  }

  /**
   * Creates a new empty marker because there is no state to clone.
   *
   * This delegates to {@linkcode SoftBody3D.copy} without a target, so the
   * supplied marker is not read and the result is always a new instance.
   *
   * @param {SoftBody3D} target - Marker to clone; it has no state to read.
   * @returns {SoftBody3D} A new empty marker.
   */
  static clone(target) {
    return SoftBody3D.copy(target)
  }

  /**
   * Serializes the marker as an empty object.
   *
   * There is no instance state to persist, so `_value` is not read.
   *
   * @param {SoftBody3D} _value - Marker to serialize; it has no state to read.
   * @returns {{}} The marker's empty serialized representation.
   */
  static serialize(_value) {
    return {}
  }

  /**
   * Deserializes an empty marker without reading serialized data.
   *
   * The input is not validated or read. This returns `out` when supplied, or
   * creates and returns a new marker.
   *
   * @param {unknown} _value - Serialized marker data; it is ignored.
   * @param {SoftBody3D} [out=new SoftBody3D()] - Marker to return.
   * @returns {SoftBody3D} The supplied output marker or a new empty marker.
   */
  static deserialize(_value, out = new SoftBody3D()) {
    return out
  }
}
/* eslint-enable jsdoc/check-tag-names */
