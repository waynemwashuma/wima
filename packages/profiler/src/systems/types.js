/** @import { TimerMode } from '@wimaengine/time' */

import { World } from '@wimaengine/ecs'
import { Field, MapInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { Profile, Profiler, ProfilerTimer } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers reflection metadata for the profiler resources.
 *
 * {@linkcode ProfilerPlugin} schedules this function as a one-shot Startup
 * system. It reads the world's {@linkcode TypeRegistry} and registers
 * {@linkcode Profile}, a string-keyed map of {@linkcode Profile} values, and
 * {@linkcode ProfilerTimer}.
 *
 * {@linkcode Profile} is described with numeric `lastTick` and `delta` fields
 * and receives {@linkcode Profile.serialize} and
 * {@linkcode Profile.deserialize}. {@linkcode Profiler} receives a
 * `profiles` field that uses the registered string-keyed profile map and
 * receives {@linkcode Profiler.serialize} and
 * {@linkcode Profiler.deserialize}. {@linkcode ProfilerTimer} receives
 * a `mode` field using the {@linkcode TimerMode} type ID, numeric `duration` and
 * `speed` fields, and a boolean `paused` field; it receives its inherited
 * `serialize` and `deserialize` methods.
 *
 * The {@linkcode TimerMode} type ID is provided by the time package's type
 * registration. This function changes only {@linkcode TypeRegistry} metadata;
 * it does not create profiler resources or collect measurements.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ProfilerPlugin } from '@wimaengine/profiler'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TimePlugin } from '@wimaengine/time'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new TimePlugin())
 *   .registerPlugin(new ProfilerPlugin())
 * // Startup registers profiler reflection metadata.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry} resource.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry} resource.
 * @category system
 */
export function registerProfilerTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Profile, new StructInfo({
    lastTick: new Field(typeid(Number)),
    delta: new Field(typeid(Number))
  }))
  registry.get(Profile)?.setMethod(Profile.serialize)
  registry.get(Profile)?.setMethod(Profile.deserialize)
  const profileMapId = typeidGeneric(Map, [String, Profile])

  registry.registerTypeId(profileMapId, new MapInfo(typeid(String), typeid(Profile)))
  registry.register(Profiler, new StructInfo({
    profiles: new Field(profileMapId)
  }))
  registry.get(Profiler)?.setMethod(Profiler.serialize)
  registry.get(Profiler)?.setMethod(Profiler.deserialize)
  registry.register(ProfilerTimer, new StructInfo({

    // TODO: add a shared helper for enum type ids to avoid setTypeId string literals.
    mode: new Field(setTypeId('TimerMode')),
    duration: new Field(typeid(Number)),
    speed: new Field(typeid(Number)),
    paused: new Field(typeid(Boolean))
  }))
  registry.get(ProfilerTimer)?.setMethod(ProfilerTimer.serialize)
  registry.get(ProfilerTimer)?.setMethod(ProfilerTimer.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
