import { clamp } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores mutable time and cycle state for an application timer.
 *
 * Each update advances the timer while it is active, and its cycle behavior
 * determines whether time stops at the end of the first cycle or wraps into
 * subsequent cycles. Pausing preserves the current position; restarting
 * begins again from zero.
 *
 * @category component
 *
 * @example
 * ```js
 * import { Timer, TimerMode } from '@wimaengine/time'
 *
 * const timer = new Timer({ duration: 2, mode: TimerMode.Once })
 *
 * timer.update(0.5)
 * timer.pause()
 * timer.play()
 * timer.update(1.5)
 *
 * if (timer.completed()) {
 *   console.log('timer finished')
 * }
 * ```
 */
export class Timer {

  /**
   * Timer behavior for a single cycle.
   * @type {TimerMode}
   */
  mode

  /**
   * Length of one timer cycle in seconds.
   * @type {number}
   */
  duration

  /**
   * Multiplier applied to each delta passed to {@linkcode Timer#update}.
   * @type {number}
   */
  speed

  /**
   * Whether updates currently leave the timer's elapsed time unchanged.
   * @type {boolean}
   */
  paused

  /**
   * @private
   * @type {number}
   */
  elapsedCount = 0

  /**
   * @private
   * @type {number}
   */
  elapsedTime = 0

  /**
   * @private
   * @type {boolean}
   */
  finished = false

  /**
   * @private
   * @type {number}
   */
  startTicks = 0

  /**
   * @private
   * @type {number}
   */
  endTicks = 0

  /**
   * Part of change detection for when playback is changed.
   * @private
   * @type {boolean}
   */
  playbackRequested = false

  /**
   * Part of change detection for when playback is changed.
   * @private
   * @type {boolean}
   */
  playbackResolved = false

  /**
   * Creates a timer with an optional duration, mode, speed, and paused state.
   *
   * @param {TimerOptions} [options]
   */
  constructor({
    duration = 1,
    mode = TimerMode.Once,
    speed = 1,
    paused = false
  } = {}) {
    this.duration = duration
    this.mode = mode
    this.speed = speed
    this.paused = paused
  }

  /**
   * @param {Timer} source
   * @param {Timer} target
   */
  static copy(source, target = new Timer()) {
    target.mode = source.mode
    target.duration = source.duration
    target.speed = source.speed
    target.paused = source.paused
    target.elapsedCount = source.elapsedCount
    target.elapsedTime = source.elapsedTime
    target.finished = source.finished
    target.startTicks = source.startTicks
    target.endTicks = source.endTicks
    target.playbackRequested = source.playbackRequested
    target.playbackResolved = source.playbackResolved

    return target
  }

  /**
   * @param {Timer} target
   */
  static clone(target) {
    return Timer.copy(target)
  }

  /**
   * @param {Timer} value
   */
  static serialize(value) {
    return {
      mode: value.mode,
      duration: value.duration,
      speed: value.speed,
      paused: value.paused,
      elapsedCount: value.elapsedCount,
      elapsedTime: value.elapsedTime,
      finished: value.finished,
      startTicks: value.startTicks,
      endTicks: value.endTicks,
      playbackRequested: value.playbackRequested,
      playbackResolved: value.playbackResolved
    }
  }

  /**
   * @param {TimerSerial} value
   * @param {Timer} [out]
   */
  static deserialize(value, out = new Timer()) {
    out.mode = value.mode
    out.duration = value.duration
    out.speed = value.speed
    out.paused = value.paused
    out.elapsedCount = value.elapsedCount
    out.elapsedTime = value.elapsedTime
    out.finished = value.finished
    out.startTicks = value.startTicks
    out.endTicks = value.endTicks
    out.playbackRequested = value.playbackRequested
    out.playbackResolved = value.playbackResolved

    return out
  }

