/** @import { TypeId } from '@wimaengine/type' */

/**
 * Provides numeric modes for {@linkcode SceneFilter} type filtering.
 *
 * `Allow` admits only the type IDs listed by a filter, while `Deny` admits
 * every type ID except those listed. The mode is applied by
 * {@linkcode SceneFilter#allows} when scene component and resource snapshots are
 * restored. Filter entries use live component and resource type IDs rather
 * than snapshot type IDs.
 *
 * @readonly
 * @enum {number}
 */
export const SceneFilterMode = /** @type {const} */({
  /** Allows only type IDs included in the filter (`0`). */
  Allow: 0,

  /** Denies type IDs included in the filter and allows all others (`1`). */
  Deny: 1
})

/**
 * Filters live scene component and resource type IDs during {@linkcode Scene#toWorld}.
 *
 * {@linkcode SceneFilterMode.Allow} admits only listed IDs, while
 * {@linkcode SceneFilterMode.Deny} admits every ID except those listed. An empty
 * allow-list therefore rejects every type, and an empty deny-list allows every
 * type. The filter decides eligibility only; it does not alter the scene
 * snapshot or the supplied type IDs.
 *
 * @example
 * ```js
 * import { SceneFilter, SceneFilterMode } from '@wimaengine/scene'
 * import { Position2D, Scale2D } from '@wimaengine/transform'
 * import { typeid } from '@wimaengine/type'
 *
 * const filter = new SceneFilter(
 *   [typeid(Position2D)],
 *   SceneFilterMode.Allow
 * )
 *
 * filter.allows(typeid(Position2D)) // true
 * filter.allows(typeid(Scale2D)) // false
 * ```
 */
export class SceneFilter {

  /**
   * Type IDs tested by {@linkcode SceneFilter#allows}.
   *
   * The array is stored as supplied, so changes made through the array are
   * observed by later checks.
   *
   * @type {TypeId[]}
   */
  typeIds

  /**
   * Allow-list or deny-list mode used by {@linkcode SceneFilter#allows}.
   *
   * @type {number}
   */
  mode

  /**
   * Creates a scene type filter.
   *
   * With the default {@linkcode SceneFilterMode.Allow} mode, only the supplied
   * type IDs are allowed. Pass {@linkcode SceneFilterMode.Deny} to allow every
   * type ID not in the array. The array is retained rather than copied.
   *
   * @param {TypeId[]} [typeIds=[]]
   * @param {number} [mode=SceneFilterMode.Allow]
   */
  constructor(typeIds = [], mode = SceneFilterMode.Allow) {
    this.typeIds = typeIds
    this.mode = mode
  }

  static default() {
    return new SceneFilter()
  }

  /**
   * Tests whether a scene component or resource type may be restored.
   *
   * `Allow` returns `true` when `typeId` is listed; `Deny` returns `true` when
   * it is not listed. This method does not mutate the filter.
   *
   * @param {TypeId} typeId
   * @returns {boolean} Whether the type ID passes the configured filter mode.
   */
  allows(typeId) {
    const contains = this.typeIds.includes(typeId)

    return this.mode === SceneFilterMode.Allow ? contains : !contains
  }
}
