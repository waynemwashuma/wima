/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's human-readable name as an ECS component.
 *
 * A {@linkcode Name} component holds a string value for an entity's name.
 * Constructing it without an argument starts with an empty string, while a
 * supplied string becomes the initial value. Serialization uses the raw
 * string, and {@linkcode Name.validateSerial} can check untrusted serialized
 * data before {@linkcode Name.deserialize} creates or populates a component.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Name } from '@wimaengine/name'
 *
 * const world = new World()
 * world.spawn([new Name('Player')])
 *
 * const names = new Query(world, [Name])
 * names.each(([name]) => {
 *   console.log(name.value) // 'Player'
 *   name.value = 'Hero'
 * })
 * ```
 */
export class Name {

  /**
   * Human-readable label stored on the entity.
   *
   * Assigning this field updates the component immediately. The component does
   * not coerce or validate the assigned value at runtime.
   *
   * @public
   * @type {string}
   */
  value

  /**
   * Creates a name component.
   *
   * With no argument, the component's value is the empty string.
   *
   * @param {string} [name=''] - Initial entity name.
   */
  constructor(name = '') {
    this.value = name
  }

  /**
   * Copies a name into a target component.
   *
   * Only the string value is copied. When `target` is omitted, a new
   * {@linkcode Name} component is created and returned.
   *
   * @param {Name} source - Component whose value should be copied.
   * @param {Name} [target=new Name('')] - Component to populate.
   * @returns {Name} The populated target component.
   */
  static copy(source, target = new Name('')) {
    target.value = source.value

    return target
  }

  /**
   * Creates a new component with the same value as another name.
   *
   * {@linkcode Name.clone} delegates to {@linkcode Name.copy}, so the returned
   * component is a separate {@linkcode Name} instance with a copied primitive
   * string value.
   *
   * @param {Name} target - Component to clone.
   * @returns {Name} A new component containing the same value.
   */
  static clone(target) {
    return Name.copy(target)
  }

  static default() {
    return new Name()
  }

  /**
   * Serializes a name to its raw string value.
   *
   * The result is the string itself, not an object such as `{ value: '...' }`.
   *
   * @param {Name} value - Component to serialize.
   * @returns {NameSerial} The component's value.
   */
  static serialize(value) {
    return value.value
  }

  /**
   * Deserializes a raw string into a name component.
   *
   * If `out` is supplied, its value is replaced and the same component is
   * returned. Without an output component, a new {@linkcode Name} is created.
   * This method assigns directly and does not call {@linkcode Name.validateSerial};
   * validate unknown input before deserializing it.
   *
   * @param {NameSerial} value - Serialized name string.
   * @param {Name} [out=new Name()] - Component to populate.
   * @returns {Name} The populated component.
   */
  static deserialize(value, out = new Name()) {
    out.value = value

    return out
  }

  /**
   * Checks whether a value is a valid serialized name.
   *
   * Validation only checks `typeof value === 'string'`; it does not enforce a
   * non-empty name or any other naming convention.
   *
   * @param {unknown} value - Value to validate.
   * @returns {value is NameSerial} Whether the value is a string.
   */
  static validateSerial(value) {
    return typeof value === 'string'
  }
}

/**
 * Raw string value produced by {@linkcode Name.serialize} for a
 * {@linkcode Name} component.
 *
 * @typedef {string} NameSerial
 */
/* eslint-enable jsdoc/check-tag-names */
