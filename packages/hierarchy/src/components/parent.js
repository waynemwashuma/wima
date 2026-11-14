/** @import {EntityId} from '@wimaengine/ecs' */

import { EntityHandle } from '@wimaengine/ecs'
import { TraverseEntities } from '@wimaengine/relationship'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Links an entity to one parent entity in a hierarchy.
 *
 * Attach {@linkcode Parent} to a child entity to identify the entity that owns it in the
 * hierarchy. The relationship is represented by an {@linkcode EntityHandle} to
 * the parent, and the component implements {@linkcode TraverseEntities} for
 * relationship traversal.
 *
 * Use {@linkcode Children} on a parent entity for its ordered direct-child
 * relationship. Register {@linkcode HierarchyPlugin} to keep the parent and
 * child relationships synchronized.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Parent } from '@wimaengine/hierarchy'
 *
 * const world = new World()
 * const root = world.spawn([])
 * const child = world.spawn([new Parent(root)])
 * const parent = world.get(child, Parent)
 *
 * console.log(parent.visit()[0].equals(root)) // true
 * ```
 *
 * @implements {TraverseEntities}
 */
export class Parent {

  /**
   * Handle of the entity that owns this entity in the hierarchy.
   *
   * This is the same handle supplied to the constructor or assigned by
   * {@linkcode Parent.copy}. It is a value containing an entity slot and generation; reading
   * this field does not query a world or guarantee that the entity is alive.
   *
   * @public
   * @type {EntityHandle}
   */
  entity

  /**
   * Creates a parent relationship for an entity.
   *
   * The supplied handle is stored directly, so the component and caller share
   * the same {@linkcode EntityHandle} object.
   *
   * @param {EntityHandle} entity - Handle of the parent entity.
   */
  constructor(entity) {
    this.entity = entity
  }

  /**
   * Returns the parent as the only relationship target.
   *
   * The returned array is newly created for each call, but its element is the
   * component's current `entity` handle.
   *
   * @returns {EntityHandle[]} A one-element array containing the parent handle.
   */
  visit() {
    return [this.entity]
  }

  /**
   * Remaps this relationship to an entity in a copied or restored world.
   *
   * The current packed handle id is used as the map key. The mapped packed id
   * is then passed to {@linkcode EntityHandle.from}, and `entity` is replaced
   * with the newly reconstructed handle. The map must contain an entry for the
   * current parent id; without one, handle reconstruction fails.
   *
   * @param {Map<EntityId, EntityId>} entityMap - Packed source-to-target entity ids.
   * @returns {void}
   */
  map(entityMap) {
    this.entity = EntityHandle.from(entityMap.get(this.entity.id()))
  }

  /**
   * Copies a parent relationship into a component.
   *
   * The target receives the source's {@linkcode EntityHandle} by reference. This
   * method does not create a second handle object; use {@linkcode Parent#map} when the relationship
   * must be remapped to another entity identity.
   *
   * @param {Parent} source - Component to copy.
   * @param {Parent} [target] - Component to populate.
   * @returns {Parent} The populated target component.
   */
  static copy(source, target = new Parent(source.entity)) {
    target.entity = source.entity

    return target
  }

  /**
   * Creates a shallow clone of a parent relationship.
   *
   * The returned component shares the original component's {@linkcode EntityHandle}
   * object because cloning delegates to {@linkcode Parent.copy}.
   *
   * @param {Parent} target - Component to clone.
   * @returns {Parent} A new component sharing the source handle.
   */
  static clone(target) {
    return Parent.copy(target)
  }

  /**
   * Serializes a parent relationship to a packed entity identity.
   *
   * This returns the number from {@linkcode EntityHandle#id}. It is different from
   * {@linkcode EntityHandle.serialize}, which returns an object containing
   * `index` and `generation`.
   *
   * @param {Parent} value - Component to serialize.
   * @returns {ParentSerial} Packed numeric parent entity id.
   */
  static serialize(value) {
    return value.entity.id()
  }

  /**
   * Deserializes a packed entity identity into a parent component.
   *
   * If `out` is provided, its existing `entity` handle is updated in place by
   * {@linkcode EntityHandle.deserialize}, and the same component is returned.
   * Without an output component, a {@linkcode Parent} with a placeholder handle is
   * created first and that handle is populated.
   *
   * @param {ParentSerial} value - Packed numeric parent entity id.
   * @param {Parent} [out] - Component to populate and return.
   * @returns {Parent} The populated component.
   */
  static deserialize(value, out = new Parent(new EntityHandle(0, 0))) {
    out.entity = EntityHandle.deserialize(value, out.entity)

    return out
  }

  /**
   * Checks whether a value has the supported serialized representation.
   *
   * This delegates to {@linkcode EntityHandle.validateSerial}, which currently
   * accepts any JavaScript number. It does not verify that the packed id maps
   * to a live entity or to a particular world.
   *
   * @param {unknown} value - Value to validate.
   * @returns {value is ParentSerial} Whether `value` is numeric.
   */
  static validateSerial(value) {
    return EntityHandle.validateSerial(value)
  }
}

/**
 * Packed numeric entity identity used by {@linkcode Parent.serialize}.
 *
 * @typedef {EntityId} ParentSerial
 */
