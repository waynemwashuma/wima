/** @import { World } from "../world" */
/** @import { EntityHandle } from "../entities" */
/**
 * Callback invoked during a component lifecycle operation.
 *
 * The callback receives the affected {@linkcode EntityHandle} and owning
 * {@linkcode World}.
 *
 * @callback ComponentHook
 * @param {EntityHandle} entity - Entity affected by the component operation.
 * @param {World} registry - World that owns the entity.
 * @returns {void}
 */
export {}
