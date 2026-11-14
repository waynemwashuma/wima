/**
 * Selects the WebGL primitive topology used by a draw call.
 *
 * Pass one of these numeric values as the mode argument to
 * `gl.drawArrays` or `gl.drawElements`. `Points` (`0x0000`) draws independent
 * points; `Lines` (`0x0001`) draws independent pairs of vertices;
 * `LineLoop` (`0x0002`) connects the vertices and closes the line;
 * `LineStrip` (`0x0003`) connects consecutive vertices without closing the
 * line; `Triangles` (`0x0004`) draws independent groups of three vertices;
 * `TriangleStrip` (`0x0005`) builds connected triangles from adjacent
 * vertices; and `TriangleFan` (`0x0006`) builds connected triangles around
 * the first vertex.
 *
 * @example
 * ```js
 * import { DrawPrimitive } from '@wimaengine/render-webgl'
 *
 * // `gl` is an existing WebGL rendering context with a bound vertex array.
 * gl.drawArrays(DrawPrimitive.Triangles, 0, 3)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const DrawPrimitive = {

  /** Independent points; WebGL `POINTS` (`0x0000`). */
  Points: 0x0000,

  /** Independent line segments; WebGL `LINES` (`0x0001`). */
  Lines: 0x0001,

  /** A connected line whose final vertex joins the first; WebGL `LINE_LOOP` (`0x0002`). */
  LineLoop: 0x0002,

  /** A connected open line; WebGL `LINE_STRIP` (`0x0003`). */
  LineStrip: 0x0003,

  /** Independent triangles formed from each group of three vertices; WebGL `TRIANGLES` (`0x0004`). */
  Triangles: 0x0004,

  /** Connected triangles that reuse adjacent vertices; WebGL `TRIANGLE_STRIP` (`0x0005`). */
  TriangleStrip: 0x0005,

  /** Connected triangles that share the first vertex; WebGL `TRIANGLE_FAN` (`0x0006`). */
  TriangleFan: 0x0006
}

/**
 * Provides usage hints for WebGL buffer storage.
 *
 * Pass a member to {@linkcode createBuffer} or {@linkcode createBufferData} as the
 * buffer-usage argument. The hint describes how often the buffer data is
 * expected to change and how often the buffer is expected to be used; it does
 * not prevent later updates.
 *
 * @example
 * ```js
 * import { BufferType, DrawUsage, createBufferData } from '@wimaengine/render-webgl'
 *
 * const positions = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0])
 * const vertexBuffer = createBufferData(
 *   gl,
 *   BufferType.Array,
 *   positions,
 *   DrawUsage.Static
 * )
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const DrawUsage = {

  /** Data is specified once and used many times (`0x88E4`, WebGL `STATIC_DRAW`). */
  Static: 0x88E4,

  /** Data may be updated repeatedly and used many times (`0x88E8`, WebGL `DYNAMIC_DRAW`). */
  Dynamic: 0x88E8,

  /** Data is specified once and used a few times (`0x88E0`, WebGL `STREAM_DRAW`). */
  Stream: 0x88E0
}

/**
 * Selects which polygon faces WebGL should cull.
 *
 * Pass `Front`, `Back`, or `Both` to
 * {@linkcode WebGLRenderingContext#cullFace} after enabling face
 * culling on the context. `None` represents disabled face culling in engine
 * configuration; disable the WebGL cull-face capability separately when
 * applying that choice.
 *
 * @example
 * ```js
 * import { CullFace } from '@wimaengine/render-webgl'
 *
 * gl.enable(gl.CULL_FACE)
 * gl.cullFace(CullFace.Back)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const CullFace = {

  /** Represents no face culling in engine configuration (`0`). */
  None:0,

  /** Culls front-facing polygons (`0x0404`). */
  Front: 0x0404,

  /** Culls back-facing polygons (`0x0405`). */
  Back: 0x0405,

  /** Culls both front-facing and back-facing polygons (`0x0408`). */
  Both: 0x0408
}

/**
 * Defines the winding direction that WebGL treats as front-facing.
 *
 * Pass a member to {@linkcode WebGLRenderingContext#frontFace} when
 * the vertex winding of the mesh changes.
 *
 * @example
 * ```js
 * import { FrontFace } from '@wimaengine/render-webgl'
 *
 * gl.frontFace(FrontFace.CounterClockWise)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const FrontFace = {

  /** Treats clockwise polygons as front-facing (`0x0900`). */
  ClockWise: 0x0900,

  /** Treats counter-clockwise polygons as front-facing (`0x0901`). */
  CounterClockWise: 0x0901
}

