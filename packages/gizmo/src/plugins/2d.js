/** @import { Constructor } from '@wimaengine/type' */
/** @import { TypeId } from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { ColorPlugin } from '@wimaengine/color'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { WindowPlugin } from '@wimaengine/window'
import { Gizmo2D, GizmoSettings } from '../core'
import { genenerateDrawGizmo2Dsystem, registerGizmo2DTypes } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides a labelled {@linkcode Gizmo2D} resource for immediate-mode 2D debug
 * drawing in an {@linkcode App}.
 *
 * The required `label` constructor identifies the resource. Use the same label
 * when retrieving it from the world; different labels provide separate gizmo
 * resources. The optional {@linkcode GizmoSettings} instance controls line width,
 * caps, joins, style, and dash offset. When it is omitted, the plugin creates
 * the default settings.
 *
 * When a window provides a 2D canvas, buffered line segments and strips are
 * drawn with these settings and cleared after a successful draw. If no usable
 * window, canvas, or 2D context is available, the buffered drawing data stays
 * in the resource.
 *
 * The app must provide {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
 * {@linkcode ColorPlugin}, {@linkcode MathPlugin}, and {@linkcode WindowPlugin} before
 * this plugin. These dependencies are not installed automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { ColorPlugin } from '@wimaengine/color'
 * import { CorePlugin } from '@wimaengine/core'
 * import { Gizmo2DPlugin } from '@wimaengine/gizmo'
 * import { MathPlugin } from '@wimaengine/math'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { WindowPlugin } from '@wimaengine/window'
 *
 * class DebugGizmo {}
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new ColorPlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new WindowPlugin())
 *   .registerPlugin(new Gizmo2DPlugin({ label: DebugGizmo }))
 *   .run()
 * ```
 *
 * @category plugin
 * @template T
 */
export class Gizmo2DPlugin extends Plugin {

  /**
   * Constructor used to identify the typed {@linkcode Gizmo2D} resource and this
   * plugin's generic identity. Use the same constructor when retrieving the
   * resource; different constructors provide separate gizmo resources.
   *
   * @readonly
   * @type {Constructor<T>}
   */
  label

  /**
   * Drawing settings used by the labelled {@linkcode Gizmo2D} resource. They
   * control line width, caps, joins, style, and dash offset.
   *
   * @readonly
   * @type {GizmoSettings}
   */
  settings

  /**
   * Creates a 2D gizmo plugin for a labelled {@linkcode Gizmo2D} resource.
   *
   * `label` is required and identifies the resource. `settings` is optional and
   * defaults to a new {@linkcode GizmoSettings}; pass a shared settings instance
   * when the app needs a specific line width, cap, join, style, or dash offset.
   *
   * @param {Gizmo2DPluginSettings<T>} param0 - Generic resource label and draw settings.
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
   * Installs the labelled {@linkcode Gizmo2D} resource in the app.
   *
   * The resource uses this plugin's `label` and `settings`. When a usable 2D
   * canvas is available, buffered line segments and strips are drawn with these
   * settings and cleared after a successful draw. Without a usable window,
   * canvas, or 2D context, the buffered drawing data remains available in the
   * resource.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    const { label, settings } = this

    app
      .setResourceByTypeId(typeidGeneric(Gizmo2D, [label]), new Gizmo2D(label, settings))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerGizmo2DTypes(label) })
      .registerSystem({ schedule: AppSchedule.Update, system: genenerateDrawGizmo2Dsystem(label) })
  }

  /**
   * Returns the plugins required by the labelled gizmo resource and its canvas
   * drawing support.
   *
   * The app must provide {@linkcode CorePlugin}, {@linkcode ReflectPlugin},
   * {@linkcode ColorPlugin}, {@linkcode MathPlugin}, and {@linkcode WindowPlugin}.
   * These dependencies are not installed automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(ColorPlugin),
      typeid(MathPlugin),
      typeid(WindowPlugin)
    ]
  }

  /**
   * Returns the generic plugin identity associated with this plugin's label
   * constructor.
   *
   * @inheritdoc
   * @returns {TypeId} Plugin {@linkcode TypeId}.
   */
  name() {
    return typeidGeneric(Gizmo2DPlugin, [this.label])
  }
}

/**
 * @template T
 * @typedef Gizmo2DPluginSettings
 * @property {Constructor<T>} label
 * @property {GizmoSettings} [settings]
 */
