/** @import { CrossWorldScheduleConfig, CrossWorldSystemConfig, Runner, ScheduleConfig, SystemConfig, SystemGroupConfig } from '@wimaengine/schedule' */
/** @import { Constructor,TypeId } from '@wimaengine/type'*/

import { World, ComponentHooks } from '@wimaengine/ecs'
import { assert, assertTrue } from '@wimaengine/logger'
import { Scheduler, SchedulerBuilder } from '@wimaengine/schedule'
import { typeid } from '@wimaengine/type'
import { Worlds } from './worlds'

const registererror = 'Schedules, crossworld schedules, system groups, systems, crossworld systems, plugins, worlds, resource aliases or resources should be registered or set before `App().run()`'

/**
 * Internal registry that tracks plugin instances staged for an {@linkcode App}.
 *
 * Most API users interact with this registry through
 * {@linkcode App#registerPlugin} rather than calling it directly. Each plugin is
 * identified by the {@linkcode TypeId} returned by {@linkcode Plugin#name}. The
 * registry preserves insertion order, rejects duplicate IDs, visits plugins
 * added during lifecycle passes, and validates declared dependencies before
 * finalization.
 *
 * @example
 * ```js
 * import { App, Plugin } from '@wimaengine/app'
 *
 * class ChildPlugin extends Plugin {}
 *
 * class ParentPlugin extends Plugin {
 *   register(app) {
 *     // The child is appended after the parent during the same pass.
 *     app.registerPlugin(new ChildPlugin())
 *   }
 * }
 *
 * new App()
 *   .registerPlugin(new ParentPlugin())
 *   .setRunner(() => {})
 *   .run()
 * // Both lifecycle hooks visit ChildPlugin after ParentPlugin.
 * ```
 */
export class PluginRegistry {

  /**
   * Plugin instances in registration order.
   *
   * Nested registrations are appended to this array. The
   * {@linkcode PluginRegistry#register} and {@linkcode PluginRegistry#finish} loops
   * continue through those appended entries.
   *
   * @type {Plugin[]}
   */
  list = []

  /**
   * Type IDs accepted by {@linkcode PluginRegistry#add}.
   *
   * This set is used for duplicate detection and by
   * {@linkcode PluginRegistry#hasTypeId}; it does not contain plugin instances
   * and does not determine hook order.
   *
   * @type {Set<TypeId>}
   */
  names = new Set()

  /**
   * Parent IDs for plugins registered from another plugin hook.
   *
   * A child ID maps to the active parent ID. Direct app registrations have no
   * entry. The map is used only to format duplicate-registration traces; it is
   * not used for dependency validation or lifecycle ordering.
   *
   * @type {Map<TypeId, TypeId>}
   */
  parents = new Map()

  /**
   * Active plugin IDs while a lifecycle hook is executing.
   *
   * {@linkcode PluginRegistry#register} and {@linkcode PluginRegistry#finish} push
   * the current plugin before calling its hook and pop it after the hook
   * returns. The last ID is the parent used when that hook registers another
   * plugin.
   *
   * @type {TypeId[]}
   */
  stack = []

  /**
   * Adds a plugin instance in insertion order.
   *
   * The plugin's {@linkcode Plugin#name} supplies its identity. When called from
   * an active plugin hook, the current stack entry is recorded as the new
   * plugin's parent for duplicate-registration diagnostics. A duplicate ID
   * throws before the list or ID set is changed.
   *
   * @param {Plugin} plugin
   * @returns {void}
   * @throws {Error} When the plugin's ID is already registered.
   */
  add(plugin) {
    const pluginId = plugin.name()

    if (this.names.has(pluginId)) {
      throw new Error(`The plugin \`${pluginId}\` is already registered.${formatRegistrationTrace(this, pluginId)}`)
    }

    const parentId = this.stack[this.stack.length - 1]

    this.list.push(plugin)
    this.names.add(pluginId)

    if (parentId === undefined) {
      this.parents.delete(pluginId)
    } else {
      this.parents.set(pluginId, parentId)
    }
  }

