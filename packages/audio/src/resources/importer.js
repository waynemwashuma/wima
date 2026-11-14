/** @import { TypeRegistry } from '@wimaengine/reflect' */
import { Importer } from '@wimaengine/asset'
import { Audio } from '../assets'

/**
 * Imports browser-supported audio responses as decoded {@linkcode Audio} assets.
 *
 * The importer reports extensions from the current browser's HTML audio
 * capability checks, reads each response as an `ArrayBuffer`, and decodes it
 * with an {@linkcode OfflineAudioContext}. Each successful decode produces an
 * {@linkcode Audio} value containing the resulting {@linkcode AudioBuffer}.
 *
 * @example
 * ```js
 * import { AssetServer } from '@wimaengine/asset'
 * import { Audio, AudioAssets } from '@wimaengine/audio'
 *
 * function loadTheme(world) {
 *   const server = world.getResource(AssetServer)
 *   const handle = server.load(Audio, '/audio/theme.ogg')
 *   const sound = world.getResource(AudioAssets).get(handle)
 *   // `sound` is the decoded `Audio` asset when it is available.
 *   return sound
 * }
 * ```
 *
 * @augments {Importer<Audio>}
 */
export class AudioImporter extends Importer {

  /**
   * {@linkcode OfflineAudioContext} used to decode fetched audio bytes.
   *
   * The context is created once from the constructor options and reused for
   * every response handled by this importer.
   *
   * @private
   * @type {OfflineAudioContext}
   */
  decoder

  /**
   * Creates an importer with an {@linkcode OfflineAudioContext} decoder.
   *
   * The options are forwarded to the browser's {@linkcode OfflineAudioContext}
   * constructor. If omitted, the importer uses a 44.1 kHz context with a
   * 512-sample render length. This configuration affects decoding only.
   *
   * @param {OfflineAudioContextOptions} [options={ sampleRate: 44100, length: 512 }] - Offline decoding context options.
   */
  constructor(options = {
    sampleRate: 44100,
    length: 512
  }) {
    super(Audio)
    this.decoder = new OfflineAudioContext(options)
  }

  /**
   * Decodes a fetched response into an {@linkcode Audio} asset.
   *
   * The response body is read as an `ArrayBuffer`, then passed to
   * {@linkcode OfflineAudioContext#decodeAudioData}. The `_typeRegistry` argument
   * is accepted for the inherited {@linkcode Importer#deserialize} contract but
   * is unused because browser audio decoding produces a native
   * {@linkcode AudioBuffer}. If reading the body or decoding fails, this promise
   * rejects.
   *
   * @inheritdoc
   * @param {Response} response - Fetched response containing encoded audio
   * bytes.
   * @param {TypeRegistry} _typeRegistry - Importer type registry, unused for
   * browser audio decoding.
   * @returns {Promise<Audio>} Decoded audio asset containing the native audio
   * buffer.
   */
  async deserialize(response, _typeRegistry) {
    const raw = await response.arrayBuffer()
    const audiobuffer = await this.decoder.decodeAudioData(raw)

    return new Audio(audiobuffer)
  }

  /**
   * Lists audio file extensions supported by the current browser.
   *
   * A temporary HTML audio element probes
   * `'audio/ogg; codecs="vorbis"'`, `'audio/mpeg;'`,
   * `'audio/wav; codecs="1"'`, and both M4A checks, `'audio/x-m4a;'` and
   * `'audio/aac;'`. A check contributes an extension when `canPlayType`
   * returns a non-empty value other than the exact string `no`, including
   * `maybe` or `probably`; the M4A check succeeds when either MIME type is
   * accepted. The returned values omit the leading dot because they are
   * extension labels. This reports browser capability, not a guarantee that
   * every file will decode successfully.
   *
   * @inheritdoc
   * @returns {string[]} Supported extension labels reported by this browser.
   */
  getExtensions() {

    // audio capabilities
    const audio = document.createElement('audio')
    const extensions = []

    if (audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
      extensions.push('ogg')
    }
    if (audio.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
      extensions.push('mp3')
    }
    if (audio.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
      extensions.push('wav')
    }
    if (audio.canPlayType('audio/x-m4a;').replace(/^no$/, '') || audio.canPlayType('audio/aac;').replace(/^no$/, '')) {
      extensions.push('m4a')
    }

    return extensions
  }
}
