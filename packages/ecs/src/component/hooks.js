/** @import { ComponentHook } from '../typedef'*/
/** @import { EntityHandle } from '../entities' */
/** @import { World } from '../world' */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Configures optional synchronous callbacks for one component type.
 *
 * Register an instance with {@linkcode World#setComponentHooks} for one world, or
 * stage it with {@linkcode App#setComponentHooks} before {@linkcode App#run} to
 * apply the same configuration to the app's worlds. Callbacks run
 * synchronously during entity component mutations; each callback's exact timing
 * is described on its field.
 *
 * @category component-hook
 *
 * @example
 * ```js
 * import { ComponentHooks, World } from '@wimaengine/ecs'
 *
 * class Player {}
 * const world = new World()
 *
 * world.setComponentHooks(Player, new ComponentHooks(
 *   (entity, world) => console.log('Player added', entity, world),
 *   (entity, world) => console.log('Player removed', entity, world)
 * ))
 *
 * const player = world.spawn([new Player()])
 * world.despawn(player)
 * ```
 */
export class ComponentHooks {

  /**
   * Runs after this component's value is stored on an entity.
   * {@linkcode World#spawn} invokes it for each component type in the new entity.
   * {@linkcode World#insert} invokes it once for each supplied component type,
   * including a type that was already present. The callback receives the
   * affected {@linkcode EntityHandle} and owning {@linkcode World}.
   *
   * @type {ComponentHook | null}
   */
  add

  /**
   * Runs before this component's storage is removed.
   * The entity still has its row when the callback runs. {@linkcode World#remove}
   * invokes it once for each requested type, even when that type is absent.
   * {@linkcode World#despawn} invokes it once for each component type on the
   * entity before the entity is deleted. The callback receives the affected
   * {@linkcode EntityHandle} and owning {@linkcode World}.
   *
   * @type {ComponentHook | null}
   */
  remove

  /**
   * Runs after an entity's resulting component set is stored.
   * {@linkcode World#insert} invokes it for each component type already present
   * before insertion. {@linkcode World#remove} invokes it for each type that
   * remains after removal. {@linkcode World#spawn} and {@linkcode World#despawn}
   * do not invoke it. The callback receives the affected {@linkcode EntityHandle}
   * and owning {@linkcode World}.
   *
   * @type {ComponentHook | null}
   */
  insert

  /**
   * Creates a lifecycle-hook configuration.
   *
   * The arguments set the `add`, `remove`, and `insert` callbacks in that order.
   * Omitted or explicitly `undefined` callbacks become `null`.
   *
   * @param {ComponentHook | null} [add=null] - Callback after component storage.
   * @param {ComponentHook | null} [remove=null] - Callback before component storage is removed.
   * @param {ComponentHook | null} [insert=null] - Callback after the resulting component set is stored.
   */
  constructor(add = null, remove = null, insert = null) {
    this.add = add
    this.remove = remove
    this.insert = insert
  }
}
/* eslint-enable jsdoc/check-tag-names */
