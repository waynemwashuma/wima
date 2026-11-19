/** @import {AppSchedule, CoreSystems} from '@wimaengine/core' */
/** @import {ReflectPlugin} from '@wimaengine/reflect' */
/** @import {WindowPlugin} from '../plugin' */

import { World } from '@wimaengine/ecs'
import { EnumInfo, Field, MapInfo, OpaqueInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { WindowRequest } from '../commands'
import { MainWindow, Window } from '../components'
import { Windows } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers window reflection metadata in the world's {@linkcode TypeRegistry}.
 *
 * {@linkcode WindowPlugin} registers this exact
 * function directly in the one-shot
 * {@linkcode AppSchedule.Startup}
 * schedule and assigns it to {@linkcode CoreSystems.Start}. The registry must
 * already be installed by {@linkcode ReflectPlugin}; this
 * system does not create the registry, a {@linkcode Windows} resource, or window
 * entities.
 *
 * When it runs, the system registers `WindowRequest` as an enum, opaque
 * `HTMLCanvasElement` metadata, and the `Map<Number,HTMLCanvasElement>` used
 * by {@linkcode Windows}. It then registers {@linkcode Window} with `width`,
 * `height`, and optional `selector` fields, and {@linkcode MainWindow} as an
 * empty struct.
 * Both component entries receive their `copy`, `clone`, `serialize`, and
 * `deserialize` methods. The {@linkcode Windows} entry contains only its
 * `entities` map field and receives no methods.
 *
 * Install {@linkcode WindowPlugin} to run this
 * system automatically during startup.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CommandsPlugin } from '@wimaengine/command'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { WindowPlugin } from '@wimaengine/window'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new CommandsPlugin())
 *   .registerPlugin(new WindowPlugin())
 *   .setRunner(() => {})
 *   .run()
 * // WindowPlugin runs registerWindowTypes in Startup/CoreSystems.Start.
 * ```
 *
 * @param {World} world
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry}.
 * @category system
 */
export function registerWindowTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const windowRequestId = setTypeId('WindowRequest')
  const htmlCanvasId = setTypeId('HTMLCanvasElement')
  const entityWindowMapId = setTypeId(`Map<Number,${htmlCanvasId}>`)

  registry.registerTypeId(windowRequestId, new EnumInfo(WindowRequest))
  registry.registerTypeId(htmlCanvasId, new OpaqueInfo())
  registry.registerTypeId(entityWindowMapId, new MapInfo(typeid(Number), htmlCanvasId))

  registry.register(Window, new StructInfo({
    width: new Field(typeid(Number)),
    height: new Field(typeid(Number)),
    selector: new Field(typeid(String), true)
  }))
  registry.get(Window)?.setMethod(Window.copy)
  registry.get(Window)?.setMethod(Window.clone)
  registry.get(Window)?.setMethod(Window.default)
  registry.get(Window)?.setMethod(Window.serialize)
  registry.get(Window)?.setMethod(Window.deserialize)
  registry.register(MainWindow, new StructInfo({}))
  registry.get(MainWindow)?.setMethod(MainWindow.copy)
  registry.get(MainWindow)?.setMethod(MainWindow.clone)
  registry.get(MainWindow)?.setMethod(MainWindow.default)
  registry.get(MainWindow)?.setMethod(MainWindow.serialize)
  registry.get(MainWindow)?.setMethod(MainWindow.deserialize)
  registry.register(Windows, new StructInfo({
    entities: new Field(entityWindowMapId)
  }))
}
