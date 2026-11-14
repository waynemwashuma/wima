/** @import { CrossWorldScheduleConfig, CrossWorldSystemConfig, CrossWorldSystemOrderReference, SystemConfig, SystemGroupConfig } from './systemconfig' */
/** @import { ExecutableConfig, ScheduleConfig } from './executable' */
/** @import { Scheduler } from './scheduler' */
/** @import { SystemFunc } from '@wimaengine/ecs' */
/** @import { World } from '@wimaengine/ecs' */
/** @import { Constructor, TypeId } from '@wimaengine/type' */
import { assert, throws } from '@wimaengine/logger'
import { typeid } from '@wimaengine/type'
import { Graph, kahnTopologySort } from 'vifaa'
import { CrossWorldSchedule } from './crossworldschedule'
import { Executable } from './executable'
import { Schedule } from './schedule'

/**
 * Collects callback registrations, callback groups, and ordering rules for one
 * normal schedule label.
 *
 * {@linkcode SchedulerBuilder} uses this context to build the matching
 * {@linkcode Schedule}. Add callbacks and groups, resolve group relationships,
 * assign callbacks, then sort the callbacks before running the schedule.
 *
 * @example
 * ```js
 * import { ScheduleContext } from '@wimaengine/schedule'
 *
 * class Update {}
 * class MainPhase {}
 * function input() {}
 * function render() {}
 *
 * const context = new ScheduleContext(Update)
 * context.addGroup({ label: MainPhase, schedule: Update })
 * context.addSystem({ schedule: Update, systemGroup: MainPhase, system: input })
 * context.addSystem({ schedule: Update, after: ['input'], system: render })
 * context.resolveGroupParents()
 * context.assignSystemsToGroups()
 *
 * const orderedSystems = context.sortSystems()
 * ```
 */
export class ScheduleContext {

  /**
   * Creates build state for a schedule label.
   *
   * @param {Constructor} label - Constructor identifying the target schedule.
   */
  constructor(label) {
    this.label = label
  }

  /**
   * @type {Constructor}
   */
  label

  /**
   * @type {SystemRegistration[]}
   */
  systems = []

  /**
   * @type {SystemGroupRegistration[]}
   */
  groups = []

  /**
   * @type {Map<string, ScheduleNodeRef>}
   */
  nodesByLabel = new Map()

  /**
   * @type {Map<TypeId, number>}
   */
  groupIdsByTypeId = new Map()

  /**
   * @type {Map<number, number> | undefined}
   */
  graphIdsByGroupId = undefined

  /**
   * @type {Constructor | undefined}
   */
  defaultSystemGroup = undefined

  /**
   * Registers a callback group in this context.
   *
   * The group receives the next zero-based ID and starts with no callbacks.
   * Its parent and ordering references remain in `config`; parent IDs are
   * filled by {@linkcode ScheduleContext#resolveGroupParents} and callbacks are
   * assigned by {@linkcode ScheduleContext#assignSystemsToGroups}. A non-empty
   * `config.label.name` is also registered as an ordering label. An empty name
   * still registers the group but cannot be used in a name-based ordering
   * reference.
   *
   * @param {{ label: Constructor, schedule: Constructor, parent?: Constructor, before?: Array<((world: World) => void) | Constructor | string>, after?: Array<((world: World) => void) | Constructor | string> }} config - Callback group label, schedule, and ordering options.
   * @returns {SystemGroupRegistration} The internal group registration.
   * @throws {Error} If the group label is already registered, or its non-empty
   * name conflicts with an existing callback or group ordering label.
   *
   * @example
   * ```js
   * import { ScheduleContext } from '@wimaengine/schedule'
   *
   * class Update {}
   * class MainPhase {}
   * function input() {}
   *
   * const context = new ScheduleContext(Update)
   * const group = context.addGroup({ label: MainPhase, schedule: Update })
   * context.addSystem({ schedule: Update, systemGroup: MainPhase, system: input })
   *
   * // group.id is 0; the callback is assigned after the context resolves groups.
   * context.resolveGroupParents()
   * context.assignSystemsToGroups()
   * ```
   */
  addGroup(config) {
    const groupTypeId = typeid(config.label)

    if (this.groupIdsByTypeId.has(groupTypeId)) {
      throws(`Duplicate system group label "${config.label.name}" on schedule "${config.schedule.name}".`)
    }

    /** @type {SystemGroupRegistration} */
    const group = {
      id: this.groups.length,
      config,
      parentId: undefined,
      systems: []
    }

    this.groups.push(group)
    this.groupIdsByTypeId.set(groupTypeId, group.id)

    const groupLabel = config.label.name

    if (groupLabel !== '') {
      const existing = this.nodesByLabel.get(groupLabel)

      if (existing) {
        throws(`Duplicate system group label "${groupLabel}" on schedule "${config.schedule.name}". Use a unique label or direct function references in ordering.`)
      }

      this.nodesByLabel.set(groupLabel, { kind: ScheduleNodeKind.Group, id: group.id })
    }

    return group
  }

