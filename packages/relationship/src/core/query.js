/** @import { ApplyFilters, QueryFilter,EntityId } from '@wimaengine/ecs' */
/** @import { Constructor, TupleConstructor } from '@wimaengine/type' */
import { Query, World, EntityHandle } from '@wimaengine/ecs'
import { TraverseEntities } from './traverseentities'

/**
 * Queries and traverses relationships while reading data from both sides of
 * each connection.
 *
 * The `relationship` constructor identifies the component on the entity being
 * expanded. That component must implement {@linkcode TraverseEntities}; its
 * {@linkcode TraverseEntities#visit} result supplies the connected entity
 * handles. The `target` constructor identifies the component required on each
 * connected entity. The query uses one ECS {@linkcode Query} for each side, so
 * the same data tuple and filters can be applied to both the relationship and
 * target entities.
 *
 * Use {@linkcode RelationshipQuery#treebfs} or {@linkcode RelationshipQuery#treedfs}
 * when the relationship is a hierarchy and repeated visits should follow its
 * structure. Use {@linkcode RelationshipQuery#graphbfs} or
 * {@linkcode RelationshipQuery#graphdfs} when connections can meet or form
 * cycles and entity IDs should be tracked while walking.
 *
 * @example
 * ```js
 * import { EntityHandle, World } from '@wimaengine/ecs'
 * import { Children, Parent } from '@wimaengine/hierarchy'
 * import { RelationshipQuery } from '@wimaengine/relationship'
 *
 * const world = new World()
 * const root = world.spawn([new Children()])
 * const child = world.spawn([new Parent(root)])
 * world.get(root, Children).list.push(child)
 *
 * const query = new RelationshipQuery(world, Children, Parent, [EntityHandle])
 * query.treebfs(root, ([childHandle], [parentHandle]) => {
 *   console.log(parentHandle.id(), childHandle.id())
 * })
 * ```
 *
 * @template {TraverseEntities} Relationship
 * @template {TraverseEntities} [Target = Relationship]
 * @template {unknown[]} [Data = [EntityHandle]]
 * @template {QueryFilter[]} [Filter = []]
 */
export class RelationshipQuery {

  /**
   * @readonly
   * @type {Constructor<Relationship>}
   */
  relationship

  /**
   * @readonly
   * @type {Constructor<Target>}
   */
  target

  /**
   * @private
   * @type {Query<[Relationship,...Data], Filter>}
   */
  ancestors

  /**
   * @private
   * @type {Query<[Target,...Data], Filter>}
   */
  descendants

  /**
   * Creates relationship and target queries for a world.
   *
   * The relationship-side query matches `[relationship, ...data]` on the
   * entity currently being expanded. The target-side query matches
   * `[target, ...data]` on each handle returned by the relationship. In both
   * result tuples, the leading relationship or target component is consumed
   * by the traversal and the remaining `data` values are passed to `visit`.
   * Both queries use the supplied filters; see {@linkcode Query} for query-cache
   * and filter behavior.
   *
   * @param {World} world - World whose entities the query reads.
   * @param {Constructor<Relationship>} relationship - Relationship component on entities being expanded. It must implement {@linkcode TraverseEntities}.
   * @param {Constructor<Target>} [target=relationship] - Target component required on connected entities. Defaults to the relationship constructor.
   * @param {[...TupleConstructor<Data>]} [data=[EntityHandle]] - Additional component constructors returned to the callback on both sides. Defaults to {@linkcode EntityHandle}.
   * @param {[...Filter]} [filter=[]] - Filters applied to both the relationship-side and target-side queries.
   */
  constructor(
    world,
    relationship,

    // SAFETY: matches the default `Target`.
    target = /** @type {Constructor<Target>}*/ (/** @type {unknown} */ (relationship)),

    // SAFETY: matches the default `Data`.
    data = /** @type {[...TupleConstructor<Data>]} */([EntityHandle]),

    // SAFETY: matches the default `Filter`.
    filter = /** @type {Filter}*/([])
  ) {
    this.relationship = relationship
    this.target = target

    // SAFETY: `components` instance type is the same type as `Data` generic,
    // no idea why ts is not catching that.
    this.ancestors = /** @type {Query<[Relationship, ...Data],Filter>} */ (new Query(world, [relationship, ...data], filter))
    this.descendants = /** @type {Query<[Target, ...Data],Filter>} */ (new Query(world, [target, ...data], filter))
  }

