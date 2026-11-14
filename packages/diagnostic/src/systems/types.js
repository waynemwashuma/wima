/** @import {AppSchedule, CoreSystems} from '@wimaengine/core' */
/** @import {FPSDebugger} from '../fpsdebugger' */
import { World } from '@wimaengine/ecs'
import { EnumInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { TimerMode } from '@wimaengine/time'
import { setTypeId, typeid } from '@wimaengine/type'
import { RAFTimer } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the reflection metadata used by {@linkcode FPSDebugger} for its
 * {@linkcode RAFTimer} resource.
 *
 * {@linkcode FPSDebugger} registers this exact function as a one-shot
 * {@linkcode AppSchedule.Startup} system in {@linkcode CoreSystems.Start}. The
 * function retrieves the world's {@linkcode TypeRegistry}, registers the
 * {@linkcode TimerMode} enum ID, and describes {@linkcode RAFTimer} with its `mode`,
 * `duration`, `speed`, and `paused` fields. It only updates the type registry;
 * it does not install the timer resource or change the timer's values.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { FPSDebugger } from '@wimaengine/diagnostic'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TimePlugin } from '@wimaengine/time'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new TimePlugin())
 *   .registerPlugin(new FPSDebugger())
 *   .run()
 * // FPSDebugger runs registerFpsDebuggerTypes during Startup/CoreSystems.Start.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry}.
 * @category system
 */
export function registerFpsDebuggerTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const timerModeId = setTypeId('TimerMode')

  registry.registerTypeId(timerModeId, new EnumInfo(TimerMode))

  registry.register(RAFTimer, new StructInfo({
    mode: new Field(timerModeId),
    duration: new Field(typeid(Number)),
    speed: new Field(typeid(Number)),
    paused: new Field(typeid(Boolean))
  }))
}
/* eslint-enable jsdoc/check-tag-names */
