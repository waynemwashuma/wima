/* eslint-disable jsdoc/check-tag-names */
/**
 * Marks an entity's concrete tween for marker-driven repeat behavior.
 *
 * Attach this empty component alongside a concrete tween such as
 * {@linkcode Position2DTween}. When the matching {@linkcode TweenPlugin} is
 * registered, the tween starts a new cycle whenever its elapsed time reaches
 * its duration. Add this marker to opt the entity into repeated cycles.
 *
 * `TweenRepeat` has no fields or constructor options. If your app uses
 * reflection, registering tween marker metadata during startup exposes this
 * component as an empty reflected type with copy and clone support.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Position2D } from '@wimaengine/transform'
 * import { Position2DTween, TweenRepeat } from '@wimaengine/tween'
 *
 * // Register the tween plugin on the app that runs this world.
 * const world = new World()
 * world.spawn([
 *   new Position2D(0, 0),
 *   new Position2DTween(
 *     new Position2D(100, 0),
 *     new Position2D(0, 0),
 *     2
 *   ),
 *   new TweenRepeat()
 * ])
 * ```
 */
export class TweenRepeat {

  /**
   * Returns a marker target without copying any state.
   *
   * `TweenRepeat` has no fields, so `source` is not read. When `target` is
   * omitted, a new marker is returned; otherwise the exact target is returned
   * unchanged.
   *
   * @param {TweenRepeat} source - Marker source; it has no state to read.
   * @param {TweenRepeat} [target] - Marker to return unchanged.
   * @returns {TweenRepeat} The supplied target or a new empty marker.
   */
  static copy(source, target = new TweenRepeat()) {
    return target
  }

  /**
   * Creates an empty marker because there is no state to clone.
   *
   * This delegates to {@linkcode TweenRepeat.copy} without a target, so the
   * result is always a new {@linkcode TweenRepeat} instance.
   *
   * @param {TweenRepeat} target - Marker source; it is not read.
   * @returns {TweenRepeat} A new empty marker.
   */
  static clone(target) {
    return TweenRepeat.copy(target)
  }
}
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Marks an entity's concrete tween for endpoint swapping.
 *
 * Attach this empty component alongside a concrete tween such as
 * {@linkcode Position2DTween}. When the matching {@linkcode TweenPlugin} is
 * registered, the tween swaps its `from` and `to` endpoints after its elapsed
 * time reaches its duration.
 *
 * Flipping does not reset the elapsed time. Because the timer remains at the
 * duration, an entity with only this marker can swap endpoints again on each
 * later update. Add {@linkcode TweenRepeat} when each flip should start a new
 * timed cycle; the repeat marker resets the elapsed time to `0`. The marker
 * has no fields of its own, and its constructor takes no options.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Position2D } from '@wimaengine/transform'
 * import { Position2DTween, TweenFlip } from '@wimaengine/tween'
 *
 * const world = new World()
 * world.spawn([
 *   new Position2D(0, 0),
 *   new Position2DTween(
 *     new Position2D(10, 0),
 *     new Position2D(0, 0),
 *     1
 *   ),
 *   new TweenFlip()
 * ])
 * // Register the tween plugin on the app that runs this world.
 * ```
 */
export class TweenFlip {

  /**
   * Returns an empty marker target without copying state.
   *
   * `TweenFlip` has no fields, so `source` is not read. When `target` is
   * omitted, a new marker is returned; otherwise the exact target is returned
   * unchanged.
   *
   * @param {TweenFlip} source - Marker source; it has no state to read.
   * @param {TweenFlip} [target] - Marker to return unchanged.
   * @returns {TweenFlip} The supplied target or a new empty marker.
   */
  static copy(source, target = new TweenFlip()) {
    return target
  }

  /**
   * Creates an empty marker because there is no state to clone.
   *
   * This delegates to {@linkcode TweenFlip.copy} without a target, so the
   * result is always a new {@linkcode TweenFlip} instance.
   *
   * @param {TweenFlip} target - Marker source; it is not read.
   * @returns {TweenFlip} A new empty marker.
   */
  static clone(target) {
    return TweenFlip.copy(target)
  }
}
/* eslint-enable jsdoc/check-tag-names */
