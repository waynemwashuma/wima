/** @import { Constructor } from '@wimaengine/type' */
/** @import { World } from '@wimaengine/ecs' */
import { Command } from '@wimaengine/command'

/**
 * Builds a deferred request to remove one resource from a world.
 *
 * The command stores the resource constructor without looking up or changing
 * the world. {@linkcode RemoveResourceCommand#execute} delegates to
 * {@linkcode World#removeResource}. The world removes the resource and alias
 * entry keyed by that constructor's type ID; aliases under other keys remain,
 * even if they point to the removed resource.
 *
 * @example
 * ```js
 * const command = new RemoveResourceCommand(Settings)
 * command.execute(world)
 * ```
 */
export class RemoveResourceCommand extends Command {

  /**
   * Constructor identifying the resource to remove.
   *
   * @readonly
   * @type {Constructor}
   */
  resourceType

  /**
   * Creates a command with a resource constructor as its payload.
   *
   * The constructor stores the type only. It does not remove a resource until
   * {@linkcode RemoveResourceCommand#execute} runs.
   *
   * @param {Constructor} resourceType - Constructor of the resource to remove.
   */
  constructor(resourceType) {
    super()
    this.resourceType = resourceType
  }

  /**
   * Removes this command's resource from the supplied world.
   *
   * Delegates to {@linkcode World#removeResource} with the stored
   * {@linkcode RemoveResourceCommand#resourceType} payload. Removing a missing
   * resource is harmless; aliases under other constructors are not deleted.
   *
   * @param {World} world - World to mutate.
   * @returns {void}
   */
  execute(world) {
    world.removeResource(this.resourceType)
  }
}