  /**
   * Checks whether a plugin ID is registered.
   *
   * @param {TypeId} pluginId
   * @returns {boolean} Whether the ID has been accepted by
   * {@linkcode PluginRegistry#add}.
   */
  hasTypeId(pluginId) {
    return this.names.has(pluginId)
  }

  /**
   * Alias for {@linkcode PluginRegistry#hasTypeId} used by registry callers.
   *
   * @param {TypeId} pluginId
   * @returns {boolean} Whether the ID is registered.
   */
  has(pluginId) {
    return this.hasTypeId(pluginId)
  }

  /**
   * Marks a plugin hook as active for nested-registration tracking.
   *
   * This pushes the ID onto {@linkcode PluginRegistry#stack}; it does not
   * register or validate a plugin by itself.
   *
   * @param {TypeId} pluginId
   * @returns {void}
   */
  enter(pluginId) {
    this.stack.push(pluginId)
  }

  /**
   * Leaves the most recently entered plugin hook.
   *
   * @returns {void}
   */
  leave() {
    this.stack.pop()
  }

  /**
   * Runs each plugin's registration hook in insertion order.
   *
   * The list is allowed to grow during this pass, so plugins registered from
   * a running {@linkcode Plugin#register} hook are visited later in the same
   * pass. Each hook runs with its ID on {@linkcode PluginRegistry#stack}; this
   * method does not validate dependencies or run finish hooks.
   *
   * @param {App} app
   * @returns {void}
   */
  register(app) {
    for (let i = 0; i < this.list.length; i++) {
      const plugin = this.list[i]

      this.enter(plugin.name())
      plugin.register(app)
      this.leave()
    }
  }

  /**
   * Runs each plugin's finish hook in insertion order.
   *
   * Plugins added while a finish hook runs are appended and visited later in
   * this same pass. Dependency validation has already happened before this
   * method is called, so plugins added here are not included in that earlier
   * validation pass.
   *
   * @param {App} app
   * @returns {void}
   */
  finish(app) {
    for (let i = 0; i < this.list.length; i++) {
      const plugin = this.list[i]

      this.enter(plugin.name())
      plugin.finish(app)
      this.leave()
    }
  }

  /**
   * Validates the plugin dependencies declared by {@linkcode Plugin#requires}.
   *
   * Every registered plugin is asked for its required IDs, and each ID is
   * checked through {@linkcode App#hasPlugin}. This method does not load missing
   * plugins, reorder hooks, or interpret dependencies as lifecycle order.
   *
   * @param {App} app
   * @returns {void}
   * @throws {Error} When a required plugin ID is not registered with the app.
   */
  assertDependencies(app) {
    for (let i = 0; i < this.list.length; i++) {
      const plugin = this.list[i]
      const pluginId = plugin.name()
      const requires = plugin.requires()

      for (let j = 0; j < requires.length; j++) {
        const requiredId = requires[j]

        assertTrue(
          app.hasPlugin(requiredId),
          `The plugin \`${pluginId}\` requires \`${requiredId}\`, but it is not registered.`
        )
      }
    }
  }
}

/**
 * Application container for configuring worlds and resources before startup.
 *
 * Stage worlds, resources, component hooks, schedules, scheduled work, and
 * plugins before calling {@linkcode App#run}. Use {@linkcode App#setRunner} to
 * provide the app callback invoked after startup setup. The callback can drive
 * execution through the prepared runtime and read resources from the app's
 * worlds.
 *
 * @example
 * ```js
 * import { App, Plugin } from '@wimaengine/app'
 *
 * class MainWorld {}
 * class Settings {}
 *
 * class GameplayPlugin extends Plugin {
 *   register(app) {
 *     app
 *       .setWorld(MainWorld)
 *       .defaultWorld(MainWorld)
 *       .setResource(new Settings())
 *   }
 * }
 *
 * new App()
 *   .registerPlugin(new GameplayPlugin())
 *   .setRunner((_scheduler, worlds) => {
 *     const world = worlds.getWorld(MainWorld)
 *     console.log(world.getResource(Settings))
 *   })
 *   .run()
 * ```
 */
export class App {

  /**
   * Registry of plugin instances staged for startup.
   *
   * @private
   * @type {PluginRegistry}
   */
  plugins = new PluginRegistry()

