/** @import {SystemFunc, World} from '@wimaengine/ecs' */
/** @import { Constructor } from '@wimaengine/type' */
/** @import {UniformBind } from '@wimaengine/render-core' */
/** @import { AssetId } from '@wimaengine/asset' */

import { Assets } from '@wimaengine/asset'
import { EntityHandle, Query } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { assert, warn } from '@wimaengine/logger'
import { Affine3 } from '@wimaengine/math'
import { Camera, Material, Mesh, MeshAdded, MeshModified, MeshDropped, RenderLists3D, ShaderStage } from '@wimaengine/render-core'
import { GlobalTransform3D } from '@wimaengine/transform'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Windows, MainWindow, Window } from '@wimaengine/window'
import { WebglRenderPipeline, createShader, validateShader, createProgram, validateProgram, createVAO } from '../core'
import { AttributeMap, ClearColor, MeshCache, UBOCache, WebglProgramCache } from '../resources'

/**
 * Creates a system that registers the uniform buffer used by one material type.
 *
 * The factory captures `type` and computes its {@linkcode typeid} when the returned
 * system runs. It does not register the system itself. The returned
 * {@linkcode SystemFunc} gets the world's {@linkcode UBOCache} and {@linkcode Windows}
 * resources, then queries the first tuple matching
 * `[{@linkcode EntityHandle}, {@linkcode Window}, {@linkcode MainWindow}]` with
 * {@linkcode Query#single}. If no main
 * window is found, it calls {@linkcode warn} with `Please define the main window
 * for rendering.` and returns. A missing canvas is a silent return; a canvas
 * without a `webgl2` context logs `WebGL 2.0 context is not created or is
 * lost.` and returns.
 *
 * When all guards pass, the system calls {@linkcode Windows#getWindow} to find the
 * canvas, then calls {@linkcode UBOCache#create} with the
 * canvas's WebGL 2 context, `typeid(type)`, and a fixed size of `32` bytes.
 * This mutates the UBO cache and returns `undefined`; the factory does not
 * create the cache, window, canvas, or material asset.
 *
 * @example
 * ```js
 * const registerMaterialBuffer = genRegisterBuffer(MyMaterial)
 * app.registerSystem({
 *   schedule: AppSchedule.Startup,
 *   systemGroup: CoreSystems.Start,
 *   system: registerMaterialBuffer
 * })
 * // The generated system creates the material's 32-byte WebGL UBO at Startup.
 * ```
 *
 * @template T
 * @param {Constructor<T>} type - Material constructor whose type ID names the
 * UBO entry.
 * @returns {SystemFunc} System that conditionally creates the material UBO and
 * returns `undefined`.
 */
export function genRegisterBuffer(type) {
  return function registerBuffers(world) {
    const ubos = world.getResource(UBOCache)
    const canvases = world.getResource(Windows)
    const windows = new Query(world, [EntityHandle, Window, MainWindow])

    const window = windows.single()

    if (!window) return warn('Please define the main window for rendering.')

    const canvas = canvases.getWindow(window[0])

    if (!canvas) return

    const gl = canvas.getContext('webgl2')

    if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

    ubos.create(gl, typeid(type), 32)
  }
}

