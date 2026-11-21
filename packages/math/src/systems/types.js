/** @import {AppSchedule} from '@wimaengine/core' */
/** @import {MathPlugin} from '../plugin' */
import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import {
  Affine2,
  Affine3,
  Angle,
  Basis2,
  Basis3,
  BVector2,
  BVector3,
  BVector4,
  Matrix2,
  Matrix3,
  Matrix4,
  Quaternion,
  Rotary,
  Vector2,
  Vector3,
  Vector4
} from 'hisabati'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers Hisabati reflection metadata in the world's
 * {@linkcode TypeRegistry}.
 *
 * {@linkcode MathPlugin} registers this exact
 * function directly in the one-shot
 * {@linkcode AppSchedule.Startup} schedule. The system only reads
 * {@linkcode TypeRegistry} from `world` and adds
 * metadata to it; it does not create math values, add resources, or register
 * systems. A world without {@linkcode TypeRegistry} fails when the resource is
 * requested.
 *
 * The registered Hisabati types are {@linkcode Angle}, {@linkcode Rotary},
 * {@linkcode Quaternion}, {@linkcode Affine2}, {@linkcode Affine3}, {@linkcode Basis2},
 * {@linkcode Basis3}, {@linkcode Vector2}, {@linkcode Vector3}, {@linkcode Vector4},
 * {@linkcode BVector2}, {@linkcode BVector3}, {@linkcode BVector4}, {@linkcode Matrix2},
 * {@linkcode Matrix3}, and {@linkcode Matrix4}. Their scalar, boolean, vector, and
 * matrix fields are described with {@linkcode Field} entries in the
 * {@linkcode StructInfo} metadata stored in the registry. Each registered type
 * also receives a direct `default` method that returns a new value from its
 * constructor defaults.
 *
 * @example
 * ```js
 * import { MathPlugin } from '@wimaengine/math'
 *
 * app.registerPlugin(new MathPlugin())
 * // MathPlugin registers the Hisabati types during AppSchedule.Startup.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @throws {Error} If the world does not contain {@linkcode TypeRegistry}.
 * @category system
 */
export function registerMathTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Angle, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.register(Rotary, new StructInfo({
    cos: new Field(typeid(Number)),
    sin: new Field(typeid(Number))
  }))
  registry.register(Quaternion, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number)),
    w: new Field(typeid(Number))
  }))
  registry.register(Affine2, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.register(Affine3, new StructInfo({
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
  registry.register(Basis2, new StructInfo({
    x: new Field(typeid(Vector2)),
    y: new Field(typeid(Vector2))
  }))
  registry.register(Basis3, new StructInfo({
    x: new Field(typeid(Vector3)),
    y: new Field(typeid(Vector3)),
    z: new Field(typeid(Vector3))
  }))
  registry.register(Vector2, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.register(Vector3, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.register(Vector4, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number)),
    w: new Field(typeid(Number))
  }))
  registry.register(BVector2, new StructInfo({
    x: new Field(typeid(Boolean)),
    y: new Field(typeid(Boolean))
  }))
  registry.register(BVector3, new StructInfo({
    x: new Field(typeid(Boolean)),
    y: new Field(typeid(Boolean)),
    z: new Field(typeid(Boolean))
  }))
  registry.register(BVector4, new StructInfo({
    x: new Field(typeid(Boolean)),
    y: new Field(typeid(Boolean)),
    z: new Field(typeid(Boolean)),
    w: new Field(typeid(Boolean))
  }))
  registry.register(Matrix2, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number))
  }))
  registry.register(Matrix3, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    e: new Field(typeid(Number)),
    f: new Field(typeid(Number)),
    g: new Field(typeid(Number)),
    h: new Field(typeid(Number)),
    i: new Field(typeid(Number))
  }))
  registry.register(Matrix4, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    e: new Field(typeid(Number)),
    f: new Field(typeid(Number)),
    g: new Field(typeid(Number)),
    h: new Field(typeid(Number)),
    i: new Field(typeid(Number)),
    j: new Field(typeid(Number)),
    k: new Field(typeid(Number)),
    l: new Field(typeid(Number)),
    m: new Field(typeid(Number)),
    n: new Field(typeid(Number)),
    o: new Field(typeid(Number)),
    p: new Field(typeid(Number))
  }))

  registry.get(Angle)?.setMethod(({ default() { return new Angle() } }).default)
  registry.get(Rotary)?.setMethod(({ default() { return new Rotary() } }).default)
  registry.get(Quaternion)?.setMethod(({ default() { return new Quaternion() } }).default)
  registry.get(Affine2)?.setMethod(({ default() { return new Affine2() } }).default)
  registry.get(Affine3)?.setMethod(({ default() { return new Affine3() } }).default)
  registry.get(Basis2)?.setMethod(({ default() { return new Basis2() } }).default)
  registry.get(Basis3)?.setMethod(({ default() { return new Basis3() } }).default)
  registry.get(Vector2)?.setMethod(({ default() { return new Vector2() } }).default)
  registry.get(Vector3)?.setMethod(({ default() { return new Vector3() } }).default)
  registry.get(Vector4)?.setMethod(({ default() { return new Vector4() } }).default)
  registry.get(BVector2)?.setMethod(({ default() { return new BVector2() } }).default)
  registry.get(BVector3)?.setMethod(({ default() { return new BVector3() } }).default)
  registry.get(BVector4)?.setMethod(({ default() { return new BVector4() } }).default)
  registry.get(Matrix2)?.setMethod(({ default() { return new Matrix2() } }).default)
  registry.get(Matrix3)?.setMethod(({ default() { return new Matrix3() } }).default)
  registry.get(Matrix4)?.setMethod(({ default() { return new Matrix4() } }).default)
}
/* eslint-enable jsdoc/check-tag-names */
