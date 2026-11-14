import { Orientation2D } from '@wimaengine/transform'
import { Tween } from './tween'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Tweens an entity's {@linkcode Orientation2D} component in 2D space.
 *
 * `Orientation2DTween` is the concrete ECS component for interpolating
 * {@linkcode Orientation2D} values between a starting orientation and an ending
 * orientation. Attach it to the same entity as the target component and
 * register a matching {@linkcode TweenPlugin}, or use {@linkcode DefaultTweenPlugin}
 * for the standard transform integrations. The paired orientation follows
 * the tween's eased progress between its `from` and `to` values.
 *
 * It inherits timing, easing, repeat, flip, and endpoint state from
 * {@linkcode Tween}. Set `duration` to control how long the transition takes,
 * use `easing` to shape its progress, and use `repeat` or `flip` to control
 * how it behaves across repeated cycles.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Orientation2D } from '@wimaengine/transform'
 * import { Orientation2DTween } from '@wimaengine/tween'
 *
 * // Register DefaultTweenPlugin on the app that runs this world.
 * const world = new World()
 * world.spawn([
 *   new Orientation2D(1, 0),
 *   new Orientation2DTween(
 *     new Orientation2D(0, 1), // 90 degrees counter-clockwise
 *     new Orientation2D(1, 0),
 *     1
 *   )
 * ])
 * ```
 *
 * @augments {Tween<Orientation2D>}
 * @category component
 */
export class Orientation2DTween extends Tween {}
/* eslint-enable jsdoc/check-tag-names */
