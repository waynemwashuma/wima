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
    
    for (let i = 0; i < emitter.burstCount; i++) {
      const orient = new Orientation2D()
      orient.value = orientation.value
      
      commands
        .spawn()
        .insertPrefab([
          ...createMovable2D(),
          ...emitter.prefab(),
          new Particle()
        ])
        .insert(new Position2D().copy(position))
        .insert(orient)
        .insert(new Velocity2D(100))
        .insert(new Rotation2D())
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
    particle.timer.update(delta)
    if (particle.timer.completed()) {
      commands.despawn(entity)
    }
  })
}