/** @import {AppSchedule, CoreSystems} from '@wimaengine/core' */
/** @import {AnimationPlugin} from '../plugin' */

import { EntityHandle, World } from '@wimaengine/ecs'
import { ArrayInfo, EnumInfo, Field, MapInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { AnimationClip } from '../assets'
import { AnimationPlayer, AnimationTarget } from '../components'
import { AnimationTrack, Playback, PlaybackRepeat } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers animation reflection metadata in the world's
 * {@linkcode TypeRegistry}.
 *
 * {@linkcode AnimationPlugin} registers this exact function directly in the
 * one-shot schedule, {@linkcode AppSchedule.Startup}. The registration does not
 * specify a system group, so it uses Startup's default group,
 * {@linkcode CoreSystems.Main}. The earlier phase runs before this system in
 * {@linkcode CoreSystems.Start}.
 *
 * The function obtains the registry with `world.getResource(TypeRegistry)` and
 * registers {@linkcode PlaybackRepeat} under the explicit `PlaybackRepeat` ID.
 * It also creates and registers these generic IDs: `Map<Number,Playback>`,
 * `Array<Number>`, `Array<AnimationTrack>`, and
 * `Map<String,Array<AnimationTrack>>`. The map and array entries use
 * {@linkcode MapInfo} and {@linkcode ArrayInfo}; the enum entry uses
 * {@linkcode EnumInfo}.
 *
 * It then registers the constructor-backed structs with these exact fields:
 *
 * - {@linkcode AnimationTrack}: `times` and `keyframes` use `Array<Number>`;
 *   `effector` uses `Function`.
 * - {@linkcode AnimationClip}: `tracks` uses `Map<String,Array<AnimationTrack>>`;
 *   `duration` uses `Number`.
 * - {@linkcode Playback}: `speed`, `duration`, and `elapsed` use `Number`;
 *   `repeatMode` uses {@linkcode PlaybackRepeat}; `paused` uses `Boolean`.
 * - {@linkcode AnimationPlayer}: `animations` uses `Map<Number,Playback>`;
 *   `current` is an optional `Number` field.
 * - {@linkcode AnimationTarget}: `player` uses {@linkcode EntityHandle}; `id` uses
 *   `String`.
 *
 * The registry entries for {@linkcode Playback}, {@linkcode AnimationPlayer}, and
 * {@linkcode AnimationTarget} receive their `copy`, `clone`, `serialize`, and
 * `deserialize` methods; {@linkcode Playback} also receives `default`. The
 * {@linkcode AnimationTrack} and {@linkcode AnimationClip} entries receive
 * `serialize` and `deserialize`; {@linkcode AnimationClip} also receives
 * `default`. The function changes reflection metadata only; it does not
 * create the {@linkcode TypeRegistry} or any animation resources. The registry
 * must therefore be installed before Startup runs.
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
 * // AnimationPlugin runs registerAnimationTypes during Startup.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry}.
 * @category system
 */
export function registerAnimationTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const playbackRepeatId = setTypeId('PlaybackRepeat')
  const playbackMapId = typeidGeneric(Map, [Number, Playback])
  const numberArrayId = typeidGeneric(Array, [Number])
  const animationTrackArrayId = typeidGeneric(Array, [AnimationTrack])
  const animationTrackMapId = setTypeId(`Map<String,${animationTrackArrayId}>`)

  registry.registerTypeId(playbackRepeatId, new EnumInfo(PlaybackRepeat))
  registry.registerTypeId(playbackMapId, new MapInfo(typeid(Number), typeid(Playback)))
  registry.registerTypeId(numberArrayId, new ArrayInfo(typeid(Number)))
  registry.registerTypeId(animationTrackArrayId, new ArrayInfo(typeid(AnimationTrack)))
  registry.registerTypeId(animationTrackMapId, new MapInfo(typeid(String), animationTrackArrayId))

  registry.register(AnimationTrack, new StructInfo({
    times: new Field(numberArrayId),
    keyframes: new Field(numberArrayId),
    effector: new Field(typeid(Function))
  }))
  registry.register(AnimationClip, new StructInfo({
    tracks: new Field(animationTrackMapId),
    duration: new Field(typeid(Number))
  }))
  registry.register(Playback, new StructInfo({
    speed: new Field(typeid(Number)),
    duration: new Field(typeid(Number)),
    elapsed: new Field(typeid(Number)),
    repeatMode: new Field(playbackRepeatId),
    paused: new Field(typeid(Boolean))
  }))
  registry.get(Playback)?.setMethod(Playback.copy)
  registry.get(Playback)?.setMethod(Playback.clone)
  registry.get(Playback)?.setMethod(Playback.default)
  registry.get(Playback)?.setMethod(Playback.serialize)
  registry.get(Playback)?.setMethod(Playback.deserialize)
  registry.register(AnimationPlayer, new StructInfo({
    animations: new Field(playbackMapId),
    current: new Field(typeid(Number), true)
  }))
  registry.get(AnimationPlayer)?.setMethod(AnimationPlayer.copy)
  registry.get(AnimationPlayer)?.setMethod(AnimationPlayer.clone)
  registry.get(AnimationPlayer)?.setMethod(AnimationPlayer.default)
  registry.get(AnimationPlayer)?.setMethod(AnimationPlayer.serialize)
  registry.get(AnimationPlayer)?.setMethod(AnimationPlayer.deserialize)
  registry.register(AnimationTarget, new StructInfo({
    player: new Field(typeid(EntityHandle)),
    id: new Field(typeid(String))
  }))
  registry.get(AnimationTarget)?.setMethod(AnimationTarget.copy)
  registry.get(AnimationTarget)?.setMethod(AnimationTarget.clone)
  registry.get(AnimationTarget)?.setMethod(AnimationTarget.default)
  registry.get(AnimationTarget)?.setMethod(AnimationTarget.serialize)
  registry.get(AnimationTarget)?.setMethod(AnimationTarget.deserialize)
  registry.get(AnimationTrack)?.setMethod(AnimationTrack.serialize)
  registry.get(AnimationTrack)?.setMethod(AnimationTrack.deserialize)
  registry.get(AnimationClip)?.setMethod(AnimationClip.default)
  registry.get(AnimationClip)?.setMethod(AnimationClip.serialize)
  registry.get(AnimationClip)?.setMethod(AnimationClip.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
