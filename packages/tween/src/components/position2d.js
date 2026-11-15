import { Position2D } from '@wimaengine/transform'
import { Tween } from './tween'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Pairs with an entity's {@linkcode Position2D} component to animate its 2D
 * position over time.
 *
 * Attach `Position2DTween` to the same entity as {@linkcode Position2D} and
 * configure the app's tween support. It inherits timing, easing, repeat, and
 * flip behavior from {@linkcode Tween}, using its `from` and `to` values to move
 * the paired position between its start and end values.
 *
 * Set `duration` to control how long the transition takes. Use `repeat` to
 * replay it and `flip` to alternate the direction between cycles.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Position2D } from '@wimaengine/transform'
 * import { Position2DTween } from '@wimaengine/tween'
 *
 * // Register DefaultTweenPlugin on the app that runs this world.
 * const world = new World()
 * world.spawn([
 *   new Position2D(0, 0),
 *   new Position2DTween(
 *     new Position2D(100, 50),
 *     new Position2D(0, 0),
 *     2
 *   )
 * ])
 * ```
 *
 * @augments {Tween<Position2D>}
 * @category component
 */
export class Position2DTween extends Tween {}
/* eslint-enable jsdoc/check-tag-names */
