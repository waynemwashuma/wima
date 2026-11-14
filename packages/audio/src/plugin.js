import { App, Plugin } from '@wimaengine/app'
import { AssetImporterPlugin, AssetPlugin, Assets } from '@wimaengine/asset'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { ReflectPlugin } from '@wimaengine/reflect'
import { TimePlugin } from '@wimaengine/time'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { Audio } from './assets'
import { AudioPlayer, AudioOscillator, removeAudioPlayerSink, removeOscillatorSink } from './components'
import { AudioAdded, AudioDropped, AudioModified } from './events'
import { AudioCommands, AudioImporter, AudioAssets, AudioGraph } from './resources'
import { playAudio, playOscillators, registerAudioTypes } from './systems'

/** @import { AssetServerPlugin } from '@wimaengine/asset' */
/** @import { TypeId } from '@wimaengine/type' */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds browser audio playback to an {@linkcode App}.
 *
 * It connects {@linkcode AudioPlayer} and {@linkcode AudioOscillator} components to
 * {@linkcode Audio} assets and provides the {@linkcode AudioGraph},
 * {@linkcode AudioCommands}, and {@linkcode AudioAssets} resources. Use
 * {@linkcode AudioPlayer} for entity audio, {@linkcode AudioOscillator} for
 * generated waveforms, and {@linkcode AudioCommands} for direct controls.
 *
 * Audio assets are available through {@linkcode AudioAssets} and can be imported
 * with {@linkcode AudioImporter} using browser-supported audio formats. It also
 * provides {@linkcode AudioAdded}, {@linkcode AudioModified}, and
 * {@linkcode AudioDropped} for asset lifecycle changes. Register
 * {@linkcode AssetServerPlugin} when audio assets should be loaded through the
 * asset server.
 *
 * Component and command playback use separate browser audio contexts. The
 * plugin directly requires {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, and
 * {@linkcode TimePlugin}. Its asset importer also requires
 * {@linkcode AssetServerPlugin}.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetServerPlugin } from '@wimaengine/asset'
 * import { AudioPlugin } from '@wimaengine/audio'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TimePlugin } from '@wimaengine/time'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new TimePlugin())
 *   .registerPlugin(new AssetServerPlugin())
 *   .registerPlugin(new AudioPlugin())
 *   .setRunner(() => {})
 *   .run()
 * ```
 *
 * @category plugin
 */
export class AudioPlugin extends Plugin {

  /**
   * Adds audio resources, component cleanup behavior, and asset integration to
   * an app.
   *
   * The hook for {@linkcode AudioPlayer} drops its audio handle and stops the
   * current source when the component is removed. The hook for
   * {@linkcode AudioOscillator} stops its current oscillator. Neither component
   * receives an add or insert hook.
   *
   * The app receives an {@linkcode AudioGraph} and an {@linkcode AudioCommands}
   * resource in its default world. The graph drives component-based playback,
   * while commands provide imperative play, stop, mute, and unmute controls.
   *
   * It registers an {@linkcode AssetPlugin} for {@linkcode Audio} with
   * {@linkcode AudioAdded}, {@linkcode AudioModified}, and {@linkcode AudioDropped}
   * lifecycle events, and an {@linkcode AssetImporterPlugin} containing
   * {@linkcode AudioImporter}. The importer advertises browser-supported audio
   * extensions and decodes fetched responses into {@linkcode Audio} assets.
   * {@linkcode AudioAssets} provides the typed view of those assets.
   *
   * {@linkcode AudioPlayer} resolves its audio handle through {@linkcode AudioAssets}
   * and {@linkcode AudioOscillator} creates waveform sources through the graph.
   *
   * Browser autoplay restrictions can leave either context suspended. The
   * plugin resumes both contexts after a `pointerdown` interaction and removes
   * each listener once its context reports `running`.
   *
   * @param {App} app - App receiving the audio configuration.
   * @returns {void}
   */
  register(app) {
    const handler = new AudioCommands()

    app
      .setComponentHooks(AudioPlayer, new ComponentHooks(
        null,
        removeAudioPlayerSink
      ))
      .setComponentHooks(AudioOscillator, new ComponentHooks(
        null,
        removeOscillatorSink
      ))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerAudioTypes })
      .setResource(new AudioGraph())
      .setResource(handler)
      .registerPlugin(new AssetPlugin({
        asset: Audio,
        events: {
          added: AudioAdded,
          modified: AudioModified,
          dropped: AudioDropped
        }
      }))
      .registerPlugin(new AssetImporterPlugin({
        asset: Audio,
        importer: new AudioImporter()
      }))
      .registerSystem({ schedule: AppSchedule.Update, system: playAudio })
      .registerSystem({ schedule: AppSchedule.Update, system: playOscillators })
      .setResourceAlias(typeidGeneric(Assets, [Audio]), AudioAssets)

    window.addEventListener('pointerdown', resumeAudio)

    /** */
    function resumeAudio() {
      const ctx = handler.getContext()

      ctx.resume()

      if (ctx.state === 'running') {
        removeEventListener('pointerdown', resumeAudio)
      }
    }
  }

  /**
   * Returns the plugins required directly by audio support.
   *
   * The direct dependencies are {@linkcode CorePlugin},
   * {@linkcode ReflectPlugin}, and {@linkcode TimePlugin}. The nested
   * {@linkcode AssetImporterPlugin} also requires {@linkcode AssetServerPlugin};
   * register that plugin when audio assets should be loaded through the asset
   * server. Dependencies are validated by the app and are not installed
   * automatically.
   *
   * @returns {TypeId[]} Required plugin IDs.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(TimePlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */
