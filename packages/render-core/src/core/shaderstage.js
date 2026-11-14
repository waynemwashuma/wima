/**
 * Identifies the stage represented by shader source.
 *
 * @example
 * ```js
 * import { Shader, ShaderStage } from '@wimaengine/render-core'
 *
 * const vertexShader = new Shader(ShaderStage.Vertex, vertexSource)
 * const fragmentShader = new Shader(ShaderStage.Fragment, fragmentSource)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const ShaderStage = {

  /**
   * Vertex-shader stage, represented by WebGL's `VERTEX_SHADER` value.
   *
   * WebGL compiles this source for the vertex stage when the value is passed
   * to `gl.createShader`.
   *
   * @type {number}
   */
  Vertex: 0x8B31,

  /**
   * Fragment-shader stage, represented by WebGL's `FRAGMENT_SHADER` value.
   *
   * WebGL compiles this source for the fragment stage when the value is passed
   * to `gl.createShader`.
   *
   * @type {number}
   */
  Fragment: 0x8B30
}