  /**
   * Component lifecycle hooks waiting to be applied to every world by
   * {@linkcode App#run}; the map is keyed by component type ID.
   *
   * @private
   * @type {Map<TypeId, { component: Constructor, hooks: ComponentHooks }>}
   */
  componentHooks = new Map()

  /**
   * Resource aliases waiting to be applied to every world by
   * {@linkcode App#run}; the map is keyed by alias type ID.
   *
   * @private
   * @type {Map<TypeId, { id: TypeId, alias: Constructor }>}
   */
  resourceAliases = new Map()

  /**
   * Resources staged for application to worlds by {@linkcode App#run}.
   * The outer `undefined` key represents the default world; other keys are
   * world type IDs, and each inner map is keyed by resource type ID.
   *
   * @private
   * @type {Map<TypeId | undefined, Map<TypeId, unknown>>}
   */
  resources = new Map()

  /**
   * Registry of worlds created for this app and selected by world type ID.
   *
   * @private
   * @type {Worlds}
   */
  worlds = new Worlds()

  /**
   * Constructor label used as the default world when the app prepares scheduled
   * work.
   *
   * @private
   * @type {Constructor | undefined}
   */
  defaultWorldLabel = undefined

  /**
   * Prepared runtime passed to the app callback after {@linkcode App#run}
   * completes startup setup.
   *
   * @private
   * @type {Scheduler}
   */
  scheduler = new Scheduler()

  /**
   * App callback invoked by {@linkcode App#run} after startup configuration and
   * staged resources are ready.
   *
   * @private
   * @type {Runner | undefined}
   */
  runner = undefined

  /**
   * Whether startup has completed far enough to lock configuration methods.
   *
   * @private
   * @type {boolean}
   */
  initialized = false

  /**
   * Returns the app's default world or the world identified by a label.
   *
   * With no label, this uses the label selected by {@linkcode App#defaultWorld}.
   * A missing default or requested world causes the lookup to throw.
   *
   * @param {Constructor | undefined} [label]
   * @returns {World}
   */
  getWorld(label) {
    return this.worlds.getWorld(label)
  }

  /**
   * Checks whether a plugin type ID is already registered with the app.
   *
   * This is useful from a plugin's {@linkcode Plugin#requires} contract;
   * it does not return the plugin instance.
   *
   * @param {TypeId} pluginId
   * @returns {boolean}
   */
  hasPlugin(pluginId) {
    return this.plugins.hasTypeId(pluginId)
  }

  /**
   * Registers a world identified by a constructor label.
   *
   * The label is converted with {@linkcode typeid}; calling this again for the
   * same label has no effect. The world is created immediately, while staged
   * resources, aliases, and component hooks are applied during {@linkcode App#run}.
   *
   * @param {Constructor} label
   * @returns {this}
   */
  setWorld(label) {
    assertTrue(!this.initialized, registererror)

    const worldId = typeid(label)
    const world = this.worlds.get(worldId)

    if (world) {
      return this
    }

    const newWorld = new World()

    this.worlds.set(worldId, newWorld)

    return this
  }

  /**
   * Selects the label used as the app's default world.
   *
   * This records the label and does not create or validate the world. Create it
   * first with {@linkcode App#setWorld}; a later lookup of the missing
   * world will assert.
   *
   * @param {Constructor} label
   * @returns {this}
   */
  defaultWorld(label) {
    assertTrue(!this.initialized, registererror)
    this.worlds.defaultWorldId = typeid(label)
    this.defaultWorldLabel = label

    return this
  }

  /**
   * Stages a schedule configuration for app startup.
   *
   * The schedule becomes available to the app callback after
   * {@linkcode App#run}; this method records the configuration and does not
   * execute scheduled work.
   *
   * @param {ScheduleConfig} config
   * @returns {this}
   */
  createSchedule(config) {
    assertTrue(!this.initialized, registererror)

    SchedulerBuilder.Instance.addSchedule(config)

    return this
  }

