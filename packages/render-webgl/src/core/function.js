/** @import {TypeArray} from '@wimaengine/utils'*/
import { assert } from '@wimaengine/logger'
import { ShaderStage, MeshAttribute, Mesh } from '@wimaengine/render-core'
import { DrawUsage, BufferType } from './constants'

/**
 * Allocates a WebGL buffer for a target.
 *
 * The helper calls {@linkcode WebGLRenderingContext#createBuffer},
 * asserts that WebGL returned a buffer, binds it to the supplied
 * {@linkcode BufferType} with {@linkcode WebGLRenderingContext#bindBuffer},
 * and allocates `size` bytes with
 * {@linkcode WebGLRenderingContext#bufferData}. The
 * {@linkcode DrawUsage} value is passed through as WebGL's storage-usage hint. The
 * newly created buffer remains bound to `type` when the function returns.
 *
 * @example
 * ```js
 * import { BufferType, DrawUsage, createBuffer } from '@wimaengine/render-webgl'
 *
 * // `gl` is an existing WebGLRenderingContext.
 * const vertexBuffer = createBuffer(
 *   gl,
 *   BufferType.Array,
 *   positions.byteLength,
 *   DrawUsage.Static
 * )
 * ```
 *
 * @param {WebGLRenderingContext} gl - WebGL context that owns the buffer.
 * @param {BufferType} type - WebGL buffer target from {@linkcode BufferType}.
 * @param {number} size - Number of bytes to allocate with `bufferData`.
 * @param {DrawUsage} bufferUsage - WebGL usage hint from {@linkcode DrawUsage}.
 * @returns {WebGLBuffer} The created and allocated WebGL buffer.
 * @throws {Error} If `gl.createBuffer()` returns `null` or `undefined`.
 */
export function createBuffer(gl, type, size, bufferUsage) {
  const buffer = gl.createBuffer()

  assert(buffer, 'Buffer could not be created.')
  gl.bindBuffer(type, buffer)
  gl.bufferData(type, size, bufferUsage)

  return buffer
}

/**
 * Creates a WebGL buffer, uploads typed-array data to it, and leaves it bound
 * to the supplied target.
 *
 * The function calls {@linkcode WebGLRenderingContext#createBuffer}
 * on `gl` and asserts that WebGL returned a buffer. It then passes `type` to
 * {@linkcode WebGLRenderingContext#bindBuffer} and uploads `data` with
 * {@linkcode WebGLRenderingContext#bufferData}, passing `bufferUsage`
 * through as WebGL's storage-usage hint. The target remains bound to the new
 * buffer when the function returns.
 *
 * @example
 * ```js
 * import { BufferType, DrawUsage, createBufferData } from '@wimaengine/render-webgl'
 *
 * // `gl` is an existing WebGLRenderingContext.
 * const positions = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0])
 * const vertexBuffer = createBufferData(
 *   gl,
 *   BufferType.Array,
 *   positions,
 *   DrawUsage.Static
 * )
 * // `vertexBuffer` is still bound to BufferType.Array on `gl`.
 * ```
 *
 * @param {WebGLRenderingContext} gl - WebGL context that owns the buffer.
 * @param {BufferType} type - Buffer target from {@linkcode BufferType}.
 * @param {TypeArray} data - Typed-array data to upload to the target.
 * @param {DrawUsage} bufferUsage - Storage-usage hint from {@linkcode DrawUsage}.
 * @returns {WebGLBuffer} The created buffer containing the uploaded data.
 * @throws {Error} If {@linkcode WebGLRenderingContext#createBuffer}
 *   returns `null` or `undefined`.
 */
export function createBufferData(gl, type, data, bufferUsage) {
  const buffer = gl.createBuffer()

  assert(buffer, 'Buffer could not be created.')
  gl.bindBuffer(type, buffer)
  gl.bufferData(type, data, bufferUsage)

  return buffer
}

