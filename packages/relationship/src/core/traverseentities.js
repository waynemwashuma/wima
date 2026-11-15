/** @import {EntityId} from '@wimaengine/ecs' */

import { EntityHandle } from '@wimaengine/ecs'
import { abstractMethod } from '@wimaengine/utils'

/**
 * Defines the contract for a relationship that can expose related entities.
 *
 * Implementations return child {@linkcode EntityHandle} values from
 * {@linkcode TraverseEntities#visit} so relationship queries can traverse them.
 * They also implement {@linkcode TraverseEntities#map} to remap the packed
 * {@linkcode EntityId} values held by the relationship when entities are copied
 * or restored.
 *
 * This class is an interface-like base contract. Both methods throw the
 * abstract-method error until an implementing class overrides them.
 *
 * @example
 * ```js
 * import { EntityHandle } from '@wimaengine/ecs'
 * import { TraverseEntities } from '@wimaengine/relationship'
 *
 * class ChildLinks extends TraverseEntities {
 *   constructor(children) {
 *     super()
 *     this.children = children
 *   }
 *
 *   visit() {
 *     return this.children
 *   }
 *
 *   map(entityMap) {
 *     this.children = this.children.map((child) =>
 *       EntityHandle.from(entityMap.get(child.id()))
 *     )
 *   }
 * }
 * ```
 *
 * @interface
 */
export class TraverseEntities {

  /**
   * Returns the child entities exposed by this relationship.
   *
   * Relationship queries call this method to continue traversal. The returned
   * values are {@linkcode EntityHandle} instances, not packed entity IDs.
   *
   * @returns {EntityHandle[]} Child entity handles.
   * @throws {string} Always in the base implementation until overridden.
   */
  visit() {
    throw abstractMethod(this, TraverseEntities, this.visit)
  }

  /**
   * Remaps the entity IDs held by this relationship.
   *
   * The map contains packed source-to-target {@linkcode EntityId} values.
   * Implementations should use it to replace each relationship target with the
   * corresponding {@linkcode EntityHandle} for the copied or restored entity.
   *
   * @param {Map<EntityId, EntityId>} _entityMap - Packed source-to-target entity IDs.
   * @returns {void}
   * @throws {string} Always in the base implementation until overridden.
   */
  map(_entityMap) {
    throw abstractMethod(this, TraverseEntities, this.map)
  }
}
