import { Timer } from '@wimaengine/time'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the repeating timer resource used to refresh profiler output.
 *
 * Register {@linkcode ProfilerPlugin} to add a {@linkcode ProfilerTimer} configured
 * with a one-second duration and {@linkcode TimerMode.Repeat}. The plugin
 * advances it from {@linkcode VirtualClock}; application code can also retrieve
 * the resource and use the inherited timer API directly.
 *
 * @inheritdoc
 * @augments {Timer}
 * @category resource
 *
 * @example
 * ```js
 * import { ProfilerTimer } from '@wimaengine/profiler'
 * import { TimerMode } from '@wimaengine/time'
 *
 * const timer = new ProfilerTimer({ duration: 1, mode: TimerMode.Repeat })
 * timer.update(1)
 * console.log(timer.cycleEnded()) // true
 * ```
 */
export class ProfilerTimer extends Timer { }
/* eslint-enable jsdoc/check-tag-names */
