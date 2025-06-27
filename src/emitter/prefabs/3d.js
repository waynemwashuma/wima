import { CPUEmitter, EmitterTimer } from '../components/index.js'
import { createTransform3D } from '../../transform/index.js'

export function createCPUEmitter3D(prefab, x, y, angle) {
  return [
    ...createTransform3D(x, y, angle),
    new CPUEmitter(prefab),
    new EmitterTimer()
  ]
}