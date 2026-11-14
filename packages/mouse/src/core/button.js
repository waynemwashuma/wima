/**
 * Defines the numeric engine codes for mouse buttons.
 *
 * {@linkcode MouseButton.Left} (`0`) is the primary button,
 * {@linkcode MouseButton.Wheel} (`1`) is the wheel or middle button, and
 * {@linkcode MouseButton.Right} (`2`) is the secondary button. The auxiliary
 * navigation buttons are {@linkcode MouseButton.Back} (`3`) and
 * {@linkcode MouseButton.Forward} (`4`); {@linkcode MouseButton.Dpi} (`5`) is a
 * DPI button, and {@linkcode MouseButton.Unidentified} (`7`) represents an
 * unknown or unsupported button value.
 *
 * Use these values with {@linkcode MouseButtons} and its inherited button-state
 * queries.
 *
 * @example
 * ```js
 * import { MouseButton, MouseButtons } from '@wimaengine/mouse'
 *
 * function handleMouse(world) {
 *   const buttons = world.getResource(MouseButtons)
 *
 *   if (buttons.justPressed(MouseButton.Left)) {
 *     console.log('primary button pressed')
 *   }
 * }
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const MouseButton = {
  Left: 0,
  Wheel: 1,
  Right: 2,
  Back: 3,
  Forward: 4,
  Dpi: 5,
  Unidentified:7
}
