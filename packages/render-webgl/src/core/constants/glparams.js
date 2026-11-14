/**
 * Identifies the GLSL type reported for an active uniform.
 *
 * Compare the `type` returned by
 * {@linkcode WebGLRenderingContext#getActiveUniform} with a
 * member when inspecting uniform metadata. The entries cover vector,
 * boolean, matrix, sampler, and non-square matrix types.
 *
 * @example
 * ```js
 * import { GlUniformType } from '@wimaengine/render-webgl'
 *
 * const uniform = gl.getActiveUniform(program, 0)
 * if (uniform?.type === GlUniformType.Matrix4) {
 *   console.log('upload a 4x4 matrix')
 * }
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const GlUniformType = {

  /** Two-component floating-point vector (`0x8B50`, `FLOAT_VEC2`). */
  Vec2:0x8B50,

  /** Three-component floating-point vector (`0x8B51`, `FLOAT_VEC3`). */
  Vec3:0x8B51,

  /** Four-component floating-point vector (`0x8B52`, `FLOAT_VEC4`). */
  Vec4:0x8B52,

  /** Two-component signed-integer vector (`0x8B53`, `INT_VEC2`). */
  Ivec2:0x8B53,

  /** Three-component signed-integer vector (`0x8B54`, `INT_VEC3`). */
  Ivec3:0x8B54,

  /** Four-component signed-integer vector (`0x8B55`, `INT_VEC4`). */
  Ivec4:0x8B55,

  /** Scalar boolean uniform (`0x8B56`, `BOOL`). */
  Bool:0x8B56,

  /** Two-component boolean vector (`0x8B57`, `BOOL_VEC2`). */
  Bvec2:0x8B57,

  /** Three-component boolean vector (`0x8B58`, `BOOL_VEC3`). */
  Bvec3:0x8B58,

  /** Four-component boolean vector (`0x8B59`, `BOOL_VEC4`). */
  Bvec4:0x8B59,

  /** Two-by-two floating-point matrix (`0x8B5A`, `FLOAT_MAT2`). */
  Matrix2:0x8B5A,

  /** Three-by-three floating-point matrix (`0x8B5B`, `FLOAT_MAT3`). */
  Matrix3:0x8B5B,

  /** Four-by-four floating-point matrix (`0x8B5C`, `FLOAT_MAT4`). */
  Matrix4:0x8B5C,

  /** Two-dimensional sampler uniform (`0x8B5E`, `SAMPLER_2D`). */
  Sampler:0x8B5E,

  /** Cube-map sampler uniform (`0x8B60`, `SAMPLER_CUBE`). */
  SamplerCube:0x8B60,

  /** Two-column by three-row floating-point matrix (`0x8B65`, `FLOAT_MAT2x3`). */
  Matrix2x3: 0x8B65,

  /** Two-column by four-row floating-point matrix (`0x8B66`, `FLOAT_MAT2x4`). */
  Matrix2x4: 0x8B66,

  /** Three-column by two-row floating-point matrix (`0x8B67`, `FLOAT_MAT3x2`). */
  Matrix3x2: 0x8B67,

  /** Three-column by four-row floating-point matrix (`0x8B68`, `FLOAT_MAT3x4`). */
  Matrix3x4: 0x8B68,

  /** Four-column by two-row floating-point matrix (`0x8B69`, `FLOAT_MAT4x2`). */
  Matrix4x2: 0x8B69,

  /** Four-column by three-row floating-point matrix (`0x8B6A`, `FLOAT_MAT4x3`). */
  Matrix4x3: 0x8B6A
}

/**
 * Provides the bit mask used by {@linkcode WebGLRenderingContext#clear}.
 *
 * Combine members with bitwise OR to clear more than one framebuffer value in
 * the same call.
 *
 * @example
 * ```js
 * import { ClearBit } from '@wimaengine/render-webgl'
 *
 * gl.clear(ClearBit.Color | ClearBit.Depth)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const ClearBit = {

  /** Clears the depth buffer (`0x00000100`). */
  Depth: 0x00000100,

  /** Clears the stencil buffer (`0x00000400`). */
  Stencil: 0x00000400,

  /** Clears the color buffer (`0x00004000`). */
  Color: 0x00004000
}

