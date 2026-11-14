/** @import { EntityHandle, World } from '@wimaengine/ecs' */
import { warn } from '@wimaengine/logger'
import { Collider2D, PhysicsProperties } from '../components'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Recomputes inverse inertia when {@linkcode PhysicsProperties} is added or
 * inserted on an entity.
 *
 * The component lifecycle invokes this function for add and insert callbacks,
 * providing the affected entity and its owning world. The hook reads the
 * entity's {@linkcode Collider2D}; when it exists, the hook converts
 * `invmass` to mass, calculates the collider's inertia, and writes the
 * resulting inverse to `invinertia`.
 *
 * If the entity has no {@linkcode Collider2D}, the hook logs a warning and returns
 * without changing `invinertia`. A zero inverse mass produces a zero mass, and
 * a zero or otherwise falsy calculated inertia produces zero inverse inertia.
 *
 * @example
 * ```js
 * // The component lifecycle invokes this hook automatically.
 * const body = world.spawn([
 *   Collider2D.rectangle(1, 1),
 *   new PhysicsProperties()
 * ])
 * // The component's inverse inertia is derived from its collider and mass.
 * console.log(world.get(body, PhysicsProperties).invinertia)
 * ```
 *
 * @param {EntityHandle} entity - Entity receiving
 * the {@linkcode PhysicsProperties} component.
 * @param {World} world - World containing the entity
 * and its components.
 * @returns {void}
 * @category component-hook
 */
export function physicspropertiesAddHook(entity, world) {

  // SAFETY: Component guranteed to be there as this is its
  // component hook
  const component = /** @type {PhysicsProperties}*/(world.get(entity, PhysicsProperties))
  const collider = world.get(entity, Collider2D)

  if (!collider) return warn(`No \`Collider2D\` component detected on entity ${entity}.Note that this entity's body will misbehave.`)

  const mass = component.invmass ? 1 / component.invmass : 0
  const inertia = Collider2D.calcInertia(collider, mass)

  component.invinertia = inertia ? 1 / inertia : 0
}
/* eslint-enable jsdoc/check-tag-names */
