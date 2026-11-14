/** @import { TouchId } from "../typedef" */
import { TouchPointer } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the active touch contacts for an application as a world resource.
 *
 * `TouchPlugin` provides one `Touches` instance in the app's default world and
 * keeps it synchronized with touch-only pointer events. It creates a
 * `TouchPointer` when a touch starts, updates its position on moves, and
 * removes it when the browser reports a pointer-up or pointer-cancel event.
 * Read the resource with `world.getResource(Touches)`; it is input state, not
 * an ECS component.
 *
 * The resource owns an indexed active list and a map from browser
 * `pointerId` values to compact `TouchId` values. The list is initialized with
 * ten normal slots, numbered 0 through 9. A browser pointer ID can be
 * arbitrary, while a `TouchPointer.id` is the compact slot assigned by
 * `Touches.set`. Deleting a pointer releases its slot for reuse.
 *
 * @example
 * ```js
 * import { Touches } from '@wimaengine/touch'
 *
 * // Register TouchPlugin before reading the resource.
 * function readTouches(world) {
 *   const touches = world.getResource(Touches)
 *
 *   for (const pointer of touches.getActive()) {
 *     const dx = pointer.position.x - pointer.lastposition.x
 *     const dy = pointer.position.y - pointer.lastposition.y
 *     console.log(pointer.id, dx, dy)
 *   }
 * }
 * ```
 *
 * @category resource
 */
export class Touches {

  /**
   * Active touch pointers indexed by their compact `TouchId`.
   *
   * The resource starts with ten supported slots. Empty slots are represented
   * by `undefined` and are reused by `Touches.set`.
   *
   * @private
   * @type {(TouchPointer | undefined)[]}
   */
  list = new Array(10).fill(undefined)

  /**
   * Maps browser pointer IDs to the slots used by `Touches.list`.
   *
   * @private
   * @type {Map<number, TouchId>}
   */
  pointerMap = new Map()

  /**
   * Finds the compact slot assigned to a browser pointer ID.
   *
   * The argument is the browser event's `pointerId`, not a compact slot. The
   * mapping exists after `Touches.set` adds a new pointer and is removed by
   * `Touches.delete`. An unknown or deleted browser pointer ID returns
   * `undefined`.
   *
   * @param {number} pointerId
   * @returns {TouchId | undefined} The active slot, or `undefined` when no mapping exists.
   */
  getId(pointerId) {
    return this.pointerMap.get(pointerId)
  }

  /**
   * Returns the active pointer in the lowest supported slot.
   *
   * This scans the current list from index 0 in order; with the initialized
   * list that means slots 0 through 9. It does not sort by browser pointer ID
   * or by the time a touch was added. If the list has grown beyond those ten
   * slots, an additional entry can also be found after the normal slots are
   * empty. It returns `undefined` when no slot is occupied.
   *
   * @returns {TouchPointer | undefined} The first active pointer, if one exists.
   */
  getFirst() {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i]) return this.list[i]
    }

    return undefined
  }

  /**
   * Returns the active pointer in the highest of the ten initial slots.
   *
   * The search runs from slot 9 down to slot 0. It returns `undefined` when
   * those ten slots are empty and ignores entries beyond slot 9.
   *
   * @returns {TouchPointer | undefined} The last active pointer, if one exists.
   */
  getLast() {
    for (let i = 9; i >= 0; i--) {
      if (this.list[i]) return this.list[i]
    }
  }

  /**
   * Returns all active pointers in slot order.
   *
   * The returned array is a new array, so adding or removing entries from it
   * does not change this resource. The `TouchPointer` objects inside it are the
   * same objects stored in the resource. In normal use the result has at most
   * ten pointers; if an additional slot has been created, it is included too.
   *
   * @returns {TouchPointer[]} A new array containing the active pointers.
   */
  getActive() {
    return this.list.filter((e) => e !== undefined)
  }

  /**
   * Adds a pointer or replaces the pointer stored for a browser ID.
   *
   * `pointerId` is the browser event ID. For a new browser ID, the first empty
   * slot is selected and the mapping is stored. For an ID already in the map,
   * its existing slot is reused and the pointer in that slot is replaced. In
   * both cases this method assigns the compact slot to `pointer.id`, stores
   * the same pointer object in the resource, and returns that slot. Deleting a
   * pointer and setting a new one can therefore reuse a different slot.
   *
   * The active list is initialized with slots 0 through 9. When all ten slots
   * are occupied, adding another distinct pointer can create an extra entry at
   * slot 10 instead of reporting a capacity error. Because that assignment
   * grows the array, later distinct pointers can extend it again. Such entries
   * are visible to `Touches.getActive` and `Touches.get`; `getFirst` can find
   * them after lower slots are empty, but `Touches.getLast` still only scans
   * slots 9 through 0. Treat ten simultaneous contacts as the supported
   * capacity rather than relying on this overflow behavior.
   *
   * @param {number} pointerId - Browser pointer ID used as the map key.
   * @param {TouchPointer} pointer - Pointer object to store in the selected slot.
   * @returns {number} The compact slot assigned to the pointer.
   */
  set(pointerId, pointer) {
    let id = this.getId(pointerId)

    if (id === undefined) {
      for (let i = 0; i < this.list.length + 1; i++) {
        if (!this.list[i]) {
          id = i
          this.pointerMap.set(pointerId, i)
          break
        }
      }
    }

    // Safety: Can only allocate id here
    // @ts-ignore
    pointer.id = id
    this.list[id] = pointer

    return id
  }

  /**
   * Removes the pointer associated with a browser pointer ID.
   *
   * The argument is the browser `pointerId`, not the compact `TouchId`.
   * When the mapping exists, the slot is cleared, the mapping is deleted, and
   * the released compact slot is returned. When the pointer ID is unknown or
   * was already deleted, the resource is unchanged and the method returns
   * `undefined`. The removed `TouchPointer` object is not modified or returned.
   *
   * @param {number} pointerId - Browser pointer ID to remove.
   * @returns {number | undefined} The released compact slot, or `undefined` when no active mapping exists.
   */
  delete(pointerId) {
    const id = this.getId(pointerId)

    if (id === undefined) return undefined

    this.list[id] = undefined
    this.pointerMap.delete(pointerId)

    return id
  }

  /**
   * Reads an active pointer by its compact slot.
   *
   * This is direct indexed lookup, so it expects the `TouchId` returned by
   * `Touches.getId` or `Touches.set`, not the browser `pointerId`. It returns
   * `undefined` for an empty or out-of-range slot.
   *
   * @param {TouchId} id - Compact slot assigned to an active touch.
   * @returns {TouchPointer | undefined} The pointer in that slot, if present.
   */
  get(id) {
    return this.list[id]
  }
}
/* eslint-enable jsdoc/check-tag-names */
