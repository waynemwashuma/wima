import { Entity, Query } from '../../ecs/index.js';
import { VirtualClock } from '../../time/index.js';
import { EntityCommands } from '../../command/index.js';
import { createMovable2D, Velocity2D, Rotation2D } from '../../movable/index.js'
import { Position2D, Orientation2D } from '../../transform/index.js';
import { Particle, EmitterTimer, CPUEmitter } from '../components/index.js';


// TODO: Remove in favor of `Timer` updating in the time package instead.
export function updateEmitterTimers(world) {
  const timers = new Query(world, [EmitterTimer])
  const clock = world.getResource(VirtualClock)
  const delta = clock.getDelta()
  
  timers.each(([timer]) => {
    timer.update(delta)
  })
}

export function emitParticles(world) {
  const emitters = new Query(world, [Position2D, Orientation2D, CPUEmitter, EmitterTimer])
  const commands = world.getResource(EntityCommands)
  
  emitters.each(([position, orientation, emitter, timer]) => {
    if (!emitter.enabled || !timer.tick()) return
    
    const burstCount = Math.round(emitter.burstCount.lerp(Math.random()))
    for (let i = 0; i < burstCount; i++) {
      const orient = new Orientation2D()
      orient.value = orientation.value
      const lifetime = emitter.lifetime.lerp(Math.random())
      const particle = emitter.prefab ? emitter.prefab() : []
      
      commands
        .spawn()
        .insertPrefab([
          ...createMovable2D(),
          ...particle,
          new Particle(lifetime)
        ])
        .insert(new Position2D().copy(position))
        .insert(orient)
        .insert(new Velocity2D(100))
        .insert(new Rotation2D(5))
        .build()
    }
  })
}

export function updateParticles(world) {
  const particles = new Query(world, [Entity, Particle])
  const commands = world.getResource(EntityCommands)
  const clock = world.getResource(VirtualClock)
  const delta = clock.getDelta()
  
  particles.each(([entity, particle]) => {
    particle.update(delta)
    if (particle.completed()) {
      commands.despawn(entity)
    }
  })
}