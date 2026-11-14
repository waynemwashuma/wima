/** @import { ArchetypeId, TableRow } from '../typedef' */
import { DenseList, IndexAllocator } from '@wimaengine/datastructures'
import { EntityLocation } from './location'

/**
 * Associates each entity slot in a {@linkcode World} with its current
 * {@linkcode EntityLocation}.
 *
 * The world uses this indexed registry to resolve an {@linkcode EntityHandle} to
 * its current {@linkcode Archetype}, {@linkcode Table}, and row. A location is
 * updated when an entity changes component layout, when dense table storage
 * moves a row, or when the entity is despawned. Recycled slot indexes can then
 * be assigned to a later entity while its generation distinguishes the new
 * handle from an older one.
 *
 * It inherits indexed storage operations from {@linkcode DenseList}.
 *
 * @augments {DenseList<EntityLocation>}
 */
export class Entities extends DenseList {

  /**
   * Creates an empty entity-location registry.
   *
   * @inheritdoc
   */
  constructor() {
    super(new IndexAllocator())
  }
}
