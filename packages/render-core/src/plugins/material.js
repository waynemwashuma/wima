/** @import { Constructor, TypeId } from '@wimaengine/type' */
/** @import { BasicMaterial } from '../assets' */
/** @import { BasicMaterialInstance } from '../components' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { ReflectPlugin } from '@wimaengine/reflect'
import { Transform2DPlugin, Transform3DPlugin } from '@wimaengine/transform'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Material } from '../assets'
import { dropMaterialInstance, MaterialInstance } from '../components'
import { RenderCorePlugin } from '../plugin'
import { genBinRenderables2D, genBinRenderables3D, registerMaterialTypes } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Connects one material asset type to one concrete material component.
 *
 * Registering this plugin associates the material asset constructor in `asset`
 * with the component constructor in `component`. It releases material handles
 * when the component is removed, makes the typed handle and component metadata
 * available to reflection, and keeps matching 2D and 3D entities in the
 * appropriate camera render lists. {@linkcode RenderCorePlugin} creates the
 * built-in pairing for {@linkcode BasicMaterial} and
 * {@linkcode BasicMaterialInstance}.
 *
 * @template {Material} T
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { BasicMaterial, BasicMaterialInstance, RenderCorePlugin } from '@wimaengine/render-core'
 *
 * const app = new App()
 * app.registerPlugin(new RenderCorePlugin())
 *
 * // RenderCorePlugin registers the equivalent of:
 * // new MaterialInstancePlugin({
 * //   asset: BasicMaterial,
 * //   component: BasicMaterialInstance
 * // })
 * ```
 *
 * @category plugin
 */
export class MaterialInstancePlugin extends Plugin {

  /**
   * Component constructor for entities bound to the material type `T`.
   *
   * {@linkcode MaterialInstancePlugin#register} uses this constructor for handle
   * cleanup, reflection metadata, and render-list integration.
   *
   * @readonly
   * @type {Constructor<MaterialInstance<T>>}
   */
  component

  /**
   * Material asset constructor handled by this plugin.
   *
   * Its type ID distinguishes the material in reflected handle metadata and
   * render-list entries. It also contributes to this plugin's generic identity.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * Creates a plugin for one material asset/component pair.
   *
   * The constructors are stored for {@linkcode MaterialInstancePlugin#register};
   * construction alone does not modify an {@linkcode App}.
   *
   * @param {MaterialPluginOptions<T>} param0 - Material asset and component constructors.
   */
  constructor({ component, asset }) {
    super()
    this.asset = asset
    this.component = component
  }

  /**
   * Registers this material pair with an {@linkcode App}.
   *
   * When an entity carrying the component is removed, its material handle is
   * released; no add or insert hook is installed.
   *
   * The typed {@linkcode Handle} value and component metadata become available to
   * reflection during app startup, including supported static component
   * methods.
   *
   * As the app updates, matching entities with {@linkcode GlobalTransform2D},
   * {@linkcode Meshed}, and this component are included in camera
   * {@linkcode RenderLists2D} opaque passes. Matching 3D entities use
   * {@linkcode GlobalTransform3D}, {@linkcode Meshed}, and this component and are
   * included in {@linkcode RenderLists3D} opaque passes. Entries use the material
   * and mesh handle IDs, and each camera's matching render lists are rebuilt
   * from the current entities.
   *
   * @param {App} app - App receiving the hook and render-list registrations.
   * @returns {void}
   */
  register(app) {
    const { asset, component } = this

    app
      .setComponentHooks(component, new ComponentHooks(
        null,
        dropMaterialInstance(component)
      ))
      .registerSystem({
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        label: `registerMaterialTypes<${typeid(asset)}>`,
        system: registerMaterialTypes(component, asset)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.PostMain,
        label: `binRenders2D<${typeid(asset)}>`,
        system: genBinRenderables2D(asset, component)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.PostMain,
        label: `binRenders3D<${typeid(asset)}>`,
        system: genBinRenderables3D(asset, component)
      })
  }

  /**
   * Returns the plugin IDs required by this material instance plugin.
   *
   * The IDs are returned in this order:
   * {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, {@linkcode RenderCorePlugin},
   * {@linkcode Transform2DPlugin}, and {@linkcode Transform3DPlugin}. The app
   * validates these IDs through {@linkcode Plugin#requires}; it does not register
   * missing dependencies automatically.
   *
   * @returns {TypeId[]} Required {@linkcode TypeId} values.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(RenderCorePlugin),
      typeid(Transform2DPlugin),
      typeid(Transform3DPlugin)
    ]
  }

  /**
   * Returns this plugin's generic identity for its material asset type.
   *
   * Plugins configured with the same `asset` constructor receive the same ID,
   * even when their `component` constructors differ.
   *
   * @returns {TypeId} Generic {@linkcode TypeId} for this material asset type.
   */
  name() {
    return typeidGeneric(MaterialInstancePlugin, [this.asset])
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * Configuration for a {@linkcode MaterialInstancePlugin}.
 *
 * The `component` constructor stores the typed material handle for the
 * `asset` constructor on entities. Use the same `T` for both constructors.
 *
 * @template {Material} T
 * @typedef MaterialPluginOptions
 * @property {Constructor<MaterialInstance<T>>} component - Component constructor that stores the material handle.
 * @property {Constructor<T>} asset - Material asset constructor associated with the component.
 */
