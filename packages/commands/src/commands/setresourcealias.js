/** @import { Constructor, TypeId } from '@wimaengine/type' */
/** @import { World } from '@wimaengine/ecs' */
import { Command } from '@wimaengine/command'

/**
 * Represents a deferred request to register a resource alias in a world.
 *
 * Use this command to map an alias constructor to a resource
 * {@linkcode TypeId} without changing the world during construction. Calling
 * {@linkcode SetResourceAliasCommand#execute} later delegates to
 * {@linkcode World#setResourceAlias}. The alias may be registered before its
 * target resource exists; a later registration with the same alias constructor
 * replaces its target.
 *
 * @example
 * ```js
 * const command = new SetResourceAliasCommand(typeid(Settings), SettingsAlias)
 * command.execute(world)
 * ```
 */
export class SetResourceAliasCommand extends Command {

  /**
   * Resource {@linkcode TypeId} that the alias resolves to.
   *
   * @readonly
   * @type {TypeId}
   */
  id

  /**
   * Constructor used to look up the resource through this alias.
   *
   * @readonly
   * @type {Constructor}
   */
  alias

  /**
   * Creates a deferred resource-alias registration command.
   *
   * The constructor stores the resource ID and alias constructor; it does not
   * register the alias until {@linkcode SetResourceAliasCommand#execute} runs.
   *
   * @param {TypeId} id - Type ID of the resource the alias names.
   * @param {Constructor} alias - Constructor used as the resource alias.
   */
  constructor(id, alias) {
    super()
    this.id = id
    this.alias = alias
  }

  /**
   * Applies this command's deferred alias registration to a world.
   *
   * Passes {@linkcode SetResourceAliasCommand#id} and
   * {@linkcode SetResourceAliasCommand#alias} to
   * {@linkcode World#setResourceAlias}.
   *
   * @param {World} world - World to mutate.
   * @returns {void}
   */
  execute(world) {
    world.setResourceAlias(this.id, this.alias)
  }
}
