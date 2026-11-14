/** @import {AssetServer, AssetServerPlugin} from '@wimaengine/asset' */
/** @import {TypeId} from '@wimaengine/type' */
/** @import {VirtualClock} from '@wimaengine/time' */
/** @import {AnimationTarget} from './components' */

import { App, Plugin } from '@wimaengine/app'
import { AssetPlugin, Assets } from '@wimaengine/asset'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { ReflectPlugin } from '@wimaengine/reflect'
import { TimePlugin } from '@wimaengine/time'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { AnimationClip } from './assets'
import { AnimationPlayer, dropAnimationPlayer } from './components'
import { AnimationClipAssets } from './resources'
import { advanceAnimationPlayers, applyAnimations, registerAnimationTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds animation playback and animation-clip asset support to an {@linkcode App}.
 *
 * Use {@linkcode AnimationPlayer} with {@linkcode AnimationClip} assets to control
 * playback and animate entities through {@linkcode AnimationTarget}. Playback
 * advances from the app clock provided by {@linkcode VirtualClock}, and sampled
 * tracks apply their values to the target components they describe.
 *
 * Animation clips are available through the {@linkcode AnimationClipAssets}
 * resource alias for typed {@linkcode Assets} access. Add
 * {@linkcode AssetServerPlugin} when clips should be loaded through
 * {@linkcode AssetServer}.
 *
 * The app requires {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
 * {@linkcode TimePlugin} for animation support.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetServerPlugin } from '@wimaengine/asset'
 * import { AnimationPlugin } from '@wimaengine/animation'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TimePlugin } from '@wimaengine/time'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new AssetServerPlugin())
 *   .registerPlugin(new TimePlugin())
 *   .registerPlugin(new AnimationPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class AnimationPlugin extends Plugin {

  /**
   * Installs animation hooks, clip assets, and playback behavior in an
   * {@linkcode App}.
   *
   * {@linkcode AnimationPlayer} components use {@linkcode AnimationClip} assets and
   * release their live handles when removed. The installed
   * {@linkcode AnimationClipAssets} resource provides typed clip access, while
   * playback advances from {@linkcode VirtualClock} and sampled tracks apply
   * values to {@linkcode AnimationTarget} entities.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .setComponentHooks(AnimationPlayer, new ComponentHooks(
        null,
        dropAnimationPlayer
      ))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerAnimationTypes })
      .registerPlugin(new AssetPlugin({
        asset:AnimationClip
      }))
      .registerSystem({ schedule: AppSchedule.Update, system: advanceAnimationPlayers })
      .registerSystem({ schedule: AppSchedule.Update, system: applyAnimations })
      .setResourceAlias(typeidGeneric(Assets, [AnimationClip]), AnimationClipAssets)
  }

  /**
   * Returns the plugin dependencies required by animation support.
   *
   * Register {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
   * {@linkcode TimePlugin} before this plugin. Registering this plugin does not
   * install missing dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(TimePlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
