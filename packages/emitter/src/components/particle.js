/* eslint-disable jsdoc/check-tag-names */
/**
 * Marks an entity as a particle.
 *
 * `Particle` is an empty marker component with no fields or constructor
 * options. Pair it with a {@linkcode Timer} when representing a particle with a
 * lifetime; the emitter integration uses the marker and timer to identify
 * particles whose lifetime has completed.
 *
 * There is no state to copy: `copy(source, target)` returns the supplied
 * target unchanged, while `clone(source)` creates another empty marker.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Particle } from '@wimaengine/emitter'
 *
 * const world = new World()
 * const particle = world.spawn([new Particle()])
 * ```
 */
export class Particle {

  /**
   * Returns a marker target without copying any state.
   *
   * @param {Particle} source - Marker source; it has no state to read.
   * @param {Particle} [target] - Marker to return unchanged.
   * @returns {Particle} The supplied target, or a new empty marker.
   */
  static copy(source, target = new Particle()) {
    return target
  }

  /**
   * Creates an empty marker because there is no state to clone.
   *
   * @param {Particle} target - Marker source; it is not read.
   * @returns {Particle} A new empty marker.
   */
  static clone(target) {
    return Particle.copy(target)
  }
}
