/** @import { Constructor, TypeId } from '@wimaengine/type' */

import { World } from '@wimaengine/ecs'
import { assert } from '@wimaengine/logger'
import { typeid } from '@wimaengine/type'

/* eslint-disable jsdoc/check-tag-names */
/**
 * {@linkcode Worlds} is the app's world registry. It extends {@linkcode Map} and
 * stores each {@linkcode World} under the {@linkcode TypeId} returned by
 * {@linkcode typeid} for its constructor label.
 *
 * App configuration adds worlds through {@linkcode App#setWorld} and selects the
 * default with {@linkcode App#defaultWorld}. API users can call
 * {@linkcode Worlds#getWorld} without a label to retrieve the selected default
 * world, or pass a label to retrieve its registered world. A missing default
 * or world causes lookup to assert instead of returning `undefined`.
 *
 * @example
 * ```js
 * import { Worlds } from '@wimaengine/app'
 * import { World } from '@wimaengine/ecs'
 * import { typeid } from '@wimaengine/type'
 *
 * class MainWorld {}
 * const worlds = new Worlds()
 * const mainWorld = new World()
 *
 * worlds.set(typeid(MainWorld), mainWorld)
 * worlds.defaultWorldId = typeid(MainWorld)
 *
 * worlds.getWorld() === mainWorld // true
 * worlds.getWorld(MainWorld) === mainWorld // true
 * ```
 *
 * @augments {Map<TypeId, World>}
 * @category resource
 */
export class Worlds extends Map {

  /**
   * The {@linkcode TypeId} used to select the world returned by
   * {@linkcode Worlds#getWorld} when no label is supplied.
   *
   * It starts as `undefined`. {@linkcode App#defaultWorld} assigns it, but that
   * assignment does not create a map entry or verify that the world exists.
   *
   * @type {TypeId | undefined}
   */
  defaultWorldId = undefined

  /**
   * Return the selected default {@linkcode World} or the world identified by a
   * label.
   *
   * With no label, this method reads {@linkcode Worlds#defaultWorldId} and
   * returns the matching map entry. With a label, it converts the constructor
   * to a {@linkcode TypeId} with {@linkcode typeid} and looks up that key.
   *
   * The lookup asserts when the default ID is `null` or `undefined`, or when
   * the selected map entry is `null` or `undefined`. The first failure uses
   * `The default world is not set.`; a missing selected world uses
   * `The world "<TypeId>" is not set.`.
   *
   * @param {Constructor | undefined} [label]
   * @returns {World}
   * @throws {Error} If no default is selected, or if the requested world is not registered.
   */
  getWorld(label) {
    if (!label) {
      assert(this.defaultWorldId, 'The default world is not set.')
      const world = this.get(this.defaultWorldId)

      assert(world, `The world "${this.defaultWorldId}" is not set.`)

      return world
    }

    const worldId = typeid(label)
    const world = this.get(worldId)

    assert(world, `The world "${worldId}" is not set.`)

    return world
  }
}
/* eslint-enable jsdoc/check-tag-names */
