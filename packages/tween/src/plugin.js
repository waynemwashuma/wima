/** @import {TweenLerp} from './typedef' */
/** @import {ReflectPlugin} from '@wimaengine/reflect' */
/** @import {TypeId} from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Vector2, Quaternion, Vector3, Rotary } from '@wimaengine/math'
import { TimePlugin } from '@wimaengine/time'
import { Orientation2D, Orientation3D, Position2D, Position3D, Scale2D, Scale3D } from '@wimaengine/transform'
import { typeid, typeidGeneric } from '@wimaengine/type'
import {
  Position2DTween,
  Orientation2DTween,
  Scale2DTween,
  Position3DTween,
  Orientation3DTween,
  Scale3DTween,
  Tween
} from './components'
import { generateTweenFlipSystem, generateTweenRepeatTween, generateTweenTimerSystem, generateTweenUpdateSystem } from './systems'

// TODO: Convert this into a plugin group
/* eslint-disable jsdoc/check-tag-names */
/**
 * Enables standard transform tweening for an {@linkcode App}.
 *
 * It supports the following transform tween pairs:
 * {@linkcode Position2D}/{@linkcode Position2DTween},
 * {@linkcode Position3D}/{@linkcode Position3DTween},
 * {@linkcode Orientation2D}/{@linkcode Orientation2DTween},
 * {@linkcode Orientation3D}/{@linkcode Orientation3DTween},
 * {@linkcode Scale2D}/{@linkcode Scale2DTween}, and
 * {@linkcode Scale3D}/{@linkcode Scale3DTween}. Position and scale use
 * {@linkcode Vector2.lerp} or {@linkcode Vector3.lerp}, while orientation uses
 * {@linkcode Rotary.slerp} or {@linkcode Quaternion.slerp}.
 *
 * The app must provide {@linkcode CorePlugin} and {@linkcode TimePlugin} before
 * this plugin. Because {@linkcode TimePlugin} depends on {@linkcode ReflectPlugin},
 * register that plugin as well. Dependencies are not installed automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TimePlugin } from '@wimaengine/time'
 * import { DefaultTweenPlugin } from '@wimaengine/tween'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new TimePlugin())
 *   .registerPlugin(new DefaultTweenPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class DefaultTweenPlugin extends Plugin {

  /**
   * Enables the standard transform tween integrations for an app.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerPlugin(new CoreTweenPlugin())
      .registerPlugin(new TweenPlugin({
        component: Position2D,
        tween: Position2DTween,
        interpolation: Vector2.lerp
      }))
      .registerPlugin(new TweenPlugin({
        component: Position3D,
        tween: Position3DTween,
        interpolation: Vector3.lerp
      }))
      .registerPlugin(new TweenPlugin({
        component: Orientation2D,
        tween: Orientation2DTween,
        interpolation: Rotary.slerp
      }))
      .registerPlugin(new TweenPlugin({
        component: Orientation3D,
        tween: Orientation3DTween,
        interpolation: Quaternion.slerp
      }))
      .registerPlugin(new TweenPlugin({
        component: Scale2D,
        tween: Scale2DTween,
        interpolation: Vector2.lerp
      }))
      .registerPlugin(new TweenPlugin({
        component: Scale3D,
        tween: Scale3DTween,
        interpolation: Vector3.lerp
      }))
  }
}
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the base plugin for the built-in tween integrations.
 *
 * This plugin does not configure a component/tween pair on its own. Use
 * {@linkcode TweenPlugin} for one pair or {@linkcode DefaultTweenPlugin} for the
 * standard transform pairs.
 *
 * @category plugin
 */
export class CoreTweenPlugin extends Plugin {

  /**
   * @inheritdoc
   * @param {App} _app - {@linkcode App} being configured.
   */
  register(_app) { }

}

// TweenPlugin<T> where `T: Lerp`
// e.g TweenPlugin<Position2D>, TweenPlugin<Scale2D> e.t.c...
// For now,this plugin will be limited to Position,Orientation and Scale (2d and 3d variants) components.
/**
 * Connects one component type to its tween component type and interpolation
 * function.
 *
 * Each instance advances and interpolates the configured component/tween pair,
 * including repeat and endpoint-flip behavior. Use one instance for each pair
 * that the app should support. The plugin depends on {@linkcode CorePlugin} and
 * {@linkcode TimePlugin}.
 *
 * @category plugin
 * @template T
 */
export class TweenPlugin extends Plugin {

  /**
   * Component constructor whose values this plugin interpolates.
   *
   * @readonly
   * @type {new (...args:any[])=>T}
   */
  component

  /**
   * Tween component constructor paired with {@linkcode TweenPlugin#component}.
   *
   * @readonly
   * @type {typeof Tween<T>}
   */
  tween

  /**
   * Function used to interpolate values of `T`.
   *
   * @readonly
   * @type {TweenLerp<T>}
   */
  interpolation

  /**
   * Creates a tween plugin for one component/tween pair.
   *
   * @param {TweenPluginOptions<T>} options - Component, tween, and interpolation
   * configuration.
   */
  constructor({ component, tween, interpolation }) {
    super()
    this.component = component
    this.interpolation = interpolation
    this.tween = tween
  }

  /**
   * Enables tweening for this plugin's configured component/tween pair in an
   * app.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({
        schedule: AppSchedule.Update,
        label: `flipTween<${typeid(this.component)}>`,
        system: generateTweenFlipSystem(this.tween)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        label: `repeatTween<${typeid(this.component)}>`,
        system: generateTweenRepeatTween(this.tween)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        label: `updateTimerTween<${typeid(this.component)}>`,
        system: generateTweenTimerSystem(this.tween)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        label: `updateTween<${typeid(this.component)}>`,
        system: generateTweenUpdateSystem(this.component, this.tween, this.interpolation)
      })
  }

  /**
   * Returns the plugin dependencies required by this tween integration.
   *
   * Register {@linkcode CorePlugin} and {@linkcode TimePlugin} before this plugin.
   * Registering this plugin does not install those dependencies automatically.
   *
   * @inheritdoc
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(TimePlugin)]
  }

  /**
   * Returns this plugin's {@linkcode TypeId} for its configured component.
   *
   * Instances configured with different component constructors have distinct
   * names.
   *
   * @inheritdoc
   * @returns {TypeId} This plugin's {@linkcode TypeId}.
   */
  name() {
    return typeidGeneric(TweenPlugin, [this.component])
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @template T
 * @typedef TweenPluginOptions
 * @property {new (...args:any[])=>T} component
 * @property {typeof Tween<T>} tween
 * @property {TweenLerp<T>} interpolation
 */
