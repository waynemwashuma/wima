/** @import { TypeId, Constructor } from '@wimaengine/type'*/
/** @import { FilterTransform, IdentityTransform, OptionalTransform } from './types' */
import { typeid } from '@wimaengine/type'

/**
 * Base class for filters that refine the archetypes selected by a
 * {@linkcode Query}.
 *
 * Extend this abstract class to add custom query-selection rules. Override
 * {@linkcode QueryFilter#isRequired} to change descriptor requirements or
 * {@linkcode QueryFilter#archetype} to accept only matching archetypes. The
 * default contract leaves every query descriptor required and accepts every
 * archetype.
 *
 * @example
 * ```js
 * import { Query, QueryFilter, World } from '@wimaengine/ecs'
 * import { typeid } from '@wimaengine/type'
 *
 * class Visible {}
 *
 * class VisibleOnly extends QueryFilter {
 *   constructor() {
 *     super()
 *     this.typeid = typeid(Visible)
 *   }
 *
 *   archetype(types) {
 *     return types.includes(this.typeid)
 *   }
 * }
 *
 * const world = new World()
 * world.spawn([new Visible()])
 * const query = new Query(world, [], [new VisibleOnly()])
 * ```
 *
 * @abstract
 * @template {FilterTransform} [Transform = FilterTransform]
 */
export class QueryFilter {

  /**
   * Compile-time transformation applied to a query's component tuple.
   *
   * Use an identity transform when the filter only selects archetypes, or a
   * component transform when it changes the type of a returned component. The
   * member is a typing contract and is not read while {@linkcode Query} applies
   * filters at runtime.
   *
   * @type {Transform}
   */
  // @ts-ignore
  typeTransform

  /**
   * Creates a filter base for a subclass.
   *
   * The base class is abstract and cannot be instantiated directly. A
   * subclass must call this constructor through `super()`.
   *
   * @throws {TypeError} If called as `new QueryFilter()` rather than through a subclass.
   */
  constructor() {
    if (new.target === QueryFilter) {
      throw new TypeError('QueryFilter is abstract')
    }
  }

  /**
   * Returns whether a query descriptor must be present before archetype matching.
   *
   * {@linkcode Query} calls this method once for each descriptor while the query is
   * constructed. Returning `false` removes that descriptor from the required
   * set; it does not by itself accept an archetype or change the result tuple.
   * The default keeps every descriptor required.
   *
   * @param {TypeId} _type - Descriptor TypeId being tested.
   * @returns {boolean} Whether the descriptor must be present in a matching archetype.
   */
  isRequired(_type) {
    return true
  }

  /**
   * Returns whether an archetype's component layout matches this filter.
   *
   * {@linkcode Query#update} passes the complete, read-only TypeId list from the
   * {@linkcode Archetype}. The method does not receive an entity, row, or
   * component value. The default accepts every archetype; a query includes an
   * archetype only when this method returns `true` for every configured filter.
   *
   * @param {readonly TypeId[]} _types - Complete component TypeIds in the archetype.
   * @returns {boolean} Whether the archetype is accepted by this filter.
   */
  archetype(_types) {
    return true
  }
}

/**
 * Filters a {@linkcode Query} to archetypes that contain a component type.
 *
 * Use {@linkcode has} when constructing this filter through the factory API.
 *
 * @example
 * ```js
 * import { Has, Query, World } from '@wimaengine/ecs'
 *
 * class Position {}
 * class Visible {}
 *
 * const world = new World()
 * world.spawn([new Position(), new Visible()])
 * const query = new Query(world, [Position], [new Has(Visible)])
 * ```
 *
 * @template T
 * @augments {QueryFilter<IdentityTransform>}
 */
export class Has extends QueryFilter {

  /**
   * TypeId of the component that a matching archetype must contain.
   *
   * The constructor stores `typeid(component)` here. The
   * {@linkcode Has#archetype} method compares this value with the
   * archetype's complete component TypeId list.
   *
   * @type {TypeId}
   */
  typeid

  /**
   * Creates a filter that requires a component type in matching archetypes.
   *
   * The component constructor is converted to a {@linkcode TypeId} with `typeid`
   * and stored in {@linkcode Has#typeid}. This does not add the component to a
   * {@linkcode Query}; pass the filter to the query directly or use {@linkcode has}.
   *
   * @param {Constructor<T>} component - Component constructor whose TypeId must be present.
   */
  constructor(component) {
    super()
    this.typeid = typeid(component)
  }

