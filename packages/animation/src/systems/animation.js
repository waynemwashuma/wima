/** @import { AppSchedule, CorePlugin, CoreSystems } from '@wimaengine/core' */
/** @import { AnimationTrack, Playback } from '../core' */
/** @import { AnimationPlugin } from '../plugin' */
import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { VirtualClock } from '@wimaengine/time'
import { AnimationPlayer, AnimationTarget } from '../components'
import { AnimationClipAssets } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Advances every {@linkcode Playback} registered in every
 * {@linkcode AnimationPlayer} component.
 *
 * {@linkcode AnimationPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule. It does not specify a
 * system group, so {@linkcode CoreSystems.Main} is used by schedules created by
 * {@linkcode CorePlugin}. The animation update sequence samples tracks after
 * playback time has been advanced.
 *
 * A fresh {@linkcode Query} finds the world's current `AnimationPlayer` tables
 * for this invocation. The function reads
 * `world.getResource(VirtualClock).getDelta()` once and passes that value to
 * {@linkcode Playback#update} for every playback. Paused playbacks still receive
 * the call; {@linkcode Playback#update} decides whether elapsed time changes. The world
 * must contain the {@linkcode VirtualClock} resource, or resource lookup throws.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { advanceAnimationPlayers } from '@wimaengine/animation'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: advanceAnimationPlayers
 * })
 * // AnimationPlugin already registers this system for its app.
 * ```
 *
 * @param {World} world - World containing `AnimationPlayer` components and a `VirtualClock` resource.
 * @returns {void}
 * @category system
 */
export function advanceAnimationPlayers(world) {
  const players = new Query(world, [AnimationPlayer])
  const dt = world.getResource(VirtualClock).getDelta()

  players.each(([player]) => {
    player.animations.forEach((playback) => {
      playback.update(dt)
    })
  })
}

/**
 * Samples and applies the tracks for every {@linkcode AnimationTarget} in the
 * world.
 *
 * {@linkcode AnimationPlugin} registers this exact function directly in
 * {@linkcode AppSchedule.Update}, in {@linkcode CoreSystems.Main} when using the
 * core schedules. A fresh {@linkcode Query} finds `AnimationPlayer` and
 * `[EntityHandle, AnimationTarget]` tables for this invocation. Each target's
 * player handle is resolved with the player query; stale or missing player
 * entities are skipped.
 *
 * For each mapped animation, the system resolves the clip from
 * {@linkcode AnimationClipAssets} by asset ID, gets the target's tracks, and
 * skips the target when no tracks are registered for its ID. It then samples
 * every {@linkcode AnimationTrack} at the playback's current elapsed time and
 * calls the track effector with the world, target entity, and sampled values.
 * Player map order, track-array order, and query iteration order are
 * preserved. Playback time is read as-is; this function does not advance it.
 *
 * The world must contain the {@linkcode AnimationClipAssets} resource; otherwise
 * resource lookup throws. Every playback asset ID must also resolve to a live
 * clip in that resource. A stale or missing asset ID is not ignored:
 * `getByAssetId()` returns `undefined`, and the subsequent track lookup
 * throws.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { applyAnimations } from '@wimaengine/animation'
 *
 * // After AnimationPlugin (or equivalent setup) provides AnimationClipAssets:
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: applyAnimations
 * })
 * // AnimationPlugin already registers this system for its app.
 * ```
 *
 * @param {World} world - World containing `AnimationPlayer`, `AnimationTarget`, and `AnimationClipAssets` state.
 * @returns {void}
 * @category system
 */
export function applyAnimations(world) {
  const clips = world.getResource(AnimationClipAssets)
  const players = new Query(world, [AnimationPlayer])
  const targets = new Query(world, [EntityHandle, AnimationTarget])

  targets.each(([entity, target]) => {
    const play = players.get(target.player)

    if (!play) return

    const [player] = play

    player.animations.forEach((playback, assetId) => {

      const clip = clips.getByAssetId(assetId)
      const tracks = clip.getTracks(target.id)

      if (!tracks) return

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const current = track.getCurrent(playback.elapsed)

        // In the future, i might implement this using type reflection when it lands to allow arbitrary
        // components without needing the current effector implementation.

        track.effector.apply(world, entity, current)
      }
    })
  })
}
/* eslint-enable jsdoc/check-tag-names */