  /**
   * Registers a callback in this context.
   *
   * The callback receives the next zero-based ID. A truthy `config.label` is
   * used as its ordering label; otherwise the callback function's `name` is
   * used. A non-empty label is added to the ordering nodes, so `before` and
   * `after` references can resolve it later. Ordering references remain in
   * `config` until {@linkcode ScheduleContext#sortSystems} runs. An empty label
   * still registers the callback but cannot be resolved by name.
   *
   * @param {{ system: (world: World) => void, schedule: Constructor, label?: string, systemGroup?: Constructor, before?: Array<((world: World) => void) | Constructor | string>, after?: Array<((world: World) => void) | Constructor | string> }} config - Callback, schedule, group, and ordering options.
   * @returns {SystemRegistration} The internal callback registration.
   * @throws {Error} If the resolved non-empty label conflicts with an existing
   * callback or group ordering label.
   *
   * @example
   * ```js
   * import { ScheduleContext } from '@wimaengine/schedule'
   *
   * class Update {}
   * function input() {}
   * function render() {}
   *
   * const context = new ScheduleContext(Update)
   * context.addSystem({ schedule: Update, system: input })
   * context.addSystem({ schedule: Update, after: [input], system: render })
   *
   * const orderedSystems = context.sortSystems()
   * ```
   */
  addSystem(config) {
    const systemLabel = config.label || config.system.name

    const system = {
      id: this.systems.length,
      config
    }

    this.systems.push(system)

    if (systemLabel !== '') {
      const existing = this.nodesByLabel.get(systemLabel)

      if (existing) {
        throws(`Duplicate system label "${systemLabel}" on schedule "${config.schedule.name}". Use a unique label or direct function references in ordering.`)
      }

      this.nodesByLabel.set(systemLabel, { kind: ScheduleNodeKind.System, id: system.id })
    }

    return system
  }

  /**
   * Sets the fallback group for callbacks without an explicit `systemGroup`.
   *
   * This stores only the group label. It does not assign callbacks or check
   * that the group is registered. Lookup and validation are deferred until
   * {@linkcode ScheduleContext#assignSystemsToGroups} runs. An explicit
   * `systemGroup` takes precedence there; `undefined` leaves callbacks without
   * a group unassigned.
   *
   * @param {Constructor | undefined} defaultSystemGroup - Group label used as
   * the fallback for callbacks without an explicit group.
   * @returns {void}
   *
   * @example
   * ```js
   * import { ScheduleContext } from '@wimaengine/schedule'
   *
   * class Update {}
   * class MainPhase {}
   * function tick() {}
   *
   * const context = new ScheduleContext(Update)
   * context.setDefaultSystemGroup(MainPhase)
   * context.addGroup({ label: MainPhase, schedule: Update })
   * context.addSystem({ schedule: Update, system: tick })
   * context.resolveGroupParents()
   * context.assignSystemsToGroups()
   * ```
   */
  setDefaultSystemGroup(defaultSystemGroup) {
    this.defaultSystemGroup = defaultSystemGroup
  }

  /**
   * Resolves callback-group parents and validates the hierarchy.
   *
   * Each configured parent constructor must already be registered in this
   * context. The matching zero-based group ID is stored as `parentId`, and
   * cyclic nesting is rejected before group ordering is expanded.
   *
   * @returns {void}
   * @throws {Error} If a parent group is missing or group nesting is cyclic.
   *
   * @example
   * ```js
   * import { ScheduleContext } from '@wimaengine/schedule'
   *
   * class Update {}
   * class MainPhase {}
   * class RenderPhase {}
   *
   * const context = new ScheduleContext(Update)
   * context.addGroup({ label: MainPhase, schedule: Update })
   * context.addGroup({ label: RenderPhase, parent: MainPhase, schedule: Update })
   * context.resolveGroupParents()
   * ```
   */
  resolveGroupParents() {
    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i]
      const parentLabel = group.config.parent

      if (!parentLabel) continue

      const parentId = this.groupIdsByTypeId.get(typeid(parentLabel))

      if (parentId === undefined) {
        throws(`The parent system group "${parentLabel.name}" must be registered explicitly before it can be used on schedule "${this.label.name}".`)
      }

