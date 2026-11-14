/* eslint-disable jsdoc/check-tag-names */
/**
 * Represents the timing value for one labeled measurement.
 *
 * {@linkcode Profiler#start} records when the measurement starts, and
 * {@linkcode Profiler#end} records the duration when it ends. Use
 * {@linkcode Profiler} to create and access profiles, and use the static
 * serialization methods to preserve their values.
 *
 */
export class Profile {

  /**
   * Timestamp captured by the most recent {@linkcode Profiler#start}, in
   * milliseconds.
   *
   * @type {number}
   */
  lastTick = 0

  /**
   * Duration measured by the most recent {@linkcode Profiler#end}, in
   * milliseconds. It remains unchanged until a matching label is ended.
   *
   * @type {number}
   */
  delta = 0

  /**
   * Converts a profile to its serializable plain-object representation.
   *
   * The returned object contains only the current `lastTick` and `delta`
   * numbers. It is a new object, so changing it does not mutate `value`.
   *
   * @param {Profile} value - Profile to serialize.
   * @returns {ProfileSerial} Serialized timestamp and duration.
   */
  static serialize(value) {
    return {
      lastTick: value.lastTick,
      delta: value.delta
    }
  }

  /**
   * Loads serialized values into a profile.
   *
   * The supplied `out` instance is reused when provided; otherwise a new
   * {@linkcode Profile} is created. The method copies `lastTick` and `delta`
   * directly and does not validate the input, so call
   * {@linkcode Profile.validateSerial} first when input is
   * untrusted.
   *
   * @param {ProfileSerial} value - Serialized profile values.
   * @param {Profile} [out] - Profile to overwrite.
   * @returns {Profile} The populated profile.
   */
  static deserialize(value, out = new Profile()) {
    out.lastTick = value.lastTick
    out.delta = value.delta

    return out
  }

  /**
   * Checks whether a value has the shape required by
   * {@linkcode Profile.deserialize}.
   *
   * The check requires a non-null object with numeric `lastTick` and `delta`
   * properties. It accepts additional properties and does not impose ranges
   * or reject `NaN` and infinities, because JavaScript classifies those values
   * as numbers.
   *
   * @param {unknown} value - Value to check.
   * @returns {value is ProfileSerial} `true` when the required fields are numeric.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('lastTick' in value) || !('delta' in value)) {
      return false
    }

    return typeof value.lastTick === 'number' &&
      typeof value.delta === 'number'
  }
}

/**
 * Collects named duration measurements as a world resource.
 *
 * Use {@linkcode Profiler#start} and {@linkcode Profiler#end} around the
 * work to measure. Labels identify entries in {@linkcode Profiler#profiles}; a
 * missing label is created by `start`, while `end` silently does nothing for
 * a label that has not been started. Measurements use `performance.now()` and
 * therefore report elapsed milliseconds rather than seconds.
 *
 * The `profiles` map stores one {@linkcode Profile} for each label, and the
 * static serialization methods preserve those entries as plain data.
 *
 * @category resource
 *
 * @example
 * ```js
 * import { Profiler } from '@wimaengine/profiler'
 *
 * const profiler = new Profiler()
 * profiler.start('load-level')
 * // loadLevel()
 * profiler.end('load-level')
 *
 * console.log(profiler.get('load-level')?.delta) // milliseconds
 * ```
 */
export class Profiler {

  /**
   * Profiles keyed by the labels passed to {@linkcode Profiler#start}.
   *
   * Calling {@linkcode Profiler#set} for an existing label replaces its
   * profile. Map iteration order is retained by serialization.
   *
   * @type {Map<string,Profile>}
   */
  profiles = new Map()

  /**
   * Creates and stores a new profile for a label.
   *
   * If the label already exists, its previous profile is replaced and the
   * returned profile starts with `lastTick` and `delta` set to `0`.
   *
   * @param {string} label - Name used to retrieve the profile.
   * @returns {Profile} The newly stored profile.
   */
  set(label) {
    const profile = new Profile()

    this.profiles.set(label, profile)

    return profile
  }

