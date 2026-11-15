import { Buttons } from '@wimaengine/input-core'
import { MouseButton } from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores the current state of mouse buttons as a world resource.
 *
 * Its inherited {@linkcode Buttons} API is specialized for {@linkcode MouseButton}
 * values. Use it to inspect whether a button is held, was just pressed, or was
 * just released, and to check those states across multiple buttons.
 *
 * @example
 * ```js
 * // While handling mouse input:
 * function handleMouse(world) {
 *   const buttons = world.getResource(MouseButtons)
 *
 *   if (buttons.justPressed(MouseButton.Left)) {
 *     console.log('left button started')
 *   }
 *
 *   if (buttons.pressed(MouseButton.Left)) {
 *     console.log('left button is held')
 *   }
 * }
 * ```
 *
 * @augments {Buttons<MouseButton>}
 * @category resource
 */
export class MouseButtons extends Buttons { }
/* eslint-enable jsdoc/check-tag-names */