      group.parentId = parentId
    }

    this.assertNoGroupCycles()
  }

  /**
   * Assigns registered callbacks to explicit or default groups.
   *
   * For each callback, `systemGroup` takes precedence over the fallback set
   * with {@linkcode ScheduleContext#setDefaultSystemGroup}. Callbacks with
   * neither remain outside all groups. The selected group must already be
   * registered, and its ID is appended to that group's callback list. This
   * method does not order callbacks.
   *
   * @returns {void}
   * @throws {Error} If an explicit or default callback group is not registered.
   *
   * @example
   * ```js
   * import { ScheduleContext } from '@wimaengine/schedule'
   *
   * class Update {}
   * class DefaultPhase {}
   * class ExplicitPhase {}
   * function update() {}
   * function render() {}
   *
   * const context = new ScheduleContext(Update)
   * context.addGroup({ label: DefaultPhase, schedule: Update })
   * context.addGroup({ label: ExplicitPhase, schedule: Update })
   * context.setDefaultSystemGroup(DefaultPhase)
   * context.addSystem({ schedule: Update, system: update })
   * context.addSystem({ schedule: Update, systemGroup: ExplicitPhase, system: render })
   * context.assignSystemsToGroups()
   * ```
   */
  assignSystemsToGroups() {
    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i]
      const groupLabel = system.config.systemGroup ?? this.defaultSystemGroup

      if (!groupLabel) continue

      const groupId = this.groupIdsByTypeId.get(typeid(groupLabel))

      if (groupId === undefined) {
        throws(`The system group "${groupLabel.name}" must be registered explicitly before it can be used on schedule "${this.label.name}".`)
      }

      this.groups[groupId].systems.push(system.id)
    }
  }

  /**
   * Resolves ordering constraints and returns callbacks in execution order.
   *
   * The context expands nested group membership into a directed graph, applies
   * each callback and group `before`/`after` constraint, and topologically
   * sorts the graph. Empty groups remain ordering nodes; groups with callbacks
   * expand their constraints to those callbacks. The returned array contains
   * callback registrations only; group nodes are not returned. The normal build
   * sequence calls {@linkcode ScheduleContext#resolveGroupParents} and
   * {@linkcode ScheduleContext#assignSystemsToGroups} before this method.
   *
   * @returns {SystemRegistration[]} Callback registrations ordered for the target schedule.
   * @throws {Error} If a reference is unknown, creates a self-ordering edge, or
   * produces cyclic callback ordering constraints.
   */
  sortSystems() {
    const { graph, systemsByGraphId } = this.expandScheduleGraph()
    const sorted = kahnTopologySort(graph)

    if (!sorted) {
      throws(`Schedule "${this.label.name}" contains cyclic system ordering constraints.`)
    }

    /** @type {SystemRegistration[]} */
    const ordered = []

    for (let i = 0; i < sorted.length; i++) {
      const system = systemsByGraphId.get(sorted[i])

      if (!system) continue

      ordered.push(system)
    }

    return ordered
  }

  /**
   * @returns {{ graph: Graph<SystemRegistration | SystemGroupRegistration, undefined>, systemsByGraphId: Map<number, SystemRegistration> }}
   */
  expandScheduleGraph() {
    const graph = /** @type {Graph<SystemRegistration | SystemGroupRegistration, undefined>} */ (new Graph(true))

    /** @type {Map<number, number>} */
    const graphIdsBySystemId = new Map()

    /** @type {Map<number, number>} */
    const graphIdsByGroupId = new Map()

    this.graphIdsByGroupId = graphIdsByGroupId

    /** @type {Map<number, SystemRegistration>} */
    const systemsByGraphId = new Map()

    /** @type {Map<number, number[]>} */
    const groupSystemsCache = new Map()

    /** @type {Set<string>} */
    const edges = new Set()

    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i]
      const graphId = graph.addNode(group)

      graphIdsByGroupId.set(group.id, graphId)
    }

    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i]
      const graphId = graph.addNode(system)

      graphIdsBySystemId.set(system.id, graphId)
      systemsByGraphId.set(graphId, system)
    }

    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i]

      this.addNodeOrdering(graph, graphIdsBySystemId, edges, {
        kind: ScheduleNodeKind.System,
        id: system.id
      }, system.config.before, system.config.after, groupSystemsCache)
    }

    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i]

      this.addNodeOrdering(graph, graphIdsBySystemId, edges, {
        kind: ScheduleNodeKind.Group,
        id: group.id
      }, group.config.before, group.config.after, groupSystemsCache)
    }

    return {
      graph,
      systemsByGraphId
    }
  }

  /**
   * @param {Graph<SystemRegistration | SystemGroupRegistration, undefined>} graph
   * @param {Map<number, number>} graphIdsBySystemId
   * @param {Set<string>} edges
   * @param {ScheduleNodeRef} source
   * @param {(SystemFunc | Constructor | string)[] | undefined} before
   * @param {(SystemFunc | Constructor | string)[] | undefined} after
   * @param {Map<number, number[]>} groupSystemsCache
   */
  addNodeOrdering(graph, graphIdsBySystemId, edges, source, before, after, groupSystemsCache) {
    if (before) {

      for (let i = 0; i < before.length; i++) {
        const label = describeReference(before[i])

        this.addExpandedEdge(graph, graphIdsBySystemId, edges, source, this.resolveNode(label), before[i], groupSystemsCache)
        this.addExpandedEdge(graph, graphIdsBySystemId, edges, source, this.resolveNode(label), label, groupSystemsCache)
      }
    }

    if (after) {
      for (let i = 0; i < after.length; i++) {
        const label = describeReference(after[i])

        this.addExpandedEdge(graph, graphIdsBySystemId, edges, this.resolveNode(label), source, after[i], groupSystemsCache)
        this.addExpandedEdge(graph, graphIdsBySystemId, edges, this.resolveNode(label), source, label, groupSystemsCache)
      }
    }
  }

  /**
   * @param {string} label
   * @returns {ScheduleNodeRef}
   */
  resolveNode(label) {
    const stringLabel = /** @type {string} */ (label)
    const node = this.nodesByLabel.get(stringLabel)

    if (!node) {
      throws(`Could not resolve the system or system group label "${stringLabel}" on schedule "${this.label.name}".`)
    }

    return node
  }

  /**
   * @param {Graph<SystemRegistration | SystemGroupRegistration, undefined>} graph
   * @param {Map<number, number>} graphIdsBySystemId
   * @param {Set<string>} edges
   * @param {ScheduleNodeRef} from
   * @param {ScheduleNodeRef} to
   * @param {SystemFunc | Constructor | string} targetLabel
   * @param {Map<number, number[]>} groupSystemsCache
   */
  addExpandedEdge(graph, graphIdsBySystemId, edges, from, to, targetLabel, groupSystemsCache) {
    const fromNodes = this.expandNodeToOrderingNodes(from, graphIdsBySystemId, groupSystemsCache)
    const toNodes = this.expandNodeToOrderingNodes(to, graphIdsBySystemId, groupSystemsCache)

    for (let i = 0; i < fromNodes.length; i++) {
      for (let j = 0; j < toNodes.length; j++) {
        const fromNodeId = fromNodes[i]
        const toNodeId = toNodes[j]

        if (fromNodeId === toNodeId) {
          throws(`The reference "${describeReference(targetLabel)}" creates a self-referential system ordering on schedule "${this.label.name}".`)
        }

        const key = `${fromNodeId}:${toNodeId}`

        if (edges.has(key)) continue

        edges.add(key)
        graph.addEdge(fromNodeId, toNodeId, undefined)
      }
    }
  }

  /**
   * @param {ScheduleNodeRef} node
   * @param {Map<number, number>} graphIdsBySystemId
   * @param {Map<number, number[]>} groupSystemsCache
   * @returns {number[]}
   */
  expandNodeToOrderingNodes(node, graphIdsBySystemId, groupSystemsCache) {
    if (node.kind === ScheduleNodeKind.System) {
      const graphId = graphIdsBySystemId.get(node.id)

      assert(graphId, `Internal error: Could not resolve graph node for system ${node.id} on schedule "${this.label.name}".`)

      return [graphId]
    }

    const systems = this.expandGroupToSystems(node.id, groupSystemsCache, new Set())

    if (systems.length > 0) {

      /** @type {number[]} */
      const graphIds = []

      for (let i = 0; i < systems.length; i++) {
        const graphId = graphIdsBySystemId.get(systems[i])

        assert(graphId, `Internal error: Could not resolve graph node for system ${systems[i]} on schedule "${this.label.name}".`)
        graphIds.push(graphId)
      }

      return graphIds
    }

    const graphId = this.expandGroupToGraphNode(node.id)

    return [graphId]
  }

  /**
   * @param {number} groupId
   * @returns {number}
   */
  expandGroupToGraphNode(groupId) {
    const graphId = this.graphIdsByGroupId?.get(groupId)

    assert(graphId, `Internal error: Could not resolve graph node for system group ${groupId} on schedule "${this.label.name}".`)

    return graphId
  }

  /**
   * @param {ScheduleNodeRef} node
   * @param {Map<number, number[]>} groupSystemsCache
   * @returns {number[]}
   */
  expandNodeToSystems(node, groupSystemsCache) {
    if (node.kind === ScheduleNodeKind.System) return [node.id]

    return this.expandGroupToSystems(node.id, groupSystemsCache, new Set())
  }

  /**
   * @param {number} groupId
   * @param {Map<number, number[]>} cache
   * @param {Set<number>} visiting
   * @returns {number[]}
   */
  expandGroupToSystems(groupId, cache, visiting) {
    const cached = cache.get(groupId)

    if (cached) return cached

    if (visiting.has(groupId)) {
      const group = this.groups[groupId]

      throws(`Schedule "${this.label.name}" contains cyclic system group nesting involving "${group.config.label.name}".`)
    }

    visiting.add(groupId)

    /** @type {number[]} */
    const systems = [...this.groups[groupId].systems]

    for (let i = 0; i < this.groups.length; i++) {
      const child = this.groups[i]

      if (child.parentId !== groupId) continue

      const childSystems = this.expandGroupToSystems(child.id, cache, visiting)

      for (let j = 0; j < childSystems.length; j++) {
        systems.push(childSystems[j])
      }
    }

    visiting.delete(groupId)
    cache.set(groupId, systems)

    return systems
  }

  /**
   * Validates that group nesting is acyclic.
   */
  assertNoGroupCycles() {

    /** @type {GroupVisitState[]} */
    const state = new Array(this.groups.length).fill(GroupVisitState.Unvisited)

    for (let i = 0; i < this.groups.length; i++) {
      this.visitGroupHierarchy(i, state)
    }
  }

  /**
   * @param {number} groupId
   * @param {GroupVisitState[]} state
   */
  visitGroupHierarchy(groupId, state) {
    const visitState = state[groupId]

    if (visitState === GroupVisitState.Visiting) {
      const group = this.groups[groupId]

      throws(`Schedule "${this.label.name}" contains cyclic system group nesting involving "${group.config.label.name}".`)
    }

    if (visitState === GroupVisitState.Visited) return

    state[groupId] = GroupVisitState.Visiting

    const { parentId } = this.groups[groupId]

    if (parentId !== undefined) {
      this.visitGroupHierarchy(parentId, state)
    }

    state[groupId] = GroupVisitState.Visited
  }
}

