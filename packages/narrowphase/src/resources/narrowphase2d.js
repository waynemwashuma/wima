/** @import {NarrowPhase2DPlugin} from '../plugin' */
/** @import {Contacts} from './contacts' */
import { CollisionManifold } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores collision manifolds so 2D SAT collision state persists across updates.
 *
 * {@linkcode NarrowPhase2DPlugin} installs one instance as a world resource. The
 * resource preserves a manifold for each generated entity-pair ID across
 * collision updates, supporting generation of the current contacts exposed by
 * the per-update {@linkcode Contacts} resource.
 *
 * @example
 * ```js
 * import { SATNarrowphase2D } from '@wimaengine/narrowphase'
 *
 * function countTrackedPairs(world) {
 *   const narrowphase = world.getResource(SATNarrowphase2D)
 *   return narrowphase.clmdrecord.size
 * }
 * ```
 *
 * @category resource
 */
export class SATNarrowphase2D {

  /**
   * Collision manifolds retained for observed entity pairs.
   *
   * The map reuses a manifold when the same generated entity-pair ID is
   * encountered again, so collision state can persist between updates. It is
   * not cleared when the current {@linkcode Contacts} collection is rebuilt.
   *
   * @type {Map<string, CollisionManifold>}
   */
  clmdrecord = new Map()
}
/* eslint-enable jsdoc/check-tag-names */
