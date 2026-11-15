/** @import {AssetPlugin, Handle} from '@wimaengine/asset' */
/** @import {AudioPlayer} from '../components' */
/** @import {AudioPlugin} from '../plugin' */
/** @import {typeidGeneric} from '@wimaengine/type' */
import { Assets } from '@wimaengine/asset'
import { Audio } from '../assets'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Typed resource alias for the shared {@linkcode Assets} pool of {@linkcode Audio}
 * assets. It inherits {@linkcode Assets} behavior, including {@linkcode Assets#add}
 * and {@linkcode Assets#get}, for storing and resolving audio handles.
 *
 * {@linkcode AudioPlugin} registers this alias for the shared audio pool; it does
 * not create a second store. Retrieve the pool with `world.getResource` and
 * {@linkcode AudioAssets}.
 *
 * @example
 * ```js
 * import { AudioAssets } from '@wimaengine/audio'
 *
 * function lookupAudio(world, audioHandle) {
 *   const audioAssets = world.getResource(AudioAssets)
 *   const audio = audioAssets.get(audioHandle)
 *
 *   // AudioAssets resolves this handle from the shared pool.
 *   return audio?.audiobuffer
 * }
 * ```
 *
 * @augments {Assets<Audio>}
 * @category resource-alias
 */
export class AudioAssets extends Assets { }
/* eslint-enable jsdoc/check-tag-names */