  /**
   * Checks whether an archetype contains the configured component type.
   *
   * This method receives the archetype's complete TypeId list.
   * Extra types are allowed; the result depends only on whether this filter's
   * TypeId is included.
   *
   * @param {readonly TypeId[]} types - Complete component TypeIds in the archetype.
   * @returns {boolean} `true` when the archetype includes {@linkcode Has#typeid}.
   */
  archetype(types) {
    return types.includes(this.typeid)
  }
}

/**
 * Creates a {@linkcode Has} filter for a component constructor.
 *
 * The returned {@linkcode QueryFilter} accepts an archetype only when its complete
 * component TypeId list includes the TypeId derived from `component`. Extra
 * components are allowed. Its identity type transform preserves the query's
 * component tuple while the filter narrows which archetypes {@linkcode Query}
 * visits.
 *
 * The factory only creates the filter; it does not mutate a {@linkcode Query} or
 * {@linkcode World}.
 *
 * @example
 * ```js
 * import { Query, World, has } from '@wimaengine/ecs'
 *
 * class Position {}
 * class Visible {}
 *
 * const world = new World()
 * world.spawn([new Position(), new Visible()])
 * world.spawn([new Position()])
 *
 * const query = new Query(world, [Position], [has(Visible)])
 * query.each(([position]) => {
 *   // Only the entity with Visible is visited; the tuple contains Position.
 *   console.log(position)
 * })
 * ```
 *
 * @template T
 * @param {Constructor<T>} component - Component constructor that must be present.
 * @returns {Has<T>} A query filter with an identity component transform.
 */
export function has(component) {
  return new Has(component)
}

/**
 * Represents a filter that makes a component descriptor optional in a
 * {@linkcode Query} while retaining its position in the result tuple.
 *
 * Use {@linkcode optional} when constructing this filter through the factory API.
 *
 * @example
 * ```js
 * import { Optional, Query, World } from '@wimaengine/ecs'
 *
 * class Position {}
 * class Velocity {}
 *
 * const world = new World()
 * world.spawn([new Position()])
 * const query = new Query(world, [Position, Velocity], [new Optional(Velocity)])
 * query.single() // [Position instance, undefined]
 * ```
 *
 * @template T
 * @augments {QueryFilter<OptionalTransform<T>>}
 */
export class Optional extends QueryFilter {

  /**
   * Type ID of the component descriptor made optional by this filter.
   *
   * {@linkcode Optional#isRequired} compares each query descriptor with
   * this value. The ID is derived from the constructor supplied to
   * {@linkcode Optional#constructor} and is not a component value or an archetype
   * ID.
   *
   * @readonly
   * @type {TypeId}
   */
  typeid

  /**
   * Creates an optional-component filter.
   *
   * The component constructor is converted to its {@linkcode TypeId} with
   * `typeid`. Construction does not add the component to a query; pass the
   * resulting filter alongside a query whose component descriptor list already
   * contains that constructor, or use {@linkcode optional}.
   *
   * @param {Constructor<T>} component - Component constructor whose descriptor may be absent.
   */
  constructor(component) {
    super()
    this.typeid = typeid(component)
  }

  /**
   * Makes only this filter's component descriptor non-required.
   *
   * {@linkcode Query} calls this method for every descriptor while building its
   * required-descriptor list. It returns `false` when `type` equals
   * {@linkcode Optional#typeid}, and `true` for every other descriptor.
   * The targeted descriptor stays in the query tuple and is read as
   * `undefined` when the matching archetype has no such component; this method
   * does not inspect an archetype or alter other filters.
   *
   * @param {TypeId} type - Query descriptor TypeId being tested.
   * @returns {boolean} `false` for this filter's TypeId; otherwise `true`.
   */
  isRequired(type) {
    return this.typeid !== type
  }

  /**
   * Accepts every archetype layout.
   *
   * An optional filter deliberately ignores the supplied TypeIds, allowing
   * archetypes both with and without {@linkcode Optional#typeid}. Other configured
   * {@linkcode QueryFilter} instances still have to accept the same
   * archetype.
   *
   * @inheritdoc
   *
   * @param {readonly TypeId[]} _types - Complete component TypeIds in the archetype.
   * @returns {boolean} Always `true`.
   */
  archetype(_types) {
    return true
  }
}