  /**
   * Stages a schedule configuration for work shared across worlds.
   *
   * The schedule becomes available to the app callback after
   * {@linkcode App#run}; this method does not execute scheduled work.
   *
   * @param {CrossWorldScheduleConfig} config
   * @returns {this}
   */
  registerCrossWorldSchedule(config) {
    assertTrue(!this.initialized, registererror)

    SchedulerBuilder.Instance.addCrossWorldSchedule(config)

    return this
  }

  /**
   * Sets the callback that drives app execution.
   *
   * {@linkcode App#run} calls this function with the prepared execution state as
   * its first argument and the app's worlds as its second, after plugin
   * registration, world configuration, resource application, and scheduled
   * work setup. The runner is required; `run` throws if it is still unset. This
   * method itself is not blocked after initialization, although it should be
   * called before `run`.
   *
   * @param {Runner} runner
   * @returns {this}
   */
  setRunner(runner) {
    this.runner = runner

    return this
  }

  /**
   * Completes app startup and invokes its callback.
   *
   * Startup proceeds in this order:
   *
   * 1. Registered plugins run their {@linkcode Plugin#register} hooks.
   * 2. Plugin dependencies are checked, then plugins run their
   *    {@linkcode Plugin#finish} hooks.
   * 3. Staged component hooks and resource aliases are applied to every world;
   *    staged resources are applied to their default or labeled worlds.
   * 4. Staged schedules and scheduled work are prepared for execution.
   * 5. The configured runner callback receives the prepared execution state and
   *    the app's worlds.
   *
   * The app is marked initialized immediately before the runner is invoked.
   * If no runner was set, `run` throws before that flag is set. If the runner
   * throws, that exception propagates. Configuration methods guarded by the
   * initialized state reject calls after startup; {@linkcode App#getWorld},
   * {@linkcode App#hasPlugin}, and {@linkcode App#setRunner} are not among those
   * guarded methods. `run` itself has no initialized-state guard, so calling it
   * again repeats plugin lifecycle and runner invocation with the app's current
   * state. The guarded configuration methods are {@linkcode App#setWorld},
   * {@linkcode App#defaultWorld}, {@linkcode App#createSchedule},
   * {@linkcode App#registerCrossWorldSchedule}, {@linkcode App#registerPlugin},
   * {@linkcode App#registerDebugger}, {@linkcode App#registerSystem},
   * {@linkcode App#registerCrossworldSystem}, {@linkcode App#registerSystemGroup},
   * {@linkcode App#setComponentHooks}, {@linkcode App#setResource},
   * {@linkcode App#setResourceByTypeId}, and {@linkcode App#setResourceAlias}.
   *
   * @returns {this}
   */
  run() {
    this.plugins.register(this)
    this.plugins.assertDependencies(this)
    this.plugins.finish(this)
    this.applyComponentHooks()
    this.applyResourceAliases()
    this.flushResources()

    SchedulerBuilder.Instance.pushToScheduler(this.scheduler, this.defaultWorldLabel)
    assert(this.runner, 'App runner is not set. Call `app.setRunner(...)` before `app.run()`.')
    this.initialized = true
    this.runner(this.scheduler, this.worlds)

    return this
  }

  /**
   * Registers a plugin instance for the app's startup lifecycle.
   *
   * Registered plugins are invoked in insertion order during {@linkcode App#run};
   * duplicate plugin type IDs are rejected. A plugin's
   * {@linkcode Plugin#register} and {@linkcode Plugin#finish} hooks can use the same
   * app configuration methods as direct callers.
   *
   * @param {Plugin} plugin
   * @returns {this}
   */
  registerPlugin(plugin) {
    assertTrue(!this.initialized, registererror)

    this.plugins.add(plugin)

    return this
  }

  /**
   * Registers a debugger plugin through {@linkcode App#registerPlugin}.
   *
   * It has the same initialization guard and duplicate-ID behavior as a regular
   * plugin registration.
   *
   * @param {Plugin} debug
   * @returns {this}
   */
  registerDebugger(debug) {
    return this.registerPlugin(debug)
  }

  /**
   * Stages world-bound scheduled work.
   *
   * The configuration is prepared during {@linkcode App#run}; registering the
   * work does not execute it immediately.
   *
   * @param {SystemConfig} config
   * @returns {this}
   */
  registerSystem(config) {
    assertTrue(!this.initialized, registererror)

    SchedulerBuilder.Instance.add(config)

    return this
  }

