import { Command } from '@wimaengine/command'
import { Query, EntityHandle, World } from '@wimaengine/ecs'
import { error } from '@wimaengine/logger'
import { Window } from '../components'
import { Windows } from '../resources'

/**
 * Queues a deferred {@linkcode WindowRequest} for a window entity.
 *
 * The command stores the target entity, request kind, and request-specific
 * payload without resolving a canvas or changing the {@linkcode Window}
 * component. {@linkcode WindowCommand#execute} later looks up the canvas through
 * {@linkcode Windows} and applies the request. A {@linkcode WindowCommands} builder
 * normally creates and queues this command for the selected entity.
 *
 * @example
 * ```js
 * import { CommandQueue } from '@wimaengine/command'
 * import { Vector2 } from '@wimaengine/math'
 * import { WindowCommand, WindowRequest } from '@wimaengine/window'
 *
 * world.getResource(CommandQueue).add(
 *   new WindowCommand(entity, WindowRequest.Resize, new Vector2(1280, 720))
 * )
 * ```
 */
export class WindowCommand extends Command {

  /**
   * Entity whose {@linkcode Window} component and associated canvas receive the
   * request when {@linkcode WindowCommand#execute} runs.
   *
   * @readonly
   * @type {EntityHandle}
   */
  entity

  /**
   * {@linkcode WindowRequest} operation to apply when the command is executed.
   *
   * @readonly
   * @type {WindowRequest}
   */
  type

  /**
   * Payload consumed by the selected {@linkcode WindowRequest} operation when
   * the command executes. {@linkcode WindowRequest.Resize} and
   * {@linkcode WindowRequest.Reposition} use `x` and `y`; pointer capture and
   * release use `id`. {@linkcode WindowRequest.FullScreen} and
   * {@linkcode WindowRequest.PointerLock} store `undefined`.
   *
   * @readonly
   * @type {any}
   */
  data

  /**
   * Creates a deferred window-request command.
   *
   * This stores the target, operation, and payload without resolving a canvas
   * or changing the target window. The command queue later calls
   * {@linkcode WindowCommand#execute} with a world to apply the request.
   *
   * @param {EntityHandle} entity - Entity whose window receives the request.
   * @param {WindowRequest} type - Operation to apply when executed.
   * @param {any} data - Payload required by the selected operation.
   */
  constructor(entity, type, data) {
    super()
    this.entity = entity
    this.type = type
    this.data = data
  }

  /**
   * Applies the queued request to the target window.
   *
   * This resolves the target canvas from {@linkcode Windows} and reads the
   * matching {@linkcode Window} component only after a canvas is found. Without a
   * registered canvas, this returns without applying anything.
   *
   * {@linkcode WindowRequest.Resize} is a no-op when the component dimensions
   * already match the requested `x` and `y`. Otherwise, it writes those values
   * to the canvas backing and CSS dimensions, reads the canvas's bounding
   * rectangle, and stores the rounded non-zero rectangle size—or the backing
   * size when a rectangle dimension is zero—on both the canvas and
   * {@linkcode Window}. {@linkcode WindowRequest.Reposition} assigns `x` to
   * `canvas.style.right` and `y` to `canvas.style.left`. Pointer capture and
   * release use `data.id`; fullscreen and pointer lock call the corresponding
   * canvas APIs. An unknown request logs an error.
   *
   * @param {World} world - World used to resolve the target canvas and
   * {@linkcode Window} component.
   * @returns {void}
   */
  execute(world) {
    const canvases = world.getResource(Windows)
    const windows = new Query(world, [Window])
    const canvas = canvases.getWindow(this.entity)

    if (!canvas) return

    const [window] = /** @type {[Window]} */(windows.get(this.entity))

    execute(this, canvas, window)
  }
}

/**
 * Applies a resolved {@linkcode WindowRequest} to a canvas and {@linkcode Window}.
 *
 * This helper is called only after {@linkcode WindowCommand#execute} has found a
 * canvas and queried the matching {@linkcode Window} component.
 *
 * @private
 * @param {WindowCommand} command
 * @param {HTMLCanvasElement} canvas
 * @param {Window} window
 */
function execute(command, canvas, window) {
  switch (command.type) {
    case WindowRequest.Resize:
      if (window.getWidth() === command.data.x && window.getHeight() === command.data.y) {
        break
      }

      canvas.width = command.data.x
      canvas.height = command.data.y
      canvas.style.width = `${canvas.width}px`
      canvas.style.height = `${canvas.height}px`

      const rect = canvas.getBoundingClientRect()
      const width = Math.round(rect.width) || canvas.width
      const height = Math.round(rect.height) || canvas.height

      canvas.width = width
      canvas.height = height
      window.set(width, height)
      break

    case WindowRequest.Reposition:
      canvas.style.right = command.data.x
      canvas.style.left = command.data.y
      break

    case WindowRequest.PointerCapture:
      canvas.setPointerCapture(command.data.id)
      break

    case WindowRequest.PointerRelease:
      canvas.releasePointerCapture(command.data.id)
      break

    case WindowRequest.FullScreen:
      canvas.requestFullscreen()
      break

    case WindowRequest.PointerLock:
      canvas.requestPointerLock()
      break

    default:
      error('A `WindowRequest` variant has not been implemented')
  }
}

/**
 * Defines the numeric request kinds consumed by {@linkcode WindowCommand}.
 *
 * Pass one of these values as {@linkcode WindowCommand#type}. Each variant
 * selects a canvas operation and determines the payload shape stored in
 * {@linkcode WindowCommand#data}:
 *
 * - {@linkcode WindowRequest.FullScreen} and {@linkcode WindowRequest.PointerLock}
 *   use `undefined` data.
 * - {@linkcode WindowRequest.PointerCapture} and
 *   {@linkcode WindowRequest.PointerRelease} use an object with an `id` field
 *   for the pointer passed to the canvas API.
 * - {@linkcode WindowRequest.Resize} uses an object with `x` and `y` fields for
 *   width and height.
 * - {@linkcode WindowRequest.Reposition} uses an object with `x` and `y` fields
 *   assigned to the canvas's right and left styles.
 *
 * {@linkcode WindowCommands#requestPointerCapture} queues the required `{id}`
 * payload when issuing a pointer-capture command.
 *
 * @example
 * ```js
 * new WindowCommand(entity, WindowRequest.Resize, { x: 1280, y: 720 })
 * new WindowCommand(entity, WindowRequest.PointerCapture, { id: pointerId })
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const WindowRequest = {

  /** Requests the target canvas enter fullscreen; no payload is required (`0`). */
  FullScreen:0,

  /** Requests pointer lock on the target canvas; no payload is required (`1`). */
  PointerLock:1,

  /** Captures the pointer identified by `data.id` on the target canvas (`2`). */
  PointerCapture:2,

  /** Releases the pointer identified by `data.id` from the target canvas (`3`). */
  PointerRelease:3,

  /** Resizes the target canvas from `data.x` width and `data.y` height (`4`). */
  Resize:4,

  /** Repositions the target canvas from `data.x` right and `data.y` left styles (`5`). */
  Reposition:5
}
