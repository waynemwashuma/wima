/** @import { EntityHandle } from '@wimaengine/ecs' */
import { World } from '@wimaengine/ecs'
import { Rotary } from '@wimaengine/math'
import { Position2D, Orientation2D, Scale2D, Position3D, Orientation3D, Scale3D } from '@wimaengine/transform'

/**
 * Defines the base contract for effectors that apply interpolated animation
 * values to entity components.
 *
 * Concrete effectors specify the number of values in each keyframe and how
 * those values are applied to their target component. Use a concrete effector
 * with an {@linkcode AnimationTrack}.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AnimationEffector, AnimationTrack } from '@wimaengine/animation'
 *
 * class Opacity {
 *   value = 1
 * }
 *
 * class OpacityAnimationEffector extends AnimationEffector {
 *   static apply(world, entity, results) {
 *     world.get(entity, Opacity).value = results[0]
 *   }
 *
 *   static elementSize() {
 *     return 1
 *   }
 * }
 *
 * const track = new AnimationTrack(OpacityAnimationEffector)
 * track.times = [0, 1]
 * track.keyframes = [0, 1]
 *
 * const world = new World()
 * const entity = world.spawn([new Opacity()])
 * OpacityAnimationEffector.apply(world, entity, track.getCurrent(0.5))
 * ```
 *
 * @abstract
 */
export class AnimationEffector {

  /**
   * Applies interpolated values to an animation target.
   *
   * The base implementation intentionally ignores every argument. A concrete
   * effector should use `world` and `entity` to find the target component and
   * write the values in `results` to it.
   *
   * @param {World} _world - World containing the target entity.
   * @param {EntityHandle} _entity - Handle of the entity to update.
   * @param {number[]} _results - Interpolated values for the current keyframe.
   * @returns {void}
   */
  static apply(_world, _entity, _results) {}

  /**
   * Returns the number of numeric values in each keyframe.
   *
   * The base implementation returns `0`. Concrete effectors must override it
   * with the width expected by {@linkcode AnimationEffector.apply} so that
   * {@linkcode AnimationTrack} can validate and interpolate flattened keyframes.
   *
   * @returns {number} Always `0` for the base implementation.
   */
  static elementSize() {
    return 0
  }
}

/**
 * Applies interpolated 2D position values to an entity's
 * {@linkcode Position2D} component.
 *
 * This class implements the {@linkcode AnimationEffector} contract for 2D
 * position animation. Pass it to an {@linkcode AnimationTrack}; each keyframe
 * contains an `x` value followed by a `y` value.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AnimationTrack, Position2DAnimationEffector } from '@wimaengine/animation'
 * import { Position2D } from '@wimaengine/transform'
 *
 * const world = new World()
 * const entity = world.spawn([new Position2D()])
 * const track = new AnimationTrack(Position2DAnimationEffector)
 * track.times = [0, 1]
 * track.keyframes = [0, 0, 10, 20]
 *
 * Position2DAnimationEffector.apply(world, entity, track.getCurrent(0.5))
 * // The entity's position is now (5, 10).
 * ```
 */
export class Position2DAnimationEffector extends AnimationEffector {

  /**
   * Component constructor read by
   * {@linkcode Position2DAnimationEffector.apply}. The method accesses this
   * through `this.componentType`, so a compatible subclass can replace the
   * constructor it looks up.
   *
   * @type {typeof Position2D}
   */
  static componentType = Position2D

  /**
   * Writes the current `x` and `y` values to the target position component.
   *
   * {@linkcode Position2DAnimationEffector.apply} reads `this.componentType` from
   * `world` for `entity`, then
   * calls `set(results[0], results[1])` on the returned component. It does not
   * add a missing component or check the lookup result; a stale handle, an
   * unknown entity, or an entity without the component therefore causes the
   * subsequent `set()` call to fail.
   *
   * @param {World} world - World containing the target entity.
   * @param {EntityHandle} entity - Handle of the entity to update.
   * @param {number[]} results - Interpolated values; indexes `0` and `1` are `x` and `y`.
   * @returns {void}
   */
  static apply(world, entity, results) {
    const component = world.get(entity, this.componentType)

    component.set(results[0], results[1])
  }

