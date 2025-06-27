import { CPUEmitter, EmitterTimer } from '../components/index.js'
import { createTransform2D } from '../../transform/index.js'


export function createCPUEmitter2D(prefab, x, y, angle) {
  return [
    ...createTransform2D(x, y, angle),
    new CPUEmitter(prefab),
    new EmitterTimer()
  ]
}