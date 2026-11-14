/** @import { Constructor, TypeId } from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { ColorPlugin } from '@wimaengine/color'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { Gizmo3D, GizmoSettings } from '../core'
import { genenerateDrawGizmo3Dsystem, registerGizmo3DTypes } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides a labelled {@linkcode Gizmo3D} resource for immediate-mode 3D debug
 * drawing in an {@linkcode App}.
 *
 * The required `label` constructor identifies the resource. Use the same label
 * when retrieving it from the world; different labels provide separate gizmo
 * resources. The optional {@linkcode GizmoSettings} instance controls line width,
 * caps, joins, style, and dash offset. When it is omitted, the plugin creates
 * the default settings.
 *
 * The current canvas backend does not render 3D geometry. It reports that 3D
 * gizmos are unsupported and clears the labelled resource's buffered data when
 * its drawing step runs.
 *
 * Register {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, {@linkcode ColorPlugin},
 * and {@linkcode MathPlugin} before this plugin. These dependencies are not
 * installed automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { ColorPlugin } from '@wimaengine/color'
 * import { CorePlugin } from '@wimaengine/core'
 * import { Gizmo3DPlugin } from '@wimaengine/gizmo'
 * import { MathPlugin } from '@wimaengine/math'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * class DebugGizmo {}
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new ColorPlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Gizmo3DPlugin({ label: DebugGizmo }))
 *   .run()
 * ```
 *
 * @category plugin
 * @template T
 */
export class Gizmo3DPlugin extends Plugin {

  /**
   * Constructor identifying this plugin's labelled {@linkcode Gizmo3D} resource.
   *
   * Use the same constructor when retrieving the resource. Different labels
   * provide separate typed gizmo resources and plugin identities.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  label

  /**
   * Drawing settings used by this plugin's labelled {@linkcode Gizmo3D} resource.
   *
   * The settings control line width, caps, joins, style, and dash offset. The
   * configured instance is shared with the resource created by this plugin.
   *
   * @readonly
   * @type {GizmoSettings}
   */
  settings

  /**
   * Creates a 3D gizmo plugin for a labelled resource.
   *
   * `label` is required and identifies the typed {@linkcode Gizmo3D} resource.
   * `settings` is optional and defaults to a new {@linkcode GizmoSettings};
   * pass a shared settings instance when the app needs a specific line width,
   * cap, join, style, or dash offset.
   *
   * @param {Gizmo3DPluginSettings<T>} param0 - Generic resource label and draw settings.
   */
  constructor({
    label,
    settings = new GizmoSettings()
  }) {
    super()
    this.label = label
    this.settings = settings
  }

  /**
   * Adds the labelled {@linkcode Gizmo3D} resource to an {@linkcode App}.
   *
   * The resource uses this plugin's `label` and `settings`. The current canvas
   * backend does not render 3D data; it reports that 3D gizmos are unsupported
   * and clears the resource's buffered data during drawing.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    const { label, settings } = this

    app
      .setResourceByTypeId(typeidGeneric(Gizmo3D, [label]), new Gizmo3D(label, settings))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerGizmo3DTypes(label) })
      .registerSystem({ schedule: AppSchedule.Update, system: genenerateDrawGizmo3Dsystem(label) })
  }

  /**
   * Returns the plugins required for labelled 3D gizmo support.
   *
   * The app must already have {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * {@linkcode ColorPlugin}, and {@linkcode MathPlugin} registered. Registering
   * this plugin does not install those dependencies automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(ColorPlugin),
      typeid(MathPlugin)
    ]
  }

  /**
   * Returns this plugin's generic identity for its label constructor.
   *
   * Different label constructors produce distinct identities, so an app can
   * use one plugin instance for each labelled {@linkcode Gizmo3D} resource.
   *
   * @inheritdoc
   * @returns {TypeId} Generic plugin {@linkcode TypeId}.
   */
  name() {
    return typeidGeneric(Gizmo3DPlugin, [this.label])
  }
}

/**
 * @template T
 * @typedef Gizmo3DPluginSettings
 * @property {Constructor<T>} label
 * @property {GizmoSettings} [settings]
 */