  /**
   * Returns the number of values consumed from each keyframe.
   *
   * {@linkcode AnimationTrack} therefore stores and interpolates two consecutive
   * values per timestamp for this effector.
   *
   * @returns {number} Always `2`.
   */
  static elementSize() {
    return 2
  }
}

/**
 * Applies interpolated 3D position values to an entity's
 * {@linkcode Position3D} component.
 *
 * This class implements the {@linkcode AnimationEffector} contract for 3D
 * position animation. Pass it to an {@linkcode AnimationTrack}; each keyframe
 * contains `x`, `y`, and `z` values in that order.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AnimationTrack, Position3DAnimationEffector } from '@wimaengine/animation'
 * import { Position3D } from '@wimaengine/transform'
 *
 * const world = new World()
 * const entity = world.spawn([new Position3D()])
 * const track = new AnimationTrack(Position3DAnimationEffector)
 * track.times = [0, 1]
 * track.keyframes = [0, 0, 0, 10, 20, 30]
 *
 * Position3DAnimationEffector.apply(world, entity, track.getCurrent(0.5))
 * // The entity's position is now (5, 10, 15).
 * ```
 */
export class Position3DAnimationEffector extends AnimationEffector {

  /**
   * Component constructor read by
   * {@linkcode Position3DAnimationEffector.apply}. The method accesses this
   * through `this.componentType`, so a compatible subclass can replace the
   * constructor it looks up.
   *
   * @type {typeof Position3D}
   */
  static componentType = Position3D

  /**
   * Writes the current `x`, `y`, and `z` values to the target position
   * component.
   *
   * {@linkcode Position3DAnimationEffector.apply} reads `this.componentType` from
   * `world` for `entity`, then
   * calls `set(results[0], results[1], results[2])` on the returned component.
   * It does not add a missing component or check the lookup result; a stale
   * handle, an unknown entity, or an entity without the component therefore
   * causes the subsequent `set()` call to fail.
   *
   * @param {World} world - World containing the target entity.
   * @param {EntityHandle} entity - Handle of the entity to update.
   * @param {number[]} results - Interpolated values; indexes `0`, `1`, and `2` are `x`, `y`, and `z`.
   * @returns {void}
   */
  static apply(world, entity, results) {
    const component = world.get(entity, this.componentType)

    component.set(results[0], results[1], results[2])
  }

  /**
   * Returns the number of values consumed from each keyframe.
   *
   * {@linkcode AnimationTrack} therefore stores and interpolates three consecutive
   * values per timestamp for this effector.
   *
   * @returns {number} Always `3`.
   */
  static elementSize() {
    return 3
  }
}

/**
 * Converts one interpolated angle into an entity's
 * {@linkcode Orientation2D} component value.
 *
 * Pass this class itself to {@linkcode AnimationTrack}. Each keyframe contains a
 * single angle in radians. {@linkcode Orientation2DAnimationEffector.apply} looks
 * up the component in the target {@linkcode World} using its {@linkcode EntityHandle},
 * converts the angle with {@linkcode Rotary.fromAngle}, and copies the resulting
 * cosine/sine pair into the component. The entity must already have the
 * component when the animation runs.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AnimationTrack, Orientation2DAnimationEffector } from '@wimaengine/animation'
 * import { Orientation2D } from '@wimaengine/transform'
 *
 * const world = new World()
 * const entity = world.spawn([new Orientation2D()])
 * const track = new AnimationTrack(Orientation2DAnimationEffector)
 * track.times = [0, 1]
 * track.keyframes = [0, Math.PI]
 *
 * Orientation2DAnimationEffector.apply(world, entity, track.getCurrent(0.5))
 * // The entity is now rotated by a quarter turn (PI / 2 radians).
 * ```
 */
export class Orientation2DAnimationEffector extends AnimationEffector {

  /**
   * Component constructor read by
   * {@linkcode Orientation2DAnimationEffector.apply}. The method accesses this
   * through `this.componentType`, so a compatible subclass can replace the
   * constructor it looks up.
   *
   * @type {typeof Orientation2D}
   */
  static componentType = Orientation2D

