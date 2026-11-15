import { Scale2D } from '@wimaengine/transform'
import { Tween } from './tween'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Tweens an entity's {@linkcode Scale2D} component in 2D space.
 *
 * `Scale2DTween` is the concrete ECS component for tweening {@linkcode Scale2D}
 * values. Attach it to the same entity as the target component and register a
 * matching {@linkcode TweenPlugin}, or use {@linkcode DefaultTweenPlugin} for the
 * standard transform integrations. The inherited tween contract is documented
 * by {@linkcode Tween}.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Scale2D } from '@wimaengine/transform'
 * import { Scale2DTween } from '@wimaengine/tween'
 *
 * // Register DefaultTweenPlugin on the app that runs this world.
 * const world = new World()
 * world.spawn([
 *   new Scale2D(1, 1),
 *   new Scale2DTween(
 *     new Scale2D(2, 2),
 *     new Scale2D(1, 1),
 *     0.5
 *   )
 * ])
 * ```
 *
 * @augments {Tween<Scale2D>}
 * @category component
 */
export class Scale2DTween extends Tween {}
/* eslint-enable jsdoc/check-tag-names */
