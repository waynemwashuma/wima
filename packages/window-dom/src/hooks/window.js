/** @import { EntityHandle, World } from '@wimaengine/ecs' */

import { Windows } from '@wimaengine/window'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Removes the DOM canvas registered for a window entity and clears its
 * {@linkcode Windows} entry. If the entity has no registered canvas, this
 * function does nothing.
 *
 * @param {EntityHandle} entity
 * @param {World} world
 * @returns {void}
 * @category component-hook
 */
export function closeWindow(entity, world) {
  const windows = world.getResource(Windows)
  const canvas = windows.getWindow(entity)

  if (!canvas) return

  canvas.remove()
  windows.delete(entity)
}
/* eslint-enable jsdoc/check-tag-names */
