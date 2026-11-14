/** @import { EntityHandle, World } from '@wimaengine/ecs' */
import { Command } from '@wimaengine/command'

/**
 * Builds a deferred component insertion for an entity.
 *
 * The command stores an {@linkcode EntityHandle} and an ordered component
 * payload. The constructor does not allocate or change an entity.
 * {@linkcode SpawnCommand#insert} appends one component,
 * {@linkcode SpawnCommand#insertPrefab} appends a batch, and
 * {@linkcode SpawnCommand#execute} passes the accumulated values to
 * {@linkcode World#insert}. The world applies the insertion
 * only when the command is executed; a stale entity handle has no effect.
 *
 * @example
 * ```js
 * const command = new SpawnCommand(entity)
 * command.insert(new Position2D(10, 20))
 * command.insertPrefab([new Name('player')])
 * command.execute(world)
 * ```
 */
export class SpawnCommand extends Command {

  /**
   * Entity to receive the accumulated component payload.
   *
   * The handle is stored as supplied and is resolved only when
   * {@linkcode SpawnCommand#execute} runs.
   *
   * @readonly
   * @type {EntityHandle}
   */
  entity

  /**
   * Components passed to {@linkcode World#insert} in insertion order.
   *
   * {@linkcode SpawnCommand#insert} and {@linkcode SpawnCommand#insertPrefab}
   * append to this array; neither method changes the world.
   *
   * @type {any[]}
   */
  components = []

  /**
   * @param {EntityHandle} entity - Entity that will receive the components.
   */
  constructor(entity) {
    super()
    this.entity = entity
  }

  /**
   * Appends one component to this command's payload.
   *
   * The component is accumulated until {@linkcode SpawnCommand#execute} is
   * called; this method does not insert into the world immediately.
   *
   * @template T
   * @param {T} component - Component instance to append.
   * @returns {void}
   */
  insert(component) {
    this.components.push(component)
  }

  /**
   * Appends a component batch to this command's payload.
   *
   * The supplied array is spread into the existing payload, preserving its
   * order and allowing multiple batches to be accumulated. The command keeps
   * the component values, not the supplied array.
   *
   * @template {unknown[]} T
   * @param {[...T]} components - Components to append in order.
   * @returns {void}
   */
  insertPrefab(components) {
    this.components.push(...components)
  }

  /**
   * Applies the queued insertion to a world.
   *
   * Delegates to {@linkcode World#insert} with the stored
   * {@linkcode SpawnCommand#entity} and accumulated
   * {@linkcode SpawnCommand#components}. The payload is not cleared, so
   * executing the same command again submits the same component values again.
   *
   * @param {World} world - World to mutate.
   * @returns {void}
   */
  execute(world) {
    world.insert(this.entity, this.components)
  }
}
