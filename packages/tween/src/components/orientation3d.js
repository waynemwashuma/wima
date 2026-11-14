import { Orientation3D } from '@wimaengine/transform'
import { Tween } from './tween'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Associates an entity's {@linkcode Orientation3D} component with 3D orientation
 * tweening.
 *
 * Attach {@linkcode Orientation3DTween} alongside {@linkcode Orientation3D}.
 * Register {@linkcode DefaultTweenPlugin} for the built-in transform pairing, or
 * a {@linkcode TweenPlugin} configured for this pair, so the orientation is
 * interpolated over time using the inherited {@linkcode Tween} behavior. Without
 * a matching plugin, this component only stores tween data and does not update
 * the orientation.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Orientation3D } from '@wimaengine/transform'
 * import { Orientation3DTween } from '@wimaengine/tween'
 *
 * // Register DefaultTweenPlugin on the app that runs this world.
 * const world = new World()
 * world.spawn([
 *   new Orientation3D(),
 *   new Orientation3DTween(
 *     new Orientation3D(0, Math.SQRT1_2, 0, Math.SQRT1_2),
 *     new Orientation3D(),
 *     1
 *   )
 * ])
 * ```
 *
 * @augments {Tween<Orientation3D>}
 * @category component
 */
export class Orientation3DTween extends Tween {}
/* eslint-enable jsdoc/check-tag-names */
