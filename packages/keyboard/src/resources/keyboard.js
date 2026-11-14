import { Buttons } from '@wimaengine/input-core'
import { KeyCode } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the current keyboard input state for an application.
 *
 * `Keyboard` is a world resource installed by {@linkcode KeyboardPlugin}. It
 * extends {@linkcode Buttons} for {@linkcode KeyCode} values, providing queries
 * for held keys and keys that were just pressed or released. Keyboard events
 * update the current state and the transient transition state exposed by the
 * inherited button queries.
 *
 * @example
 * ```js
 * // After enabling the keyboard input plugin, read the resource from your
 * // application's input handling.
 * function handleInput(world) {
 *   const keyboard = world.getResource(Keyboard)
 *
 *   if (keyboard.pressed(KeyCode.ArrowLeft)) {
 *     // Move while the left arrow is held.
 *   }
 *
 *   if (keyboard.justPressed(KeyCode.Space)) {
 *     // React once when Space is pressed.
 *   }
 * }
 * ```
 *
 * @augments {Buttons<KeyCode>}
 * @category resource
 */
export class Keyboard extends Buttons {}