  /**
   * Stages scheduled work that can use more than one world.
   *
   * The configuration is prepared during {@linkcode App#run} and is not executed
   * by this registration call.
   *
   * @param {CrossWorldSystemConfig} config
   * @returns {this}
   */
  registerCrossworldSystem(config) {
    assertTrue(!this.initialized, registererror)

    SchedulerBuilder.Instance.addCrossworldSystem(config)

    return this
  }

  /**
   * Stages a group configuration for scheduled work.
   *
   * The group is prepared during {@linkcode App#run}. Use
   * {@linkcode App#registerSystem} or {@linkcode App#registerCrossworldSystem} to
   * stage work for the group.
   *
   * @param {SystemGroupConfig} config
   * @returns {this}
   */
  registerSystemGroup(config) {
    assertTrue(!this.initialized, registererror)

    SchedulerBuilder.Instance.addGroup(config)

    return this
  }

  /**
   * @template T
   * Stages component lifecycle hooks to be installed for this component in
   * every world when {@linkcode App#run} applies world configuration.
   *
   * Hooks are keyed by the component's {@linkcode typeid} and a later registration
   * for the same component replaces the earlier staged entry.
   *
   * @param {new (...args:any[])=>T} component
   * @param {ComponentHooks} hooks
   * @returns {this}
   */
  setComponentHooks(component, hooks) {
    assertTrue(!this.initialized, registererror)

    const id = typeid(component)

    this.componentHooks.set(id, { component, hooks })

    return this
  }

  /**
   * @template {object} T
   * Stages a resource instance for a world.
   *
   * The resource constructor supplies its type ID. With no world label the
   * resource is applied to the default world; otherwise it is applied to the
   * labeled world during {@linkcode App#run}. For explicit type IDs or generic
   * resource values, use {@linkcode App#setResourceByTypeId}.
   *
   * @param {T} resource
   * @param {Constructor | undefined} [world]
   * @returns {this}
   */
  setResource(resource, world) {
    assertTrue(!this.initialized, registererror)

    // SAFETY: An object's constructor is constructible.
    const id = typeid(/** @type {Constructor} */(resource.constructor))

    this.setResourceByTypeId(id, resource, world)

    return this
  }

  /**
   * @template T
   * Stages a resource value under an explicit type ID.
   *
   * The outer staging key selects the default world when `world` is omitted or
   * a labeled world otherwise. A later value with the same type ID and world
   * replaces the earlier staged value; values are applied to worlds by
   * {@linkcode App#run}.
   *
   * @param {TypeId} id
   * @param {T} resource
   * @param {Constructor | undefined} [world]
   * @returns {this}
   */
  setResourceByTypeId(id, resource, world) {
    assertTrue(!this.initialized, registererror)

    const worldId = world === undefined ? undefined : typeid(world)
    let worldResources = this.resources.get(worldId)

    if (!worldResources) {
      worldResources = new Map()
      this.resources.set(worldId, worldResources)
    }

    worldResources.set(id, resource)

    return this
  }

  /**
   * Stages a resource alias for every world created in this app.
   *
   * `id` is the type ID of the resource the alias should resolve to, while
   * `alias` is the constructor callers can use for lookup. The alias is
   * installed on each world during {@linkcode App#run}; another registration
   * for the same alias constructor replaces the staged entry.
   *
   * @template T
   * @param {TypeId} id
   * @param {Constructor<T>} alias
   * @returns {this}
   */
  setResourceAlias(id, alias) {
    assertTrue(!this.initialized, registererror)

    const aliasId = typeid(alias)

    this.resourceAliases.set(aliasId, { id, alias })

    return this
  }

  /**
   * @private
   */
  flushResources() {
    for (const [worldId, resources] of this.resources) {
      const world = worldId === undefined ?
        this.worlds.getWorld() :
        this.worlds.get(worldId)

      assert(world, `The world "${worldId}" is not set.`)

      for (const [id, resource] of resources) {
        world.setResourceByTypeId(id, resource)
      }
    }

    this.resources.clear()
  }

