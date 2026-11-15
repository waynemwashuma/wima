/** @import { App } from '@wimaengine/app' */
/** @import { TypeId } from '@wimaengine/type' */
import { Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule, CoreSystems } from '@wimaengine/core'
import { typeid } from '@wimaengine/type'
import { CommandQueue } from './resources'
import { executeCommands } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds deferred command execution to an {@linkcode App}.
 *
 * `CommandsPlugin` provides a {@linkcode CommandQueue} resource in the app's
 * default world. Add {@linkcode Command} instances to the queue when a world
 * mutation should be applied later. Queued commands execute in FIFO order
 * during app execution; commands added after a batch begins wait for the next
 * batch.
 *
 * `CommandsPlugin` requires {@linkcode CorePlugin}. Register it before
 * {@linkcode App#run}; the app validates the dependency but does not install it
 * automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { Command, CommandQueue, CommandsPlugin } from '@wimaengine/command'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * class PrintCommand extends Command {
 *   execute(_world) {
 *     console.log('command executed')
 *   }
 * }
 *
 * const app = new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new CommandsPlugin())
 *
 * app.run()
 * app.getWorld().getResource(CommandQueue).add(new PrintCommand())
 * ```
 *
 * @category plugin
 */
export class CommandsPlugin extends Plugin {

  /**
   * Adds a {@linkcode CommandQueue} to the app's default world and enables
   * deferred commands to be applied during app execution.
   *
   * Commands already queued when a processing pass begins execute in FIFO
   * order. Commands added during that pass remain queued for the next pass.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setResource(new CommandQueue())
      .registerSystem({
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.End,
        system: executeCommands
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.End,
        system: executeCommands
      })
  }

  /**
   * Declares the core plugin required by this plugin.
   *
   * The app validates this dependency after plugin registration and does not
   * install it automatically. A missing {@linkcode CorePlugin} causes
   * {@linkcode App#run} to throw.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
