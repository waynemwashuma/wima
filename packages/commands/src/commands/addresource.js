/** @import { World } from '@wimaengine/ecs' */
import { Command } from '@wimaengine/command'

/**
 * Represents a deferred request to install a resource in a world.
 *
 * Use this command when a resource should be installed as part of a deferred
 * world update. Constructing it stores the resource without changing the
 * world. Calling {@linkcode AddResourceCommand#execute} later delegates to
 * {@linkcode World#setResource}. A resource already stored under the same
 * constructor type ID is replaced by the new instance.
 *
 * @example
 * ```js
 * const command = new AddResourceCommand(new Settings())
 * command.execute(world)
 * ```
 */
export class AddResourceCommand extends Command {

  /**
   * Resource instance to install when {@linkcode AddResourceCommand#execute}
   * runs.
   *
   * @readonly
   * @type {object}
   */
  resource

  /**
   * Creates a deferred resource-installation command.
   *
   * The constructor stores the resource only; it does not call
   * {@linkcode World#setResource} until {@linkcode AddResourceCommand#execute} runs.
   *
   * @param {object} resource - Resource instance to install in a world.
   */
  constructor(resource) {
    super()
    this.resource = resource
  }

  /**
   * Applies this command's deferred resource installation to a world.
   *
   * Passes {@linkcode AddResourceCommand#resource} to
   * {@linkcode World#setResource}.
   *
   * @param {World} world - World to mutate.
   * @returns {void}
   */
  execute(world) {
    world.setResource(this.resource)
  }
}