  /**
   * @private
   */
  applyComponentHooks() {
    for (const hooks of this.componentHooks.values()) {
      for (const world of this.worlds.values()) {
        world.setComponentHooks(hooks.component, hooks.hooks)
      }
    }

    this.componentHooks.clear()
  }

  /**
   * @private
   */
  applyResourceAliases() {
    for (const world of this.worlds.values()) {
      for (const alias of this.resourceAliases.values()) {
        world.setResourceAlias(alias.id, alias.alias)
      }
    }

    this.resourceAliases.clear()
  }
}

/* eslint-disable jsdoc/check-tag-names */
/**
 * Base lifecycle contract for a plugin that contributes configuration to an
 * {@linkcode App}.
 *
 * Register instances with {@linkcode App#registerPlugin}. Override
 * {@linkcode Plugin#register} to stage configuration. Override
 * {@linkcode Plugin#finish} for final setup, {@linkcode Plugin#requires} to declare
 * required plugin IDs, or {@linkcode Plugin#name} to provide a custom identity.
 * The base lifecycle methods are no-ops, the base dependency list is empty,
 * and the default identity is the concrete plugin class's type ID.
 *
 * @example
 * ```js
 * import { App, Plugin } from '@wimaengine/app'
 *
 * class Settings {}
 * class DefaultWorld {}
 *
 * class SettingsPlugin extends Plugin {
 *   register(app) {
 *     app
 *       .setWorld(DefaultWorld)
 *       .defaultWorld(DefaultWorld)
 *       .setResource(new Settings())
 *   }
 * }
 *
 * new App()
 *   .registerPlugin(new SettingsPlugin())
 *   .setRunner(() => {})
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Plugin {

  /**
   * Configures the app during the registration phase of {@linkcode App#run}.
   *
   * {@linkcode PluginRegistry} calls this hook for each registered plugin in
   * insertion order, before it validates any {@linkcode Plugin#requires} IDs. A
   * hook can use the app's registration methods to configure worlds and
   * resources, install component hooks, and stage schedules with execution
   * callbacks for the app runner. It can also call
   * {@linkcode App#registerPlugin} to add a nested plugin. The registry continues
   * through plugins added during this pass, and those plugins also reach the
   * later {@linkcode Plugin#finish} pass. Return values are ignored.
   *
   * @param {App} _app - App being configured.
   * @returns {void} This hook's return value is ignored.
   */
  register(_app) { }

  /**
   * Performs final setup after registration and dependency validation.
   *
   * {@linkcode PluginRegistry} calls this hook in insertion order after
   * {@linkcode Plugin#requires} checks pass, but before {@linkcode App#run} applies
   * queued resources, aliases, and component hooks, builds the scheduler, or
   * invokes the runner. Plugins added during `finish` are visited later in the
   * finish pass, but their dependencies were not part of the earlier
   * validation pass. Use this hook for setup that depends on all registration
   * hooks having run; return values are ignored.
   *
   * @param {App} _app - App being finalized.
   * @returns {void} This hook's return value is ignored.
   */
  finish(_app) { }

  /**
   * Returns plugin IDs that must already be registered before finalization.
   *
   * {@linkcode App#run} asks {@linkcode PluginRegistry} to validate every returned
   * ID after all registration hooks complete and before any finish hook runs. A
   * missing ID causes `run` to throw; IDs do not cause plugins to be installed,
   * and this list does not reorder plugin hooks. The base implementation has no
   * dependencies.
   *
   * @returns {TypeId[]} Required plugin type IDs.
   */
  requires() {
    return []
  }

  /**
   * Returns this plugin's identity used by {@linkcode PluginRegistry}.
   *
   * The default implementation returns `typeid(this.constructor)`. Override it
   * when a plugin has multiple valid instances that need distinct identities,
   * such as a generic plugin keyed by a configured constructor. The returned ID
   * is checked when {@linkcode App#registerPlugin} adds the plugin; registering a
   * duplicate ID throws instead of replacing the existing instance.
   *
   * @returns {TypeId} Plugin identity used for duplicate detection and
   * dependency lookup.
   */
  name() {

    // SAFETY: `this.constructor` can be casted into a `Contructor`
    return typeid(/** @type {Constructor}*/(this.constructor))
  }
}
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * A {@linkcode Plugin} that bundles several plugins into one app registration.
 *
 * Add, remove, or replace members with the group methods, then register the
 * group with {@linkcode App#registerPlugin}. The group is registered under its
 * own plugin ID; {@linkcode PluginGroup#register} then forwards each contained
 * plugin to the app in map order. It inherits {@linkcode Plugin#finish},
 * {@linkcode Plugin#requires}, and {@linkcode Plugin#name} unless a subclass
 * overrides them.
 *
 * @category plugin-group
 * @example
 * ```js
 * import { App, Plugin, PluginGroup } from '@wimaengine/app'
 *
 * class GameplayPlugin extends Plugin {}
 *
 * class EnginePlugins extends PluginGroup {
 *   constructor() {
 *     super()
 *     this.add(new GameplayPlugin())
 *   }
 * }
 *
 * const plugins = new EnginePlugins()
 * plugins.replace(new GameplayPlugin()) // change the member, keep one ID
 *
 * new App()
 *   .registerPlugin(plugins)
 *   .setRunner(() => {})
 *   .run()
 * ```
 */
export class PluginGroup extends Plugin {

  /**
   * Plugins in this group, keyed by the type ID returned by
   * {@linkcode Plugin#name}. The map is private so membership changes should go
   * through {@linkcode PluginGroup#add}, {@linkcode PluginGroup#remove}, or
   * {@linkcode PluginGroup#replace}.
   *
   * @private
   * @type {Map<TypeId, Plugin>}
   */
  plugins = new Map()

  /**
   * Adds a plugin keyed by its {@linkcode Plugin#name} type ID. If a plugin with
   * the same ID is already present, it is overwritten. Replacing an existing
   * map value with `add` does not move that ID to the end of iteration order;
   * use {@linkcode PluginGroup#replace} when order should change.
   *
   * @template {Plugin} T
   * @param {T} plugin
   * @returns {this}
   */
  add(plugin) {
    this.plugins.set(plugin.name(), plugin)

    return this
  }

  /**
   * Removes the plugin stored under a type ID. Missing IDs are ignored.
   *
   * @param {TypeId} id
   * @returns {this}
   */
  remove(id) {
    this.plugins.delete(id)

    return this
  }

  /**
   * Replaces the plugin with the same type ID by removing the current entry
   * and adding the supplied plugin. The replacement is therefore placed at the
   * end of map iteration order. If the ID was not present, this behaves like
   * {@linkcode PluginGroup#add}.
   *
   * @template {Plugin} T
   * @param {T} plugin
   * @returns {this}
   */
  replace(plugin) {
    const typeId = plugin.name()

    this
      .remove(typeId)
      .add(plugin)

    return this
  }

  /**
   * Registers each contained plugin with the app in map iteration order. The
   * app invokes this hook when the group itself is registered during
   * {@linkcode App#run}. The contained plugins are registered through the app and
   * are processed by the app's plugin registry after the current registration
   * pass reaches them; their normal {@linkcode Plugin#register} and
   * {@linkcode Plugin#finish} hooks are not called directly by the group.
   *
   * @param {App} app
   * @returns {void}
   */
  register(app) {
    for (const plugin of this.plugins.values()) {
      app.registerPlugin(plugin)
    }
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * Formats the registration chain for error output.
 *
 * @param {PluginRegistry} registry
 * @param {TypeId} pluginId
 * @returns {string}
 */
function formatRegistrationTrace(registry, pluginId) {
  const chain = []
  let current = pluginId

  while (current !== undefined) {
    chain.push(current)
    current = registry.parents.get(current)
  }

  chain.reverse()

  if (!chain.length) {
    return ''
  }

  const lines = ['Plugin registration stack:']

  for (let i = 0; i < chain.length; i++) {
    const currentId = chain[i]
    const parentId = chain[i - 1]

    if (parentId === undefined) {
      lines.push(`- \`${currentId}\` registered directly on the app`)
    } else {
      lines.push(`- \`${currentId}\` registered by \`${parentId}\``)
    }
  }

  return `\n\n${lines.join('\n')}`
}