/**
 * Creates a system that lazily compiles and caches one material's WebGL
 * render pipeline.
 *
 * The factory captures `type`, `vertexSource`, and `fragmentSource`, computes
 * `typeid(type)`, and returns a {@linkcode SystemFunc}; it does not compile shaders
 * or register the system itself. Each run reads the world's
 * {@linkcode AttributeMap}, {@linkcode UBOCache}, {@linkcode WebglProgramCache}, and
 * {@linkcode Windows} resources, and queries the first
 * `[{@linkcode EntityHandle}, {@linkcode Window}, {@linkcode MainWindow}]` tuple with
 * {@linkcode Query#single}.
 *
 * If {@linkcode WebglProgramCache} already has the material type ID, the system
 * returns immediately without checking the window or touching WebGL. Without
 * a main window it warns `Please define the main window for rendering.`; a
 * missing canvas returns silently; and a canvas without a `webgl2` context
 * warns `WebGL 2.0 context is not created or is lost.`. These guard paths
 * leave the pipeline cache unchanged.
 *
 * Otherwise, the system uses {@linkcode Windows#getWindow} to find the canvas, then
 * compiles the captured sources with {@linkcode createShader}
 * for {@linkcode ShaderStage.Vertex} and {@linkcode ShaderStage.Fragment}, reports
 * their status with {@linkcode validateShader}, creates a linked program with
 * {@linkcode createProgram} using the {@linkcode AttributeMap}, and wraps it in a
 * {@linkcode WebglRenderPipeline}. It then reports link and validation status with
 * {@linkcode validateProgram}, calls {@linkcode UBOCache#create} to create a
 * `16`-byte UBO named by the material type ID, initializes the pipeline with
 * {@linkcode WebglRenderPipeline#init}, and
 * stores it in the cache. Shader and program validation only logs diagnostics;
 * their return values are ignored, so pipeline initialization continues after
 * a reported validation failure. Allocation, reflection, or UBO-size errors
 * from the called APIs propagate. A successful run returns `undefined`.
 *
 * @example
 * ```js
 * const initPipeline = genRenderPipeline(MyMaterial, vertexSource, fragmentSource)
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   systemGroup: CoreSystems.PostMain,
 *   system: initPipeline
 * })
 * // Later runs do nothing once WebglProgramCache contains this material ID.
 * ```
 *
 * @template T
 * @param {Constructor<T>} type - Material constructor whose type ID keys the
 * pipeline and material UBO.
 * @param {string} vertexSource - Vertex-shader source passed to
 * {@linkcode createShader}.
 * @param {string} fragmentSource - Fragment-shader source passed to
 * {@linkcode createShader}.
 * @returns {SystemFunc} System that initializes and caches the material
 * pipeline when the WebGL setup is available.
 */
export function genRenderPipeline(type, vertexSource, fragmentSource) {
  const materialid = typeid(type)

  return function initRenderPipeline(world) {
    const attributeMap = world.getResource(AttributeMap)
    const ubos = world.getResource(UBOCache)
    const renderpipelines = world.getResource(WebglProgramCache)
    const windows = new Query(world, [EntityHandle, Window, MainWindow])
    const canvases = world.getResource(Windows)

    if (renderpipelines.has(materialid)) return

    const window = windows.single()

    if (!window) return warn('Please define the main window for rendering.')

    const canvas = canvases.getWindow(window[0])

    if (!canvas) return

    const gl = canvas.getContext('webgl2')

    if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

    const vertex = createShader(gl, vertexSource, ShaderStage.Vertex)
    const fragment = createShader(gl, fragmentSource, ShaderStage.Fragment)

    validateShader(gl, vertex, 'vertex')
    validateShader(gl, fragment, 'fragment')

    const program = createProgram(gl, vertex, fragment, attributeMap)
    const pipe = new WebglRenderPipeline(program)

    validateProgram(gl, program)
    ubos.create(gl, materialid, 16)
    pipe.init(gl, ubos)
    renderpipelines.set(materialid, pipe)
  }
}

