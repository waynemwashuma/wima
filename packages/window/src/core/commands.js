/** @import {EntityHandle, World} from '@wimaengine/ecs' */
import { CommandQueue } from '@wimaengine/command'
import { assert } from '@wimaengine/logger'
import { Vector2 } from '@wimaengine/math'
import { WindowCommand, WindowRequest } from '../commands'

/**
 * Fluent builder for queuing window requests for an entity.
 *
 * Call {@linkcode WindowCommands#window} to select the target entity, then
 * call one or more request methods to queue {@linkcode WindowCommand} values.
 * Each request method returns this builder, so related requests can be chained.
 *
 * @example
 * ```js
 * new WindowCommands(world)
 *   .window(entity)
 *   .resize(1280, 720)
 *   .requestFullscreen()
 * ```
 */
export class WindowCommands {

  /**
   * @private
   * @type {EntityHandle | undefined}
   */
  entity

  /**
   * @private
   * @type {CommandQueue}
   */
  buffer

  /**
   * Creates a builder for queuing requests in the supplied world.
   *
   * @param {World} world - World containing a {@linkcode CommandQueue} resource.
   */
  constructor(world) {
    this.buffer = world.getResource(CommandQueue)
  }

  /**
   * Selects the {@linkcode EntityHandle} that receives subsequent window
   * requests.
   *
   * Selection is retained until another entity is passed to this method. This
   * method does not queue a command; request methods queue commands for the
   * selected entity instead.
   *
   * @param {EntityHandle} entity
   * @returns {this}
   */
  window(entity) {
    this.entity = entity

    return this
  }

  /**
   * Queues a {@linkcode WindowRequest.Resize} with a {@linkcode Vector2} payload
   * containing the requested width in `x` and height in `y`.
   *
   * Throws `No window entity selected for resize` when called before
   * {@linkcode WindowCommands#window}.
   *
   * @param {number} width
   * @param {number} height
   * @returns {this}
   */
  resize(width, height) {
    assert(this.entity, 'No window entity selected for resize')
    this.buffer.add(new WindowCommand(this.entity, WindowRequest.Resize, new Vector2(width, height)))

    return this
  }

  /**
   * Queues a {@linkcode WindowRequest.PointerLock} with an `undefined` payload.
   *
   * Throws `No window entity selected for pointer lock` when called before
   * {@linkcode WindowCommands#window}.
   *
   * @returns {this}
   */
  requestPointerLock() {
    assert(this.entity, 'No window entity selected for pointer lock')
    this.buffer.add(new WindowCommand(this.entity, WindowRequest.PointerLock, undefined))

    return this
  }

  /**
   * Queues a {@linkcode WindowRequest.PointerCapture} for a pointer id.
   *
   * Throws `No window entity selected for pointer capture` when called before
   * {@linkcode WindowCommands#window}.
   *
   * @param {number} id - Pointer id to capture.
   * @returns {this}
   */
  requestPointerCapture(id) {
    assert(this.entity, 'No window entity selected for pointer capture')
    this.buffer.add(new WindowCommand(this.entity, WindowRequest.PointerCapture, { id }))

    return this
  }

  /**
   * Queues a {@linkcode WindowRequest.PointerRelease} for a pointer id.
   *
   * @param {number} id - Pointer id to release.
   * @returns {this}
   */
  requestPointerRelease(id) {
    assert(this.entity, 'No window entity selected for pointer release')
    this.buffer.add(new WindowCommand(this.entity, WindowRequest.PointerRelease, { id }))

    return this
  }

  /**
   * Queues a {@linkcode WindowRequest.FullScreen} with an `undefined` payload.
   *
   * Throws `No window entity selected for fullscreen` when called before
   * {@linkcode WindowCommands#window}.
   *
   * @returns {this}
   */
  requestFullscreen() {
    assert(this.entity, 'No window entity selected for fullscreen')
    this.buffer.add(new WindowCommand(this.entity, WindowRequest.FullScreen, undefined))

    return this
  }
}
