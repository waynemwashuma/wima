import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Acceleration2D, Acceleration3D, Rotation2D, Rotation3D, Torque2D, Torque3D, Velocity2D, Velocity3D } from '../components'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers reflection metadata for the 2D movable components.
 *
 * {@linkcode Movable2DPlugin} schedules this function as a one-shot Startup
 * system. When it runs, the function reads the world's {@linkcode TypeRegistry}
 * and registers {@linkcode Velocity2D}, {@linkcode Rotation2D},
 * {@linkcode Acceleration2D}, and {@linkcode Torque2D} as struct types.
 *
 * The registered fields are numeric `x` and `y` for {@linkcode Velocity2D} and
 * {@linkcode Acceleration2D}, and numeric `value` for {@linkcode Rotation2D} and
 * {@linkcode Torque2D}. Each entry receives its matching `copy`, `clone`,
 * `serialize`, and `deserialize` methods, including
 * {@linkcode Velocity2D.copy}, {@linkcode Velocity2D.clone},
 * {@linkcode Velocity2D.serialize}, and
 * {@linkcode Velocity2D.deserialize}.
 *
 * The function changes only {@linkcode TypeRegistry} metadata. It does not
 * create entities, add components, or update movable state.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { Movable2DPlugin } from '@wimaengine/movable'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Movable2DPlugin())
 *   .run()
 * // Startup registers the 2D movable component metadata.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry} resource.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry} resource.
 * @category system
 */
export function registerMovable2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Velocity2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(Velocity2D)?.setMethod(Velocity2D.copy)
  registry.get(Velocity2D)?.setMethod(Velocity2D.clone)
  registry.get(Velocity2D)?.setMethod(Velocity2D.serialize)
  registry.get(Velocity2D)?.setMethod(Velocity2D.deserialize)
  registry.register(Rotation2D, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Rotation2D)?.setMethod(Rotation2D.copy)
  registry.get(Rotation2D)?.setMethod(Rotation2D.clone)
  registry.get(Rotation2D)?.setMethod(Rotation2D.serialize)
  registry.get(Rotation2D)?.setMethod(Rotation2D.deserialize)
  registry.register(Acceleration2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(Acceleration2D)?.setMethod(Acceleration2D.copy)
  registry.get(Acceleration2D)?.setMethod(Acceleration2D.clone)
  registry.get(Acceleration2D)?.setMethod(Acceleration2D.serialize)
  registry.get(Acceleration2D)?.setMethod(Acceleration2D.deserialize)
  registry.register(Torque2D, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Torque2D)?.setMethod(Torque2D.copy)
  registry.get(Torque2D)?.setMethod(Torque2D.clone)
  registry.get(Torque2D)?.setMethod(Torque2D.serialize)
  registry.get(Torque2D)?.setMethod(Torque2D.deserialize)
}

/**
 * Registers reflection metadata for the 3D movable components.
 *
 * {@linkcode Movable3DPlugin} schedules this function as a one-shot Startup
 * system. When it runs, the function reads the world's {@linkcode TypeRegistry}
 * and registers {@linkcode Velocity3D}, {@linkcode Rotation3D},
 * {@linkcode Acceleration3D}, and {@linkcode Torque3D} as struct types.
 *
 * The registered fields are numeric `x`, `y`, and `z` for all four component
 * types. Each entry receives its matching `copy`, `clone`, `serialize`, and
 * `deserialize` methods, including {@linkcode Velocity3D.copy},
 * {@linkcode Velocity3D.clone}, {@linkcode Velocity3D.serialize},
 * and {@linkcode Velocity3D.deserialize}.
 *
 * The function changes only {@linkcode TypeRegistry} metadata. It does not
 * create entities, add components, or update movable state.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { Movable3DPlugin } from '@wimaengine/movable'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Movable3DPlugin())
 *   .run()
 * // Startup registers the 3D movable component metadata.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry} resource.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry} resource.
 * @category system
 */
export function registerMovable3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Velocity3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Velocity3D)?.setMethod(Velocity3D.copy)
  registry.get(Velocity3D)?.setMethod(Velocity3D.clone)
  registry.get(Velocity3D)?.setMethod(Velocity3D.serialize)
  registry.get(Velocity3D)?.setMethod(Velocity3D.deserialize)
  registry.register(Rotation3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Rotation3D)?.setMethod(Rotation3D.copy)
  registry.get(Rotation3D)?.setMethod(Rotation3D.clone)
  registry.get(Rotation3D)?.setMethod(Rotation3D.serialize)
  registry.get(Rotation3D)?.setMethod(Rotation3D.deserialize)
  registry.register(Acceleration3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Acceleration3D)?.setMethod(Acceleration3D.copy)
  registry.get(Acceleration3D)?.setMethod(Acceleration3D.clone)
  registry.get(Acceleration3D)?.setMethod(Acceleration3D.serialize)
  registry.get(Acceleration3D)?.setMethod(Acceleration3D.deserialize)
  registry.register(Torque3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Torque3D)?.setMethod(Torque3D.copy)
  registry.get(Torque3D)?.setMethod(Torque3D.clone)
  registry.get(Torque3D)?.setMethod(Torque3D.serialize)
  registry.get(Torque3D)?.setMethod(Torque3D.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