/**
 * Creates a system that renders one material type's 3D opaque pass with
 * WebGL.
 *
 * The factory captures `type`, computes the material type ID, and computes the
 * typed {@linkcode Assets} IDs for {@linkcode Mesh} and that material. It returns a
 * {@linkcode SystemFunc}; it does not register the system or create any resources.
 * Each run reads `Assets<Mesh>`, `Assets<T>`, {@linkcode MeshCache},
 * {@linkcode WebglProgramCache}, {@linkcode UBOCache}, {@linkcode Windows}, and
 * {@linkcode ClearColor}. It also queries cameras with
 * `[{@linkcode GlobalTransform3D}, {@linkcode RenderLists3D}, {@linkcode Camera}]` and
 * the first window with
 * `[{@linkcode EntityHandle}, {@linkcode Window}, {@linkcode MainWindow}]`.
 *
 * No main window logs `Please define the main window for rendering.` and
 * returns. A missing canvas returns silently, while a missing `webgl2` context
 * logs `WebGL 2.0 context is not created or is lost.` and returns. On success,
 * the system clears the color buffer using the channels in {@linkcode ClearColor}
 * before visiting cameras. A camera is skipped when the
 * {@linkcode WebglProgramCache} has no pipeline for this material type or when its
 * {@linkcode RenderLists3D} has no opaque pass for that type.
 *
 * For each opaque item, the system looks up its mesh and material assets and
 * cached vertex array, converts its transform with {@linkcode Affine3.toMatrix4},
 * uploads the material's {@linkcode UniformBind#asUniformBind} data to the
 * material UBO, binds the pipeline and vertex array, and draws indexed
 * triangles when {@linkcode Mesh#getIndices} returns a value. Otherwise it reads
 * the `position3d` attribute and draws `positions.data.length / 3` vertices.
 * The camera UBO is updated with the inverse global transform followed by the
 * camera projection matrix before that camera's items are drawn.
 *
 * The camera UBO and material UBO are required: missing entries trigger the
 * corresponding {@linkcode assert} failure. Missing mesh or material assets are
 * not guarded here and fail when their methods are used; a missing GPU cache
 * entry is passed to `gl.bindVertexArray` as-is. If a mesh has no `position3d`
 * attribute, the current camera callback returns and its remaining items are
 * skipped. A successful run returns `undefined`; WebGL state and uploaded
 * buffer contents remain available to subsequent system invocations.
 *
 * @example
 * ```js
 * const renderMaterial = genRender(MyMaterial)
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   systemGroup: CoreSystems.PostMain,
 *   system: renderMaterial
 * })
 * // WebglMaterialPlugin performs this registration for its material type.
 * ```
 *
 * @template {Material & UniformBind} T
 * @param {Constructor<T>} type - Material asset constructor whose opaque pass
 * and typed asset pool are rendered.
 * @returns {SystemFunc} System that clears the active WebGL canvas and renders
 * the material's available 3D opaque items.
 */
export function genRender(type) {
  const materialtypeid = typeid(type)
  const meshassetsid = typeidGeneric(Assets, [Mesh])
  const materialassetsid = typeidGeneric(Assets, [type])

  return function renderToWebgl(world) {

    /** @type {Assets<Mesh>} */
    const meshes = world.getResourceByTypeId(meshassetsid)

    /** @type {Assets<T>} */
    const materials = world.getResourceByTypeId(materialassetsid)

    /** @type {MeshCache<WebGLVertexArrayObject>} */
    const gpumeshes = world.getResourceByTypeId(typeid(MeshCache))
    const programs = world.getResource(WebglProgramCache)
    const ubos = world.getResource(UBOCache)
    const canvases = world.getResource(Windows)
    const windows = new Query(world, [EntityHandle, Window, MainWindow])
    const cameras = new Query(world, [GlobalTransform3D, RenderLists3D, Camera])
    const clearColor = world.getResource(ClearColor)

    const window = windows.single()

    if (!window) return warn('Please define the main window for rendering.')

    const canvas = canvases.getWindow(window[0])

    if (!canvas) return

    const gl = canvas.getContext('webgl2')

    if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

    gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a)
    gl.clear(gl.COLOR_BUFFER_BIT)

    cameras.each(([cameraTransform, renderlist, camera]) => {
      const projection = camera.projectionMatrix()
      const cameraUniform = ubos.get('Camera')
      const camData = new Float32Array([
        ...GlobalTransform3D.toMatrix4(cameraTransform).invert(),
        ...projection
      ])

      assert(cameraUniform, 'The uniform buffer for the camera is not set up.')

      gl.bindBuffer(gl.UNIFORM_BUFFER, cameraUniform.buffer)
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, camData)

      const pipeline = programs.get(materialtypeid)

      if (!pipeline) return

      const opaquepass = renderlist.getOpaquePass(materialtypeid)

      if (!opaquepass) return

      for (let i = 0; i < opaquepass.length; i++) {
        const { meshid, materialid, transform } = opaquepass[i]
        const meshTransform = Affine3.toMatrix4(transform)
        const mesh = meshes.getByAssetId(meshid)
        const material = materials.getByAssetId(materialid)
        const gpumesh = gpumeshes.get(meshid)
        const data = material.asUniformBind()
        const ubo = ubos.get(materialtypeid)

        assert(ubo, `The uniform buffer for material '${materialtypeid}' is not set up.`)

        gl.useProgram(pipeline.program)
        pipeline.setUniformMatrix4(gl, 'model', meshTransform)
        gl.bindBuffer(gl.UNIFORM_BUFFER, ubo.buffer)
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, data)
        gl.bindVertexArray(gpumesh)

        const indices = mesh.getIndices()

        if (indices) {
          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
        } else {
          const positions = mesh.getAttribute('position3d')

          if (positions === undefined) return

          const count = positions.data.length

          gl.drawArrays(gl.TRIANGLES, 0, count / 3)
        }
      }
    })
  }
}

