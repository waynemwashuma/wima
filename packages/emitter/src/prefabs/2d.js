/** @import {EmitterOptions} from "../components" */
import { Children } from '@wimaengine/hierarchy'
import { Timer } from '@wimaengine/time'
import { createTransform2D, GlobalTransform2D, Orientation2D, Position2D, Scale2D } from '@wimaengine/transform'
import { Emitter } from '../components'

/**
 * Creates the component bundle for a 2D particle emitter entity.
 *
 * The returned tuple contains {@linkcode Position2D}, {@linkcode Orientation2D},
 * {@linkcode Scale2D}, {@linkcode GlobalTransform2D}, {@linkcode Emitter},
 * {@linkcode Timer}, and {@linkcode Children} in insertion order. The transform
 * starts at the supplied position and angle, with unit scale; omitted
 * position and angle arguments use the defaults of
 * {@linkcode createTransform2D}. The optional `prefab` object is forwarded to
 * {@linkcode Emitter} as its constructor options.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { createEmitter2D } from '@wimaengine/emitter'
 *
 * const world = new World()
 * world.spawn(createEmitter2D({ prefab: () => [] }, 10, 20, Math.PI / 4))
 * ```
 *
 * @param {EmitterOptions} [prefab] - Options forwarded to {@linkcode Emitter}.
 * @param {number} [x=0] - Initial x position.
 * @param {number} [y=0] - Initial y position.
 * @param {number} [angle=0] - Initial 2D angle.
 * @returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D, Emitter, Timer, Children]} Ordered component bundle containing {@linkcode Position2D}, {@linkcode Orientation2D}, {@linkcode Scale2D}, {@linkcode GlobalTransform2D}, {@linkcode Emitter}, {@linkcode Timer}, and {@linkcode Children}.
 */
export function createEmitter2D(prefab, x, y, angle) {
  return [
    ...createTransform2D(x, y, angle),
    new Emitter(prefab),
    new Timer(),
    new Children()
  ]
}
