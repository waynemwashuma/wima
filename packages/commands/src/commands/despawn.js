/** @import { EntityHandle, World } from '@wimaengine/ecs' */
import { Command } from '@wimaengine/command'

/**
 * Builds a deferred request to remove one entity from a world.
 *
 * The command stores the target handle without looking it up or changing the
 * world. {@linkcode DespawnCommand#execute} delegates to
 * {@linkcode World#despawn}, which removes the target entity and all of its
 * components. A stale handle has no effect. When hierarchy hooks are
 * installed, removing an entity with a {@linkcode Children} component also
 * recursively removes its descendants.
 *
 * @example
 * ```js
 * const command = new DespawnCommand(entity)
 * command.execute(world)
 * ```
 */
export class DespawnCommand extends Command {

  /**
   * Entity to remove when this command executes.
   *
   * @readonly
   * @type {EntityHandle}
   */
  entity

  /**
   * Creates a deferred entity-removal command.
   *
   * The constructor stores the handle only. It does not look up or remove the
   * entity until {@linkcode DespawnCommand#execute} runs.
   *
   * @param {EntityHandle} entity - Entity to remove from the world.
   */
  constructor(entity) {
    super()
    this.entity = entity
  }

  /**
   * Applies the queued removal to a world.
   *
   * Delegates to {@linkcode World#despawn} with this command's
   * {@linkcode DespawnCommand#entity} payload. A stale handle is ignored by the
   * world.
   *
   * @param {World} world - World to mutate.
   * @returns {void}
   */
  execute(world) {
    world.despawn(this.entity)
  }
}
