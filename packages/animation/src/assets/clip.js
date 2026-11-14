/** @import { AnimationTrackSerial } from '../core' */
/** @import { AnimationTarget } from '../components' */
import { AnimationTrack } from '../core'

/**
 * Represents an animation asset composed of named {@linkcode AnimationTrack}
 * values.
 *
 * Tracks are grouped by target IDs supplied by {@linkcode AnimationTarget}, while
 * the clip stores the combined animation duration. A new clip starts empty
 * with a duration of `0`; use {@linkcode AnimationClip#add} and
 * {@linkcode AnimationClip#calculateDuration} to populate the asset.
 *
 * @example
 * ```js
 * import {
 *   AnimationClip,
 *   AnimationTrack,
 *   Position2DAnimationEffector
 * } from '@wimaengine/animation'
 *
 * const clip = new AnimationClip()
 * const track = new AnimationTrack(Position2DAnimationEffector)
 * track.times = [0, 1]
 * track.keyframes = [0, 0, 1, 1]
 * clip.add('/player/position', track)
 * clip.calculateDuration()
 * console.log(clip.duration) // 1
 * ```
 */
export class AnimationClip {

  /**
   * Animation tracks grouped by their target id.
   *
   * Each map value preserves the order in which tracks were added, so several
   * tracks can contribute to the same target. {@linkcode AnimationClip#add},
   * {@linkcode AnimationClip#getTracks}, and {@linkcode AnimationClip#remove} operate
   * on these live arrays and do not recalculate {@linkcode AnimationClip#duration}.
   *
   * @type {Map<string,AnimationTrack[]>}
   */
  tracks = new Map()

  /**
   * Clip length in the same time units as its track timestamps.
   *
   * It starts at `0` and is only recomputed by
   * {@linkcode AnimationClip#calculateDuration}; adding,
   * removing, or mutating a track does not update it automatically. The value
   * is copied as-is by serialization.
   *
   * @type {number}
   */
  duration = 0

  /**
   * Adds a track under a target id.
   *
   * An existing id receives the track at the end of its array; a new id gets a
   * one-element array. This method does not validate the track or recalculate
   * {@linkcode AnimationClip#duration}.
   *
   * @param {string} name
   * @param {AnimationTrack} track
   * @returns {this} This clip, for fluent setup.
   */
  add(name, track) {
    const tracks = this.tracks.get(name)

    if (tracks) {
      tracks.push(track)
    } else {
      this.tracks.set(name, [track])
    }

    return this
  }

  /**
   * Returns the tracks assigned to a target id.
   *
   * The returned array is the live array stored in the clip, so changing it
   * changes the clip. The method returns `undefined` when the id is not in the
   * map.
   *
   * @param {string} id
   * @returns {AnimationTrack[] | undefined}
   */
  getTracks(id) {
    return this.tracks.get(id)
  }

  /**
   * Removes every track assigned to a target id.
   *
   * Missing ids are ignored. The method does not recalculate
   * {@linkcode AnimationClip#duration} and returns `undefined`.
   *
   * @param {string} name
   * @returns {void}
   */
  remove(name) {
    this.tracks.delete(name)
  }

  /**
   * Recomputes the clip duration from its tracks.
   *
   * The method resets `duration` to `0`, then compares the final value in each
   * track's `times` array and keeps the greatest value. Empty tracks and final
   * timestamps that do not exceed `0` leave the duration at `0`. It does not
   * sort or validate tracks and returns `undefined`.
   *
   * @returns {void}
   */
  calculateDuration() {
    this.duration = 0
    this.tracks.forEach((tracks) => {
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const contender = track.times[track.times.length - 1]

        if (this.duration < contender) {
          this.duration = contender
        }
      }
    })
  }

  /**
   * Validates every track currently stored in the clip.
   *
   * Returns `false` as soon as a track's
   * {@linkcode AnimationTrack#validate} method returns `false`; an empty
   * clip is valid. This checks track values only and does not validate the
   * duration or target-id keys.
   *
   * @returns {boolean} Whether every stored track is valid.
   */
  validate() {
    for (const tracks of this.tracks.values()) {
      for (let i = 0; i < tracks.length; i++) {
        if (!tracks[i].validate()) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Creates a fresh empty clip.
   *
   * Each call is equivalent to `new AnimationClip()`: it returns a distinct
   * instance with no tracks and a duration of `0`. It does not calculate a
   * duration or share state with another clip.
   *
   * @returns {AnimationClip} A new empty clip.
   *
   * @example
   * ```js
   * const clip = AnimationClip.default()
   * console.log(clip.duration) // 0
   * ```
   */
  static
  default() {
    return new AnimationClip()
  }

  /**
   * Converts a clip to its serialized representation.
   *
   * The `tracks` map becomes an array of `[targetId, tracks]` entries in map
   * insertion order, and each nested track is passed to
   * {@linkcode AnimationTrack.serialize}. The stored duration is copied as-is;
   * serialization does not calculate or validate it and does not mutate the
   * clip.
   *
   * @param {AnimationClip} value - Clip to serialize.
   * @returns {AnimationClipSerial} Serialized clip data.
   */
  static serialize(value) {
    return {
      duration: value.duration,
      tracks: Array.from(value.tracks.entries()).map(([name, tracks]) => [
        name,
        tracks.map((track) => AnimationTrack.serialize(track))
      ])
    }
  }

  /**
   * Checks the serialized shape accepted by
   * {@linkcode AnimationClip.deserialize}.
   *
   * `duration` must be a JavaScript number and `tracks` must be an array of
   * two-item `[targetId, tracks]` entries. Each target id must be a string and
   * each nested value must pass {@linkcode AnimationTrack.validateSerial}. Empty
   * track arrays and duplicate target ids are accepted; this method does not
   * check duration against timestamps or run {@linkcode AnimationTrack#validate}.
   *
   * @param {unknown} value - Value to validate.
   * @returns {value is AnimationClipSerial} Whether the value has a valid clip serial shape.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('duration' in value) || !('tracks' in value)) {
      return false
    }

    if (typeof value.duration !== 'number' || !Array.isArray(value.tracks)) {
      return false
    }

    for (let i = 0; i < value.tracks.length; i++) {
      const entry = value.tracks[i]

      if (!Array.isArray(entry) || entry.length !== 2) {
        return false
      }

      const [name, tracks] = entry

      if (typeof name !== 'string' || !Array.isArray(tracks)) {
        return false
      }

      for (let j = 0; j < tracks.length; j++) {
        if (!AnimationTrack.validateSerial(tracks[j])) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Restores a serialized clip into a new or supplied output instance.
   *
   * The output's duration is copied and its tracks map is replaced with a new
   * map; each serialized track is restored through
   * {@linkcode AnimationTrack.deserialize}. This method does not validate or
   * recalculate the restored data, so validate external input with
   * {@linkcode AnimationClip.validateSerial} first.
   *
   * @param {AnimationClipSerial} value - Serialized clip data.
   * @param {AnimationClip} [out] - Clip to populate.
   * @returns {AnimationClip} The populated output clip.
   */
  static deserialize(value, out = new AnimationClip()) {
    out.duration = value.duration
    out.tracks = new Map(
      value.tracks.map(([name, tracks]) => [
        name,
        tracks.map((track) => AnimationTrack.deserialize(track))
      ])
    )

    return out
  }
}

/**
 * Serialized form of `AnimationClip`.
 *
 * @typedef AnimationClipSerial
 * @property {number} duration Stored clip duration.
 * @property {[string, AnimationTrackSerial[]][]} tracks Target-id entries in map insertion order.
 */
