/** @import { Assets } from '@wimaengine/asset' */
/**
 * Stores decoded browser audio data as one audio asset value.
 *
 * An `Audio` instance wraps an `AudioBuffer` produced by the browser's Web
 * Audio APIs. The value is stored in the shared {@linkcode Assets} pool exposed
 * through {@linkcode AudioAssets}. A handle identifies the pool entry; `Audio`
 * owns the decoded buffer reference, not the handle or pool.
 *
 * Use {@linkcode AudioAssets} to look up a loaded value by handle.
 *
 * @example
 * ```js
 * import { AssetServer } from '@wimaengine/asset'
 * import { Audio, AudioAssets } from '@wimaengine/audio'
 *
 * function inspectAudio(world) {
 *   const handle = world.getResource(AssetServer).load(Audio, '/audio/theme.ogg')
 *   const sound = world.getResource(AudioAssets).get(handle)
 *   if (sound) {
 *     console.log(sound.audiobuffer.duration)
 *   }
 * }
 * ```
 */
export class Audio {

  /**
   * Native decoded audio data supplied by the Web Audio API.
   *
   * The reference is the browser-created `AudioBuffer`, including its decoded
   * samples, duration, channel data, and sample rate. `Audio` stores this
   * reference as-is and does not copy or transform it.
   *
   * @type {AudioBuffer}
   */
  audiobuffer

  /**
   * Wraps an already decoded browser audio buffer.
   *
   * The constructor stores the reference as-is. It does not fetch, decode, or
   * add the value to {@linkcode AudioAssets}.
   *
   * @param {AudioBuffer} audiobuffer
   */
  constructor(audiobuffer) {
    this.audiobuffer = audiobuffer
  }

  /**
   * Creates a minimal silent audio asset.
   *
   * The returned buffer has one silent sample at 44,800 Hz. This is useful as
   * a default value for APIs that require an `Audio` instance; it is not a
   * replacement for importing a real audio file.
   *
   * @returns {Audio} A one-sample silent audio asset.
   */
  static default() {
    return new Audio(new AudioBuffer({
      sampleRate:44800,
      length:1
    }))
  }
}
