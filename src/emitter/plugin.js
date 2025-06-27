import { AppSchedule } from '../app/index.js';
import { updateEmitterTimers, updateParticles, emitParticles } from './systems/index.js'
import { Particle, EmitterTimer, ParticleEmitter } from './components/index.js';

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