/**
 * Collects cross-world callback registrations and ordering rules for one
 * schedule label.
 *
 * {@linkcode SchedulerBuilder} uses this context to order callbacks before
 * populating the runtime {@linkcode CrossWorldSchedule}.
 *
 * @example
 * ```js
 * import { CrossWorldScheduleContext } from '@wimaengine/schedule'
 *
 * class Synchronize {}
 * function copy(target, source) {}
 * function flush(target, source) {}
 *
 * const context = new CrossWorldScheduleContext(Synchronize)
 * context.addSystem({ schedule: Synchronize, system: copy })
 * context.addSystem({ schedule: Synchronize, after: [copy], system: flush })
 *
 * const orderedSystems = context.sortSystems()
 * ```
 */
export class CrossWorldScheduleContext {

  /**
   * Creates build state for a cross-world schedule label.
   *
   * @param {Constructor} label - Constructor identifying the target schedule.
   */
  constructor(label) {
    this.label = label
  }

  /**
   * Schedule constructor used to identify this build context.
   *
   * @type {Constructor}
   */
  label

  /**
   * Cross-world callbacks registered for this schedule, in registration order.
   *
   * Each registration receives a zero-based ID equal to its position when it
   * is added. The builder later uses the ordered registrations to populate the
   * matching {@linkcode CrossWorldSchedule}.
   *
   * @type {CrossWorldSystemRegistration[]}
   */
  systems = []

  /**
   * Maps non-empty callback labels to ordering-node references.
   *
   * {@linkcode CrossWorldScheduleContext#addSystem} resolves a label from
   * `config.label` or `config.system.name`; ordering references are looked up
   * here before graph edges are added.
   *
   * @type {Map<string, ScheduleNodeRef>}
   */
  nodesByLabel = new Map()

  /**
   * Registers a cross-world callback in this context.
   *
   * The returned registration receives the next zero-based ID. A truthy
   * `config.label`, or the callback function's name when it is absent or empty,
   * becomes the ordering label. A non-empty label is registered for `before`
   * and `after` references. Duplicate non-empty labels are rejected
   * immediately. Ordering references are stored in `config` and resolved later
   * by {@linkcode CrossWorldScheduleContext#sortSystems}.
   *
   * @param {{ system: (targetWorld: World, sourceWorld: World) => void, schedule: Constructor, label?: string, before?: Array<((targetWorld: World, sourceWorld: World) => void) | Constructor | string>, after?: Array<((targetWorld: World, sourceWorld: World) => void) | Constructor | string> }} config - Callback, schedule, and ordering options.
   * @returns {CrossWorldSystemRegistration} The internal callback registration.
   * @throws {Error} If the resolved non-empty label is already registered.
   *
   * @example
   * ```js
   * import { CrossWorldScheduleContext } from '@wimaengine/schedule'
   *
   * class Synchronize {}
   * function copy(target, source) {}
   * function flush(target, source) {}
   *
   * const context = new CrossWorldScheduleContext(Synchronize)
   * context.addSystem({ schedule: Synchronize, system: copy })
   * context.addSystem({ schedule: Synchronize, after: [copy], system: flush })
   * ```
   */
  addSystem(config) {
    const systemLabel = config.label || config.system.name

    const system = {
      id: this.systems.length,
      config
    }

    this.systems.push(system)

    if (systemLabel !== '') {
      const existing = this.nodesByLabel.get(systemLabel)

      if (existing) {
        throws(`Duplicate system label "${systemLabel}" on schedule "${config.schedule.name}". Use a unique label or direct function references in ordering.`)
      }

      this.nodesByLabel.set(systemLabel, { kind: ScheduleNodeKind.System, id: system.id })
    }

    return system
  }