  /**
   * Converts the current angle and writes it to the target orientation.
   *
   * The method reads `this.componentType` from `world` for `entity`, creates a
   * {@linkcode Rotary} with {@linkcode Rotary.fromAngle}(results[0]), and copies
   * that value into the returned component. The angle is interpreted in
   * radians. It does not add a missing component or check the lookup result; a
   * stale handle, an unknown entity, or an entity without the component
   * therefore causes the subsequent `copy()` call to fail.
   *
   * @param {World} world - World containing the target entity.
   * @param {EntityHandle} entity - Handle of the entity to update.
   * @param {number[]} results - Interpolated values; index `0` is the angle in radians.
   * @returns {void}
   */
  static apply(world, entity, results) {
    const component = world.get(entity, this.componentType)

    component.copy(Rotary.fromAngle(results[0]))
  }

  /**
   * Returns the number of values consumed from each keyframe.
   *
   * `AnimationTrack` therefore stores and interpolates one angle per
   * timestamp for this effector.
   *
   * @returns {number} Always `1`.
   */
  static elementSize() {
    return 1
  }
}

/**
 * Writes four interpolated quaternion values from an {@linkcode AnimationTrack}
 * to an entity's {@linkcode Orientation3D} component.
 *
 * Use the class itself as the track effector. Each keyframe contains four
 * values in `x`, `y`, `z`, `w` order. `apply()` receives the interpolated
 * values, target {@linkcode World}, and {@linkcode EntityHandle}. The target entity
 * must already have an {@linkcode Orientation3D} component.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AnimationTrack, Orientation3DAnimationEffector } from '@wimaengine/animation'
 * import { Orientation3D } from '@wimaengine/transform'
 *
 * const world = new World()
 * const entity = world.spawn([new Orientation3D()])
 * const track = new AnimationTrack(Orientation3DAnimationEffector)
 * track.times = [0, 1]
 * track.keyframes = [0, 0, 0, 1, 0, 0, 1, 0]
 *
 * Orientation3DAnimationEffector.apply(world, entity, track.getCurrent(0.5))
 * // The component now contains the interpolated quaternion [0, 0, 0.5, 0.5].
 * ```
 */
export class Orientation3DAnimationEffector extends AnimationEffector {

  /**
   * Component constructor used by
   * {@linkcode Orientation3DAnimationEffector.apply} when it reads the target from
   * the world. A compatible subclass can replace this value and the inherited
   * `apply` method will use that constructor through `this.componentType`.
   *
   * @type {typeof Orientation3D}
   */
  static componentType = Orientation3D

  /**
   * Writes four interpolated quaternion values to the target orientation.
   *
   * The method calls `world.get(entity, this.componentType)`, then passes
   * `results[0]`, `results[1]`, `results[2]`, and `results[3]` to the returned
   * component's `set()` method. It does not normalize the quaternion, add a
   * missing component, or check the lookup result. A stale handle, an unknown
   * entity, or an entity without the component therefore causes the subsequent
   * `set()` call to fail.
   *
   * @param {World} world - World containing the target entity.
   * @param {EntityHandle} entity - Handle of the entity to update.
   * @param {number[]} results - Interpolated quaternion values in `x`, `y`, `z`, `w` order.
   * @returns {void}
   */
  static apply(world, entity, results) {
    const component = world.get(entity, this.componentType)

    component.set(results[0], results[1], results[2], results[3])
  }

  /**
   * Returns the number of values consumed from each keyframe.
   *
   * `AnimationTrack` uses this width when validating and interpolating the
   * flattened keyframe array for this effector.
   *
   * @returns {number} Always `4`.
   */
  static elementSize() {
    return 4
  }
}

/**
 * Writes two interpolated scale values from an {@linkcode AnimationTrack} to an
 * entity's {@linkcode Scale2D} component.
 *
 * Use the class itself as the track effector. Each keyframe contains the local
 * scale's `x` and `y` values. `apply()` receives the interpolated values,
 * target {@linkcode World}, and {@linkcode EntityHandle}. The target entity must
 * already have an {@linkcode Scale2D} component.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AnimationTrack, Scale2DAnimationEffector } from '@wimaengine/animation'
 * import { Scale2D } from '@wimaengine/transform'
 *
 * const world = new World()
 * const entity = world.spawn([new Scale2D()])
 * const track = new AnimationTrack(Scale2DAnimationEffector)
 * track.times = [0, 1]
 * track.keyframes = [1, 1, 2, 0.5]
 *
 * Scale2DAnimationEffector.apply(world, entity, track.getCurrent(0.5))
 * // The component now contains the scale (1.5, 0.75).
 * ```
 */