/**
 * Creates a WebGL shader, submits its source, and requests compilation.
 *
 * The helper calls {@linkcode WebGLRenderingContext#createShader}
 * with the supplied {@linkcode ShaderStage}, asserts that WebGL returned a shader,
 * uploads `src` with {@linkcode WebGLRenderingContext#shaderSource},
 * and requests compilation with
 * {@linkcode WebGLRenderingContext#compileShader}. It returns the
 * shader object without checking whether compilation succeeded; inspect that
 * status separately with the WebGL API or {@linkcode validateShader}.
 *
 * @example
 * ```js
 * import { ShaderStage } from '@wimaengine/render-core'
 * import { createShader } from '@wimaengine/render-webgl'
 *
 * // `gl` is an existing WebGLRenderingContext.
 * const vertexShader = createShader(
 *   gl,
 *   'void main() { gl_Position = vec4(0.0); }',
 *   ShaderStage.Vertex
 * )
 * ```
 *
 * @param {WebGLRenderingContext} gl - WebGL context that owns the shader.
 * @param {string} src - Shader-language source to upload.
 * @param {ShaderStage} type - Shader stage from {@linkcode ShaderStage}.
 * @returns {WebGLShader} The allocated shader after source upload and compilation is requested.
 * @throws {Error} If `gl.createShader()` returns `null` or `undefined`.
 */
export function createShader(gl, src, type) {
  const shader = gl.createShader(type)

  assert(shader, 'Shader could not be created.')
  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  return shader
}

/**
 * Checks whether a compiled WebGL shader passed its compile-status check.
 *
 * The helper reads `gl.COMPILE_STATUS` with
 * {@linkcode WebGLRenderingContext#getShaderParameter}. If the
 * status is false, it logs the supplied label and the diagnostic returned by
 * {@linkcode WebGLRenderingContext#getShaderInfoLog}, then returns
 * `false`. A successful check returns `true` without logging. Compilation
 * failure is reported rather than thrown; this function does not compile the
 * shader or alter its compilation state.
 *
 * @example
 * ```js
 * // `shader` was created and compiled with `createShader`.
 * if (!validateShader(gl, shader, 'vertex')) {
 *   return
 * }
 * ```
 *
 * @param {WebGLRenderingContext} gl - WebGL context that owns the shader.
 * @param {WebGLShader} shader - Compiled shader to inspect.
 * @param {string} [label=''] - Diagnostic label included in failure output.
 * @returns {boolean} `true` when `COMPILE_STATUS` is truthy; otherwise `false`.
 */
export function validateShader(gl, shader, label = '') {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(
      `Shader "${label}" could not compile:
      ${gl.getShaderInfoLog(shader)}`
    )

    return false
  }

  return true
}

/**
 * Creates a 2D WebGL texture from an image source and uploads its pixels.
 *
 * The helper calls {@linkcode WebGLRenderingContext#createTexture},
 * optionally enables {@linkcode WebGLRenderingContext#pixelStorei}
 * with `UNPACK_FLIP_Y_WEBGL`, and binds the result with
 * {@linkcode WebGLRenderingContext#bindTexture}. It uploads `img` with
 * {@linkcode WebGLRenderingContext#texImage2D} using `RGBA` and
 * `UNSIGNED_BYTE`, sets linear magnification and linear-mipmap-nearest
 * minification filters, and generates mipmaps. When `flipY` is truthy, the
 * unpack flag is set back to `false` after the upload; the previous context
 * value is not saved or restored. The created texture remains bound to
 * `TEXTURE_2D` when the function completes.
 *
 * @example
 * ```js
 * import { createTexture } from '@wimaengine/render-webgl'
 *
 * // `gl` is an existing WebGLRenderingContext and `image` is a TexImageSource.
 * const texture = createTexture(gl, image, 1) // truthy flipY flips the upload vertically
 * ```
 *
 * If {@linkcode WebGLRenderingContext#createTexture} returns `null`,
 * the subsequent WebGL calls still receive that value and `null` is returned.
 * If a WebGL call throws, there is no catch or `finally` block, so a requested
 * unpack-state reset may not be reached.
 *
 * @param {WebGLRenderingContext} gl - WebGL context that owns the texture.
 * @param {TexImageSource} img - Image source passed to `texImage2D`.
 * @param {number} flipY - Truthy to enable vertical unpack flipping during the
 * upload; falsy to leave the unpack flag unchanged.
 * @returns {WebGLTexture | null} The allocated texture, or `null` if WebGL
 * could not allocate one.
 * @throws If a WebGL operation rejects the image or texture state; such errors
 * propagate without restoring context state in a `finally` block.
 */
