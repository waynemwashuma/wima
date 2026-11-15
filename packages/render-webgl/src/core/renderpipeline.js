import { assert } from '@wimaengine/logger'
import {
  Vector2,
  Vector3,
  Vector4,
  Matrix2,
  Matrix3,
  Matrix4,
  Affine2,
  Affine3
} from '@wimaengine/math'
import { UBOCache } from '../resources'

/**
 * Represents a linked WebGL program and the reflection metadata needed to
 * upload uniforms and bind named uniform blocks.
 *
 * Initialize a pipeline with a WebGL 2 context and a {@linkcode UBOCache} after
 * linking its program. A {@linkcode WebglProgramCache} can store these values by
 * material type, but a pipeline can also be used directly. The caller must
 * make the program current and bind textures before drawing.
 *
 * @example
 * ```js
 * // `program` is a linked WebGLProgram and `ubos` is a UBOCache.
 * const pipeline = new WebglRenderPipeline(program)
 * pipeline.init(gl, ubos)
 *
 * gl.useProgram(pipeline.program)
 * pipeline.setUniformMatrix4(gl, 'model', modelMatrix)
 * ```
 */
export class WebglRenderPipeline {

  /**
   * Linked WebGL program used by this pipeline.
   *
   * Make this program current with `gl.useProgram(pipeline.program)` before
   * calling a uniform setter or issuing a draw. The pipeline stores the
   * program but does not bind it or bind textures on its own.
   *
   * @readonly
   * @type {WebGLProgram}
   */
  program

  /**
   * Active-uniform metadata keyed by each uniform's exact shader name.
   *
   * {@linkcode WebglRenderPipeline#init} stores each entry's WebGL type, array
   * size, and uniform location. Sampler uniforms use the same metadata; a
   * sampler's texture-unit value can be written with
   * {@linkcode WebglRenderPipeline#setUniformInt}, but texture creation and
   * binding remain the caller's responsibility.
   *
   * @private
   * @type {Map<string,{type:number,size:number,location:WebGLUniformLocation}>}
   */
  uniforms = new Map()

  /**
   * Uniform-block metadata keyed by each block's exact shader name.
   *
   * Each entry records the block's WebGL index, per-uniform byte offsets, and
   * declared data size. The {@linkcode WebglRenderPipeline#init} method matches
   * the block to a {@linkcode UBOCache} entry, verifies its size, and binds the
   * block to that entry's binding point.
   *
   * @private
   * @type {Map<string,{index:number,offsets:Int32Array,size:number}>}
   */
  uniformBuffers = new Map()

  /**
   * Creates a pipeline for an existing linked WebGL program.
   *
   * The program is stored as supplied. Uniform and uniform-block metadata are
   * empty until {@linkcode WebglRenderPipeline#init} reflects the program.
   *
   * @param {WebGLProgram} program - Program to use for rendering.
   */
  constructor(program) {
    this.program = program
  }

  /**
   * Reflects the program's uniforms and binds its uniform blocks.
   *
   * Active uniforms with no returned metadata or no location are skipped.
   * Named uniform blocks are recorded in
   * {@linkcode WebglRenderPipeline#uniformBuffers}, matched by name through
   * {@linkcode UBOCache#get}, checked against the registered buffer
   * size, and connected to that buffer's binding point with
   * `gl.uniformBlockBinding`. This method does not call `gl.useProgram`, bind a
   * uniform buffer object, or bind a texture. Make those bindings current
   * before drawing.
   *
   * @param {WebGL2RenderingContext} gl - Context that owns the program.
   * @param {UBOCache} ubos - Cache containing a buffer for each reflected block.
   * @returns {void}
   * @throws {Error} If a reflected uniform block has no matching {@linkcode UBOCache} entry.
   * @throws {string} If a registered UBO size differs from the shader block's data size.
   */
  init(gl, ubos) {
    const uniformNum = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS)

    for (let i = 0; i < uniformNum; i++) {
      const info = gl.getActiveUniform(this.program, i)

      if (!info) continue

      const location = gl.getUniformLocation(this.program, info.name)

      if (location === null) continue

      this.uniforms.set(info.name, {
        type: info.type,
        size: info.size,
        location
      })
    }

