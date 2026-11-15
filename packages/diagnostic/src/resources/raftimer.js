import { Timer } from '@wimaengine/time'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Timer resource used by diagnostic tools to track completed frame-rate cycles.
 *
 * `RAFTimer` extends {@linkcode Timer} and provides the timing behavior used by
 * diagnostic consumers.
 *
 * @category resource
 *
 * @example
 * ```js
 * import { RAFTimer } from '@wimaengine/diagnostic'
 *
 * function readFpsCycle(world) {
 *   const timer = world.getResource(RAFTimer)
 *
 *   if (timer.cycleStarted()) {
 *     console.log('a diagnostic timer cycle completed')
 *   }
 * }
 * ```
 */
export class RAFTimer extends Timer {}
/* eslint-enable jsdoc/check-tag-names */