/**
 * Describes the error codes returned by {@linkcode WebGLRenderingContext#getError}.
 *
 * Read the returned number and compare it with a member to identify the
 * WebGL error condition.
 *
 * @example
 * ```js
 * import { GLError } from '@wimaengine/render-webgl'
 *
 * if (gl.getError() !== GLError.None) {
 *   console.warn('WebGL reported an error')
 * }
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const GLError = {

  /** Indicates that no WebGL error is pending (`0x0000`, `NO_ERROR`). */
  None: 0,

  /** Indicates that an unsupported enum value was supplied (`0x0500`, `INVALID_ENUM`). */
  InvalidEnum: 0x0500,

  /** Indicates that an argument value was outside the accepted range (`0x0501`, `INVALID_VALUE`). */
  InvalidValue: 0x0501,

  /** Indicates that a call was invalid for the current WebGL state (`0x0502`, `INVALID_OPERATION`). */
  InvalidOperation: 0x0502,

  /** Indicates that WebGL could not allocate enough memory (`0x0505`, `OUT_OF_MEMORY`). */
  OutOfMemory: 0x0505,

  /** Indicates that the WebGL context was lost (`0x9242`, `CONTEXT_LOST_WEBGL`). */
  ContextLost: 0x9242
}

/**
 * Selects a WebGL capability for {@linkcode WebGLRenderingContext#enable}
 * or {@linkcode WebGLRenderingContext#disable}.
 *
 * Use these values to turn common rendering capabilities on or off for the
 * current context.
 *
 * @example
 * ```js
 * import { GLEnable } from '@wimaengine/render-webgl'
 *
 * gl.enable(GLEnable.DepthTest)
 * gl.disable(GLEnable.Dither)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const GLEnable = {

  /** Enables blending (`0x0BE2`, `BLEND`). */
  Blend: 0x0BE2,

  /** Enables depth testing (`0x0B71`, `DEPTH_TEST`). */
  DepthTest: 0x0B71,

  /** Enables stencil testing (`0x0B90`, `STENCIL_TEST`). */
  StencilTest: 0x0B90,

  /** Enables scissor testing (`0x0C11`, `SCISSOR_TEST`). */
  ScissorTest: 0x0C11,

  /** Enables dithering (`0x0BD0`, `DITHER`). */
  Dither: 0x0BD0,

  /** Enables polygon offset for filled primitives (`0x8037`, `POLYGON_OFFSET_FILL`). */
  PolygonOffsetFill: 0x8037,

  /** Enables sample coverage (`0x80A0`, `SAMPLE_COVERAGE`). */
  SampleCoverage: 0x80A0,

  /** Enables alpha-to-coverage for multisampling (`0x809E`, `SAMPLE_ALPHA_TO_COVERAGE`). */
  SampleAlphaToCoverage: 0x809E
}

/**
 * Selects a shader or program status queried from WebGL.
 *
 * Pass a member to {@linkcode WebGLRenderingContext#getShaderParameter}
 * or {@linkcode WebGLRenderingContext#getProgramParameter}
 * to inspect deletion, compilation, linking, or validation status.
 *
 * @example
 * ```js
 * import { GLStatus } from '@wimaengine/render-webgl'
 *
 * const compiled = gl.getShaderParameter(shader, GLStatus.Compile)
 * const linked = gl.getProgramParameter(program, GLStatus.Link)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const GLStatus = {

  /** Queries whether a shader or program has been flagged for deletion (`0x8B80`, `DELETE_STATUS`). */
  Delete: 0x8B80,

  /** Queries whether a shader compiled successfully (`0x8B81`, `COMPILE_STATUS`). */
  Compile: 0x8B81,

  /** Queries whether a program linked successfully (`0x8B82`, `LINK_STATUS`). */
  Link: 0x8B82,

  /** Queries whether a program passed validation (`0x8B83`, `VALIDATE_STATUS`). */
  Validate: 0x8B83
}
