import { Assets } from '@wimaengine/asset'
import { AnimationClip } from '../assets'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Typed resource alias for the shared {@linkcode Assets} pool of
 * {@linkcode AnimationClip} assets. It inherits {@linkcode Assets} behavior for
 * adding clips and resolving their handles.
 *
 * Retrieve the pool with `world.getResource` and {@linkcode AnimationClipAssets}.
 * Use {@linkcode Assets#add} to add clips and {@linkcode Assets#get} to resolve
 * their handles.
 *
 * @example
 * ```js
 * import { AnimationClip, AnimationClipAssets } from 'wima'
 *
 * function addClip(world) {
 *   const clips = world.getResource(AnimationClipAssets)
 *   const handle = clips.add(new AnimationClip())
 *
 *   return clips.get(handle)
 * }
 * ```
 *
 * @augments {Assets<AnimationClip>}
 * @category resource-alias
 */
export class AnimationClipAssets extends Assets { }
/* eslint-enable jsdoc/check-tag-names */
