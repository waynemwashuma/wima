/** @import { AppSchedule, CoreSystems } from '@wimaengine/core' */
/** @import { ReflectPlugin } from '@wimaengine/reflect' */
/** @import { Broadphase2DPlugin } from '../plugin' */
import { EntityHandle, World } from '@wimaengine/ecs'
import { Vector2 } from '@wimaengine/math'
import { ArrayInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { PhysicsHitbox } from '../components'
import { CollisionPair } from '../core'
import { Broadphase2D, CollisionPairs } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers broadphase reflection metadata in the world's
 * {@linkcode TypeRegistry}.
 *
 * {@linkcode Broadphase2DPlugin} registers this exact function directly in the
 * one-shot {@linkcode AppSchedule.Startup} schedule. The plugin leaves
 * `systemGroup` unspecified, so {@linkcode CoreSystems.Main} is used as Startup's
 * default; {@linkcode CoreSystems.Start} runs earlier in the same startup pass.
 *
 * When it runs, the system retrieves the world's {@linkcode TypeRegistry}, then
 * registers {@linkcode CollisionPair} with `a` and `b` entity-handle fields,
 * {@linkcode PhysicsHitbox} with `type`, `max`, and `min` fields, an empty
 * {@linkcode Broadphase2D} struct, and an array type for {@linkcode CollisionPairs}.
 * The `PhysicsHitbox` entry also receives its `copy`, `clone`, `serialize`,
 * and `deserialize` methods. The function changes reflection metadata only;
 * it does not create resources, query entities, or calculate collision pairs.
 *
 * Install {@linkcode ReflectPlugin} before {@linkcode Broadphase2DPlugin} so the
 * world has a {@linkcode TypeRegistry} when Startup runs.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { Broadphase2DPlugin, NaiveBroadphase2D } from '@wimaengine/broadphase'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new Broadphase2DPlugin({ broadphase: new NaiveBroadphase2D() }))
 *   .run()
 * // Broadphase2DPlugin runs registerBroadphaseTypes2D during Startup.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry}.
 * @category system
 */
export function registerBroadphaseTypes2D(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(CollisionPair, new StructInfo({
    a: new Field(typeid(EntityHandle)),
    b: new Field(typeid(EntityHandle))
  }))
  registry.register(PhysicsHitbox, new StructInfo({
    type: new Field(typeid(Number)),
    max: new Field(typeid(Vector2)),
    min: new Field(typeid(Vector2))
  }))
  registry.get(PhysicsHitbox)?.setMethod(PhysicsHitbox.copy)
  registry.get(PhysicsHitbox)?.setMethod(PhysicsHitbox.clone)
  registry.get(PhysicsHitbox)?.setMethod(PhysicsHitbox.serialize)
  registry.get(PhysicsHitbox)?.setMethod(PhysicsHitbox.deserialize)
  registry.register(Broadphase2D, new StructInfo({}))
  registry.register(CollisionPairs, new ArrayInfo(typeid(CollisionPair)))
}
/* eslint-enable jsdoc/check-tag-names */