  /**
   * Resolves ordering constraints and returns callbacks in execution order.
   *
   * The context expands each registered callback and its `before`/`after`
   * references into a directed graph, then applies a topological sort. The
   * returned array contains callback registrations only. Cross-world contexts
   * do not expand callback groups.
   *
   * Missing labels and self-referential edges are rejected while the graph is
   * expanded. If the resolved graph contains a cycle, this method throws
   * instead of returning a partial order.
   *
   * @returns {CrossWorldSystemRegistration[]} Callback registrations ordered for the schedule.
   * @throws {Error} If a label is missing, an edge is self-referential, or the ordering graph is cyclic.
   */
  sortSystems() {
    const { graph, systemsByGraphId } = this.expandScheduleGraph()
    const sorted = kahnTopologySort(graph)

    if (!sorted) {
      throws(`Schedule "${this.label.name}" contains cyclic system ordering constraints.`)
    }

    /** @type {CrossWorldSystemRegistration[]} */
    const ordered = []

    for (let i = 0; i < sorted.length; i++) {
      const system = systemsByGraphId.get(sorted[i])

      if (!system) continue

      ordered.push(system)
    }

    return ordered
  }

  /**
   * Expands registered callbacks and ordering constraints into a directed graph.
   *
   * One graph node is created for each callback, and `systemsByGraphId` maps
   * graph nodes back to their registrations. Each `before` reference adds an
   * edge from the current callback to the referenced callback; each `after`
   * reference adds the reverse edge. Duplicate edges are ignored. This method
   * builds the graph but does not sort it; use
   * {@linkcode CrossWorldScheduleContext#sortSystems} for the ordered registrations.
   *
   * @returns {{ graph: Graph<CrossWorldSystemRegistration, undefined>, systemsByGraphId: Map<number, CrossWorldSystemRegistration> }} The graph and its registration lookup.
   * @throws {Error} If an ordering label is missing or creates a self-reference.
   */
  expandScheduleGraph() {
    const graph = /** @type {Graph<CrossWorldSystemRegistration, undefined>} */ (new Graph(true))

    /** @type {Map<number, number>} */
    const graphIdsBySystemId = new Map()

    /** @type {Map<number, CrossWorldSystemRegistration>} */
    const systemsByGraphId = new Map()

    /** @type {Set<string>} */
    const edges = new Set()

    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i]
      const graphId = graph.addNode(system)

      graphIdsBySystemId.set(system.id, graphId)
      systemsByGraphId.set(graphId, system)
    }

    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i]

      this.addNodeOrdering(graph, graphIdsBySystemId, edges, {
        kind: ScheduleNodeKind.System,
        id: system.id
      }, system.config.before, system.config.after)
    }

    return {
      graph,
      systemsByGraphId
    }
  }

  /**
   * Adds graph edges for one callback's ordering constraints.
   *
   * Each `before` reference creates an edge from `source` to the referenced
   * callback. Each `after` reference creates an edge from the referenced
   * callback to `source`. References are converted to labels and resolved
   * through {@linkcode CrossWorldScheduleContext#resolveNode}; duplicate edges
   * are ignored by {@linkcode CrossWorldScheduleContext#addExpandedEdge}.
   *
   * @param {Graph<CrossWorldSystemRegistration, undefined>} graph - Ordering graph being built.
   * @param {Map<number, number>} graphIdsBySystemId - Registration IDs to graph IDs.
   * @param {Set<string>} edges - Directed edges already added to the graph.
   * @param {ScheduleNodeRef} source - Callback whose constraints are being applied.
   * @param {CrossWorldSystemOrderReference[] | undefined} before - Callbacks that must run after `source`.
   * @param {CrossWorldSystemOrderReference[] | undefined} after - Callbacks that must run before `source`.
   * @returns {void}
   * @throws {Error} If a reference is missing or creates a self-referential edge.
   */
  addNodeOrdering(graph, graphIdsBySystemId, edges, source, before, after) {
    if (before) {
      for (let i = 0; i < before.length; i++) {
        const label = describeReference(before[i])

        this.addExpandedEdge(graph, graphIdsBySystemId, edges, source, this.resolveNode(label), before[i])
      }
    }

    if (after) {
      for (let i = 0; i < after.length; i++) {
        const label = describeReference(after[i])

        this.addExpandedEdge(graph, graphIdsBySystemId, edges, this.resolveNode(label), source, after[i])
      }
    }
  }

  /**
   * @param {string} label
   * @returns {ScheduleNodeRef}
   */
  resolveNode(label) {
    const node = this.nodesByLabel.get(label)

    if (!node) {
      throws(`Could not resolve the system label "${label}" on schedule "${this.label.name}".`)
    }

    return node
  }

  /**
   * Adds one directed graph edge between two registered callbacks.
   *
   * The endpoint registrations are converted to graph node IDs. An edge that
   * has already been added is ignored. An edge whose endpoints are the same
   * callback is rejected because it creates a self-referential ordering.
   *
   * @param {Graph<CrossWorldSystemRegistration, undefined>} graph - Ordering graph being built.
   * @param {Map<number, number>} graphIdsBySystemId - Registration IDs to graph IDs.
   * @param {Set<string>} edges - Directed edges already added to the graph.
   * @param {ScheduleNodeRef} from - Source callback node.
   * @param {ScheduleNodeRef} to - Destination callback node.
   * @param {CrossWorldSystemOrderReference} targetLabel - Original reference used for error reporting.
   * @returns {void}
   * @throws {Error} If the edge points from a callback to itself.
   */
  addExpandedEdge(graph, graphIdsBySystemId, edges, from, to, targetLabel) {
    const fromNodeId = this.expandNodeToOrderingNode(from, graphIdsBySystemId)
    const toNodeId = this.expandNodeToOrderingNode(to, graphIdsBySystemId)

    if (fromNodeId === toNodeId) {
      throws(`The reference "${describeReference(targetLabel)}" creates a self-referential system ordering on schedule "${this.label.name}".`)
    }

    const key = `${fromNodeId}:${toNodeId}`

    if (edges.has(key)) return

    edges.add(key)
    graph.addEdge(fromNodeId, toNodeId, undefined)
  }

  /**
   * Resolves a registered callback node to its graph node ID.
   *
   * @param {ScheduleNodeRef} node - Registered callback node reference.
   * @param {Map<number, number>} graphIdsBySystemId - Registration IDs to graph IDs.
   * @returns {number} The graph node ID.
   * @throws {Error} If the registration has no graph node in the current expansion.
   */
  expandNodeToOrderingNode(node, graphIdsBySystemId) {
    const graphId = graphIdsBySystemId.get(node.id)

    assert(graphId, `Internal error: Could not resolve graph node for system ${node.id} on schedule "${this.label.name}".`)

    return graphId
  }
}

