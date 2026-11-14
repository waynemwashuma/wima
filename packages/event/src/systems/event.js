/** @import { AppSchedule, CoreSystems } from '@wimaengine/core' */
/** @import { SystemFunc } from '@wimaengine/ecs' */
/** @import { TypeId } from '@wimaengine/type' */
/**
 * Creates a system that clears one typed {@linkcode Events} resource.
 *
 * The returned system captures `id` and uses it on every execution to resolve
 * the resource with `world.getResourceByTypeId(id)`. It then calls
 * {@linkcode Events#clear}, rotating the write buffer into the readable batch. If
 * the resource is not registered under that ID, the lookup throws an assertion
 * error and `clear` is not called.
 *
 * {@linkcode EventPlugin} creates and registers this system when its
 * `autoClearEvent` option is enabled (the default), placing it in the repeating
 * {@linkcode AppSchedule.Update} schedule's {@linkcode CoreSystems.End} group. Set
 * `autoClearEvent: false` when another system owns buffer rotation.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Events, makeEventClear } from '@wimaengine/event'
 * import { typeidGeneric } from '@wimaengine/type'
 *
 * class DamageEvent {}
 * const eventId = typeidGeneric(Events, [DamageEvent])
 * const world = new World()
 * world.setResourceByTypeId(eventId, new Events())
 * const clearEvents = makeEventClear(eventId)
 * clearEvents(world)
 * // EventPlugin normally registers the resource and schedules this system.
 * ```
 *
 * @param {TypeId} id - Generic type ID of the typed {@linkcode Events} resource to
 * capture in the returned system.
 * @returns {SystemFunc} System that looks up the captured resource and returns
 * `undefined` after calling {@linkcode Events#clear}.
 */
export function makeEventClear(id) {
  return function clearEvents(world) {
    const dispatch = world.getResourceByTypeId(id)

    dispatch.clear()
  }
}
