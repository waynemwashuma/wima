/**
 * Defines numeric locations for distinguishing physical keyboard sides.
 *
 * {@linkcode KeyLocation.Standard} (`0`) identifies a key with no left/right
 * distinction. {@linkcode KeyLocation.Right} (`1`) and
 * {@linkcode KeyLocation.Left} (`2`) identify the corresponding physical side.
 * Use these values when an input adapter needs to keep otherwise matching
 * keys, such as left and right modifiers, separate.
 *
 * @example
 * ```js
 * import { KeyLocation } from '@wimaengine/keyboard'
 *
 * const modifierLocation = KeyLocation.Left
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const KeyLocation = {
  Standard:0,
  Right:1,
  Left:2
}
