export function createParticleEmitter3D(prefab, x, y, angle) {
  return [
    ...createTransform3D(x, y, angle),
    ParticleEmitter,
    EmitterTimer
  ]
}