export function createTexture(gl, img, flipY) {
  const tex = gl.createTexture()

  if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
  gl.generateMipmap(gl.TEXTURE_2D)

  if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)

  return tex
}

/**
 * Creates and links a WebGL program with explicit vertex-attribute locations.
 *
 * The helper calls {@linkcode WebGLRenderingContext#createProgram},
 * asserts that WebGL returned a program, attaches `vertex` and `fragment` with
 * {@linkcode WebGLRenderingContext#attachShader}, then binds every
 * {@linkcode MeshAttribute} value in `attributemap` with
 * {@linkcode WebGLRenderingContext#bindAttribLocation}. Map keys
 * are ignored; each descriptor's {@linkcode MeshAttribute#id} and
 * {@linkcode MeshAttribute#name} are passed to WebGL. It finishes with
 * {@linkcode WebGLRenderingContext#linkProgram} and returns the
 * program. Attribute locations must therefore be supplied before linking.
 *
 * This helper does not inspect `LINK_STATUS`, call
 * {@linkcode validateProgram}, or make the program current with
 * {@linkcode WebGLRenderingContext#useProgram}. A link failure still
 * returns the program so callers can inspect it with WebGL or
 * {@linkcode validateProgram}.
 *
 * @example
 * ```js
 * import { MeshAttribute } from '@wimaengine/render-core'
 * import { AttributeMap, createProgram } from '@wimaengine/render-webgl'
 *
 * const attributes = new AttributeMap()
 * attributes.set('position', new MeshAttribute('position', 0, gl.FLOAT, 3))
 * const program = createProgram(gl, vertexShader, fragmentShader, attributes)
 * ```
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertex
 * @param {WebGLShader} fragment
 * @param {Readonly<Map<string,MeshAttribute>>} attributemap - Attribute descriptors, normally the {@linkcode AttributeMap} resource.
 * @returns {WebGLProgram} The created program after the link operation.
 * @throws {Error} If {@linkcode WebGLRenderingContext#createProgram}
 *   returns a falsy value.
 */
export function createProgram(gl, vertex, fragment, attributemap) {
  const program = gl.createProgram()

  assert(program, 'Could not create a program.')

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  attributemap.forEach((attribute) => {
    gl.bindAttribLocation(program, attribute.id, attribute.name)
  })
  gl.linkProgram(program)

  return program
}

/**
 * Checks and logs the link and validation status of a WebGL program.
 *
 * The helper reads `LINK_STATUS` with
 * {@linkcode WebGLRenderingContext#getProgramParameter}. When
 * the result is falsy, it logs `Program could not be linked:` together with
 * {@linkcode WebGLRenderingContext#getProgramInfoLog}. It then
 * always calls {@linkcode WebGLRenderingContext#validateProgram},
 * reads `VALIDATE_STATUS`, and logs `Program could not be validated:` with the
 * same info-log API when that result is falsy.
 *
 * Link or validation failure is reported only through `console.log`; the
 * helper does not throw, return a status, or skip validation after a failed
 * link. It returns `undefined` after both checks.
 *
 * @example
 * ```js
 * const program = createProgramFromSrc(gl, vertexSource, fragmentSource, attributes)
 * validateProgram(gl, program)
 * ```
 *
 * @param {WebGLRenderingContext} gl - Context that owns `program`.
 * @param {WebGLProgram} program - Program to inspect and validate.
 * @returns {void}
 */
export function validateProgram(gl, program) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(
      `Program could not be linked: 
      ${gl.getProgramInfoLog(program)}
      `
    )
  }

  gl.validateProgram(program)

  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.log(
      `Program could not be validated: 
       ${gl.getProgramInfoLog(program)}
        `
    )
  }
}

