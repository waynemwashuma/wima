/** @import { AppSchedule } from '@wimaengine/core' */
/** @import { AudioPlugin } from '../plugin' */
import { Handle, HandleSnapshot } from '@wimaengine/asset'
import { LiveType, SnapshotType } from '@wimaengine/core'
import { Graph } from '@wimaengine/datastructures'
import { World } from '@wimaengine/ecs'
import { EnumInfo, Field, OpaqueInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { Audio } from '../assets'
import { AudioOscillator, AudioOscillatorType, AudioPlayer, AudioPlayerSnapshot } from '../components'
import { AudioCommands, AudioGraph } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the audio package's reflection metadata in a world's
 * {@linkcode TypeRegistry}.
 *
 * {@linkcode AudioPlugin} registers this exact function in
 * {@linkcode AppSchedule.Startup},
 * after the reflection plugin has installed the registry. It creates
 * the stable IDs `AudioOscillatorType` and `AudioBuffer`, registering the
 * former as an {@linkcode EnumInfo} for {@linkcode AudioOscillatorType} and the latter
 * as {@linkcode OpaqueInfo} because a native `AudioBuffer` has no structured
 * reflection fields. It then registers the following constructor-backed types:
 *
 * - {@linkcode Audio} as a struct with the required `audiobuffer` field.
 * - {@linkcode AudioPlayer} with optional numeric `sourceNode` and `attach` fields
 *   and an optional generic `Handle<Audio>` field. Its entry receives
 *   `copy`, `clone`, and `toSnapshot` methods.
 * - {@linkcode AudioPlayerSnapshot} with optional numeric graph fields and an
 *   optional `HandleSnapshot` field. Its entry receives `serialize`,
 *   `deserialize`, and `fromSnapshot` methods.
 * - {@linkcode AudioOscillator} with optional numeric `sourceNode` and `attach`,
 *   required `AudioOscillatorType`, `detune`, and `frequency` fields. Its
 *   entry receives `copy`, `clone`, `serialize`, and `deserialize` methods.
 * - {@linkcode AudioGraph} with a required `Graph` field.
 * - {@linkcode AudioCommands} as an empty struct.
 *
 * Constructor-backed registrations derive their IDs with {@linkcode typeid}; the
 * `AudioPlayer.audio` field uses `typeidGeneric(Handle, [Audio])`, while the
 * two explicit IDs are created with {@linkcode setTypeId}. Method attachments use
 * the registry entry returned by {@linkcode TypeRegistry#get}; no methods are
 * attached to `Audio`, `AudioGraph`, or `AudioCommands`. The function has no
 * return value and does not create a second registry.
 *
 * @param {World} world - World containing the installed {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 *
 * @example
 * ```js
 * import { AudioPlayer } from '@wimaengine/audio'
 * import { TypeRegistry } from '@wimaengine/reflect'
 *
 * // AudioPlugin runs registerAudioTypes during Startup.
 * function inspectAudioPlayerMetadata(world) {
 *   const registry = world.getResource(TypeRegistry)
 *   const playerInfo = registry.get(AudioPlayer)
 *
 *   return playerInfo?.getMethod('toSnapshot')
 * }
 * ```
 */
export function registerAudioTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const oscillatorTypeId = setTypeId('AudioOscillatorType')
  const audioBufferId = setTypeId('AudioBuffer')

  registry.registerTypeId(oscillatorTypeId, new EnumInfo(AudioOscillatorType))
  registry.registerTypeId(audioBufferId, new OpaqueInfo())

  registry.register(Audio, new StructInfo({
    audiobuffer: new Field(audioBufferId)
  }))

  registry.register(AudioPlayer, new StructInfo({
    sourceNode: new Field(typeid(Number), true),
    attach: new Field(typeid(Number), true),
    audio: new Field(typeidGeneric(Handle, [Audio]), true)
  }))
  registry.get(AudioPlayer)?.setMethod(AudioPlayer.copy)
  registry.get(AudioPlayer)?.setMethod(AudioPlayer.clone)
  registry.get(AudioPlayer)?.setMethod(AudioPlayer.toSnapshot)
  registry.get(AudioPlayer)?.setAttribute(new SnapshotType(typeid(AudioPlayerSnapshot)))
  registry.register(AudioPlayerSnapshot, new StructInfo({
    sourceNode: new Field(typeid(Number), true),
    attach: new Field(typeid(Number), true),
    audio: new Field(typeidGeneric(HandleSnapshot, [Audio]), true)
  }))
  registry.get(AudioPlayerSnapshot)?.setMethod(AudioPlayerSnapshot.serialize)
  registry.get(AudioPlayerSnapshot)?.setMethod(AudioPlayerSnapshot.deserialize)
  registry.get(AudioPlayerSnapshot)?.setAttribute(new LiveType(typeid(AudioPlayer)))
  registry.register(AudioOscillator, new StructInfo({
    sourceNode: new Field(typeid(Number), true),
    type: new Field(oscillatorTypeId),
    attach: new Field(typeid(Number), true),
    detune: new Field(typeid(Number)),
    frequency: new Field(typeid(Number))
  }))
  registry.get(AudioOscillator)?.setMethod(AudioOscillator.copy)
  registry.get(AudioOscillator)?.setMethod(AudioOscillator.clone)
  registry.get(AudioOscillator)?.setMethod(AudioOscillator.serialize)
  registry.get(AudioOscillator)?.setMethod(AudioOscillator.deserialize)
  registry.register(AudioGraph, new StructInfo({
    graph: new Field(typeid(Graph))
  }))
  registry.register(AudioCommands, new StructInfo({}))
}
/* eslint-enable jsdoc/check-tag-names */