  /**
   * Traverses relationship edges breadth-first without tracking visited IDs.
   *
   * Every relationship result is queued in the order returned by
   * {@linkcode TraverseEntities#visit}, so the traversal follows the
   * relationship structure level by level and may revisit an entity when the
   * structure reaches it again. For each edge whose target query matches,
   * `visit` receives `(descendantData, ancestorData)` in that order. A missing
   * target match skips the callback, but the handle is still queued and can
   * be expanded if its relationship query matches. If the starting entity has
   * no relationship match, the traversal finishes without invoking `visit`.
   *
   * @param {EntityHandle} entity - Entity from which to begin traversal.
   * @param {(
   *   descendant: ApplyFilters<Data, Filter>,
   *   ancestor: ApplyFilters<Data, Filter>
   * ) => void} visit - Called with the descendant data first and ancestor data second.
   * @returns {void}
   */
  treebfs(entity, visit) {
    const queue = [entity]

    while (queue.length) {

      // SAFETY: `stack` is dense and an element is guaranteed to exist
      // as we check the length above.
      const ancestorEntity = /** @type {EntityHandle}*/(queue.shift())
      const ancestor = /** @type {[Relationship, ...Data] | null} */ (this.ancestors.get(ancestorEntity))

      if (!ancestor) continue

      const [relationship, ...ancestorData] = ancestor
      const descendants = relationship.visit()

      queue.push(...descendants)

      for (let i = 0; i < descendants.length; i++) {

        const descendant = /** @type {[Target, ...Data] | null} */ (this.descendants.get(descendants[i]))

        if (!descendant) continue

        const [, ...descendantData] = descendant

        visit(
          /** @type {ApplyFilters<Data, Filter>} */ (descendantData),
          /** @type {ApplyFilters<Data, Filter>} */ (ancestorData)
        )
      }
    }
  }

  /**
   * Traverses relationship edges depth-first without tracking visited IDs.
   *
   * Children are visited in the order returned by
   * {@linkcode TraverseEntities#visit}, descending before the next sibling.
   * Every structural occurrence is eligible to be visited again. The
   * callback receives `(descendantData, ancestorData)` in that order. If the
   * starting entity has no relationship match, the method returns immediately.
   * For an edge, a missing ancestor or target query match skips the callback
   * and does not expand that descendant further.
   *
   * @param {EntityHandle} entity - Entity from which to begin traversal.
   * @param {(
   *   descendant: ApplyFilters<Data, Filter>,
   *   ancestor: ApplyFilters<Data, Filter>
   * ) => void} visit - Called with the descendant data first and ancestor data second.
   * @returns {void}
   */
  treedfs(entity, visit) {

    /** @type {[EntityHandle,EntityHandle][]} */
    const stack = []
    const root = /** @type {[Relationship, ...Data] | null} */ (this.ancestors.get(entity))

    if (!root) return

    const [relationship] = root

    stack.push(
      ...relationship.visit()
        .map((c) => /** @type {[EntityHandle,EntityHandle]} */([entity, c]))
        .reverse()
    )

    while (stack.length) {
      const [ancestorEntity, descendantEntity] = stack.pop()
      const ancestor = /** @type {[Relationship, ...Data] | null} */ (this.ancestors.get(ancestorEntity))
      const descendant = /** @type {[Target, ...Data] | null} */ (this.descendants.get(descendantEntity))

      if (!ancestor || !descendant) continue

      const [, ...descendantData] = descendant
      const [, ...ancestorData] = ancestor

      visit(
        /** @type {ApplyFilters<Data, Filter>} */ (descendantData),
        /** @type {ApplyFilters<Data, Filter>} */ (ancestorData)
      )

      const grand = /** @type {[Relationship, ...Data] | null} */ (this.ancestors.get(descendantEntity))

      if (grand) stack.push(
        ...grand[0].visit()
          .map((c) => /** @type {[EntityHandle,EntityHandle]} */([descendantEntity, c]))
          .reverse()
      )
    }
  }

