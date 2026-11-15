/** @import {World} from '@wimaengine/ecs' */
/** @import {ClockSerial} from '../clock' */
/** @import {TimePlugin} from '../plugin' */

import { Clock } from '../clock'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the app-wide mutable virtual time resource.
 *
 * {@linkcode VirtualClock} extends {@linkcode Clock} and is the clock resource
 * exposed by {@linkcode TimePlugin}. Access it from a {@linkcode World} when
 * application code needs shared virtual time.
 *
 * The resource preserves the serialized state defined by {@linkcode Clock}, so
 * the same virtual-time state can be restored later.
 *
 * @category resource
 *
 * @example
 * ```js
 * import { VirtualClock } from '@wimaengine/time'
 *
 * function readFrameTime(world) {
 *   const clock = world.getResource(VirtualClock)
 *   console.log(clock.getDelta(), clock.getElapsed())
 * }
 * ```
 */
export class VirtualClock extends Clock {

  /**
   * @inheritdoc
   * @param {Clock} value - {@linkcode Clock} to serialize.
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {ClockSerial} value - {@linkcode ClockSerial} state.
   * @param {VirtualClock} [out] - {@linkcode VirtualClock} to populate.
   */
  static deserialize(value, out = new VirtualClock()) {
    return super.deserialize(value, out)
  }
}