/**
 * Collects build-time configuration for normal and cross-world schedules,
 * callback groups, and callbacks.
 *
 * The builder stores this configuration until it is pushed to a
 * {@linkcode Scheduler}, where it becomes runtime schedules and executables.
 *
 * @example
 * ```js
 * import { Scheduler, SchedulerBuilder } from '@wimaengine/schedule'
 *
 * class Update {}
 * class MainWorld {}
 * function update(world) {
 *   console.log('update', world)
 * }
 *
 * const builder = new SchedulerBuilder()
 * builder.addSchedule({ label: Update, world: MainWorld })
 * builder.add({ schedule: Update, system: update })
 *
 * const scheduler = new Scheduler()
 * builder.pushToScheduler(scheduler)
 * ```
 */
export class SchedulerBuilder {

  /**
   * Derived normal-schedule contexts keyed by `typeid(scheduleLabel)`.
   *
   * Contexts are created when the builder is pushed to a scheduler; they hold
   * registrations while callback groups and ordering constraints are resolved.
   *
   * @private
   * @type {Map<string, ScheduleContext>}
   */
  schedules = new Map()

  /**
   * Derived cross-world schedule contexts keyed by `typeid(scheduleLabel)`.
   *
   * Contexts are created when the builder is pushed to a scheduler and hold
   * cross-world callback registrations while their ordering is resolved.
   *
   * @private
   * @type {Map<string, CrossWorldScheduleContext>}
   */
  crossWorldSchedules = new Map()

  /**
   * Queued normal-schedule records.
   *
   * @private
   * @type {ScheduleConfig[]}
   */
  scheduleConfigs = []

  /**
   * Queued cross-world schedule records.
   *
   * @private
   * @type {CrossWorldScheduleConfig[]}
   */
  crossWorldScheduleConfigs = []

  /**
   * Queued normal callback records.
   *
   * @private
   * @type {SystemConfig[]}
   */
  systems = []

  /**
   * Queued cross-world callback records.
   *
   * @private
   * @type {CrossWorldSystemConfig[]}
   */
  crossWorldSystems = []

  /**
   * Queued normal callback-group records.
   *
   * @private
   * @type {SystemGroupConfig[]}
   */
  systemGroups = []

  /**
   * Clears queued configuration and derived schedule contexts.
   *
   * This replaces all normal and cross-world config arrays and context maps
   * with empty collections. It does not modify a {@linkcode Scheduler} previously
   * passed to {@linkcode SchedulerBuilder#pushToScheduler}. Call this before
   * reusing a builder for a new build; pushing does not clear the builder.
   *
   * @returns {SchedulerBuilder} This builder after its state is reset.
   *
   * @example
   * ```js
   * import { SchedulerBuilder } from '@wimaengine/schedule'
   *
   * const builder = new SchedulerBuilder()
   * builder.addSchedule({ label: class Update {} })
   * const sameBuilder = builder.clear()
   *
   * sameBuilder === builder // true
   * ```
   */
  clear() {
    this.scheduleConfigs = []
    this.crossWorldScheduleConfigs = []
    this.systems = []
    this.crossWorldSystems = []
    this.systemGroups = []
    this.schedules = new Map()
    this.crossWorldSchedules = new Map()

    return this
  }

  /**
   * Queues a normal schedule for the next build push.
   *
   * The config is stored as provided. It does not validate the target world or
   * register an executable immediately. During
   * {@linkcode SchedulerBuilder#pushToScheduler}, the explicit `world`, or
   * `defaultWorld` when `world` is absent, is checked before a
   * {@linkcode Schedule} executable is registered with the target
   * {@linkcode Scheduler}.
   *
   * @param {ScheduleConfig} config - Schedule label and runtime options.
   * @returns {void}
   *
   * @example
   * ```js
   * import { SchedulerBuilder } from '@wimaengine/schedule'
   *
   * class Update {}
   * class MainWorld {}
   *
   * const builder = new SchedulerBuilder()
   * builder.addSchedule({ label: Update, world: MainWorld })
   * // The executable is created when builder.pushToScheduler(...) runs.
   * ```
   */
  addSchedule(config) {
    this.scheduleConfigs.push(config)
  }

