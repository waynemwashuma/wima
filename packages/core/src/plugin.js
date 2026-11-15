/** @import { App } from '@wimaengine/app' */
/** @import { TypeId } from '@wimaengine/type' */
import { Plugin } from '@wimaengine/app'
import { ReflectPlugin } from '@wimaengine/reflect'
import { SchedulerBuilder } from '@wimaengine/schedule'
import { typeid } from '@wimaengine/type'
import { AppSchedule, CoreSystems, MainWorld, defaultRunner } from './core'
import { registerCoreTypes, registerPrimitiveTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the core runtime foundation for an {@linkcode App}.
 *
 * Registering {@linkcode CorePlugin} selects {@linkcode MainWorld} as the app's
 * default world, stages the shared {@linkcode SchedulerBuilder.Instance}
 * scheduler, and sets {@linkcode defaultRunner} as the app runner.
 *
 * It creates the {@linkcode AppSchedule.Startup} and
 * {@linkcode AppSchedule.Update} schedules. Both use the core phase ordering and
 * default group.
 * During startup, it also prepares the core and primitive type metadata used
 * by the app's reflection support.
 *
 * {@linkcode CorePlugin} requires {@linkcode ReflectPlugin}. Register that plugin
 * before the core plugin; registering the core plugin does not install it.
 *
 * @example
 * ```js
 * import { App, CorePlugin, ReflectPlugin } from 'wima'
 *
 * const app = new App()
 * app
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class CorePlugin extends Plugin {

  /**
   * Applies the core world, scheduler, runner, schedule, and group setup to an
   * {@linkcode App}.
   *
   * The app uses {@linkcode MainWorld} as its default world, stages
   * {@linkcode SchedulerBuilder.Instance}, and uses {@linkcode defaultRunner}. It
   * creates {@linkcode AppSchedule.Startup} and {@linkcode AppSchedule.Update};
   * both use the core phase ordering and default group. Startup also prepares
   * the core and primitive type metadata used by the app's reflection support.
   *
   * @inheritdoc
   * @param {App} app - App to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setWorld(MainWorld)
      .defaultWorld(MainWorld)
      .setResource(SchedulerBuilder.Instance)
      .setRunner(defaultRunner)
      .createSchedule({
        label: AppSchedule.Startup,
        repeat: false,
        defaultSystemGroup: CoreSystems.Main
      })
      .createSchedule({
        label: AppSchedule.Update,
        repeat: true,
        defaultSystemGroup: CoreSystems.Main
      })
      .registerSystemGroup({
        label: CoreSystems.Start,
        schedule: AppSchedule.Startup,
        before: [CoreSystems.PreMain]
      })
      .registerSystemGroup({
        label: CoreSystems.PreMain,
        schedule: AppSchedule.Startup,
        before: [CoreSystems.Main]
      })
      .registerSystemGroup({
        label: CoreSystems.Main,
        schedule: AppSchedule.Startup,
        before: [CoreSystems.PostMain]
      })
      .registerSystemGroup({
        label: CoreSystems.PostMain,
        schedule: AppSchedule.Startup,
        before: [CoreSystems.End]
      })
      .registerSystemGroup({
        label: CoreSystems.End,
        schedule: AppSchedule.Startup
      })

      .registerSystemGroup({
        label: CoreSystems.Start,
        schedule: AppSchedule.Update,
        before: [CoreSystems.PreMain]
      })
      .registerSystemGroup({
        label: CoreSystems.PreMain,
        schedule: AppSchedule.Update,
        before: [CoreSystems.Main]
      })
      .registerSystemGroup({
        label: CoreSystems.Main,
        schedule: AppSchedule.Update,
        before: [CoreSystems.PostMain]
      })
      .registerSystemGroup({
        label: CoreSystems.PostMain,
        schedule: AppSchedule.Update,
        before: [CoreSystems.End]
      })
      .registerSystemGroup({
        label: CoreSystems.End,
        schedule: AppSchedule.Update
      })
      .registerSystem({
        schedule: AppSchedule.Startup,
        system: registerCoreTypes
      })
      .registerSystem({
        schedule: AppSchedule.Startup,
        system: registerPrimitiveTypes
      })
  }

  /**
   * Returns the type ID for the required {@linkcode ReflectPlugin} dependency.
   * The app validates this dependency before final setup; registering
   * {@linkcode CorePlugin} does not install {@linkcode ReflectPlugin} automatically.
   *
   * @inheritdoc
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(ReflectPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