export * from './types'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Queues WebGL vertex arrays for mesh assets whose GPU representation must be
 * created or rebuilt.
 *
 * {@linkcode WebglRendererPlugin} registers this function directly in the repeating
 * {@linkcode AppSchedule.Update} schedule's
 * {@linkcode CoreSystems.PostMain}
 * group. Each run reads typed {@linkcode Events} resources for {@linkcode MeshAdded} and
 * {@linkcode MeshModified}, a typed {@linkcode Assets} resource for {@linkcode Mesh}; the
 * run also reads the {@linkcode MeshCache}, the {@linkcode AttributeMap}, and the
 * {@linkcode Windows} canvas resource.
 *
 * The system selects the first tuple matching
 * `[{@linkcode EntityHandle}, {@linkcode Window}, {@linkcode MainWindow}]` with
 * {@linkcode Query#single}. No matching main
 * window emits a warning and returns. {@linkcode Windows#getWindow} returning no
 * canvas returns silently, while a canvas without a `webgl2` context
 * emits a warning and returns. Any of these early returns skip both event
 * passes for that invocation.
 *
 * For each {@linkcode MeshAdded} event, the asset id from `event.data.id` is passed
 * to the internal mesh update path, which looks up the {@linkcode Mesh} in
 * `Assets<Mesh>`, asserts that it exists, calls {@linkcode createVAO}, and stores
 * the resulting `WebGLVertexArrayObject` in {@linkcode MeshCache} under the same
 * id. For each {@linkcode MeshModified} event, the existing cached VAO is deleted
 * with `gl.deleteVertexArray`, then recreated and replaced through the same
 * path. The modified path assumes the mesh already has a cached VAO; it does
 * not skip a missing cache entry.
 *
 * {@linkcode Events#each} visits the current readable batch in write
 * order; it does not clear or remove those events, and this system does not
 * call {@linkcode Events#clear}.
 * The event plugins normally rotate these batches separately in
 * {@linkcode CoreSystems.End}. Therefore
 * a guard return means neither batch is processed during this invocation. This
 * function does not retain or retry skipped events, so a later invocation sees
 * them only if the event resource has not been cleared. {@linkcode MeshDropped}
 * Events and GPU deletion are handled by the sibling
 * {@linkcode disposeDroppedMeshes} system. This function only prepares the VAO
 * cache; draw calls are issued by the WebGL render systems that consume it.
 *
 * @example
 * ```js
 * // WebglRendererPlugin installs queueMeshes in Update/PostMain.
 * app.registerPlugin(new WebglRendererPlugin())
 * // MeshAdded and MeshModified batches then create or rebuild MeshCache entries.
 * ```
 *
 * @param {World} world - World containing the required resources and main-window components.
 * @returns {void}
 * @category system
 */
export function queueMeshes(world) {

  /** @type {Events<MeshAdded>} */
  const added = world.getResourceByTypeId(typeidGeneric(Events, [MeshAdded]))

  /** @type {Events<MeshModified>} */
  const modified = world.getResourceByTypeId(typeidGeneric(Events, [MeshModified]))

  /** @type {Assets<Mesh>} */
  const meshes = world.getResourceByTypeId(typeidGeneric(Assets, [Mesh]))

  /** @type {MeshCache<WebGLVertexArrayObject>} */
  const cache = world.getResource(MeshCache)
  const attributes = world.getResource(AttributeMap)
  const windows = new Query(world, [EntityHandle, Window, MainWindow])
  const canvases = world.getResource(Windows)

  // TODO: Find a way to decouple to allow multi-window support.
  const window = windows.single()

  if (!window) return warn('Please define the main window for rendering.')

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const gl = canvas.getContext('webgl2')

  if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

  added.each((event) => {
    const { id } = event.data

    updateMesh(gl, id, meshes, cache, attributes)
  })

  modified.each((event) => {
    const { id } = event.data

    // SAFETY:Guaranteed to exist as it was added before modified.
    const vao = /** @type {WebGLVertexArrayObject} */ (cache.get(id))

    gl.deleteVertexArray(vao)
    updateMesh(gl, id, meshes, cache, attributes)
  })
}
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Disposes the WebGL vertex arrays for dropped mesh assets.
 *
 * {@linkcode WebglRendererPlugin} registers this function directly in the repeating
 * {@linkcode AppSchedule.Update} schedule's
 * {@linkcode CoreSystems.PostMain}
 * group. It reads the typed {@linkcode Events} resource for {@linkcode MeshDropped},
 * the {@linkcode MeshCache}, and the {@linkcode Windows} canvas resource.
 *
 * The system selects the first tuple matching
 * `[{@linkcode EntityHandle}, {@linkcode Window}, {@linkcode MainWindow}]` with
 * {@linkcode Query#single}. If no main-window tuple exists, it
 * warns and returns. If {@linkcode Windows#getWindow} finds no canvas for the
 * matching entity,
 * it returns silently. If the canvas cannot provide a `webgl2` context, it
 * warns and returns. Each guard exits before the event batch is visited, so no
 * dropped mesh is processed during that invocation.
 *
 * For every event in the current readable {@linkcode Events} batch, the system
 * reads the dropped asset id from `event.data.id` and looks up its VAO in
 * {@linkcode MeshCache}. If no VAO is cached, that event is skipped without a WebGL
 * deletion or cache mutation. Otherwise it calls
 * {@linkcode WebGL2RenderingContext#deleteVertexArray} and then
 * removes the id with {@linkcode Map.prototype.delete}. The callback return
 * skips only that event; subsequent dropped events remain eligible for the
 * same pass.
 *
 * {@linkcode Events#each} reads events but does not clear them, and
 * this function never calls {@linkcode Events#clear}. Event-batch rotation
 * is owned by the event plugin's separately scheduled clear system, normally
 * in {@linkcode CoreSystems.End}.
 *
 * @example
 * ```js
 * // WebglRendererPlugin installs disposeDroppedMeshes in Update/PostMain.
 * app.registerPlugin(new WebglRendererPlugin())
 * // MeshDropped events then release their cached WebGL vertex arrays.
 * ```
 *
 * @param {World} world - World containing the MeshDropped events, MeshCache, Windows, and main-window components.
 * @returns {void}
 * @category system
 */
export function disposeDroppedMeshes(world) {

  /** @type {Events<MeshDropped>} */
  const dropped = world.getResourceByTypeId(typeidGeneric(Events, [MeshDropped]))

  /** @type {MeshCache<WebGLVertexArrayObject>} */
  const cache = world.getResource(MeshCache)
  const windows = new Query(world, [EntityHandle, Window, MainWindow])
  const canvases = world.getResource(Windows)

  // TODO: Find a way to decouple to allow multi-window support.
  const window = windows.single()

  if (!window) return warn('Please define the main window for rendering.')

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const gl = canvas.getContext('webgl2')

  if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

  dropped.each((drop) => {
    const { id } = drop.data
    const vao = cache.get(id)

    if (!vao) return

    gl.deleteVertexArray(vao)

    cache.delete(id)
  })
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @param {WebGL2RenderingContext} gl
 * @param {AssetId} id
 * @param {Assets<Mesh>} meshes
 * @param {MeshCache<WebGLVertexArrayObject>} cache
 * @param {AttributeMap} attributeMap
 */
function updateMesh(gl, id, meshes, cache, attributeMap) {
  const mesh = meshes.getByAssetId(id)

  assert(mesh, 'Internal error: Mesh should have been loaded before sending to gpu')

  const vao = createVAO(gl, mesh, attributeMap)

  cache.set(id, vao)
}
