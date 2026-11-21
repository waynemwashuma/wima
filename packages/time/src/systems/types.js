/** @import {AppSchedule, CoreSystems} from '@wimaengine/core' */
/** @import {TimePlugin} from '../plugin' */
import { World } from '@wimaengine/ecs'
import { Field, StructInfo, EnumInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { Clock } from '../clock'
import { Timer, TimerMode } from '../components'
import { VirtualClock } from '../resource'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the reflection metadata used by the time package.
 *
 * {@linkcode TimePlugin} registers this function directly as a one-shot
 * {@linkcode AppSchedule.Startup} system in {@linkcode CoreSystems.Start}. When it
 * runs, the function retrieves the world's {@linkcode TypeRegistry} and registers
 * the `TimerMode` enum ID, then describes {@linkcode Timer} with `mode`,
 * `duration`, `speed`, and `paused` fields. The
 * timer entry also receives its `copy`, `clone`, `serialize`, and `deserialize`
 * methods for reflection-based copying and snapshots.
 *
 * {@linkcode Clock} and {@linkcode VirtualClock} each receive `elapsed`, `lastTick`,
 * and `delta` numeric fields plus their `serialize` and `deserialize` methods.
 * The function only updates existing registry metadata; it does not create a
 * {@linkcode TypeRegistry} or a clock resource. The world therefore needs the
 * registry installed before this system runs.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TimePlugin } from '@wimaengine/time'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new TimePlugin())
 *   .run()
 * // TimePlugin runs registerTimeTypes in Startup/CoreSystems.Start.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerTimeTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const timerModeId = setTypeId('TimerMode')

  registry.registerTypeId(timerModeId, new EnumInfo(TimerMode))

  registry.register(Timer, new StructInfo({
    mode: new Field(timerModeId),
    duration: new Field(typeid(Number)),
    speed: new Field(typeid(Number)),
    paused: new Field(typeid(Boolean))
  }))
  registry.get(Timer)?.setMethod(Timer.copy)
  registry.get(Timer)?.setMethod(Timer.clone)
  registry.get(Timer)?.setMethod(Timer.default)
  registry.get(Timer)?.setMethod(Timer.serialize)
  registry.get(Timer)?.setMethod(Timer.deserialize)
  registry.register(Clock, new StructInfo({
    elapsed: new Field(typeid(Number)),
    lastTick: new Field(typeid(Number)),
    delta: new Field(typeid(Number))
  }))
  registry.get(Clock)?.setMethod(Clock.serialize)
  registry.get(Clock)?.setMethod(Clock.deserialize)
  registry.register(VirtualClock, new StructInfo({
    elapsed: new Field(typeid(Number)),
    lastTick: new Field(typeid(Number)),
    delta: new Field(typeid(Number))
  }))
  registry.get(VirtualClock)?.setMethod(VirtualClock.serialize)
  registry.get(VirtualClock)?.setMethod(VirtualClock.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