  /**
   * Queues a cross-world schedule for the next build push.
   *
   * The config is stored as provided. It does not validate the worlds or
   * register an executable immediately. During
   * {@linkcode SchedulerBuilder#pushToScheduler}, the target `world` uses
   * `defaultWorld` only when the config has no world, and `sourceWorld` is
   * required before a {@linkcode CrossWorldSchedule} executable is registered.
   *
   * @param {CrossWorldScheduleConfig} config - Cross-world schedule label, worlds, and runtime options.
   * @returns {void}
   *
   * @example
   * ```js
   * import { SchedulerBuilder } from '@wimaengine/schedule'
   *
   * class Synchronize {}
   * class MainWorld {}
   * class SourceWorld {}
   *
   * const builder = new SchedulerBuilder()
   * builder.addCrossWorldSchedule({
   *   label: Synchronize,
   *   world: MainWorld,
   *   sourceWorld: SourceWorld
   * })
   * // Registration is deferred until builder.pushToScheduler(...).
   * ```
   */
  addCrossWorldSchedule(config) {
    this.crossWorldScheduleConfigs.push(config)
  }

  /**
   * Queues a normal callback for the next build push.
   *
   * The config remains in the builder until
   * {@linkcode SchedulerBuilder#createScheduleContexts} assigns it to a
   * {@linkcode ScheduleContext}. Registration and ordering validation are
   * deferred until {@linkcode SchedulerBuilder#pushToScheduler}.
   *
   * @param {{ system: (world: World) => void, schedule: Constructor, label?: string, systemGroup?: Constructor, before?: Array<((world: World) => void) | Constructor | string>, after?: Array<((world: World) => void) | Constructor | string> }} config - Callback, schedule, group, and ordering options.
   * @returns {void}
   */
  add(config) {
    this.systems.push(config)
  }

  /**
   * Queues a cross-world callback for the next build push.
   *
   * The config remains in the builder until
   * {@linkcode SchedulerBuilder#createCrossWorldScheduleContexts} assigns it to a
   * {@linkcode CrossWorldScheduleContext}. Label and ordering validation are
   * deferred until the context is built and sorted.
   *
   * @param {{ system: (targetWorld: World, sourceWorld: World) => void, schedule: Constructor, label?: string, before?: Array<((targetWorld: World, sourceWorld: World) => void) | Constructor | string>, after?: Array<((targetWorld: World, sourceWorld: World) => void) | Constructor | string> }} config - Cross-world callback, schedule, and ordering options.
   * @returns {void}
   */
  addCrossworldSystem(config) {
    this.crossWorldSystems.push(config)
  }

  /**
   * Queues a normal callback-group configuration for the next build push.
   *
   * The group is not registered immediately. During context creation,
   * {@linkcode ScheduleContext} validates its label, parent relationship, and
   * ordering references.
   *
   * @param {{ label: Constructor, schedule: Constructor, parent?: Constructor, before?: Array<((world: World) => void) | Constructor | string>, after?: Array<((world: World) => void) | Constructor | string> }} config - Group label, schedule, parent, and ordering options.
   * @returns {void}
   */
  addGroup(config) {
    this.systemGroups.push(config)
  }

  /**
   * Builds the collected configuration into a runtime scheduler.
   *
   * Each queued normal schedule creates an {@linkcode Executable} with a new
   * {@linkcode Schedule} and registers it with {@linkcode Scheduler#set}. Each
   * queued cross-world schedule creates an executable with a new
   * {@linkcode CrossWorldSchedule} and registers it with
   * {@linkcode Scheduler#setCrossWorld}. The executable constructor supplies
   * defaults for omitted options such as `repeat` and `delay`.
   *
   * For both schedule kinds, `config.world` takes precedence over
   * `defaultWorld`; a target world is checked before the executable is
   * created. Cross-world configs also require `config.sourceWorld`; there is
   * no source-world fallback. Missing worlds throw before callback contexts
   * are built.
   *
   * Callback-group and callback configs are then collected into
   * {@linkcode ScheduleContext} instances. The last queued `defaultSystemGroup`
   * for a schedule type ID is used as the context's fallback group. Group
   * parents and assignments are resolved before ordered callbacks are added to
   * the matching schedule from {@linkcode Scheduler#get}. Cross-world callbacks
   * are collected into {@linkcode CrossWorldScheduleContext} instances and added
   * in resolved order to schedules from {@linkcode Scheduler#getCrossWorld}.
   * Each required runtime schedule must exist in `scheduler`.
   *
   * This method does not clear queued configuration or derived contexts; call
   * {@linkcode SchedulerBuilder#clear} before collecting a new build.
   *
   * @param {Scheduler} scheduler - Runtime scheduler receiving executables and callbacks.
   * @param {Constructor | undefined} defaultWorld - Fallback target-world label for configs without a world.
   * @returns {void}
   * @throws {Error} If a required world or runtime schedule is missing, or if context validation or ordering fails.
   */
  pushToScheduler(scheduler, defaultWorld) {
    for (let i = 0; i < this.scheduleConfigs.length; i++) {
      const config = this.scheduleConfigs[i]
      const world = config.world || defaultWorld

      assert(world, `The world for schedule "${config.label.name}" is not set.`)

      const executableConfig = /** @type {ExecutableConfig<Schedule, undefined>} */ ({
        ...config,
        world,
        schedule: new Schedule()
      })

      scheduler.set(/** @type {Executable<Schedule, undefined>} */ (new Executable(executableConfig)))
    }

    for (let i = 0; i < this.crossWorldScheduleConfigs.length; i++) {
      const config = this.crossWorldScheduleConfigs[i]
      const world = config.world || defaultWorld

      assert(world, `The world for crossworld schedule "${config.label.name}" is not set.`)
      assert(config.sourceWorld, `The source world for crossworld schedule "${config.label.name}" is not set.`)

      const executableConfig = /** @type {ExecutableConfig<CrossWorldSchedule, Constructor>} */ ({
        ...config,
        world,
        schedule: new CrossWorldSchedule()
      })

      scheduler.setCrossWorld(/** @type {Executable<CrossWorldSchedule, Constructor>} */ (new Executable(executableConfig)))
    }

    /** @type {Map<string,  Constructor>} */
    const defaultGroupsBySchedule = new Map()

    for (let i = 0; i < this.scheduleConfigs.length; i++) {
      const config = this.scheduleConfigs[i]

      defaultGroupsBySchedule.set(typeid(config.label), config.defaultSystemGroup)
    }

    const schedules = this.createScheduleContexts(defaultGroupsBySchedule)

    for (const [, context] of schedules) {
      const schedule = scheduler.get(context.label)

      assert(schedule, `The schedule label "${context.label.name}" is not set in the provided \`Scheduler\`.`)

      for (const system of context.sortSystems()) {
        schedule.add(system.config.system)
      }
    }

    const crossWorldSchedules = this.createCrossWorldScheduleContexts()

    for (const [, context] of crossWorldSchedules) {
      const schedule = scheduler.getCrossWorld(context.label)

      assert(schedule, `The crossworld schedule label "${context.label.name}" is not set in the provided \`Scheduler\`.`)

      for (const system of context.sortSystems()) {
        schedule.add(system.config.system)
      }
    }
  }

