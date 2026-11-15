/** @import { EntityCommands } from '@wimaengine/commands' */
import { Range } from '@wimaengine/datastructures'
import { EntityHandle } from '@wimaengine/ecs'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the configuration used to emit timed particle entities.
 *
 * Pair this component with a matching {@linkcode GlobalTransform2D} or
 * {@linkcode GlobalTransform3D} and a {@linkcode Timer}. When it is enabled and
 * the timer starts a cycle, emission samples its configured ranges and creates
 * the resulting particles. Each particle receives a sampled lifetime, a
 * {@linkcode Particle} marker, a {@linkcode Timer}, and the emitter's current world
 * transform. Optional `prefab` and `patch` callbacks customize the particle's
 * components before and after it is built.
 *
 * Use this component on the entity that represents the emitter; the matching
 * transform determines particle placement and the timer determines emission
 * cycles. The member documentation describes the available configuration and
 * its defaults.
 *
 * @category component
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Range } from '@wimaengine/datastructures'
 * import { Emitter } from '@wimaengine/emitter'
 * import { GlobalTransform2D } from '@wimaengine/transform'
 * import { Timer, TimerMode } from '@wimaengine/time'
 *
 * // These represent application-defined particle components.
 * class SparkVisual {}
 * class SpawnedByEmitter {}
 *
 * const world = new World()
 * world.spawn([
 *   new GlobalTransform2D(),
 *   new Timer({ duration: 0.1, mode: TimerMode.Repeat }),
 *   new Emitter({
 *     prefab: () => [new SparkVisual()],
 *     patch: (commands, entity) => {
 *       commands.entity(entity).insert(new SpawnedByEmitter()).build()
 *     },
 *     burstCount: new Range(2, 4),
 *     lifetime: new Range(0.5, 1.5)
 *   })
 * ])
 * ```
 */
export class Emitter {

  // TODO: replace with handle to a scene
  /**
   * Factory that returns extra components for each emitted particle.
   *
   * The emitter calls this once for every particle in a burst. The returned
   * array is passed to {@linkcode EntityCommands#insertPrefab} before the
   * particle's built-in components are added. Return an empty array or leave
   * the field undefined when no extra components are needed.
   *
   * @type {(() => unknown[]) | undefined}
   */
  prefab

  /**
   * Runs after an emitted particle has been built.
   *
   * The first argument is an {@linkcode EntityCommands} instance and the second
   * is the new particle's {@linkcode EntityHandle}. Select the entity with
   * `commands.entity(entity)` before queuing inserts or other entity commands,
   * then call {@linkcode EntityCommands#build}.
   *
   * @type {((commands:EntityCommands,entity:EntityHandle)=>void) | undefined}
   */
  patch

  /**
   * Number of particles to create at the next timer cycle.
   *
   * The emitter samples this range with a random value and rounds the result
   * for the next burst. Its default is `new Range(1, 1)`.
   *
   * @type {Range}
   */
  burstCount

  /**
   * Whether the emitter is allowed to create new particles.
   *
   * Disabling an emitter does not affect its timer or particles that were
   * emitted earlier.
   *
   * @type {boolean}
   */
  enabled

  /**
   * Lifetime range, in seconds, for each emitted particle.
   *
   * The emitter samples this range independently for every particle. Its
   * default is `new Range()`, whose bounds are `0` and `1`.
   *
   * @type {Range}
   */
  lifetime

  /**
   * Creates an emitter configuration.
   *
   * Supplied `burstCount` and `lifetime` objects are stored as-is rather than
   * copied. The default ranges are created for this emitter when those options
   * are omitted.
   *
   * @param {EmitterOptions} [options]
   */
  constructor({
    prefab,
    patch,
    lifetime = new Range(),
    burstCount = new Range(1, 1),
    enabled = true
  } = {}) {
    this.prefab = prefab
    this.patch = patch
    this.lifetime = lifetime
    this.burstCount = burstCount
    this.enabled = enabled
  }

  /**
   * Copies an emitter configuration.
   *
   * Function fields are copied by reference. `burstCount` and `lifetime` are
   * replaced with new `Range` objects containing the same bounds, so changing
   * either range on the target does not change the source. When `target` is
   * supplied, its existing range objects are replaced.
   *
   * @param {Emitter} source - Emitter whose settings to copy.
   * @param {Emitter} [target] - Emitter to populate.
   * @returns {Emitter} The populated target emitter.
   */
  static copy(source, target = new Emitter()) {
    target.prefab = source.prefab
    target.patch = source.patch
    target.lifetime = new Range(source.lifetime.start, source.lifetime.end)
    target.burstCount = new Range(source.burstCount.start, source.burstCount.end)
    target.enabled = source.enabled

    return target
  }

  /**
   * Creates an independent emitter copy.
   *
   * The callback references are shared, while the two `Range` instances are
   * newly allocated by {@linkcode Emitter.copy}.
   *
   * @param {Emitter} target - Emitter to copy.
   * @returns {Emitter} A new emitter with copied settings.
   */
  static clone(target) {
    return Emitter.copy(target)
  }

  /**
   * Converts an emitter to its plain serialized field object.
   *
   * The range fields become `{ start, end }` objects. `prefab` and `patch` are
   * kept as function values rather than converted to names or source text; a
   * JSON serializer will omit those fields. The returned object still includes
   * the fields with their `undefined` values when callbacks are not configured.
   *
   * @param {Emitter} value - Emitter to serialize.
   * @returns {EmitterSerial} Serialized emitter fields.
   */
  static serialize(value) {
    return {
      prefab: value.prefab,
      patch: value.patch,
      burstCount: Range.serialize(value.burstCount),
      enabled: value.enabled,
      lifetime: Range.serialize(value.lifetime)
    }
  }

  /**
   * Restores serialized fields into an emitter.
   *
   * When `out` is supplied, its existing `Range` instances are updated through
   * `Range.deserialize` and the same emitter is returned. Callback values are
   * assigned as-is. This method does not validate its input; call
   * {@linkcode Emitter.validateSerial} for untrusted data first.
   *
   * @param {EmitterSerial} value - Serialized emitter fields.
   * @param {Emitter} [out] - Emitter to populate.
   * @returns {Emitter} The populated emitter.
   */
  static deserialize(value, out = new Emitter()) {
    out.prefab = value.prefab
    out.patch = value.patch
    out.lifetime = Range.deserialize(value.lifetime, out.lifetime)
    out.burstCount = Range.deserialize(value.burstCount, out.burstCount)
    out.enabled = value.enabled

    return out
  }

  /**
   * Checks the shape accepted by {@linkcode Emitter.deserialize}.
   *
   * The candidate must contain all five serialized fields. `prefab` and
   * `patch` may be `undefined` or functions; they are not invoked or checked
   * for a particular return value. Both range values must contain numeric
   * `start` and `end` fields, while `enabled` must be boolean. Range ordering
   * is not checked, and this method does not make the value JSON-safe.
   *
   * @param {unknown} value - Candidate serialized value.
   * @returns {value is EmitterSerial} Whether the value has valid serialized fields.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('prefab' in value) || !('patch' in value) || !('burstCount' in value) || !('enabled' in value) || !('lifetime' in value)) {
      return false
    }

    return (value.prefab === undefined || typeof value.prefab === 'function') &&
      (value.patch === undefined || typeof value.patch === 'function') &&
      typeof value.burstCount === 'object' &&
      Range.validSerial(value.burstCount) &&
      typeof value.enabled === 'boolean' &&
      typeof value.lifetime === 'object' &&
      Range.validSerial(value.lifetime)
  }
}

/**
 * @typedef EmitterSerial
 * @property {(() => unknown[]) | undefined} prefab
 * @property {((commands:EntityCommands,entity:EntityHandle)=>void) | undefined} patch
 * @property {{ start: number, end: number }} burstCount
 * @property {boolean} enabled
 * @property {{ start: number, end: number }} lifetime
 */

/**
 * @typedef EmitterOptions
 * @property {()=>unknown[]} [prefab]
 * @property {(commands:EntityCommands,entity:EntityHandle)=>void} [patch]
 * @property {Range} [burstCount]
 * @property {Range} [lifetime]
 * @property {boolean} [enabled]
 */
/* eslint-enable jsdoc/check-tag-names */
