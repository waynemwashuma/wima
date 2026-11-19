/** @import {EntityId} from '@wimaengine/ecs' */

import { EntityHandle } from '@wimaengine/ecs'
import { TraverseEntities } from '@wimaengine/relationship'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's ordered direct-child relationship.
 *
 * Attach {@linkcode Children} to a parent entity to list its direct children in order.
 * Each entry is an {@linkcode EntityHandle} for one child, and the component
 * implements {@linkcode TraverseEntities} for relationship traversal.
 *
 * Use {@linkcode Parent} on a child entity for the reverse relationship. Register
 * {@linkcode HierarchyPlugin} to keep the parent and child relationships
 * synchronized.
 *
 * @category component
 * @example
 * ```js
 * import { EntityHandle } from '@wimaengine/ecs'
 * import { Children, Parent } from '@wimaengine/hierarchy'
 *
 * const root = new EntityHandle(1, 0)
 * const child = new EntityHandle(2, 0)
 * const parent = new Parent(root)
 * const children = new Children([child])
 *
 * console.log(parent.entity.equals(root)) // true
 * console.log(children.visit()[0].equals(child)) // true
 * ```
 *
 * @implements {TraverseEntities}
 */
export class Children {

  /**
   * Direct child handles in insertion order.
   *
   * This is the live backing array. {@linkcode Children#add}, {@linkcode Children#remove}, and
   * {@linkcode Children#clear} change it, while {@linkcode Children#visit} returns this same array
   * rather than a copy. Mutating the array directly therefore changes the
   * relationship exposed by this component.
   *
   * @public
   * @type {EntityHandle[]}
   */
  list = []

  /**
   * Creates a children relationship from an optional ordered list.
   *
   * The supplied array is stored by reference; the constructor does not make
   * a copy. Use {@linkcode Children.copy} when an independent list is required.
   *
   * @param {EntityHandle[]} [children=[]] - Direct child handles in traversal order.
   */
  constructor(children = []) {
    this.list = children
  }

  /**
   * Copies a children relationship into a target component.
   *
   * The target receives a new array with the same handles in the same order.
   * Handles themselves are shared; this is a shallow copy of the relationship
   * list. When `target` is omitted, a new {@linkcode Children} is created.
   *
   * @param {Children} source - Relationship to copy.
   * @param {Children} [target=new Children()] - Component to populate.
   * @returns {Children} The populated target component.
   */
  static copy(source, target = new Children()) {
    target.list = source.list.slice()

    return target
  }

  /**
   * Creates a shallow clone with an independent list array.
   *
   * The cloned component keeps the same entity-handle objects as the source,
   * but changing either component's list does not change the other list.
   *
   * @param {Children} target - Relationship to clone.
   * @returns {Children} The cloned relationship.
   */
  static clone(target) {
    return Children.copy(target)
  }

  static default() {
    return new Children()
  }

  /**
   * Serializes the relationship to packed numeric entity identities.
   *
   * Each handle is converted with {@linkcode EntityHandle#id}; the resulting
   * {@linkcode EntityId}[] keeps the order of {@linkcode Children#list}. This is a numeric
   * array, not the `{ index, generation }` object produced by
   * {@linkcode EntityHandle.serialize}.
   *
   * @param {Children} value - Relationship to serialize.
   * @returns {ChildrenSerial} Packed child identities in list order.
   */
  static serialize(value) {
    return value.list.map((entity) => entity.id())
  }

  /**
   * Deserializes packed child identities into a relationship component.
   *
   * A new {@linkcode EntityHandle} is created for each numeric identity with
   * {@linkcode EntityHandle.deserialize}, and the original order is preserved.
   * When `out` is supplied, its `list` is replaced with a new array; existing
   * handles and the previous list array are not reused.
   *
   * @param {ChildrenSerial} value - Packed child identities in list order.
   * @param {Children} [out=new Children([])] - Component to populate.
   * @returns {Children} The populated output component.
   */
  static deserialize(value, out = new Children([])) {
    out.list = value.map((entity) => EntityHandle.deserialize(entity))

    return out
  }

  /**
   * Checks whether a value has the serialized children shape.
   *
   * Validation requires an array whose entries pass
   * {@linkcode EntityHandle.validateSerial}. It checks only that each entry is a
   * number; it does not check that an identity is finite, currently alive, or
   * present in a particular world.
   *
   * @param {unknown} value - Value to validate.
   * @returns {value is ChildrenSerial} Whether the value can be deserialized.
   */
  static validateSerial(value) {
    if (!Array.isArray(value)) {
      return false
    }

    for (let i = 0; i < value.length; i++) {
      if (!EntityHandle.validateSerial(value[i])) {
        return false
      }
    }

    return true
  }

  /**
   * Appends a child handle to the end of the ordered list.
   *
   * No duplicate or liveness check is performed. The method mutates
   * {@linkcode Children#list} and returns `undefined`.
   *
   * @param {EntityHandle} entity - Handle for the direct child to append.
   * @returns {void}
   */
  add(entity) {
    this.list.push(entity)
  }

  /**
   * Removes the first matching handle from the list.
   *
   * Matching uses the array's strict object identity through `indexOf`; it
   * does not use {@linkcode EntityHandle#equals}. If the exact handle object is
   * not present in a non-empty list, the current implementation passes `-1`
   * to `splice` and removes the last list entry. The method mutates
   * {@linkcode Children#list} and returns `undefined`.
   *
   * @param {EntityHandle} entity - Exact handle object to remove.
   * @returns {void}
   */
  remove(entity) {
    this.list.splice(this.list.indexOf(entity), 1)
  }

  /**
   * Returns the live ordered list of direct child handles.
   *
   * No copy is made. Relationship queries use this array for traversal, and
   * changes made through the returned reference affect the component.
   *
   * @returns {EntityHandle[]} The component's live child list.
   */
  visit() {
    return this.list
  }

  /**
   * Replaces each child handle with its mapped packed entity identity.
   *
   * For every current handle, the method looks up `entityMap.get(handle.id())`
   * and passes the result to {@linkcode EntityHandle.from}. Map values must
   * therefore be packed numeric {@linkcode EntityId} values, not
   * {@linkcode EntityHandle} objects, and every current child ID must have an
   * entry. The list is replaced with a new array of newly constructed handles;
   * the method returns `undefined`.
   *
   * @param {Map<EntityId, EntityId>} entityMap - Old-to-new packed IDs.
   * @returns {void}
   */
  map(entityMap) {
    this.list = this.list.map((e) => EntityHandle.from(entityMap.get(e.id())))
  }

  /**
   * Removes all child entries while preserving the backing array.
   *
   * References previously returned by {@linkcode Children#visit} observe the list becoming
   * empty. The method does not despawn entities or modify their {@linkcode Parent}
   * components and returns `undefined`.
   *
   * @returns {void}
   */
  clear() {
    this.list.length = 0
  }
}

/**
 * @typedef {EntityId[]} ChildrenSerial
 */
/* eslint-enable jsdoc/check-tag-names */
