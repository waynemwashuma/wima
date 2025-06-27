import { ParticleEmitter, EmitterTimer } from '../components/index.js'
import { createTransform2D } from '../../transform/index.js'


export function createParticleEmitter2D(prefab, x, y, angle) {
  return [
    ...createTransform2D(x, y, angle),
    new ParticleEmitter(prefab),
    new EmitterTimer()
  ]
}