  /**
   * Gets the profile stored for a label.
   *
   * @param {string} label - Name of the profile to retrieve.
   * @returns {Profile | undefined} The profile, or `undefined` when no entry exists.
   */
  get(label) {
    return this.profiles.get(label)
  }

  /**
   * Starts measuring a labeled interval.
   *
   * An absent label is created. Existing profiles keep their previous
   * `delta`; this method only replaces `lastTick` with the current
   * `performance.now()` timestamp. Calling `start` again for the same label
   * restarts that label's interval.
   *
   * @param {string} label - Name of the interval to start.
   * @returns {void}
   */
  start(label) {
    const isthere = this.get(label)
    const profile = isthere ? isthere : this.set(label)

    profile.lastTick = performance.now()
  }

  /**
   * Ends a labeled interval and records its duration.
   *
   * For an existing profile, `delta` becomes the current
   * `performance.now()` value minus `lastTick`, in milliseconds. If the label
   * is unknown, the method does nothing and does not create a profile.
   *
   * @param {string} label - Name of the interval to end.
   * @returns {void}
   */
  end(label) {
    const profile = this.get(label)

    if (!profile) return

    profile.delta = performance.now() - profile.lastTick
  }

  /**
   * Converts a profiler to a serializable plain object.
   *
   * Profiles are emitted as `[label, profile]` pairs in map iteration order;
   * each profile value is converted with {@linkcode Profile.serialize}.
   * The returned object and entries are newly allocated.
   *
   * @param {Profiler} value - Profiler to serialize.
   * @returns {ProfilerSerial} Serialized profile entries.
   */
  static serialize(value) {
    return {
      profiles: Array.from(value.profiles.entries()).map(([label, profile]) => [
        label,
        Profile.serialize(profile)
      ])
    }
  }

  /**
   * Loads serialized profiles into a profiler.
   *
   * The optional `out` profiler is reused, but its `profiles` map is replaced
   * with a new map populated from `value`. Each entry creates a new
   * {@linkcode Profile}. Duplicate labels are accepted by the underlying map, so
   * the last value for a duplicate label is retained. The method does not
   * validate input; use {@linkcode Profiler.validateSerial} first
   * for untrusted data.
   *
   * @param {ProfilerSerial} value - Serialized profile entries.
   * @param {Profiler} [out] - Profiler to overwrite.
   * @returns {Profiler} The populated profiler.
   */
  static deserialize(value, out = new Profiler()) {
    out.profiles = new Map(
      value.profiles.map(([label, profile]) => [label, Profile.deserialize(profile)])
    )

    return out
  }

  /**
   * Checks whether a value has the shape required by
   * {@linkcode Profiler.deserialize}.
   *
   * The value must be a non-null object with a `profiles` array. Every entry
   * must be a two-item array containing a string label and a value accepted by
   * {@linkcode Profile.validateSerial}. Additional properties are
   * accepted, duplicate labels are not rejected, and numeric values are only
   * checked with `typeof` (so `NaN` and infinities are accepted).
   *
   * @param {unknown} value - Value to check.
   * @returns {value is ProfilerSerial} `true` when every serialized entry has the required shape.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('profiles' in value)) {
      return false
    }

    if (!Array.isArray(value.profiles)) {
      return false
    }

    for (let i = 0; i < value.profiles.length; i++) {
      const entry = value.profiles[i]

      if (!Array.isArray(entry) || entry.length !== 2) {
        return false
      }

      const [label, profile] = entry

      if (typeof label !== 'string' || !Profile.validateSerial(profile)) {
        return false
      }
    }

    return true
  }
}

/**
 * Serialized form of a {@linkcode Profile}.
 *
 * @typedef ProfileSerial
 * @property {number} lastTick
 * @property {number} delta
 */

/**
 * Serialized form of a {@linkcode Profiler}.
 *
 * @typedef ProfilerSerial
 * @property {[string, ProfileSerial][]} profiles
 */
/* eslint-enable jsdoc/check-tag-names */
