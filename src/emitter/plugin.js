export class ParticleEmitter2DPlugin {
  register(app) {
    app
      .registerType(Particle)
      .registerType(EmitterTimer)
      .registerType(ParticleEmitter)
      .registerSystem(AppSchedule.Update, updateEmitterTimers)
      .registerSystem(AppSchedule.Update, updateParticles)
      .registerSystem(AppSchedule.Update, emitParticles)
    
  }
}

function updateEmitterTimers(world) {
  const timers = new World(world, [EmitterTimer])
  const clock = world.getResource(VirtualClock)
  const delta = clock.getDelta()
  
  timers.each(([timer]) => {
    timer.update(delta)
  })
}

function emitParticles(world) {
  const emitters = new World(world, [Position2D, Orientation2D, ParticleEmitter, EmitterTimer])
  const commands = world.getResource(EntityCommands)
  
  emitters.each(([position, orientation, emitter, timer]) => {
    if (!emitter.enabled || !timer.finished) return
    
    for (let i = 0; i < emitter.burstCount; i++) {
      commands
        .spawn()
        .insertPrefab(emitter.prefab())
        .insert(new Position2D().copy(position))
        .insert(new Orientation2D().copy(orientation))
        .insert(new Velocity2D())
        .insert(new Rotation2D())
        .insert(new Acceleration2D())
        .insert(new Torque2D())
        .insert(new Particle())
        .build()
    }
  })
}

function updateParticles(world) {
  const particles = new World(world, [Entity, Particle])
  const commands = world.getResource(EntityCommands)
  const clock = world.getResource(VirtualClock)
  const delta = clock.getDelta()
  
  particles.each(([entity, particle]) => {
    particle.timer.update(delta)
    if (particle.timer.finished) {
      commands.despawn(entity)
    }
  })
}