import { Query, World } from '@wimaengine/ecs'
import { Timer, TimerMode } from '@wimaengine/time'
import { AudioPlayer, AudioOscillator, AudioOscillatorType } from '../components'
import { AudioAssets, AudioGraph } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Drives {@linkcode AudioPlayer} components from the world's typed audio assets.
 *
 * {@linkcode AudioPlugin} registers this exact
 * function in {@linkcode AppSchedule.Update}.
 * Each update looks up {@linkcode AudioGraph} and {@linkcode AudioAssets}, then
 * queries only entities that have both an `AudioPlayer` and a {@linkcode Timer}
 * using {@linkcode Query#each}.
 * Players without a handle or whose handle is not currently resolved are
 * skipped. The system does not load audio or process a player without a timer.
 *
 * For a resolved player without a graph slot, the system reserves an empty
 * {@linkcode AudioGraph} slot, connects it to `attach` or the graph root, and sets
 * the timer duration from the decoded buffer before restarting the timer while
 * preserving its current elapsed position. On a later playback change, it
 * creates an `AudioBufferSourceNode` with the buffer and timer speed. The loop
 * flag is `false` for {@linkcode TimerMode.Once} and `true` for
 * {@linkcode TimerMode.Repeat}; other numeric modes fall back to `false`.
 * The node starts at the timer's elapsed offset and replaces the placeholder
 * through {@linkcode AudioGraph#update}.
 *
 * A paused timer clears the current native source. A completed timer is also
 * cleared before the system checks for a playback change. If no playback
 * change is reported, the existing source is left alone. Replacing or clearing
 * a graph slot lets {@linkcode AudioGraph} stop and disconnect the previous native
 * source while retaining the slot and its outgoing edge.
 *
 * @param {World} world - World containing the audio resources and entities.
 * @returns {void}
 * @category system
 *
 * @example
 * ```js
 * import { AudioAssets, AudioPlayer } from '@wimaengine/audio'
 * import { Timer } from '@wimaengine/time'
 *
 * // AudioPlugin registers playAudio in the Update schedule.
 * function inspectPlayer(world, entity) {
 *   const player = world.get(entity, AudioPlayer)
 *   const audio = player.audio
 *     ? world.getResource(AudioAssets).get(player.audio)
 *     : undefined
 *   const timer = world.get(entity, Timer)
 *
 *   console.log(audio?.audiobuffer.duration, timer?.elapsed())
 * }
 * ```
 */
export function playAudio(world) {
  const graph = world.getResource(AudioGraph)
  const audioSources = world.getResource(AudioAssets)
  const players = new Query(world, [AudioPlayer, Timer])
  const ctx = graph.getContext()
  const root = graph.getRoot()

  players.each(([player, playback]) => {
    const { audio, sourceNode, attach } = player

    if (!audio) return

    const source = audioSources.get(audio)

    if (!source) {
      return
    }
    if (sourceNode) {
      if (playback.completed()) {
        graph.update(sourceNode, undefined)
      }

      if (!playback.playbackChanged()) return
      if (playback.paused) {
        graph.update(sourceNode, undefined)

        return
      }

      const node = new AudioBufferSourceNode(ctx, {
        buffer: source.audiobuffer,
        loop: looped(playback.mode),
        playbackRate: playback.speed
      })

      node.start(0, playback.elapsed())
      graph.update(sourceNode, node)

    } else {

      // The Oscillator will play in the next frame..
      // TODO: Maybe do this in a component hook?
      const id = graph.add(undefined)

      if (attach) {
        graph.connect(id, attach)
      } else {
        graph.connect(id, root)
      }

      const elapsed = playback.elapsed()

      playback.duration = source.audiobuffer.duration
      playback.reset()
      playback.seek(elapsed)
      player.sourceNode = id
    }
  })
}

/**
 * Drives {@linkcode AudioOscillator} components from timer playback state.
 *
 * {@linkcode AudioPlugin} registers this exact
 * function in {@linkcode AppSchedule.Update}.
 * Each update looks up {@linkcode AudioGraph} and queries only entities
 * that have both an {@linkcode AudioOscillator} and a {@linkcode Timer} using
 * {@linkcode Query#each}. No audio asset
 * lookup is performed because the native oscillator is created from the
 * component's frequency, detune, and waveform settings.
 *
 * When an oscillator has no graph slot, the system reserves an empty slot and
 * connects it to `attach` or the graph root. It resets the timer while
 * preserving its current elapsed position so the slot can be filled on a
 * later update. When the timer reports a playback change, the system maps
 * {@linkcode AudioOscillatorType} to the corresponding Web Audio waveform
 * (`SawTooth` → `sawtooth`, `Sine` → `sine`, `Square` → `square`, or
 * `Triangle` → `triangle`), creates an `OscillatorNode`, starts it immediately,
 * and replaces the slot through {@linkcode AudioGraph#update}. An unknown numeric
 * waveform throws before a native node is created.
 *
 * A paused timer clears the native oscillator. A completed timer is cleared
 * before playback-change handling; repeating timers do not report completion
 * and can create the next oscillator when playback is requested again. When
 * no playback change is reported, the current native source is left alone.
 * Replacing or clearing a slot delegates stopping and disconnection of the
 * previous source to {@linkcode AudioGraph#update}; the reserved slot and graph
 * edge remain available for reuse.
 *
 * @param {World} world - World containing the audio graph and oscillator entities.
 * @returns {void}
 * @category system
 *
 * @example
 * ```js
 * import { AudioOscillator, AudioOscillatorType } from '@wimaengine/audio'
 * import { Timer, TimerMode } from '@wimaengine/time'
 *
 * // AudioPlugin registers playOscillators in the Update schedule.
 * function spawnSquareTone(world) {
 *   return world.spawn([
 *     new AudioOscillator({ type: AudioOscillatorType.Square, frequency: 220 }),
 *     new Timer({ duration: 1, mode: TimerMode.Once })
 *   ])
 * }
 * ```
 */
export function playOscillators(world) {
  const graph = world.getResource(AudioGraph)
  const oscillators = new Query(world, [AudioOscillator, Timer])
  const ctx = graph.getContext()
  const root = graph.getRoot()

  oscillators.each(([oscillator, playback]) => {
    const { type, frequency, sourceNode, detune, attach } = oscillator

    if (sourceNode) {
      if (playback.completed()) {
        graph.update(sourceNode, undefined)
      }
      if (!playback.playbackChanged()) return
      if (playback.paused) {
        graph.update(sourceNode, undefined)

        return
      }

      const node = new OscillatorNode(ctx, {
        detune,
        frequency,
        type: mapType(type)
      })

      node.start(0)
      graph.update(sourceNode, node)

    } else {

      // SAFETY: Since we dont know when the actual audio source will load, we set this node's weight to undefined.
      // TODO: Maybe do this in a component hook?
      const id = graph.add(undefined)

      if (attach) {
        graph.connect(id, attach)
      } else {
        graph.connect(id, root)
      }

      const elapsed = playback.elapsed()

      playback.reset()
      playback.seek(elapsed)
      oscillator.sourceNode = id
    }
  })
}

/**
 * @param {TimerMode} playbackMode
 */
function looped(playbackMode) {
  switch (playbackMode) {
    case TimerMode.Once:
      return false

    case TimerMode.Repeat:
      return true

    default:
      return false
  }
}

/**
 * @param {AudioOscillatorType} type
 * @throws {string}
 * @returns {OscillatorType}
 */
function mapType(type) {
  switch (type) {
    case AudioOscillatorType.SawTooth:
      return 'sawtooth'

    case AudioOscillatorType.Sine:
      return 'sine'

    case AudioOscillatorType.Square:
      return 'square'

    case AudioOscillatorType.Triangle:
      return 'triangle'

    default:
      throw 'No such `AudioOscillatorType` exists.'
  }
}
/* eslint-enable jsdoc/check-tag-names */
