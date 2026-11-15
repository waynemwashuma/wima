/** @import {EntityHandle,EntityId} from '@wimaengine/ecs'*/

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the canvas registered for each window entity.
 *
 * `Windows` is a world resource installed by {@linkcode WindowPlugin}. Browser
 * integration can register the canvas
 * associated with each {@linkcode Window} component. This resource stores those
 * references; it does not create, append, resize, focus, or remove canvas
 * elements itself.
 *
 * Each entry is keyed by the exact value returned by {@linkcode EntityHandle#id}.
 * That packed {@linkcode EntityId} includes an entity's slot and generation, so
 * an entity that replaces an older one in the same slot receives a different
 * key. These methods do not check whether a handle is still live; they use its
 * current id only. Delete entries during teardown and do not use a stale
 * handle to access a canvas that has been closed.
 *
 * {@linkcode WindowCommand} uses this resource to find a canvas for a queued
 * window operation. Read the shared resource with
 * `world.getResource(Windows)` rather than creating one for each entity.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Windows } from '@wimaengine/window'
 *
 * const world = new World()
 * world.setResource(new Windows())
 *
 * const entity = world.spawn([])
 * const canvas = document.createElement('canvas')
 * const windows = world.getResource(Windows)
 *
 * windows.setWindow(entity, canvas)
 * console.log(windows.getWindow(entity) === canvas) // true
 *
 * windows.delete(entity)
 * console.log(windows.getWindow(entity)) // undefined
 * ```
 *
 * @category resource
 */
export class Windows {

  /**
   * @private
   * @type {Map<EntityId,HTMLCanvasElement>}
   */
  entities = new Map()

  /**
   * Returns the canvas registered under an entity's id.
   *
   * This lookup does not query the world or verify that the entity is still
   * alive. It returns `undefined` when no canvas is registered for the id.
   *
   * @param {EntityHandle} entity
   * @returns {HTMLCanvasElement | undefined} The registered canvas, if any.
   */
  getWindow(entity) {
    const window = this.entities.get(entity.id())

    return window
  }

  /**
   * Registers a canvas under an entity's id.
   *
   * Registering another canvas for the same id replaces the previous
   * reference. This does not append the canvas to the document, change its
   * dimensions, or focus it.
   *
   * @param {EntityHandle} entity
   * @param {HTMLCanvasElement} window
   */
  setWindow(entity, window) {
    this.entities.set(entity.id(), window)
  }

  /**
   * Deletes the canvas registered under an entity's id.
   *
   * This only changes the resource map. It does not remove or modify the
   * canvas element.
   *
   * @param {EntityHandle} entity
   */
  delete(entity) {
    this.entities.delete(entity.id())
  }
}
/* eslint-enable jsdoc/check-tag-names */
