/** @import {PlaybackId} from '../typedef'*/
import { Audio } from '../assets'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides direct audio playback controls as a world resource.
 *
 * Use this resource to play, stop, mute, and unmute a resolved
 * {@linkcode Audio} asset. It does not resolve asset handles; use
 * {@linkcode AudioAssets} or {@linkcode Assets} first when playback begins with a
 * handle.
 *
 * @example
 * ```js
 * import { AudioCommands } from '@wimaengine/audio'
 *
 * // `sound` is a loaded Audio asset, not an asset handle.
 * function playLoop(world, sound) {
 *   const commands = world.getResource(AudioCommands)
 *   const playback = commands.play(sound, true)
 *
 *   // This disconnects the source from the command mix. It does not call the
 *   // native AudioBufferSourceNode.stop() method.
 *   return () => commands.stop(playback)
 * }
 * ```
 *
 * @category resource
 */
export class AudioCommands {

  /**
   * Audio context used by command-driven playback.
   *
   * This resource uses the context for its playback.
   *
   * @private
   * @type {AudioContext}
   */
  ctx

  /**
   * Buffer source nodes created by {@linkcode AudioCommands#play}.
   *
   * Entries remain in this array after a source naturally finishes and after
   * {@linkcode AudioCommands#stop}; the resource has no automatic source cleanup
   * or array-slot reclamation. Stopping only disconnects the source and marks
   * its playback mapping as stopped.
   *
   * @private
   * @type {AudioBufferSourceNode[]}
   */
  audio = []

  /**
   * Maps public playback IDs to indexes in {@linkcode AudioCommands#audio}.
   *
   * {@linkcode AudioCommands#stop} replaces a stopped mapping with `-1`; entries
   * are not removed or recycled.
   *
   * @private
   * @type {number[]}
   */
  playbacks = []

  /**
   * Master gain value captured by {@linkcode AudioCommands#mute} for
   * {@linkcode AudioCommands#unmute}.
   *
   * @private
   * @type {number}
   */
  internalVolume = 1

  /**
   * Master gain through which every source created by {@linkcode AudioCommands#play}
   * is routed.
   *
   * The gain is connected to the context destination by the constructor.
   *
   * @private
   * @type {GainNode}
   */
  masterGainNode

  /**
   * Creates a command resource with a master gain connected to the context's
   * destination.
   *
   * When no context is supplied, a new `AudioContext` is created. The supplied
   * context is stored as-is. The constructor does not load assets or start
   * playback.
   *
   * @param {AudioContext} [ctx] - Context to use, or a new context when omitted.
   */
  constructor(ctx = new AudioContext()) {
    this.ctx = ctx
    this.masterGainNode = ctx.createGain()
    this.masterGainNode.connect(ctx.destination)
  }

  /**
   * Creates and starts a buffer source for an audio asset.
   *
   * The source reads `sound.audiobuffer`, connects to this resource's master
   * gain node, and forwards the timing values to
   * `AudioBufferSourceNode.start(when, offset, duration)`. `delay` is passed as
   * `when` directly; it is not added to the context's current time. The
   * `loop` flag is assigned to the source after it is started.
   *
   * The returned ID indexes the resource's playback mapping, which points to
   * the source in {@linkcode AudioCommands#audio}. It is not the source-array
   * index itself. A source that reaches its end is not removed or marked in
   * this mapping, and the resource exposes no completion event for it.
   *
   * @param {Audio} sound - Decoded audio asset to play.
   * @param {boolean} [loop=false] - Whether the source should loop.
   * @param {number} [delay=0] - Value passed as Web Audio's `when` argument.
   * @param {number} [offset=0] - Start offset in the audio buffer, in seconds.
   * @param {number} [duration=sound.audiobuffer.duration] - Playback duration,
   * in seconds.
   * @returns {PlaybackId} ID to pass to {@linkcode AudioCommands#stop}.
   */
  play(sound, loop = false, delay = 0, offset = 0, duration = sound.audiobuffer.duration) {
    const source = this.ctx.createBufferSource()
    const id = this.audio.push(source) - 1

    source.buffer = sound.audiobuffer
    source.connect(this.masterGainNode)
    source.start(delay, offset, duration)
    source.loop = loop

    return this.playbacks.push(id) - 1
  }

  /**
   * Disconnects a playback source from the master gain node.
   *
   * This is the only cleanup operation provided for a playback ID. It does not
   * call the source's native `stop()` method, remove it from
   * {@linkcode AudioCommands#audio}, or reclaim its array slot. It only sets the
   * playback mapping to `-1` after disconnecting the source. Pass a live ID
   * returned by {@linkcode AudioCommands#play}; an
   * unknown or already-stopped ID does not no-op safely because no source can
   * be disconnected.
   *
   * @param {PlaybackId} id - ID returned by {@linkcode AudioCommands#play}.
   */
  stop(id) {
    const playback = this.playbacks[id]
    const audio = this.audio[playback]

    audio.disconnect()
    this.playbacks[id] = -1
  }

  /**
   * Silences all command-driven playback through the master gain.
   *
   * The current gain value is saved in `internalVolume`, then the gain is set
   * to zero. Sources continue running and are neither stopped nor disconnected.
   * Calling `mute()` again while already muted saves zero, so a later
   * {@linkcode AudioCommands#unmute} restores zero.
   */
  mute() {
    this.internalVolume = this.masterGainNode.gain.value
    this.masterGainNode.gain.value = 0
  }

  /**
   * Restores the gain value saved by {@linkcode AudioCommands#mute}.
   *
   * Before the first mute, the saved value is `1`. This changes only the
   * master gain; it does not restart, stop, disconnect, or otherwise alter
   * individual sources.
   */
  unmute() {
    this.masterGainNode.gain.value = this.internalVolume
  }

  /**
   * Returns the Web Audio context used by this resource.
   *
   * The returned context may be suspended until the browser permits audio
   * playback.
   *
   * @returns {AudioContext} The command resource's audio context.
   */
  getContext() {
    return this.ctx
  }
}
/* eslint-enable jsdoc/check-tag-names */
