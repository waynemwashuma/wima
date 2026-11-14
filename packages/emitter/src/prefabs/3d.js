/** @import {EmitterOptions} from "../components" */
import { Children } from '@wimaengine/hierarchy'
import { Vector3 } from '@wimaengine/math'
import { Timer } from '@wimaengine/time'
import { createTransform3D, GlobalTransform3D, Orientation3D, Position3D, Scale3D } from '@wimaengine/transform'
import { Emitter } from '../components'

/**
 * Creates the component bundle for a 3D particle emitter entity.
 *
 * The returned tuple contains {@linkcode Position3D}, {@linkcode Orientation3D},
 * {@linkcode Scale3D}, {@linkcode GlobalTransform3D}, {@linkcode Emitter},
 * {@linkcode Timer}, and {@linkcode Children} in insertion order. Optional
 * `position` and `angle` vectors provide the initial position and Euler
 * orientation; omitted vectors use zero values, and the transform uses unit
 * scale. The optional `prefab` object is forwarded to {@linkcode Emitter} as
 * its constructor options.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Vector3 } from '@wimaengine/math'
 * import { createEmitter3D } from '@wimaengine/emitter'
 *
 * const world = new World()
 * world.spawn(createEmitter3D(
 *   { prefab: () => [] },
 *   new Vector3(0, 1, 0),
 *   new Vector3(0, Math.PI / 2, 0)
 * ))
 * ```
 *
 * @param {EmitterOptions} [prefab] - Options forwarded to {@linkcode Emitter}.
 * @param {Vector3} [position] - Optional {@linkcode Vector3} initial position.
 * @param {Vector3} [angle] - Optional {@linkcode Vector3} Euler orientation.
 * @returns {[Position3D, Orientation3D, Scale3D, GlobalTransform3D, Emitter, Timer, Children]} Ordered component bundle containing {@linkcode Position3D}, {@linkcode Orientation3D}, {@linkcode Scale3D}, {@linkcode GlobalTransform3D}, {@linkcode Emitter}, {@linkcode Timer}, and {@linkcode Children}.
 */
export function createEmitter3D(prefab, position, angle) {
  return [
    ...createTransform3D(
      position?.x,
      position?.y,
      position?.z,
      angle?.x,
      angle?.y,
      angle?.z
    ),
    new Emitter(prefab),
    new Timer(),
    new Children()
  ]
}