/**
 * Creates an {@linkcode Optional} filter for a component constructor.
 *
 * When passed to a {@linkcode Query}, the filter makes each matching component
 * descriptor whose TypeId matches `component` optional. The component remains
 * in its original position in each returned tuple and is `undefined` when the
 * entity's archetype does not contain it. Other filters continue to constrain
 * the query. The component constructor must already be in the query's
 * component list; this factory does not add a descriptor or tuple entry.
 *
 * @example
 * ```js
 * import { Query, World, optional } from '@wimaengine/ecs'
 *
 * class Position {}
 * class Velocity {}
 *
 * const world = new World()
 * world.spawn([new Position()])
 *
 * const query = new Query(world, [Position, Velocity], [optional(Velocity)])
 * query.each(([position, velocity]) => {
 *   // `velocity` is undefined when the entity has no Velocity component.
 * })
 * ```
 *
 * @template T
 * @param {Constructor<T>} component - Component constructor whose descriptor should be optional.
 * @returns {Optional<T>} An {@linkcode Optional} filter that allows the component to be absent from matching archetypes.
 */
export function optional(component) {
  return new Optional(component)
}

/**
 * Filters a {@linkcode Query} to archetypes that do not contain a component type.
 *
 * Use {@linkcode without} when constructing this filter through the factory API.
 *
 * @example
 * ```js
 * import { Query, Without, World } from '@wimaengine/ecs'
 *
 * class Position {}
 * class Parent {}
 *
 * const world = new World()
 * world.spawn([new Position()])
 * const query = new Query(world, [Position], [new Without(Parent)])
 * ```
 *
 * @template T
 * @augments {QueryFilter<IdentityTransform>}
 */
export class Without extends QueryFilter {

  /**
   * TypeId of the component that a matching archetype must not contain.
   *
   * The constructor stores `typeid(component)` here. The
   * {@linkcode Without#archetype} method compares this value with the
   * archetype's complete component TypeId list.
   *
   * @type {TypeId}
   */
  typeid

  /**
   * Creates a filter that excludes a component type from matching archetypes.
   *
   * The component constructor is converted to a {@linkcode TypeId} with `typeid`
   * and stored in {@linkcode Without#typeid}. This does not remove a component
   * from a {@linkcode Query}; pass the filter to the query directly or use
   * {@linkcode without}.
   *
   * @param {Constructor<T>} component - Component constructor whose TypeId must be absent.
   */
  constructor(component) {
    super()
    this.typeid = typeid(component)
  }

  /**
   * Checks whether an archetype excludes the configured component type.
   *
   * This method receives the archetype's complete TypeId list.
   * Extra types are allowed, but a list containing this filter's TypeId is
   * rejected. The inherited {@linkcode QueryFilter#isRequired} behavior
   * leaves descriptor requirements unchanged, so this filter does not make an
   * excluded descriptor optional.
   *
   * @param {readonly TypeId[]} types - Complete component TypeIds in the archetype.
   * @returns {boolean} `true` when the archetype excludes {@linkcode Without#typeid}.
   */
  archetype(types) {
    return !types.includes(this.typeid)
  }
}

/**
 * @template T
 * Creates a {@linkcode Without} {@linkcode QueryFilter} for a component constructor.
 *
 * When a {@linkcode Query} uses this filter, an archetype matches only when its
 * complete component TypeId list contains no TypeId derived from `component`.
 * Other component types are allowed. Its identity type transform
 * preserves the query's component tuple, and the filter does not add or remove
 * a descriptor. If the same component is listed in the query, it remains
 * required by default; combine with {@linkcode optional} when an absent component
 * should be returned as `undefined`.
 * All configured filters are combined, so this exclusion is applied alongside
 * any other {@linkcode QueryFilter} constraints.
 *
 * The factory only creates the filter; it does not mutate a {@linkcode Query} or
 * {@linkcode World}.
 *
 * @example
 * ```js
 * import { Query, World, without } from '@wimaengine/ecs'
 *
 * class Position {}
 * class Parent {}
 *
 * const world = new World()
 * world.spawn([new Position()])
 * world.spawn([new Position(), new Parent()])
 *
 * const roots = new Query(world, [Position], [without(Parent)])
 * roots.each(([position]) => {
 *   // Visits only Position entities without a Parent component.
 *   console.log(position)
 * })
 * ```
 *
 * @param {Constructor<T>} component - Component constructor whose TypeId must be absent from matching archetypes.
 * @returns {Without<T>} A filter that excludes archetypes containing `component`.
 */
export function without(component) {
  return new Without(component)
}
