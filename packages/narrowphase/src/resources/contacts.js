import { CollisionManifold } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the current list of confirmed 2D collision manifolds.
 *
 * A {@linkcode Contacts} value is an ordinary array of {@linkcode CollisionManifold}
 * values. Retrieve it as a world resource to inspect the manifolds currently
 * available to application code; standard array operations can be used to
 * read or iterate the collection.
 *
 * @example
 * ```js
 * import { Contacts } from '@wimaengine/narrowphase'
 *
 * function countContacts(world) {
 *   return world.getResource(Contacts).length
 * }
 * ```
 *
 * @augments {Array<CollisionManifold>}
 * @category resource
 */
export class Contacts extends Array { }
/* eslint-enable jsdoc/check-tag-names */
