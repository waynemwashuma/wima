/** @import { ComponentId } from './typedef'*/
/** @import { Constructor,TypeId } from '@wimaengine/type'*/

import { typeid } from '@wimaengine/type'
import { ComponentInfo } from './component'

/**
 * Registers component constructors and explicit {@linkcode TypeId} values,
 * mapping each type to a dense {@linkcode ComponentId} and retaining its
 * {@linkcode ComponentInfo} metadata.
 *
 * A {@linkcode World} owns one store for its component types. Constructor-based
 * methods derive a {@linkcode TypeId} with {@linkcode typeid}; {@linkcode TypeId}-based
 * methods accept that key directly. The first registration of a type receives
 * the next zero-based component ID. Registering the same {@linkcode TypeId} returns
 * its existing ID and keeps its existing {@linkcode ComponentInfo}.
 *
 * Use the lookup methods to inspect registration and metadata. A returned
 * {@linkcode ComponentInfo} exposes its {@linkcode ComponentHooks} through
 * {@linkcode ComponentInfo#getHooks}; normal hook configuration goes through
 * {@linkcode World#setComponentHooks}.
 *
 * @example
 * ```js
 * import { TypeStore } from '@wimaengine/ecs'
 *
 * class Position {}
 * const store = new TypeStore()
 * const id = store.getOrSet(Position)
 *
 * store.getId(Position) === id // true
 * store.get(Position)?.getHooks() // the component's ComponentHooks
 * store.getOrSet(Position) === id // true: registration is idempotent
 * ```
 */
export class TypeStore {

  /**
   * Maps each registered {@linkcode TypeId} to its dense {@linkcode ComponentId}.
   *
   * @private
   * @type {Map<TypeId,ComponentId>}
   */
  map = new Map()

  /**
   * Component metadata in component-ID order. The entry at index `id` is the
   * {@linkcode ComponentInfo} returned for that component ID.
   *
   * @private
   * @type {Array<ComponentInfo>}
   */
  list = []

  /**
   * Registers a component constructor and returns its component ID.
   *
   * The constructor is converted to a {@linkcode TypeId} before registration. If
   * that {@linkcode TypeId} is already registered, this method returns the
   * existing ID and does not replace its {@linkcode ComponentInfo}; otherwise it
   * assigns the next zero-based ID and creates a metadata record.
   *
   * @template T
   * @param {Constructor<T>} type - Component constructor to register.
   * @returns {ComponentId} The existing or newly assigned component ID.
   */
  set(type) {
    const typeId = typeid(type)

    return this.setByTypeId(typeId)
  }

  /**
   * Registers a component {@linkcode TypeId} and returns its component ID.
   *
   * Registration is idempotent. An existing {@linkcode TypeId} keeps its
   * original zero-based ID and metadata; a new {@linkcode TypeId} is appended to
   * the metadata list and receives the list's previous length.
   *
   * @param {TypeId} id - Component type ID to register.
   * @returns {ComponentId} The existing or newly assigned component ID.
   */
  setByTypeId(id) {
    const hasid = this.map.get(id)

    if (hasid !== undefined) return hasid

    const compId = this.list.length

    this.map.set(id, compId)
    this.list.push(new ComponentInfo(compId, id))

    return compId
  }

  /**
   * Checks whether a component constructor has been registered.
   *
   * This is a lookup only: it derives the constructor's {@linkcode TypeId} and
   * does not add an entry when the type is missing.
   *
   * @template T
   * @param {Constructor<T>} type - Component constructor to look up.
   * @returns {boolean} Whether the constructor's {@linkcode TypeId} is registered.
   */
  has(type) {
    return this.map.has(typeid(type))
  }

  /**
   * Checks whether a component ID is within the store's current ID range.
   *
   * The check uses only the numeric bounds `0 <= id < getInfos().length`; it
   * does not read or validate the entry at that index.
   *
   * @param {ComponentId} id - Component ID to check.
   * @returns {boolean} Whether `id` is in the current component-ID range.
   */
  hasId(id) {
    return id < this.list.length && id >= 0
  }

  /**
   * Looks up {@linkcode ComponentInfo} metadata by a component constructor.
   *
   * The constructor is converted to its {@linkcode TypeId}. Missing types are not
   * registered and return `undefined`.
   *
   * @template T
   * @param {Constructor<T>} type - Component constructor to look up.
   * @returns {ComponentInfo | undefined} The metadata record, if registered.
   */
  get(type) {
    return this.getByTypeId(typeid(type))
  }

  /**
   * Looks up {@linkcode ComponentInfo} metadata by component ID.
   *
   * @param {ComponentId} id - Component ID to look up.
   * @returns {ComponentInfo | undefined} The metadata record, if the index exists.
   */
  getById(id) {
    return this.list[id]
  }

  /**
   * Looks up {@linkcode ComponentInfo} metadata by an explicit component
   * {@linkcode TypeId}.
   *
   * @param {TypeId} typeId - Component type ID to look up.
   * @returns {ComponentInfo | undefined} The metadata record, if registered.
   */
  getByTypeId(typeId) {
    const id = this.getIdByTypeId(typeId)

    if (id === void 0) return undefined

    return this.getById(id)
  }

  /**
   * Looks up a component ID by constructor without registering the type.
   *
   * @template T
   * @param {Constructor<T>} type - Component constructor to look up.
   * @returns {ComponentId | undefined} The ID, or `undefined` if it is missing.
   */
  getId(type) {
    return this.getIdByTypeId(typeid(type))
  }

  /**
   * Looks up a component ID by explicit {@linkcode TypeId} without registering
   * the type.
   *
   * @param {TypeId} id - Component type ID to look up.
   * @returns {ComponentId | undefined} The ID, or `undefined` if it is missing.
   */
  getIdByTypeId(id) {
    return this.map.get(id)
  }

  /**
   * Returns the existing component ID or registers a constructor when missing.
   *
   * The constructor is converted to a {@linkcode TypeId}. This is equivalent to
   * calling {@linkcode TypeStore#set}; both preserve an existing registration.
   *
   * @template T
   * @param {Constructor<T>} component - Component constructor to retrieve or register.
   * @returns {ComponentId} The existing or newly assigned component ID.
   */
  getOrSet(component) {
    return this.getOrSetByTypeId(typeid(component))
  }

  /**
   * Returns the existing component ID or registers a {@linkcode TypeId} when
   * missing.
   *
   * A missing {@linkcode TypeId} is registered with
   * {@linkcode TypeStore#setByTypeId}; an existing {@linkcode TypeId} keeps its
   * current ID and metadata.
   *
   * @param {TypeId} typeId - Component type ID to retrieve or register.
   * @returns {ComponentId} The existing or newly assigned component ID.
   */
  getOrSetByTypeId(typeId) {
    const id = this.getIdByTypeId(typeId)

    if (id !== undefined) return id

    return this.setByTypeId(typeId)
  }

  /**
   * Returns the component metadata records in component-ID order.
   *
   * The returned value is the store's live backing array, not a snapshot.
   * Entries are {@linkcode ComponentInfo} values, so their
   * {@linkcode ComponentInfo#getHooks} method exposes the associated
   * {@linkcode ComponentHooks}.
   *
   * @returns {Iterable<ComponentInfo>} The live metadata list.
   */
  getInfos() {
    return this.list
  }
}