export class Scale2DAnimationEffector extends AnimationEffector {

  /**
   * Component constructor used by {@linkcode Scale2DAnimationEffector.apply} when
   * it reads the target from the world. A compatible subclass can replace this
   * value and the inherited `apply` method will use that constructor through
   * `this.componentType`.
   *
   * @type {typeof Scale2D}
   */
  static componentType = Scale2D

  /**
   * Writes the interpolated `x` and `y` values to the target scale.
   *
   * The method calls `world.get(entity, this.componentType)`, then passes
   * `results[0]` and `results[1]` to the returned component's `set()` method.
   * It does not add a missing component or check the lookup result. A stale
   * handle, an unknown entity, or an entity without the component therefore
   * causes the subsequent `set()` call to fail.
   *
   * @param {World} world - World containing the target entity.
   * @param {EntityHandle} entity - Handle of the entity to update.
   * @param {number[]} results - Interpolated scale values; indexes `0` and `1` are `x` and `y`.
   * @returns {void}
   */
  static apply(world, entity, results) {
    const component = world.get(entity, this.componentType)

    component.set(results[0], results[1])
  }

  /**
   * Returns the number of values consumed from each keyframe.
   *
   * `AnimationTrack` uses this width when validating and interpolating the
   * flattened keyframe array for this effector.
   *
   * @returns {number} Always `2`.
   */
  static elementSize() {
    return 2
  }
}

/**
 * Writes three interpolated scale values from an {@linkcode AnimationTrack} to
 * an entity's {@linkcode Scale3D} component.
 *
 * Use the class itself as the track effector. Each keyframe contains the local
 * scale's `x`, `y`, and `z` values. `apply()` receives the interpolated values,
 * target {@linkcode World}, and {@linkcode EntityHandle}. The target entity must
 * already have an {@linkcode Scale3D} component.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AnimationTrack, Scale3DAnimationEffector } from '@wimaengine/animation'
 * import { Scale3D } from '@wimaengine/transform'
 *
 * const world = new World()
 * const entity = world.spawn([new Scale3D()])
 * const track = new AnimationTrack(Scale3DAnimationEffector)
 * track.times = [0, 1]
 * track.keyframes = [1, 1, 1, 2, 0.5, 3]
 *
 * Scale3DAnimationEffector.apply(world, entity, track.getCurrent(0.5))
 * // The component now contains the scale (1.5, 0.75, 2).
 * ```
 */
export class Scale3DAnimationEffector extends AnimationEffector {

  /**
   * Component constructor used by {@linkcode Scale3DAnimationEffector.apply} when
   * it reads the target from the world. A compatible subclass can replace this
   * value and the inherited `apply` method will use that constructor through
   * `this.componentType`.
   *
   * @type {typeof Scale3D}
   */
  static componentType = Scale3D

  /**
   * Writes the interpolated `x`, `y`, and `z` values to the target scale.
   *
   * The method calls `world.get(entity, this.componentType)`, then passes
   * `results[0]`, `results[1]`, and `results[2]` to the returned component's
   * `set()` method. It does not add a missing component or check the lookup
   * result. A stale handle, an unknown entity, or an entity without the
   * component therefore causes the subsequent `set()` call to fail.
   *
   * @param {World} world - World containing the target entity.
   * @param {EntityHandle} entity - Handle of the entity to update.
   * @param {number[]} results - Interpolated scale values; indexes `0`, `1`, and `2` are `x`, `y`, and `z`.
   * @returns {void}
   */
  static apply(world, entity, results) {
    const component = world.get(entity, this.componentType)

    component.set(results[0], results[1], results[2])
  }

  /**
   * Returns the number of values consumed from each keyframe.
   *
   * `AnimationTrack` uses this width when validating and interpolating the
   * flattened keyframe array for this effector.
   *
   * @returns {number} Always `3`.
   */
  static elementSize() {
    return 3
  }
}

/**
 * @typedef AnimationEffectorEnforcer
 * @property {(world:World,entity:EntityHandle,results:number[])=>void} apply
 * @property {()=>number} elementSize
 */