  /**
   * @param {TimerSerial} value
   * @returns {value is TimerSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('mode' in value) ||
      !('duration' in value) ||
      !('speed' in value) ||
      !('paused' in value) ||
      !('elapsedCount' in value) ||
      !('elapsedTime' in value) ||
      !('finished' in value) ||
      !('startTicks' in value) ||
      !('endTicks' in value) ||
      !('playbackRequested' in value) ||
      !('playbackResolved' in value)
    ) {
      return false
    }

    return typeof value.mode === 'number' &&
      typeof value.duration === 'number' &&
      typeof value.speed === 'number' &&
      typeof value.paused === 'boolean' &&
      typeof value.elapsedCount === 'number' &&
      typeof value.elapsedTime === 'number' &&
      typeof value.finished === 'boolean' &&
      typeof value.startTicks === 'number' &&
      typeof value.endTicks === 'number' &&
      typeof value.playbackRequested === 'boolean' &&
      typeof value.playbackResolved === 'boolean'
  }

  /**
   * Returns the elapsed time in the current cycle, in seconds.
   *
   * This reads the current value without changing the timer. In
   * {@linkcode TimerMode.Once} mode it reaches `duration` when the timer
   * finishes; in {@linkcode TimerMode.Repeat} mode it wraps when a cycle
   * ends.
   *
   * @returns {number} Elapsed seconds in the current cycle.
   *
   * @example
   * ```js
   * timer.update(0.25)
   * console.log(timer.elapsed()) // 0.25
   * ```
   */
  elapsed() {
    return this.elapsedTime
  }

  /**
   * Returns elapsed time as a ratio of the configured cycle duration.
   *
   * This is the raw division of {@linkcode Timer#elapsed} by
   * {@linkcode Timer#duration}; it does not mutate the timer or clamp the
   * result. A zero duration therefore produces `NaN` for zero elapsed time or
   * an infinite result for non-zero elapsed time.
   *
   * @returns {number} Elapsed-to-duration ratio, where `1` represents one full cycle.
   */
  progress() {
    return this.elapsedTime / this.duration
  }

  /**
   * Resumes progression without resetting the current elapsed time.
   */
  play() {
    this.paused = false
    this.requestPlayback()
  }

  /**
   * Pauses progression without resetting the current elapsed time.
   */
  pause() {
    this.paused = true
    this.requestPlayback()
  }

  /**
   * Restarts the timer from the beginning and resumes progression.
   *
   * This clears the completed-cycle count and elapsed seconds, then delegates
   * to {@linkcode Timer#play}; the playback-change request is therefore
   * resolved by the next {@linkcode Timer#update}.
   *
   * @returns {void}
   */
  start() {
    this.elapsedCount = 0
    this.elapsedTime = 0
    this.play()
  }

  /**
   * Stops the timer and resets its cycle state.
   *
   * This clears the completed-cycle count and elapsed seconds, then delegates
   * to {@linkcode Timer#pause}; the timer is paused and its finished state is
   * cleared through the resulting playback request.
   *
   * @returns {void}
   */
  stop() {
    this.elapsedCount = 0
    this.elapsedTime = 0
    this.pause()
  }

  /**
   * Resets the timer by delegating to {@linkcode Timer#start}.
   *
   * The timer therefore resumes from zero, clears its completed-cycle count,
   * and requests a playback change.
   *
   * @returns {void}
   */
  reset() {
    this.start()
  }

  /**
   * @param {number} timestamp
   */
  seek(timestamp) {
    this.elapsedTime = clamp(timestamp, 0, this.duration)
    this.requestPlayback()
  }

  /**
   * Requests playback state resolution on the next timer update.
   *
   * The request flag is set and the finished state is cleared. This method
   * does not change {@linkcode Timer#paused} or elapsed time; callers such
   * as {@linkcode Timer#play}, {@linkcode Timer#pause}, and
   * {@linkcode Timer#seek} control those values separately.
   *
   * @returns {void}
   */
  requestPlayback() {
    this.playbackRequested = true
    this.finished = false
  }

