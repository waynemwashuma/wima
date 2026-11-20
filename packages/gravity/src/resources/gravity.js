/** @import {Vector2Like, Vector3Like} from '@wimaengine/math' */

import { Vector2, Vector3 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the world's 2D gravity acceleration as a mutable {@linkcode Vector2}
 * resource.
 *
 * A directly constructed {@linkcode Gravity2D} starts at `(0, 0)`. {@linkcode Gravity2DPlugin}
 * installs the resource with a default value of `(0, -980)`, or with the
 * configured acceleration supplied to the plugin. The resource can be read or
 * replaced through the world's resource API.
 *
 * @example
 * ```js
 * import { Gravity2D } from '@wimaengine/gravity'
 * import { World } from '@wimaengine/ecs'
 *
 * const world = new World()
 * world.setResource(new Gravity2D(0, -9.8))
 *
 * function readGravity(world) {
 *   const gravity = world.getResource(Gravity2D)
 *   return { x: gravity.x, y: gravity.y }
 * }
 *
 * readGravity(world) // { x: 0, y: -9.8 }
 * ```
 *
 * @category resource
 */
export class Gravity2D extends Vector2 {

  static default() {
    return new Gravity2D()
  }

  /**
   * @inheritdoc
   * @param {Gravity2D} value
   * @returns {Vector2Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector2Like} value
   * @param {Gravity2D} [out=new Gravity2D()]
   * @returns {Gravity2D}
   */
  static deserialize(value, out = new Gravity2D()) {
    return super.deserialize(value, out)
  }
}
/* eslint-disable jsdoc/check-tag-names */

/**
 * Stores the world's 3D gravity acceleration as a mutable {@linkcode Vector3}
 * resource.
 *
 * A directly constructed {@linkcode Gravity3D} starts at `(0, 0, 0)`. {@linkcode Gravity3DPlugin}
 * installs the resource with a default value of `(0, -980, 0)`, or with the
 * configured acceleration supplied to the plugin. The resource can be read or
 * replaced through the world's resource API.
 *
 * @example
 * ```js
 * import { Gravity3D } from '@wimaengine/gravity'
 * import { World } from '@wimaengine/ecs'
 *
 * const world = new World()
 * world.setResource(new Gravity3D(0, -9.8, 0))
 *
 * const gravity = world.getResource(Gravity3D)
 * console.log(gravity.y) // -9.8
 * ```
 *
 * @category resource
 */
export class Gravity3D extends Vector3 {

  /**
   * @inheritdoc
   * @param {Gravity3D} value
   * @returns {Vector3Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector3Like} value
   * @param {Gravity3D} [out=new Gravity3D()]
   * @returns {Gravity3D}
   */
  static deserialize(value, out = new Gravity3D()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