    const uniformBufNum = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORM_BLOCKS)

    for (let i = 0; i < uniformBufNum; i++) {
      const name = gl.getActiveUniformBlockName(this.program, i)
      const indices = gl.getActiveUniformBlockParameter(this.program, i, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES)
      const offsets = gl.getActiveUniforms(this.program, indices, gl.UNIFORM_OFFSET)
      const size = gl.getActiveUniformBlockParameter(this.program, i, gl.UNIFORM_BLOCK_DATA_SIZE)

      if (!name) continue

      const ubo = ubos.get(name)

      this.uniformBuffers.set(name, {
        index: i,
        offsets,
        size
      })

      assert(ubo, `The uniform block '${name}' is not registered in \`UBOCache\`.`)

      if (ubo.size !== +size) throw `The uniform block '${name}' should be of size of ${size} but is size of ${ubo.size}.`

      gl.uniformBlockBinding(this.program, i, ubo.point)
    }
  }

  /**
   * Sets a scalar floating-point uniform.
   *
   * The exact `name` must be present in the reflected
   * {@linkcode WebglRenderPipeline#uniforms} map;
   * unknown names are ignored. This delegates to `gl.uniform1f` and does not
   * bind the program first.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {number} value - Floating-point value.
   * @returns {void}
   */
  setUniformFloat(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform1f(uniform.location, value)
  }

  /**
   * Sets a scalar signed-integer uniform.
   *
   * Unknown names are ignored. For a sampler uniform, `value` can be the
   * texture-unit index; this method writes the sampler value but does not bind
   * the texture or select the texture unit.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {number} value - Signed integer or sampler texture-unit index.
   * @returns {void}
   */
  setUniformInt(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform1i(uniform.location, value)
  }

  /**
   * Sets a scalar unsigned-integer uniform.
   *
   * Unknown names are ignored. This delegates to `gl.uniform1ui` and does not
   * bind the program first.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {number} value - Unsigned integer value.
   * @returns {void}
   */
  setUniformUint(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform1ui(uniform.location, value)
  }

  /**
   * Sets a two-component floating-point uniform.
   *
   * Unknown names are ignored. The vector's `x` and `y` fields are passed to
   * `gl.uniform2f`.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {Vector2} value - Vector whose `x` and `y` components are uploaded.
   * @returns {void}
   */
  setUniformVector2(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform2f(uniform.location, value.x, value.y)
  }

  /**
   * Sets a three-component floating-point uniform.
   *
   * Unknown names are ignored. The vector's `x`, `y`, and `z` fields are
   * passed to `gl.uniform3f`.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {Vector3} value - Vector whose `x`, `y`, and `z` components are uploaded.
   * @returns {void}
   */
  setUniformVector3(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform3f(uniform.location, value.x, value.y, value.z)
  }

  /**
   * Sets a four-component floating-point uniform.
   *
   * Unknown names are ignored. The vector's `x`, `y`, `z`, and `w` fields are
   * passed to `gl.uniform4f`.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {Vector4} value - Vector whose `x`, `y`, `z`, and `w` components are uploaded.
   * @returns {void}
   */
  setUniformVector4(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform4f(uniform.location, value.x, value.y, value.z, value.w)
  }

  /**
   * Sets a 2x2 matrix uniform.
   *
   * Unknown names are ignored. The iterable matrix is copied to a new
   * `Float32Array` and passed to `gl.uniformMatrix2fv` with transposition
   * disabled.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {Matrix2} value - Matrix values in the order expected by WebGL.
   * @returns {void}
   */
  setUniformMatrix2(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniformMatrix2fv(uniform.location, false, new Float32Array([...value]))
  }

  /**
   * Sets a 3x3 matrix uniform.
   *
   * Unknown names are ignored. The iterable matrix is copied to a new
   * `Float32Array` and passed to `gl.uniformMatrix3fv` with transposition
   * disabled.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {Matrix3} value - Matrix values in the order expected by WebGL.
   * @returns {void}
   */
  setUniformMatrix3(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniformMatrix3fv(uniform.location, false, new Float32Array([...value]))
  }

  /**
   * Sets a 4x4 matrix uniform.
   *
   * Unknown names are ignored. The iterable matrix is copied to a new
   * `Float32Array` and passed to `gl.uniformMatrix4fv` with transposition
   * disabled.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {Matrix4} value - Matrix values in the order expected by WebGL.
   * @returns {void}
   */
  setUniformMatrix4(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniformMatrix4fv(uniform.location, false, new Float32Array([...value]))
  }

  /**
   * Sets a 2x3 matrix uniform.
   *
   * Unknown names are ignored. The iterable affine matrix is copied to a new
   * `Float32Array` and passed to `gl.uniformMatrix2x3fv` with transposition
   * disabled.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {Affine2} value - Affine matrix values in the order expected by WebGL.
   * @returns {void}
   */
  setUniformMatrix2x3(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniformMatrix2x3fv(uniform.location, false, new Float32Array([...value]))
  }

  /**
   * Sets a 3x4 matrix uniform.
   *
   * Unknown names are ignored. The iterable affine matrix is copied to a new
   * `Float32Array` and passed to `gl.uniformMatrix3x4fv` with transposition
   * disabled.
   *
   * @param {WebGL2RenderingContext} gl - Context with this pipeline's program current.
   * @param {string} name - Exact active uniform name.
   * @param {Affine3} value - Affine matrix values in the order expected by WebGL.
   * @returns {void}
   */
  setUniformMatrix3x4(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniformMatrix3x4fv(uniform.location, false, new Float32Array([...value]))
  }
}
