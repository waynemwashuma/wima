import { createBuffer } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides a world resource that manages named WebGL uniform buffers for shader
 * uniform blocks.
 *
 * Use it with {@linkcode WebglRenderPipeline} when a pipeline contains named
 * uniform blocks so shader reflection and buffer binding use the same names.
 *
 * @example
 * ```js
 * import { UBOCache } from '@wimaengine/render-webgl'
 *
 * function registerMaterialBlock(world, gl) {
 *   const ubos = world.getResource(UBOCache)
 *   ubos.create(gl, 'Material', 16)
 *
 *   const material = ubos.get('Material')
 *   return material?.buffer
 * }
 * ```
 *
 * @category resource
 */
export class UBOCache {

  /**
   * @private
   * @type {Map<string,UBO>}
   */
  object = new Map()

  /**
   * @private
   * @type {number}
   */
  pointGenerator = 0

  /**
   * Creates and registers a dynamic WebGL uniform buffer.
   *
   * The buffer is allocated with {@linkcode createBuffer} as a
   * `gl.UNIFORM_BUFFER`, bound to the next available binding point, and stored
   * under `name`. Binding points start at zero and increase by one for every
   * call. Creating another buffer with an existing name replaces that entry
   * and still consumes a new binding point.
   *
   * @param {WebGL2RenderingContext} gl - Context that owns the buffer.
   * @param {string} name - Uniform-block name used by shader lookup.
   * @param {number} size - Buffer size in bytes.
   * @returns {void}
   */
  create(gl, name, size) {
    const buffer = createBuffer(gl, gl.UNIFORM_BUFFER, size, gl.DYNAMIC_DRAW)

    gl.bindBufferBase(gl.UNIFORM_BUFFER, this.pointGenerator, buffer)
    this.object.set(name, new UBO(
      this.pointGenerator,
      buffer,
      size
    ))
    this.pointGenerator += 1
  }

  /**
   * Returns the registered uniform-buffer metadata for a name.
   *
   * The result contains the WebGL buffer, its allocated binding point, and the
   * requested size. No buffer is created when the name is absent.
   *
   * @param {string} name - Uniform-block name to look up.
   * @returns {UBO | undefined} The metadata, or `undefined` when unregistered.
   */
  get(name) {
    return this.object.get(name)
  }
}
/* eslint-enable jsdoc/check-tag-names */

class UBO {

  /**
   * @readonly
   * @type {number}
   */
  point

  /**
   * @readonly
   * @type {WebGLBuffer}
   */
  buffer

  /**
   * @readonly
   * @type {number}
   */
  size

  /**
   * @param {number} point
   * @param {WebGLBuffer} buffer
   * @param {number} size
   */
  constructor(point, buffer, size) {
    this.point = point
    this.buffer = buffer
    this.size = size
  }
}
