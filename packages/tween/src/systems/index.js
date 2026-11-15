/** @import {SystemFunc} from '@wimaengine/ecs' */
/** @import {TweenLerp} from '../typedef' */
import { Query, World } from '@wimaengine/ecs'
import { VirtualClock } from '@wimaengine/time'
import { TweenFlip, TweenRepeat } from '../components/markers'
import { Tween } from '../components/tween'

/**
 * Creates a system that restarts concrete tweens marked with {@linkcode TweenRepeat}.
 *
 * The returned system queries for the supplied concrete {@linkcode Tween}
 * constructor and the repeat marker. When a matching tween has
 * `timeTaken >= duration`, it sets `timeTaken` to `0`. It does not inspect the
 * tween's `repeat` boolean, preserve an overshoot, or advance the timer; the
 * generated timer system handles advancement separately.
 *
 * @example
 * ```js
 * const repeatSystem = generateTweenRepeatTween(Position2DTween)
 * repeatSystem(world) // resets matching tweens at their duration
 * ```
 *
 * @template T
 * @param {typeof Tween<T>} tween - Concrete tween constructor to query.
 * @returns {SystemFunc} World system that resets completed marked tweens.
 */
export function generateTweenRepeatTween(tween) {

  /**
   * @param {World} world
   */
  return function repeatTween(world) {
    const query = new Query(world, [tween, TweenRepeat])

    query.each(([tween, _]) => {
      if (tween.timeTaken >= tween.duration) {
        tween.timeTaken = 0
      }

    })
  }
}

/**
 * Creates a system that swaps the endpoints of concrete tweens marked with
 * {@linkcode TweenFlip}.
 *
 * The returned system queries for the supplied concrete {@linkcode Tween}
 * constructor and the flip marker. When a matching tween has
 * `timeTaken >= duration`, it swaps the `from` and `to` references. It leaves
 * `timeTaken` unchanged and does not inspect the tween's `flip` boolean. If
 * the value remains at or beyond the duration, the endpoints are swapped again
 * the next time the system runs; combine it with {@linkcode TweenRepeat} when
 * each new direction should start at time `0`.
 *
 * @example
 * ```js
 * const flipSystem = generateTweenFlipSystem(Position2DTween)
 * flipSystem(world) // swaps endpoints on matching completed tweens
 * ```
 *
 * @template T
 * @param {typeof Tween<T>} tween - Concrete tween constructor to query.
 * @returns {SystemFunc} World system that swaps completed marked tweens.
 */
export function generateTweenFlipSystem(tween) {

  // `flipTween<T>` where `T => Tween<T>`
  /**
   * @param {World} world
   */
  return function flipTween(world) {
    const query = new Query(world, [tween, TweenFlip])

    query.each(([tween, _]) => {
      if (tween.timeTaken >= tween.duration) {

        const temp = tween.to

        tween.to = tween.from
        tween.from = temp
      }
    })
  }
}

/**
 * Creates a system that advances the elapsed time of a concrete tween type.
 *
 * Each time the returned system runs, it reads the current delta from the
 * world's {@linkcode VirtualClock} once, then updates every entity containing the
 * supplied {@linkcode Tween} constructor with `Math.min(timeTaken + delta,
 * duration)`. It does not require repeat or flip markers, reset time, update
 * `finish`, or apply easing. The assignment is an upper cap only; negative
 * deltas are not clamped to zero.
 * The returned system requires a {@linkcode VirtualClock} resource; a missing
 * clock makes its resource lookup fail.
 *
 * @example
 * ```js
 * const timerSystem = generateTweenTimerSystem(Position2DTween)
 * app.registerSystem({ schedule: AppSchedule.Update, system: timerSystem })
 * ```
 *
 * @template T
 * @param {typeof Tween<T>} tween - Concrete tween constructor to query.
 * @returns {SystemFunc} World system that advances and caps tween time.
 */
export function generateTweenTimerSystem(tween) {

  /**
   * @param {World} world
   */
  return function updateTimerTween(world) {
    const dt = world.getResource(VirtualClock).getDelta()
    const query = new Query(world, [tween])

    query.each(([tween]) => {
      tween.timeTaken = Math.min(tween.timeTaken + dt, tween.duration)
    })
  }
}

/**
 * Creates a system that interpolates a component from a concrete tween.
 *
 * The returned system queries entities containing both `component` and the
 * supplied concrete {@linkcode Tween} constructor. For each match it computes
 * `tween.easing(tween.timeTaken / tween.duration)` and calls `interpolate`
 * with `from`, `to`, the eased progress, and the live component as its output
 * value. This helper does not advance time, clamp progress, or handle a zero
 * duration; JavaScript's division result is passed to the easing function.
 *
 * @example
 * ```js
 * const updateSystem = generateTweenUpdateSystem(
 *   Position2D,
 *   Position2DTween,
 *   (from, to, progress, out) => out.set(from, to, progress)
 * )
 * ```
 *
 * @template T
 * @param {new (...args:any[]) => T} component - Component constructor to update.
 * @param {typeof Tween<T>} tween - Concrete tween constructor to query.
 * @param {TweenLerp<T>} interpolate - Function that writes the interpolated value into the component.
 * @returns {SystemFunc} World system that updates matched component values.
 */
export function generateTweenUpdateSystem(component, tween, interpolate) {

  /**
   * @param {World} world
   */
  return function updateTween(world) {
    const query = new Query(world, [component, tween])

    query.each(([component, tween]) => {
      const t = tween.easing(
        tween.timeTaken / tween.duration
      )

      interpolate(tween.from, tween.to, t, component)
    })
  }
}

export * from './types'
