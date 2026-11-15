import { EntityCommands } from '@wimaengine/commands'
import { EntityHandle, has, Query, World } from '@wimaengine/ecs'
import { Timer } from '@wimaengine/time'
import { Position2D, Orientation2D, GlobalTransform2D, GlobalTransform3D, Orientation3D, Position3D, Scale3D } from '@wimaengine/transform'
import { Particle, Emitter } from '../components'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Emits world-space 2D particle entities for eligible emitters.
 *
 * The query matches entities with {@linkcode GlobalTransform2D}, {@linkcode Emitter},
 * and {@linkcode Timer}. Disabled emitters and emitters whose timer has not started
 * a cycle are skipped. For each remaining emitter, the system samples and rounds
 * the configured burst count, decomposes the current global transform, then
 * queues that many entities with copied {@linkcode Position2D} and
 * {@linkcode Orientation2D}, a {@linkcode Particle} marker, and a {@linkcode Timer}
 * whose duration is a sampled lifetime.
 *
 * When configured, {@linkcode Emitter#prefab} supplies components before the
 * particle components are inserted. After each entity is built,
 * {@linkcode Emitter#patch} receives the shared {@linkcode EntityCommands} instance
 * and the new {@linkcode EntityHandle}. Component insertion and later despawning
 * are deferred through the world's command queue.
 *
 * The emitter plugin registers this function in the repeating Update schedule.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { emitParticles2D } from '@wimaengine/emitter'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: emitParticles2D
 * })
 * ```
 *
 * @param {World} world - World containing the emitter entities and command queue.
 * @returns {void}
 * @category system
 */
export function emitParticles2D(world) {
  const emitters = new Query(world, [GlobalTransform2D, Emitter, Timer])
  const commands = new EntityCommands(world)

  emitters.each(([transform, emitter, timer]) => {
    if (!emitter.enabled || !timer.cycleStarted()) return

    const { prefab, patch } = emitter
    const [position, orientation] = transform.decompose()
    const burstCount = Math.round(emitter.burstCount.lerp(Math.random()))

    for (let i = 0; i < burstCount; i++) {
      const orient = new Orientation2D().copy(orientation)
      const lifetime = emitter.lifetime.lerp(Math.random())
      const particle = prefab ? prefab() : []

      // TODO: Sometimes one would want to just parent the entity to this emitter,
      // maybe introduce a mode for that e.g World space or local space placement
      // This places entity in world space.
      const particleEntity = commands
        .spawn()
        .insertPrefab([
          ...particle,
          new Position2D().copy(position),
          orient,

          // TODO: Sometimes you may not want to tack
          // on this marker,add an option to disable adding it
          // on an emitter.
          new Particle(),
          new Timer({ duration:lifetime })
        ])
        .build()

      if (patch) {
        patch(commands, particleEntity)
      }
    }
  })
}

/**
 * Emits world-space 3D particle entities for eligible emitters.
 *
 * The query matches entities with {@linkcode GlobalTransform3D}, {@linkcode Emitter},
 * and {@linkcode Timer}. Disabled emitters and emitters whose timer has not started
 * a cycle are skipped. For each remaining emitter, the system samples and rounds
 * the configured burst count, decomposes the current global transform, then
 * queues that many entities with copied {@linkcode Position3D},
 * {@linkcode Orientation3D}, and {@linkcode Scale3D}, a {@linkcode Particle} marker,
 * and a {@linkcode Timer} whose duration is a sampled lifetime.
 *
 * When configured, {@linkcode Emitter#prefab} supplies components before the
 * particle components are inserted. After each entity is built,
 * {@linkcode Emitter#patch} receives the shared {@linkcode EntityCommands} instance
 * and the new {@linkcode EntityHandle}. Component insertion and later despawning
 * are deferred through the world's command queue.
 *
 * The emitter plugin registers this function in the repeating Update schedule.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { emitParticles3D } from '@wimaengine/emitter'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: emitParticles3D
 * })
 * ```
 *
 * @param {World} world - World containing the emitter entities and command queue.
 * @returns {void}
 * @category system
 */
export function emitParticles3D(world) {
  const emitters = new Query(world, [GlobalTransform3D, Emitter, Timer])
  const commands = new EntityCommands(world)

  emitters.each(([transform, emitter, timer]) => {
    if (!emitter.enabled || !timer.cycleStarted()) return

    const [position, orientation, scale] = transform.decompose()
    const burstCount = Math.round(emitter.burstCount.lerp(Math.random()))

    for (let i = 0; i < burstCount; i++) {
      const { prefab, patch } = emitter
      const lifetime = emitter.lifetime.lerp(Math.random())
      const particle = prefab ? prefab() : []

      // TODO: Sometimes one would want to just parent the entity to this emitter,
      // maybe introduce a mode for that e.g World space or local space placement
      // This places entity in world space.
      const particleEntity = commands
        .spawn()
        .insertPrefab([
          ...particle,
          new Position3D().copy(position),
          new Orientation3D().copy(orientation),
          new Scale3D().copy(scale),
          new Particle(),
          new Timer({ duration: lifetime })
        ])
        .build()

      if (patch) {
        patch(commands, particleEntity)
      }
    }
  })
}

// TODO: Move to time module.It seems that this functionality can be
// tacked onto Timer using another component to mark the entity as
// despawning when timer is done
/**
 * Queues completed particle entities for despawning.
 *
 * The query matches entities with {@linkcode EntityHandle} and {@linkcode Timer} and
 * filters for {@linkcode Particle}. For each match where {@linkcode Timer#completed}
 * is true, the system queues {@linkcode EntityCommands#despawn} for that entity;
 * the world removes it when the command queue is applied.
 * The emitter plugin registers this cleanup function in the repeating Update
 * schedule.
 *
 * @param {World} world - World containing particle entities and command queue.
 * @returns {void}
 * @category system
 */
export function despawnParticles(world) {
  const particles = new Query(world, [EntityHandle, Timer], [has(Particle)])
  const commands = new EntityCommands(world)

  particles.each(([entity, timer]) => {
    if (timer.completed()) {
      commands.despawn(entity)
    }
  })
}
/* eslint-enable jsdoc/check-tag-names */
