import { Scale3D } from '@wimaengine/transform'
import { Tween } from './tween'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Associates an entity's {@linkcode Scale3D} component with 3D scale tweening.
 *
 * Attach {@linkcode Scale3DTween} alongside {@linkcode Scale3D}. Register
 * {@linkcode DefaultTweenPlugin} for the built-in transform pairing, or a
 * {@linkcode TweenPlugin} configured for this pair, so the scale is interpolated
 * over time using the inherited {@linkcode Tween} behavior. Without a matching
 * plugin, this component only stores tween data and does not update the scale.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Scale3D } from '@wimaengine/transform'
 * import { Scale3DTween } from '@wimaengine/tween'
 *
 * // Register DefaultTweenPlugin on the app that runs this world.
 * const world = new World()
 * world.spawn([
 *   new Scale3D(1, 1, 1),
 *   new Scale3DTween(
 *     new Scale3D(2, 2, 2),
 *     new Scale3D(1, 1, 1),
 *     0.5
 *   )
 * ])
 * ```
 *
 * @augments {Tween<Scale3D>}
 * @category component
 */
export class Scale3DTween extends Tween {}
/* eslint-enable jsdoc/check-tag-names */
