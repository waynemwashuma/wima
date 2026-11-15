/**
 * Selects a WebGL texture format or sized internal format.
 *
 * Use the channel formats with texture upload calls and the sized formats as
 * internal storage formats. Floating-point, integer, and sized formats may
 * require a WebGL 2 context or the corresponding extension.
 *
 * @example
 * ```js
 * import { TextureFormat } from '@wimaengine/render-webgl'
 *
 * gl.texImage2D(
 *   gl.TEXTURE_2D,
 *   0,
 *   TextureFormat.RGBA8,
 *   width,
 *   height,
 *   0,
 *   TextureFormat.RGBA,
 *   gl.UNSIGNED_BYTE,
 *   pixels
 * )
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const TextureFormat = {

  /** Depth-component texture format (`0x1902`, `DEPTH_COMPONENT`). */
  Depth: 0x1902,

  /** Single red-channel texture format (`0x1903`, `RED`). */
  Red: 0x1903,

  /** Alpha-channel texture format (`0x1906`, `ALPHA`). */
  Alpha: 0x1906,

  /** Three-channel RGB texture format (`0x1907`, `RGB`). */
  RGB: 0x1907,

  /** Four-channel RGBA texture format (`0x1908`, `RGBA`). */
  RGBA: 0x1908,

  /** Luminance texture format (`0x1909`, `LUMINANCE`). */
  Luminance: 0x1909,

  /** Luminance-plus-alpha texture format (`0x190A`, `LUMINANCE_ALPHA`). */
  LuminanceAlpha: 0x190A,

  /** Eight-bit normalized RGB internal format (`0x8051`, `RGB8`). */
  RGB8: 0x8051,

  /** Eight-bit normalized RGBA internal format (`0x8058`, `RGBA8`). */
  RGBA8: 0x8058,

  /** Sixteen-bit floating-point RGBA internal format (`0x881A`, `RGBA16F`). */
  RGBA16F: 0x881A,

  /** Sixteen-bit floating-point RGB internal format (`0x881B`, `RGB16F`). */
  RGB16F: 0x881B,

  /** Thirty-two-bit floating-point RGBA internal format (`0x8814`, `RGBA32F`). */
  RGBA32F: 0x8814,

  /** Thirty-two-bit floating-point RGB internal format (`0x8815`, `RGB32F`). */
  RGB32F: 0x8815,

  /** Thirty-two-bit signed-integer RGBA internal format (`0x8D82`, `RGBA32I`). */
  RGBA32I: 0x8D82,

  /** Thirty-two-bit signed-integer RGB internal format (`0x8D83`, `RGB32I`). */
  RGB32I: 0x8D83,

  /** Sixteen-bit signed-integer RGBA internal format (`0x8D88`, `RGBA16I`). */
  RGBA16I: 0x8D88,

  /** Sixteen-bit signed-integer RGB internal format (`0x8D89`, `RGB16I`). */
  RGB16I: 0x8D89,

  /** Eight-bit signed-integer RGBA internal format (`0x8D8E`, `RGBA8I`). */
  RGBA8I: 0x8D8E,

  /** Eight-bit signed-integer RGB internal format (`0x8D8F`, `RGB8I`). */
  RGB8I: 0x8D8F
}

/**
 * Selects how WebGL samples a texture between texels and mip levels.
 *
 * Pass a member to {@linkcode WebGLRenderingContext#texParameteri}
 * with `TEXTURE_MIN_FILTER` or `TEXTURE_MAG_FILTER`. The four mipmap members
 * are minification filters; use `Nearest` or `Linear` for magnification.
 *
 * @example
 * ```js
 * import { TextureFilter } from '@wimaengine/render-webgl'
 *
 * gl.texParameteri(
 *   gl.TEXTURE_2D,
 *   gl.TEXTURE_MIN_FILTER,
 *   TextureFilter.LINEAR_MIPMAP_LINEAR
 * )
 * gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, TextureFilter.Linear)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const TextureFilter = {

  /** Selects the nearest texel without mipmaps (`0x2600`, `NEAREST`). */
  Nearest: 0x2600,

  /** Interpolates neighboring texels without mipmaps (`0x2601`, `LINEAR`). */
  Linear: 0x2601,

  /** Uses the nearest texel from the nearest mip level (`0x2700`, `NEAREST_MIPMAP_NEAREST`). */
  NEAREST_MIPMAP_NEAREST: 0x2700,

  /** Interpolates texels in the nearest mip level (`0x2701`, `LINEAR_MIPMAP_NEAREST`). */
  LINEAR_MIPMAP_NEAREST: 0x2701,

  /** Uses nearest-texel sampling while blending the two nearest mip levels (`0x2702`, `NEAREST_MIPMAP_LINEAR`). */
  NEAREST_MIPMAP_LINEAR: 0x2702,

  /** Interpolates texels and blends the two nearest mip levels (`0x2703`, `LINEAR_MIPMAP_LINEAR`). */
  LINEAR_MIPMAP_LINEAR: 0x2703
}

/**
 * Selects how texture coordinates outside the normalized range are handled.
 *
 * Pass a member to {@linkcode WebGLRenderingContext#texParameteri}
 * for the `TEXTURE_WRAP_S` or `TEXTURE_WRAP_T` parameter.
 *
 * @example
 * ```js
 * import { TextureWrap } from '@wimaengine/render-webgl'
 *
 * gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, TextureWrap.Repeat)
 * gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, TextureWrap.Clamp)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const TextureWrap = {

  /** Repeats the texture across the coordinate range (`0x2901`, `REPEAT`). */
  Repeat: 0x2901,

  /** Clamps coordinates to the texture edge (`0x812F`, `CLAMP_TO_EDGE`). */
  Clamp: 0x812F,

  /** Mirrors the texture on alternating repeats (`0x8370`, `MIRRORED_REPEAT`). */
  MirrorRepeat: 0x8370
}
