import { ParticleEmitter, EmitterTimer } from '../components/index.js'
import { createTransform3D } from '../../transform/index.js'

export function createParticleEmitter3D(prefab, x, y, angle) {
  return [
    ...createTransform3D(x, y, angle),
    new ParticleEmitter(prefab),
    new EmitterTimer()
  ]
}