  /**
   * Reports whether the most recent timer update resolved a playback request.
   *
   * The result is `true` only during the update in which a pending request was
   * consumed; the next {@linkcode Timer#update} clears the resolved flag.
   * Calling this method does not mutate the timer.
   *
   * @returns {boolean} Whether the latest update resolved a playback request.
   */
  playbackChanged() {
    return this.playbackResolved
  }

  /**
   * Advances the timer by a frame delta in seconds.
   *
   * The delta is multiplied by {@linkcode Timer#speed}. Paused or finished
   * timers do not advance. A repeating timer can complete multiple cycles in
   * one update; use {@linkcode Timer#cyclesCompletedThisFrame} or
   * {@linkcode Timer#cycleEnded} to inspect that update.
   *
   * @param {number} dt - Frame delta in seconds.
   * @returns {void}
   */
  update(dt) {
    const previousElapsedTime = this.elapsedTime

    this.startTicks = 0
    this.endTicks = 0
    this.playbackResolved = false

    if (this.playbackRequested) {
      this.playbackResolved = true
      this.playbackRequested = false
    }
    if (this.paused || this.finished) {
      return
    }

    this.elapsedTime += dt * this.speed
    this.endTicks = Math.floor(this.elapsedTime / this.duration)

    if (this.endTicks) {
      if (this.mode === TimerMode.Once) {
        this.elapsedTime = this.duration
        this.finished = true
        this.elapsedCount = 1
      } else if (this.mode === TimerMode.Repeat) {
        this.elapsedCount += this.endTicks
        this.elapsedTime = this.elapsedTime % this.duration
      }
    }

    if (
      (!previousElapsedTime && this.elapsedTime) ||
      previousElapsedTime > this.elapsedTime) {
      this.startTicks = 1
    }
  }

  /**
   * @returns {boolean}
   */
  cycleStarted() {
    return this.startTicks > 0
  }

  /**
   * @returns {boolean}
   */
  cycleEnded() {
    return this.endTicks > 0
  }

  /**
   * @returns {number}
   */
  cyclesCompleted() {
    return this.elapsedCount
  }

  /**
   * @returns {number}
   */
  cyclesCompletedThisFrame() {
    return this.endTicks
  }

  /**
   * Reports whether a one-shot timer has reached its duration.
   *
   * Repeating timers continue cycling and therefore do not report completion.
   *
   * @returns {boolean} `true` after a `Once` timer finishes; otherwise `false`.
   */
  completed() {
    return this.finished
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @typedef TimerSerial
 * @property {TimerMode} mode
 * @property {number} duration
 * @property {number} speed
 * @property {boolean} paused
 * @property {number} elapsedCount
 * @property {number} elapsedTime
 * @property {boolean} finished
 * @property {number} startTicks
 * @property {number} endTicks
 * @property {boolean} playbackRequested
 * @property {boolean} playbackResolved
 */

/**
 * Defines how {@linkcode Timer} behaves when a cycle reaches its duration.
 *
 * One-shot behavior stops at the duration and reports completion. Repeating
 * behavior wraps to the next cycle and continues counting completed cycles.
 *
 * @example
 * ```js
 * import { Timer, TimerMode } from '@wimaengine/time'
 *
 * const once = new Timer({ duration: 1, mode: TimerMode.Once })
 * once.update(1.25)
 * console.log(once.elapsed(), once.completed()) // 1, true
 *
 * const repeat = new Timer({ duration: 1, mode: TimerMode.Repeat })
 * repeat.update(1.25)
 * console.log(repeat.elapsed(), repeat.cyclesCompleted()) // 0.25, 1
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const TimerMode = {

  /**
   * Complete after the first duration and remain at the duration.
   * @readonly
   */
  Once: 0,

  /**
   * Wrap at each duration and continue counting completed cycles.
   * @readonly
   */
  Repeat: 1
}

/**
 * @typedef TimerOptions
 * @property {number} [duration]
 * @property {TimerMode} [mode]
 * @property {number} [speed]
 * @property {boolean} [paused]
 */