/**
 * Creates a WebGL 2 vertex-array object from a {@linkcode Mesh}.
 *
 * The helper calls {@linkcode WebGL2RenderingContext#createVertexArray},
 * reads the mesh's indices and named attribute data, and binds the new object
 * with {@linkcode WebGL2RenderingContext#bindVertexArray}. When
 * {@linkcode Mesh#getIndices} returns anything other than `undefined`,
 * it uploads that typed array with {@linkcode BufferType.ElementArray} and
 * {@linkcode DrawUsage.Static}. For each mesh attribute, it looks up a matching
 * {@linkcode MeshAttribute} in `attributemap`, uploads `data.data` with
 * {@linkcode BufferType.Array} and {@linkcode DrawUsage.Static}, enables the descriptor's
 * location with {@linkcode WebGLRenderingContext#enableVertexAttribArray}, and records it with
 * {@linkcode WebGLRenderingContext#vertexAttribPointer} using
 * `(attribute.id, attribute.size, attribute.type, false, 0, 0)`.
 *
 * `attributemap` is read by name; its keys do not need to be iterated in the
 * same order as the mesh. A missing descriptor causes an error identifying the
 * attribute name.
 * The value passed to `bindVertexArray` remains bound when the function
 * returns. When present, the index buffer remains bound to
 * `ELEMENT_ARRAY_BUFFER`; the last attribute buffer remains bound to
 * `ARRAY_BUFFER`. The helper does not restore bindings or delete any created
 * buffers. It does not assert the result of `createVertexArray`, so WebGL's
 * `null` result is returned as-is.
 *
 * @example
 * ```js
 * import { Mesh } from '@wimaengine/render-core'
 * import { AttributeMap, createVAO } from '@wimaengine/render-webgl'
 *
 * const vao = createVAO(gl, Mesh.quad2D(1, 1), world.getResource(AttributeMap))
 * // `vao` is bound to `gl` and ready for the matching vertex program.
 * ```
 *
 * @param {WebGL2RenderingContext} gl - WebGL 2 context that owns the VAO and buffers.
 * @param {Mesh} mesh - Geometry whose index and attribute arrays are uploaded.
 * @param {Readonly<Map<string,MeshAttribute>>} attributemap - Descriptors, normally the {@linkcode AttributeMap} resource.
 * @returns {WebGLVertexArrayObject | null} The created VAO, or `null` when
 * WebGL cannot allocate one.
 */
export function createVAO(gl, mesh, attributemap) {
  const vao = gl.createVertexArray()
  const indices = mesh.getIndices()
  const attributedata = mesh.getAttributes()

  gl.bindVertexArray(vao)

  if (indices !== undefined) {
    createBufferData(gl, BufferType.ElementArray, indices, DrawUsage.Static)
  }

  for (const [name, data] of attributedata) {
    const attribute = attributemap.get(name)

    assert(attribute, `The attribute "${name}" is not defined in the\`AttributeMap()\``)
    createBufferData(gl, BufferType.Array, data.data, DrawUsage.Static)

    gl.enableVertexAttribArray(attribute.id)
    gl.vertexAttribPointer(attribute.id, attribute.size, attribute.type, false, 0, 0)
  }

  return vao
}

/**
 * Compiles vertex and fragment source, then creates a linked WebGL program.
 *
 * The helper passes `gl.VERTEX_SHADER` and `gl.FRAGMENT_SHADER` to
 * {@linkcode createShader}; these are the WebGL values represented by the vertex
 * and fragment entries of {@linkcode ShaderStage}. It then delegates to
 * {@linkcode createProgram}, so attribute locations come from the supplied
 * {@linkcode MeshAttribute} descriptors in `attributemap`.
 *
 * Shader compilation and program linking are requested, but their status is
 * not checked here. Use {@linkcode validateShader} and {@linkcode validateProgram} when
 * diagnostics are needed. The helper also does not make the program current or
 * delete the temporary shader objects.
 *
 * @example
 * ```js
 * const program = createProgramFromSrc(gl, vertexSource, fragmentSource, attributes)
 * validateProgram(gl, program)
 * ```
 *
 * @param {WebGL2RenderingContext} gl - Context used to compile and link.
 * @param {string} vertex - Vertex-shader source.
 * @param {string} fragment - Fragment-shader source.
 * @param {Readonly<Map<string,MeshAttribute>>} attributemap - Attribute descriptors, normally the {@linkcode AttributeMap} resource.
 * @returns {WebGLProgram} The program returned by {@linkcode createProgram}.
 * @throws {Error} If shader or program allocation returns a falsy value.
 */
export function createProgramFromSrc(gl, vertex, fragment, attributemap) {
  const v = createShader(gl, vertex, gl.VERTEX_SHADER)
  const f = createShader(gl, fragment, gl.FRAGMENT_SHADER)
  const program = createProgram(gl, v, f, attributemap)

  return program
}
