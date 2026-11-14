/** @import {AppSchedule} from '@wimaengine/core' */
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { TweenFlip, TweenRepeat, Tween } from '../components'

/**
 * Creates a Startup-compatible system that registers one concrete tween type.
 *
 * The returned system obtains {@linkcode TypeRegistry} from the world and
 * registers `tween` with {@linkcode StructInfo} metadata for the fields
 * `duration` and `timeTaken` as numbers, `finish`, `repeat`, and `flip` as
 * booleans, `easing` as a function, and `to` and `from` using `valueType`.
 * It then attaches the concrete tween constructor's `copy` and `clone` methods
 * to the registered entry. Registering the same constructor again replaces
 * its existing metadata entry.
 *
 * This factory does not register the returned system or create a
 * {@linkcode TypeRegistry}. Schedule the returned system in
 * {@linkcode AppSchedule.Startup}
 * before code that needs the tween's reflection metadata.
 * The returned system requires that registry resource to already exist.
 *
 * @example
 * ```js
 * const registerTypes = registerTweenTypes(Position2DTween, Position2D)
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Startup,
 *   system: registerTypes
 * })
 * ```
 *
 * @template T
 * @param {typeof Tween<T>} tween - Concrete tween constructor to reflect.
 * @param {import('@wimaengine/type').Constructor<T>} valueType - Constructor used for the tween's `to` and `from` values.
 * @returns {import('@wimaengine/ecs').SystemFunc} System that registers the tween metadata.
 */
export function registerTweenTypes(tween, valueType) {
  return function registerTweenTypes(world) {
    const registry = world.getResource(TypeRegistry)

    registry.register(tween, new StructInfo({
      duration: new Field(typeid(Number)),
      finish: new Field(typeid(Boolean)),
      to: new Field(typeid(valueType)),
      from: new Field(typeid(valueType)),
      easing: new Field(typeid(Function)),
      timeTaken: new Field(typeid(Number)),
      repeat: new Field(typeid(Boolean)),
      flip: new Field(typeid(Boolean))
    }))
    registry.get(tween)?.setMethod(tween.copy)
    registry.get(tween)?.setMethod(tween.clone)
  }
}

/**
 * Creates a Startup-compatible system that registers tween marker metadata.
 *
 * The returned system obtains {@linkcode TypeRegistry} from the world, registers
 * {@linkcode TweenFlip} and {@linkcode TweenRepeat} as empty {@linkcode StructInfo}
 * entries, and attaches each marker's static `copy` and `clone` methods. It
 * does not register the system or create the registry. Re-running it replaces
 * the existing entries for these marker constructors.
 *
 * Schedule the returned system in
 * {@linkcode AppSchedule.Startup}
 * when reflection metadata for the markers is needed. The returned system
 * requires the {@linkcode TypeRegistry} resource to already exist.
 *
 * @example
 * ```js
 * app.registerSystem({
 *   schedule: AppSchedule.Startup,
 *   system: registerTweenMarkerTypes()
 * })
 * ```
 *
 * @returns {import('@wimaengine/ecs').SystemFunc} System that registers both marker types.
 */
export function registerTweenMarkerTypes() {
  return function registerTweenMarkerTypes(world) {
    const registry = world.getResource(TypeRegistry)

    registry.register(TweenFlip, new StructInfo({}))
    registry.register(TweenRepeat, new StructInfo({}))
    registry.get(TweenFlip)?.setMethod(TweenFlip.copy)
    registry.get(TweenFlip)?.setMethod(TweenFlip.clone)
    registry.get(TweenRepeat)?.setMethod(TweenRepeat.copy)
    registry.get(TweenRepeat)?.setMethod(TweenRepeat.clone)
  }
}
