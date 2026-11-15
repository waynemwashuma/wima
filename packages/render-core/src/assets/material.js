
/**
 * Defines the base asset type for render material values.
 *
 * Extend this class when defining a concrete material asset for a renderer.
 * The base value supplies neutral defaults and an empty serialized form, so a
 * subclass can add the state and behavior its renderer needs.
 *
 * @example
 * ```js
 * class CustomMaterial extends Material {
 *   vertex() { return 'vertex shader source' }
 *   fragment() { return 'fragment shader source' }
 * }
 *
 * const material = new CustomMaterial()
 * ```
 */
export class Material {

  /**
   * Returns the vertex-stage shader source for this material.
   *
   * The base implementation returns an empty string. Concrete material
   * classes can override this method with their vertex source.
   *
   * @returns {string} Empty source from the base implementation.
   */
  vertex() {
    return ''
  }

  /**
   * Returns the fragment-stage shader source for this material.
   *
   * The base implementation returns an empty string. Concrete material
   * classes can override this method with their fragment source.
   *
   * @returns {string} Empty source from the base implementation.
   */
  fragment() {
    return ''
  }

  /**
   * Creates the base material's default asset value.
   *
   * The base implementation returns a new {@linkcode Material}. Concrete
   * material classes should override this method when their default asset
   * needs subtype-specific state.
   *
   * @returns {Material} A new base material.
   */
  static default() {
    return new Material()
  }

  /**
   * Converts a material to the base class's serialized representation.
   *
   * The base implementation ignores `_value` and returns a new empty object;
   * it does not mutate the material. Concrete material classes can override
   * this method with fields for their own asset data.
   *
   * @param {Material} _value - Material value to serialize.
   * @returns {object} An empty serialized representation.
   */
  static serialize(_value) {
    return {}
  }

  /**
   * Restores a material from the base class's serialized representation.
   *
   * The base implementation ignores `_value`. When `out` is provided, it
   * returns that same object without changing it; otherwise it returns a new
   * {@linkcode Material}. Concrete material classes can override this method to
   * populate their own fields.
   *
   * @param {unknown} _value - Serialized material value, ignored by the base implementation.
   * @param {Material} [out] - Existing material to return unchanged.
   * @returns {Material} `out`, or a new base material when `out` is omitted.
   */
  static deserialize(_value, out = new Material()) {
    return out
  }
}

export {}