/**
 * Selects the depth comparison used by WebGL's depth test.
 *
 * Pass a member to {@linkcode WebGLRenderingContext#depthFunc}. The
 * comparison is made between the incoming fragment depth and the stored
 * depth value.
 *
 * @example
 * ```js
 * import { DepthFunc } from '@wimaengine/render-webgl'
 *
 * gl.depthFunc(DepthFunc.Less)
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const DepthFunc = {

  /** Never passes the depth test (`0x0200`). */
  Never: 0x0200,

  /** Passes when the incoming depth is less than the stored depth (`0x0201`). */
  Less: 0x0201,

  /** Passes when the incoming depth equals the stored depth (`0x0202`). */
  Equal: 0x0202,

  /** Passes when the incoming depth is less than or equal to the stored depth (`0x0203`). */
  LEqual: 0x0203,

  /** Passes when the incoming depth is greater than the stored depth (`0x0204`). */
  Greater: 0x0204,

  /** Passes when the incoming depth differs from the stored depth (`0x0205`). */
  NotEqual: 0x0205,

  /** Passes when the incoming depth is greater than or equal to the stored depth (`0x0206`). */
  GEqual: 0x0206,

  /** Always passes the depth test (`0x0207`). */
  Always: 0x0207
}

/**
 * Selects the operation WebGL applies to a stencil value.
 *
 * Pass the operation for stencil-test failure, depth-test failure, and depth
 * test success to {@linkcode WebGLRenderingContext#stencilOp}. The
 * clamped increment and decrement values are exposed as `Equal` and
 * `Increase`; wrapping variants are exposed as `IncreaseWrap` and
 * `DecreaseWrap`. The package's exported names and numeric values are
 * preserved exactly, including the `Decrease` value.
 *
 * @example
 * ```js
 * import { StencilOperation } from '@wimaengine/render-webgl'
 *
 * gl.stencilOp(
 *   StencilOperation.Keep,
 *   StencilOperation.Keep,
 *   StencilOperation.Replace
 * )
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const StencilOperation = {

  /** Keeps the current stencil value (`0x1E00`). */
  Keep: 0x1E00,

  /** Replaces the stencil value with the reference value (`0x1E01`). */
  Replace: 0x1E01,

  /** Exposes WebGL's clamped-increment value (`0x1E02`) under the `Equal` name. */
  Equal: 0x1E02,

  /** Exposes WebGL's clamped-decrement value (`0x1E03`) under the `Increase` name. */
  Increase: 0x1E03,

  /** Exposes `0x1E04` under the `Decrease` name; WebGL does not define this as a standard stencil operation. */
  Decrease: 0x1E04,

  /** Inverts the stencil value (`0x150A`). */
  Invert: 0x150A,

  /** Increments the stencil value with wrapping (`0x8507`). */
  IncreaseWrap: 0x8507,

  /** Decrements the stencil value with wrapping (`0x8508`). */
  DecreaseWrap: 0x8508
}

/**
 * Selects a WebGL buffer binding target.
 *
 * Pass a member to {@linkcode WebGLRenderingContext#bindBuffer} or
 * use it with {@linkcode createBuffer} and {@linkcode createBufferData}. The
 * `CopyRead`, `CopyWrite`, `Uniform`, `PixelPack`, and `PixelUnpack` targets
 * require the WebGL 2 buffer APIs; `Array` and `ElementArray` are the common
 * vertex and index-buffer targets.
 *
 * @example
 * ```js
 * import { BufferType, DrawUsage, createBufferData } from '@wimaengine/render-webgl'
 *
 * const vertexBuffer = createBufferData(
 *   gl,
 *   BufferType.Array,
 *   new Float32Array([0, 0, 0]),
 *   DrawUsage.Static
 * )
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const BufferType = {

  /** Vertex-attribute data target (`0x8892`, `ARRAY_BUFFER`). */
  Array:0x8892,

  /** Element-index data target (`0x8893`, `ELEMENT_ARRAY_BUFFER`). */
  ElementArray:0x8893,

  /** WebGL 2 source target for buffer-to-buffer copy operations (`0x8F36`). */
  CopyRead:0x8F36,

  /** WebGL 2 destination target for buffer-to-buffer copy operations (`0x8F37`). */
  CopyWrite:0x8F37,

  /** WebGL 2 uniform-buffer target (`0x8A11`). */
  Uniform:0x8A11,

  /** WebGL 2 target for reading pixel data into a buffer (`0x88EB`). */
  PixelPack:0x88EB,

  /** WebGL 2 target for unpacking pixel data from a buffer (`0x88EC`). */
  PixelUnpack:0x88EC
}
