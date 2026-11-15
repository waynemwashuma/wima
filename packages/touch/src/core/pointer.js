/** @import { TouchId } from "../typedef" */
import { Vector2 } from '@wimaengine/math'

/**
 * Represents one active touch contact and its current and previous positions.
 *
 * {@linkcode TouchPlugin} creates and updates pointers stored in {@linkcode Touches}.
 * At touch start, {@linkcode TouchPointer#position} and
 * {@linkcode TouchPointer#lastposition} both receive the start position. On a
 * later move, the previous current position is copied to
 * {@linkcode TouchPointer#lastposition} before {@linkcode TouchPointer#position}
 * receives the new event position, so subtracting the vectors gives the
 * movement for that update. A touch end or cancellation removes the
 * pointer from {@linkcode Touches} without resetting its fields.
 *
 * {@linkcode TouchPointer#id} is the compact slot assigned by {@linkcode Touches#set};
 * it is not the browser's `pointerId`. Read the pointer returned by
 * {@linkcode Touches#get} or {@linkcode Touches#getActive} rather than updating its
 * history directly.
 *
 * @example
 * ```js
 * import { Touches } from '@wimaengine/touch'
 *
 * function readFirstTouch(world) {
 *   const pointer = world.getResource(Touches).getFirst()
 *   if (!pointer) return
 *
 *   console.log(pointer.id)
 *   console.log(pointer.position.x - pointer.lastposition.x)
 * }
 * ```
 */
export class TouchPointer {

  /**
   * Compact engine slot assigned to this pointer by {@linkcode Touches#set}.
   *
   * The constructor initializes this value from its argument. When
   * {@linkcode Touches#set} stores the pointer, it overwrites the value with the
   * slot mapped from the browser pointer ID.
   *
   * @readonly
   * @type {TouchId}
   */
  id = 0

  /**
   * Current position of the touch in the pointer event's coordinate space.
   *
   * {@linkcode TouchPlugin} copies the latest matching pointer-move position here.
   * On a new pointer this vector is initialized to zero until the plugin copies
   * the start event into it.
   *
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * Position recorded before the latest touch move.
   *
   * {@linkcode TouchPlugin} copies {@linkcode TouchPointer#position} here before
   * applying a new move. At touch start it copies the initial position here as
   * well, so the first frame's position delta is zero. This field is exposed as
   * {@linkcode TouchPointer#lastposition} in the public API.
   *
   * @type {Vector2}
   */
  lastposition = new Vector2()

  /**
   * Creates a touch pointer with an initial compact ID.
   *
   * Both position vectors start at `(0, 0)`. When the pointer is created by
   * {@linkcode TouchPlugin}, the plugin passes `0` and {@linkcode Touches#set} later
   * assigns the actual compact slot. The constructor does not receive or
   * translate a browser `pointerId`.
   *
   * @param {number} id - Initial engine-side ID; {@linkcode Touches#set} may replace it.
   */
  constructor(id) {
    this.id = id
  }
}
