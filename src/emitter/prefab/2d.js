export function createParticleEmitter2D(prefab,x,y,angle) {
  return [
    ...createTransform2D(x,y,angle),
    ParticleEmitter,
    EmitterTimer
  ]
}