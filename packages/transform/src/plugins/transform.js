/** @import {TypeId} from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { HierarchyPlugin } from '@wimaengine/hierarchy'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { propagateTransform2D, propagateTransform3D, registerTransform2DTypes, registerTransform3DTypes, synctransform2D, synctransform3D } from '../systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the public group label registered by {@linkcode Transform2DPlugin}.
 *
 * {@linkcode Transform3DPlugin} assigns its 3D transform processing to this
 * label. Applications can use it when configuring related work for that
 * processing group.
 *
 * @category systemgroup-label
 */
export class TransformSystems { }

/**
 * Adds 2D transform support to an {@linkcode App}.
 *
 * Register this plugin to compute global transforms from each entity's local
 * 2D position, orientation, and scale values. Entities in a hierarchy inherit
 * their parent entities' transforms. The plugin requires {@linkcode CorePlugin},
 * {@linkcode ReflectPlugin}, and {@linkcode HierarchyPlugin}.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { HierarchyPlugin } from '@wimaengine/hierarchy'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { Transform2DPlugin } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .registerPlugin(new Transform2DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Transform2DPlugin extends Plugin {

  /**
   * Enables 2D transform support for an {@linkcode App}.
   *
   * Entities with local 2D position, orientation, and scale values receive
   * composed global transforms, and child entities inherit their parent's
   * transform through the hierarchy.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app

      // TODO: Also register this in the 3d variant
      .registerSystemGroup({
        label: TransformSystems,
        schedule: AppSchedule.Update
      })
      .registerSystem({
        schedule: AppSchedule.Startup,
        system: registerTransform2DTypes
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        system: synctransform2D
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        system: propagateTransform2D,
        after: [synctransform2D]
      })
  }

  /**
   * Declares the dependencies required by 2D transform support.
   *
   * The app validates these dependencies and does not install them
   * automatically.
   *
   * @returns {TypeId[]} Type IDs for
   * {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
   * {@linkcode HierarchyPlugin}.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(HierarchyPlugin)]
  }
}

/**
 * Adds 3D transform support to an {@linkcode App}.
 *
 * Register this plugin to compute global transforms from each entity's local
 * 3D position, orientation, and scale values. Entities in a hierarchy inherit
 * their parent entities' transforms. The plugin requires {@linkcode CorePlugin},
 * {@linkcode ReflectPlugin}, and {@linkcode HierarchyPlugin}. Use
 * {@linkcode Transform2DPlugin} separately when an app also needs 2D transforms.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { HierarchyPlugin } from '@wimaengine/hierarchy'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { Transform2DPlugin, Transform3DPlugin } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new HierarchyPlugin())
 *   .registerPlugin(new Transform2DPlugin())
 *   .registerPlugin(new Transform3DPlugin())
 *   .run()
 * ```
 *
 * @category plugin
 */
export class Transform3DPlugin extends Plugin {

  /**
   * Enables 3D transform support for an {@linkcode App}.
   *
   * Entities with local 3D position, orientation, and scale values receive
   * composed global transforms, and child entities inherit their parent's
   * transform through the hierarchy.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {
    app
      .registerSystem({
        schedule: AppSchedule.Startup,
        system: registerTransform3DTypes
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: TransformSystems,
        system: synctransform3D
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: TransformSystems,
        system: propagateTransform3D,
        after: [synctransform3D]
      })
  }

  /**
   * Declares the dependencies required by 3D transform support.
   *
   * The app validates these dependencies and does not install them
   * automatically.
   *
   * @returns {TypeId[]} Type IDs for
   * {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
   * {@linkcode HierarchyPlugin}.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(HierarchyPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
