/**
 * Tracks held buttons and pending press and release transitions for input.
 *
 * This generic utility accepts any token type `T` that identifies a button,
 * including keyboard codes, pointer buttons, and gamepad inputs. Record
 * transitions with {@linkcode Buttons#press} and {@linkcode Buttons#release}, then
 * query current and transition state while processing input.
 *
 * Pressing an already pressed button does not create another just-pressed
 * transition. Releasing a button that is not pressed has no effect. The
 * just-pressed and just-released states persist until their corresponding
 * clear operation is called; they are not cleared automatically.
 *
 * @example
 * const buttons = new Buttons()
 * buttons.press('jump')
 * if (buttons.justPressed('jump')) {
 *   startJump()
 * }
 * buttons.clearJustPressed()
 *
 * @template T
 */
export class Buttons {

  /**
   * @private
   * @type {Set<T>}
   */
  innerPressed = new Set()

  /**
   * @private
   * @type {Set<T>}
   */
  innerJustPressed = new Set()

  /**
   * @private
   * @type {Set<T>}
   */
  innerJustReleased = new Set()

  /**
   * Marks a button as pressed and records a just-pressed transition when it
   * was not already pressed.
   *
   * @param {T} button
   */
  press(button) {
    if (!this.innerPressed.has(button)) {
      this.innerJustPressed.add(button)
    }

    this.innerPressed.add(button)
  }

  /**
   * Marks a button as released and records a just-released transition only
   * when it was currently pressed.
   *
   * @param {T} button
   */
  release(button) {
    if (this.innerPressed.delete(button)) {
      this.innerJustReleased.add(button)
    }
  }

  /**
   * Tests whether a button is currently held down.
   *
   * @param {T} button
   * @returns {boolean}
   */
  pressed(button) {
    return this.innerPressed.has(button)
  }

  /**
   * Tests whether at least one of the supplied buttons has a pending
   * just-pressed transition.
   *
   * @param {T[]} buttons
   * @returns {boolean}
   */
  anyJustPressed(...buttons) {
    for (let i = 0; i < buttons.length; i++) {
      if (this.justPressed(buttons[i])) {
        return true
      }
    }

    return false
  }

  /**
   * Tests whether at least one of the supplied buttons is currently held.
   *
   * @param {T[]} buttons
   * @returns {boolean}
   */
  anyPressed(...buttons) {
    for (let i = 0; i < buttons.length; i++) {
      if (this.pressed(buttons[i])) {
        return true
      }
    }

    return false
  }

  /**
   * Tests whether at least one of the supplied buttons has a pending
   * just-released transition.
   *
   * @param {T[]} buttons
   * @returns {boolean}
   */
  anyJustReleased(...buttons) {
    for (let i = 0; i < buttons.length; i++) {
      if (this.justReleased(buttons[i])) {
        return true
      }
    }

    return false
  }

  /**
   * Tests whether a button has a pending just-pressed transition.
   *
   * @param {T} button
   * @returns {boolean}
   */
  justPressed(button) {
    return this.innerJustPressed.has(button)
  }

  /**
   * Tests whether a button has a pending just-released transition.
   *
   * @param {T} button
   * @returns {boolean}
   */
  justReleased(button) {
    return this.innerJustReleased.has(button)
  }

  /**
   * Clears all pending just-pressed transitions.
   *
   * This does not change which buttons are currently pressed.
   */
  clearJustPressed() {
    this.innerJustPressed.clear()
  }

  /**
   * Clears all pending just-released transitions.
   *
   * This does not change which buttons are currently pressed.
   */
  clearJustReleased() {
    this.innerJustReleased.clear()
  }

  /**
   * Clears all currently pressed buttons.
   *
   * This does not create just-released transitions or clear pending
   * just-pressed and just-released transitions.
   */
  clearPressed() {
    this.innerPressed.clear()
  }
}
