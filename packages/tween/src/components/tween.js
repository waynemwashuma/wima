/** @import { EasingFn } from '../typedef' */
import { Easing } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the shared value and timing state used by a tween component.
 *
 * `Tween` is the reusable base for concrete tween components such as
 * {@linkcode Position2DTween}, {@linkcode Position3DTween},
 * {@linkcode Orientation2DTween}, {@linkcode Orientation3DTween},
 * {@linkcode Scale2DTween}, and {@linkcode Scale3DTween}. A matching
 * {@linkcode TweenPlugin} uses the stored value and timing state to interpolate
 * a concrete component value over time.
 *
 * Add {@linkcode TweenRepeat} or {@linkcode TweenFlip} alongside a concrete tween
 * to opt into repeated cycles or endpoint swapping.
 *
 * @property {boolean} repeat - Stored repeat option associated with
 * {@linkcode TweenRepeat}.
 * @property {boolean} flip - Stored flip option associated with
 * {@linkcode TweenFlip}.
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Position2D } from '@wimaengine/transform'
 * import { Position2DTween, TweenFlip } from '@wimaengine/tween'
 *
 * const world = new World()
 * world.spawn([
 *   new Position2D(0, 0),
 *   new Position2DTween(
 *     new Position2D(100, 50), // to
 *     new Position2D(0, 0), // from
 *     2
 *   ),
 *   new TweenFlip()
 * ])
 *
 * new Query(world, [Position2D, Position2DTween]).each(([position, tween]) => {
 *   console.log(position, tween.timeTaken)
 * })
 * // Register the tween plugin on the app that runs this world to advance
 * // and interpolate the tween.
 * ```
 *
 * @template T
 * @category component
 */
export class Tween {

  /**
   * Total duration of the tween in seconds.
   *
   * `timeTaken` represents elapsed time toward this value, and
   * `timeTaken / duration` provides the normalized progress used to
   * interpolate between the endpoints. The constructor stores the supplied
   * number directly without validation.
   *
   * @type {number}
   */
  duration = 0

  /**
   * Indicates whether the tween has completed.
   *
   * The value starts as `false` and is stored as a boolean. Application code
   * can set it when the tween reaches its desired state. {@linkcode Tween.copy}
   * copies the value directly.
   *
   * @type {boolean}
   */
  finish = false

  /**
   * Value at the end of the interpolation.
   *
   * The constructor stores the supplied value by reference. Interpolation uses
   * this value at progress `1`. {@linkcode Tween.copy} reuses primitive values
   * and calls the value type's static `copy` method for object values.
   *
   * @type {T}
   */
  to

  /**
   * Value at the start of the interpolation.
   *
   * The constructor stores the supplied value by reference. Interpolation uses
   * this value at progress `0`. {@linkcode Tween.copy} reuses primitive values
   * and calls the value type's static `copy` method for object values.
   *
   * @type {T}
   */
  from

  /**
   * Easing function applied to normalized progress before interpolation.
   *
   * The default is {@linkcode Easing.linear}. The function receives
   * `timeTaken / duration`, and its return value becomes the interpolation
   * progress without additional clamping. The function is stored and copied
   * by reference.
   *
   * @type {EasingFn}
   */
  easing

  /**
   * Elapsed tween time in seconds.
   *
   * It starts at `0`. Together with `duration`, it forms
   * `timeTaken / duration`, which is passed to `easing` before interpolation
   * between `from` and `to`. {@linkcode Tween.copy} copies the number directly.
   *
   * @type {number}
   */
  timeTaken = 0

  /**
   * Creates tween state for an ending value, starting value, and duration.
   *
   * Values are assigned directly; the constructor does not clone `to` or
   * `from`, or validate `duration`. The optional booleans are stored on the
   * instance; use {@linkcode TweenRepeat} and {@linkcode TweenFlip} to opt into
   * repeated cycles and endpoint swapping.
   *
   * @param {T} to - Value passed to interpolation at progress `1`.
   * @param {T} from - Value passed to interpolation at progress `0`.
   * @param {number} duration - Total tween duration in seconds.
   * @param {boolean} [repeat=false] - Stored repeat option.
   * @param {boolean} [flip=true] - Stored flip option.
   * @param {EasingFn} [easing=Easing.linear] - Function applied to normalized progress.
   */
  constructor(to, from, duration, repeat = false, flip = true, easing = Easing.linear) {
    this.to = to
    this.from = from
    this.repeat = repeat
    this.flip = flip
    this.duration = duration
    this.easing = easing
  }

  /**
   * Copies tween state into a target component.
   *
   * The scalar fields (`duration`, `finish`, `timeTaken`, `repeat`, and
   * `flip`) are assigned directly. `easing` is copied by reference. `to` and
   * `from` are copied independently: non-object values are reused, while each
   * object value must have a constructor with a callable static `copy` method,
   * which is called as `value.constructor.copy(value)`. That delegated method
   * determines whether nested state is copied recursively.
   *
   * If either object value cannot be copied, the method throws the string
   * `The source cannot be copied with value type \`<name>\``. When `target` is
   * omitted, the method creates a plain {@linkcode Tween} rather than preserving
   * the source's concrete subclass; passing a target lets callers choose the
   * object that is populated. The populated target is returned.
   *
   * @template U
   * @param {Tween<U>} source - Tween whose state is copied.
   * @param {Tween<U>} [target] - Target to overwrite; defaults to a new base Tween.
   * @returns {Tween<U>} The populated target.
   * @throws {string} If an object-valued endpoint has no callable static `copy` method.
   */
  static copy(source, target = new Tween(source.to, source.from, source.duration, source.repeat, source.flip, source.easing)) {
    const cloneValue = (/** @type {U} */ value) => {
      if (!value || typeof value !== 'object') {
        return value
      }

      const ctor = value.constructor

      if ('copy' in ctor && typeof ctor.copy === 'function') {

        return ctor.copy(value)
      }

      throw `The source cannot be copied with value type \`${ctor.name}\``
    }

    target.duration = source.duration
    target.finish = source.finish
    target.to = cloneValue(source.to)
    target.from = cloneValue(source.from)
    target.easing = source.easing
    target.timeTaken = source.timeTaken
    target.repeat = source.repeat
    target.flip = source.flip

    return target
  }

  /**
   * Creates a new base Tween containing copied state.
   *
   * This delegates to {@linkcode Tween.copy} without a target, so endpoint
   * objects are copied with their static `copy` methods and the result is a
   * plain `Tween` even when the source is a concrete tween subclass.
   *
   * @template U
   * @param {Tween<U>} target - Tween whose state is copied.
   * @returns {Tween<U>} A new base Tween containing copied state.
   * @throws {string} If an object-valued endpoint has no callable static `copy` method.
   */
  static clone(target) {
    return Tween.copy(target)
  }
}
/* eslint-enable jsdoc/check-tag-names */