  /**
   * Builds normal-schedule contexts from queued callback groups and callbacks.
   *
   * Configs are grouped by `typeid(config.schedule)`. Groups are registered
   * before callbacks, so callbacks can refer to groups collected in the same
   * builder. Each context receives the default group mapped for its schedule,
   * then resolves group parents and assigns callbacks to groups. Ordering is
   * left to {@linkcode ScheduleContext#sortSystems} during the push.
   *
   * The existing `schedules` map is reused; this method does not reset it.
   * Duplicate labels and invalid group relationships therefore surface during
   * context registration or validation rather than when configs are queued.
   *
   * @private
   * @param {Map<string, Constructor | undefined>} defaultGroupsBySchedule
   * @returns {Map<string, ScheduleContext>} The derived normal-schedule contexts.
   */
  createScheduleContexts(defaultGroupsBySchedule) {
    for (let i = 0; i < this.systemGroups.length; i++) {
      const config = this.systemGroups[i]
      const context = getOrCreateScheduleContext(this.schedules, config.schedule)

      context.addGroup(config)
    }

    for (let i = 0; i < this.systems.length; i++) {
      const config = this.systems[i]
      const context = getOrCreateScheduleContext(this.schedules, config.schedule)

      context.addSystem(config)
    }

    for (const [, context] of this.schedules) {
      context.setDefaultSystemGroup(defaultGroupsBySchedule.get(typeid(context.label)))
      context.resolveGroupParents()
      context.assignSystemsToGroups()
    }

    return this.schedules
  }

  /**
   * Builds cross-world contexts from queued cross-world callbacks.
   *
   * Configs are grouped by `typeid(config.schedule)` and registered in their
   * collection order. Label conflicts are detected by
   * {@linkcode CrossWorldScheduleContext#addSystem}; ordering references are
   * resolved later by {@linkcode CrossWorldScheduleContext#sortSystems}. The
   * existing `crossWorldSchedules` map is reused rather than reset.
   *
   * @private
   * @returns {Map<string, CrossWorldScheduleContext>} The derived cross-world contexts.
   */
  createCrossWorldScheduleContexts() {
    for (let i = 0; i < this.crossWorldSystems.length; i++) {
      const config = this.crossWorldSystems[i]
      const context = getOrCreateCrossWorldScheduleContext(this.crossWorldSchedules, config.schedule)

      context.addSystem(config)
    }

    return this.crossWorldSchedules
  }

  /**
   * Shared builder instance for code that uses the engine's singleton build
   * configuration.
   *
   * Clear it before starting a new independent build with
   * {@linkcode SchedulerBuilder#clear}.
   *
   * @type {SchedulerBuilder}
   */
  static Instance = new SchedulerBuilder()
}

/**
 * @param {Map<string, ScheduleContext>} schedules
 * @param {Constructor} label
 * @returns {ScheduleContext}
 */
function getOrCreateScheduleContext(schedules, label) {
  const scheduleTypeId = typeid(label)
  const existing = schedules.get(scheduleTypeId)

  if (existing) return existing

  const created = new ScheduleContext(label)

  schedules.set(scheduleTypeId, created)

  return created
}

/**
 * @param {Map<string, CrossWorldScheduleContext>} schedules
 * @param {Constructor} label
 * @returns {CrossWorldScheduleContext}
 */
function getOrCreateCrossWorldScheduleContext(schedules, label) {
  const scheduleTypeId = typeid(label)
  const existing = schedules.get(scheduleTypeId)

  if (existing) return existing

  const created = new CrossWorldScheduleContext(label)

  schedules.set(scheduleTypeId, created)

  return created
}

/**
 * @param {Function | Constructor | string} reference
 */
function describeReference(reference) {
  if (typeof reference === 'string') return reference

  return reference.name || '<anonymous>'
}

/** @enum {number} */
const ScheduleNodeKind = Object.freeze({
  System: 0,
  Group: 1
})

/**
 * @typedef SystemRegistration
 * @property {number} id
 * @property {SystemConfig} config
 */

/**
 * @typedef SystemGroupRegistration
 * @property {number} id
 * @property {SystemGroupConfig} config
 * @property {number | undefined} parentId
 * @property {number[]} systems
 */

/**
 * @typedef CrossWorldSystemRegistration
 * @property {number} id
 * @property {CrossWorldSystemConfig} config
 */

/**
 * @typedef ScheduleNodeRef
 * @property {ScheduleNodeKind} kind
 * @property {number} id
 */

/**
 * @enum {number}
 */
const GroupVisitState = Object.freeze({
  Unvisited: 0,
  Visiting: 1,
  Visited: 2
})
