/** @import { EntityHandle, World } from '@wimaengine/ecs' */
/** @import { TupleConstructor } from '@wimaengine/type' */
import { Command } from '@wimaengine/command'

/**
 * Represents a deferred request to remove component types from an entity.
 *
 * Use this command to defer component removal until a world update is applied.
 * Constructing it stores the entity handle and component constructors without
 * changing the world. Calling {@linkcode RemoveCommand#execute} later delegates
 * to {@linkcode World#remove}. A stale entity handle has no effect. If a
 * requested component type is not present, storage is unchanged but its
 * registered remove hook still runs.
 *
 * @example
 * ```js
 * const command = new RemoveCommand(entity, [Position2D, Velocity2D])
 * queue.add(command) // The queue applies the command later.
 * ```
 *
 * @template {unknown[]} T
 */
export class RemoveCommand extends Command {

  /**
   * Entity whose components will be removed.
   *
   * @readonly
   * @type {EntityHandle}
   */
  entity

  /**
   * Component constructors to pass to {@linkcode World#remove} for
   * {@linkcode RemoveCommand#entity}.
   *
   * @readonly
   * @type {TupleConstructor<T>}
   */
  components

  /**
   * Creates a deferred command that removes component types from an entity.
   *
   * The constructor stores its arguments; it does not call
   * {@linkcode World#remove} or change the world until
   * {@linkcode RemoveCommand#execute} runs.
   *
   * @param {EntityHandle} entity - Entity whose components will be removed.
   * @param {TupleConstructor<T>} components - Component constructors to remove.
   */
  constructor(entity, components) {
    super()
    this.entity = entity
    this.components = components
  }

  /**
   * Applies this command's deferred component removal to a world.
   *
   * Passes {@linkcode RemoveCommand#entity} and
   * {@linkcode RemoveCommand#components} to {@linkcode World#remove}.
   *
   * @param {World} world - World to mutate.
   * @returns {void}
   */
  execute(world) {
    world.remove(this.entity, this.components)
  }
}
