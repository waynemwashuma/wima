import { World, EntityHandle } from '@wimaengine/ecs'
import { Affine2, Affine3 } from '@wimaengine/math'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import {
  GlobalTransform2D,
  GlobalTransform3D,
  Orientation2D,
  Orientation3D,
  Position2D,
  Position3D,
  RemoteTransform2D,
  RemoteTransform3D,
  Scale2D,
  Scale3D
} from '../components'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the 2D transform metadata used by reflection and persistence.
 *
 * {@linkcode Transform2DPlugin} registers this function directly in the one-shot
 * {@linkcode AppSchedule.Startup} schedule. It registers {@linkcode Position2D}
 * with numeric `x` and `y` fields, {@linkcode Orientation2D} with numeric `cos`
 * and `sin` fields, {@linkcode Scale2D} with numeric `x` and `y` fields, and
 * {@linkcode GlobalTransform2D} with numeric `a`, `b`, `c`, `d`, `x`, and `y`
 * fields. Each entry receives its `copy`, `clone`, `serialize`, and
 * `deserialize` methods.
 *
 * The function updates the world's {@linkcode TypeRegistry} only; it does not
 * create transform components or entities.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AppSchedule, CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { registerTransform2DTypes } from '@wimaengine/transform'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerSystem({ schedule: AppSchedule.Startup, system: registerTransform2DTypes })
 *   .run()
 * ```
 *
 * @param {World} world - Startup world containing {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerTransform2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Position2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(Position2D)?.setMethod(Position2D.copy)
  registry.get(Position2D)?.setMethod(Position2D.clone)
  registry.get(Position2D)?.setMethod(Position2D.default)
  registry.get(Position2D)?.setMethod(Position2D.serialize)
  registry.get(Position2D)?.setMethod(Position2D.deserialize)
  registry.register(Orientation2D, new StructInfo({
    cos: new Field(typeid(Number)),
    sin: new Field(typeid(Number))
  }))
  registry.get(Orientation2D)?.setMethod(Orientation2D.copy)
  registry.get(Orientation2D)?.setMethod(Orientation2D.clone)
  registry.get(Orientation2D)?.setMethod(Orientation2D.default)
  registry.get(Orientation2D)?.setMethod(Orientation2D.serialize)
  registry.get(Orientation2D)?.setMethod(Orientation2D.deserialize)
  registry.register(Scale2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(Scale2D)?.setMethod(Scale2D.copy)
  registry.get(Scale2D)?.setMethod(Scale2D.clone)
  registry.get(Scale2D)?.setMethod(Scale2D.default)
  registry.get(Scale2D)?.setMethod(Scale2D.serialize)
  registry.get(Scale2D)?.setMethod(Scale2D.deserialize)
  registry.register(GlobalTransform2D, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(GlobalTransform2D)?.setMethod(GlobalTransform2D.copy)
  registry.get(GlobalTransform2D)?.setMethod(GlobalTransform2D.clone)
  registry.get(GlobalTransform2D)?.setMethod(GlobalTransform2D.default)
  registry.get(GlobalTransform2D)?.setMethod(GlobalTransform2D.serialize)
  registry.get(GlobalTransform2D)?.setMethod(GlobalTransform2D.deserialize)
}

/**
 * Registers the 3D transform metadata used by reflection and persistence.
 *
 * {@linkcode Transform3DPlugin} registers this function directly in the one-shot
 * {@linkcode AppSchedule.Startup} schedule. It registers {@linkcode Position3D}
 * with numeric `x`, `y`, and `z` fields, {@linkcode Orientation3D} with numeric
 * `x`, `y`, `z`, and `w` fields, {@linkcode Scale3D} with numeric `x`, `y`, and
 * `z` fields, and {@linkcode GlobalTransform3D} with numeric `a`, `b`, `c`, `d`,
 * `e`, `f`, `g`, `h`, `i`, `x`, `y`, and `z` fields. Each entry receives its
 * `copy`, `clone`, `serialize`, and `deserialize` methods.
 *
 * The function updates the world's {@linkcode TypeRegistry} only; it does not
 * create transform components or entities.
 *
 * @param {World} world - Startup world containing {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerTransform3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Position3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Position3D)?.setMethod(Position3D.copy)
  registry.get(Position3D)?.setMethod(Position3D.clone)
  registry.get(Position3D)?.setMethod(Position3D.default)
  registry.get(Position3D)?.setMethod(Position3D.serialize)
  registry.get(Position3D)?.setMethod(Position3D.deserialize)
  registry.register(Orientation3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number)),
    w: new Field(typeid(Number))
  }))
  registry.get(Orientation3D)?.setMethod(Orientation3D.copy)
  registry.get(Orientation3D)?.setMethod(Orientation3D.clone)
  registry.get(Orientation3D)?.setMethod(Orientation3D.default)
  registry.get(Orientation3D)?.setMethod(Orientation3D.serialize)
  registry.get(Orientation3D)?.setMethod(Orientation3D.deserialize)
  registry.register(Scale3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Scale3D)?.setMethod(Scale3D.copy)
  registry.get(Scale3D)?.setMethod(Scale3D.clone)
  registry.get(Scale3D)?.setMethod(Scale3D.default)
  registry.get(Scale3D)?.setMethod(Scale3D.serialize)
  registry.get(Scale3D)?.setMethod(Scale3D.deserialize)
  registry.register(GlobalTransform3D, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    e: new Field(typeid(Number)),
    f: new Field(typeid(Number)),
    g: new Field(typeid(Number)),
    h: new Field(typeid(Number)),
    i: new Field(typeid(Number)),
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(GlobalTransform3D)?.setMethod(GlobalTransform3D.copy)
  registry.get(GlobalTransform3D)?.setMethod(GlobalTransform3D.clone)
  registry.get(GlobalTransform3D)?.setMethod(GlobalTransform3D.default)
  registry.get(GlobalTransform3D)?.setMethod(GlobalTransform3D.serialize)
  registry.get(GlobalTransform3D)?.setMethod(GlobalTransform3D.deserialize)
}

/**
 * Registers the 2D remote-transform metadata used by reflection and
 * persistence.
 *
 * {@linkcode RemoteTransform2DPlugin} registers this function directly in the
 * one-shot {@linkcode AppSchedule.Startup} schedule. It registers
 * {@linkcode RemoteTransform2D} with boolean `copyTranslation`,
 * `copyOrientation`, and `copyScale` fields, an {@linkcode EntityHandle}
 * `entity` field, and an {@linkcode Affine2} `offsetTransform` field. The entry
 * receives its `copy`, `clone`, `serialize`, and `deserialize` methods.
 *
 * The function updates the world's {@linkcode TypeRegistry} only; it does not
 * create remote-transform components or entities.
 *
 * @param {World} world - Startup world containing {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerRemoteTransform2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(RemoteTransform2D, new StructInfo({
    copyTranslation: new Field(typeid(Boolean)),
    copyOrientation: new Field(typeid(Boolean)),
    copyScale: new Field(typeid(Boolean)),
    entity: new Field(typeid(EntityHandle)),
    offsetTransform: new Field(typeid(Affine2))
  }))
  registry.get(RemoteTransform2D)?.setMethod(RemoteTransform2D.copy)
  registry.get(RemoteTransform2D)?.setMethod(RemoteTransform2D.clone)
  registry.get(RemoteTransform2D)?.setMethod(RemoteTransform2D.default)
  registry.get(RemoteTransform2D)?.setMethod(RemoteTransform2D.serialize)
  registry.get(RemoteTransform2D)?.setMethod(RemoteTransform2D.deserialize)
}

/**
 * Registers the 3D remote-transform metadata used by reflection and
 * persistence.
 *
 * {@linkcode RemoteTransform3DPlugin} registers this function directly in the
 * one-shot {@linkcode AppSchedule.Startup} schedule. It registers
 * {@linkcode RemoteTransform3D} with boolean `copyTranslation`,
 * `copyOrientation`, and `copyScale` fields, an {@linkcode EntityHandle}
 * `entity` field, and an {@linkcode Affine3} `offsetTransform` field. The entry
 * receives its `copy`, `clone`, `serialize`, and `deserialize` methods.
 *
 * The function updates the world's {@linkcode TypeRegistry} only; it does not
 * create remote-transform components or entities.
 *
 * @param {World} world - Startup world containing {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerRemoteTransform3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(RemoteTransform3D, new StructInfo({
    copyTranslation: new Field(typeid(Boolean)),
    copyOrientation: new Field(typeid(Boolean)),
    copyScale: new Field(typeid(Boolean)),
    entity: new Field(typeid(EntityHandle)),
    offsetTransform: new Field(typeid(Affine3))
  }))
  registry.get(RemoteTransform3D)?.setMethod(RemoteTransform3D.copy)
  registry.get(RemoteTransform3D)?.setMethod(RemoteTransform3D.clone)
  registry.get(RemoteTransform3D)?.setMethod(RemoteTransform3D.default)
  registry.get(RemoteTransform3D)?.setMethod(RemoteTransform3D.serialize)
  registry.get(RemoteTransform3D)?.setMethod(RemoteTransform3D.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */
