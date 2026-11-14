/**
 * Provides the numeric labels for scalar data types understood by WebGL.
 *
 * Each member is the corresponding WebGL enum constant. Pass a member to an
 * API that describes a WebGL scalar type, such as {@linkcode MeshAttribute}.
 *
 * @example
 * ```js
 * import { GlDataType, MeshAttribute } from '@wimaengine/render-core'
 *
 * const weights = new MeshAttribute('weights', 9, GlDataType.Float, 1)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const GlDataType = {

  /**
   * WebGL `BYTE` constant (`0x1400`) for signed 8-bit integer data.
   *
   * @type {number}
   */
  Byte: 0x1400,

  /**
   * WebGL `UNSIGNED_BYTE` constant (`0x1401`) for unsigned 8-bit integer data.
   *
   * @type {number}
   */
  UnsignedByte: 0x1401,

  /**
   * WebGL `SHORT` constant (`0x1402`) for signed 16-bit integer data.
   *
   * @type {number}
   */
  Short: 0x1402,

  /**
   * WebGL `UNSIGNED_SHORT` constant (`0x1403`) for unsigned 16-bit integer data.
   *
   * @type {number}
   */
  UnsignedShort: 0x1403,

  /**
   * WebGL `INT` constant (`0x1404`) for signed 32-bit integer data.
   *
   * @type {number}
   */
  Int: 0x1404,

  /**
   * WebGL `UNSIGNED_INT` constant (`0x1405`) for unsigned 32-bit integer data.
   *
   * @type {number}
   */
  UnsignedInt: 0x1405,

  /**
   * WebGL `FLOAT` constant (`0x1406`) for 32-bit floating-point data.
   *
   * @type {number}
   */
  Float: 0x1406
}