  /**
   * Traverses relationship edges breadth-first while tracking visited IDs.
   *
   * An entity whose ID has already been visited is skipped when it is removed
   * from the queue. Descendant handles whose IDs are already visited are
   * filtered before a relationship result is queued; duplicate edges can
   * therefore still be reported when they are queued before the target ID is
   * marked visited. For each matching target, `visit` receives
   * `(descendantData, ancestorData)` in that order. A missing ancestor match
   * skips that queue entry. A missing target match skips only the callback;
   * the handle remains eligible for expansion if it has relationship data.
   *
   * @param {EntityHandle} entity - Entity from which to begin traversal.
   * @param {(
   *   descendant: ApplyFilters<Data, Filter>,
   *   ancestor: ApplyFilters<Data, Filter>
   * ) => void} visit - Called with the descendant data first and ancestor data second.
   * @returns {void}
   */
  graphbfs(entity, visit) {
    const queue = [entity]

    /** @type {Set<EntityId>} */
    const visited = new Set()

    while (queue.length) {

      // SAFETY: `stack` is dense and an element is guaranteed to exist
      // as we check the length above.
      const ancestorEntity = /** @type {EntityHandle}*/(queue.shift())
      const ancestorEntityId = ancestorEntity.id()
      const ancestor = /** @type {[Relationship, ...Data] | null} */ (this.ancestors.get(ancestorEntity))

      if (visited.has(ancestorEntityId)) continue
      if (!ancestor) continue

      const [relationship, ...ancestorData] = ancestor
      const descendants = relationship.visit().filter((e) => !visited.has(e.id()))

      queue.push(...descendants)
      visited.add(ancestorEntityId)

      for (let i = 0; i < descendants.length; i++) {
        const descendantEntity = descendants[i]
        const descendant = /** @type {[Target, ...Data] | null} */ (this.descendants.get(descendantEntity))

        if (!descendant) continue

        const [, ...descendantData] = descendant

        visit(
          /** @type {ApplyFilters<Data, Filter>} */ (descendantData),
          /** @type {ApplyFilters<Data, Filter>} */ (ancestorData)
        )
      }
    }
  }

  /**
   * Traverses relationship edges depth-first while tracking visited IDs.
   *
   * The starting entity must match the relationship-side query; otherwise the
   * method returns immediately. Before each edge is processed, a visited
   * descendant ID skips that edge. When both query sides match, `visit` receives
   * `(descendantData, ancestorData)` in that order, then the edge's ancestor ID
   * is recorded as visited before its relationship is expanded. A missing
   * ancestor or target match skips the edge and does not expand it. The
   * traversal therefore follows graph IDs rather than treating every
   * structural occurrence as a new tree node.
   *
   * @param {EntityHandle} entity - Entity from which to begin traversal.
   * @param {(
   *   descendant: ApplyFilters<Data, Filter>,
   *   ancestor: ApplyFilters<Data, Filter>
   * ) => void} visit - Called with the descendant data first and ancestor data second.
   * @returns {void}
   */
  graphdfs(entity, visit) {

    /** @type {[EntityHandle,EntityHandle][]} */
    const stack = []

    /** @type {Set<EntityId>} */
    const visited = new Set()
    const root = /** @type {[Relationship, ...Data] | null} */ (this.ancestors.get(entity))

    if (!root) return

    const [rootRelationship] = root

    stack.push(
      ...rootRelationship.visit()
        .map((c) => /** @type {[EntityHandle,EntityHandle]} */([entity, c]))
        .reverse()
    )
    while (stack.length) {
      const [ancestorEntity, descendantEntity] = stack.pop()

      if (visited.has(descendantEntity.id())) continue

      const ancestor = /** @type {[Relationship, ...Data] | null} */ (this.ancestors.get(ancestorEntity))
      const descendant = /** @type {[Target, ...Data] | null} */ (this.descendants.get(descendantEntity))

      if (!ancestor || !descendant) continue

      const [, ...descendantData] = descendant
      const [, ...ancestorData] = ancestor

      visit(
        /** @type {ApplyFilters<Data, Filter>} */ (descendantData),
        /** @type {ApplyFilters<Data, Filter>} */ (ancestorData)
      )
      visited.add(ancestorEntity.id())
      const grand = /** @type {[Relationship, ...Data] | null} */ (this.ancestors.get(descendantEntity))

      if (grand) stack.push(
        ...grand[0].visit()
          .map((c) => /** @type {[EntityHandle,EntityHandle]} */([descendantEntity, c]))
          .filter(([e]) => !visited.has(e.id()))
          .reverse()
      )
    }
  }
}
