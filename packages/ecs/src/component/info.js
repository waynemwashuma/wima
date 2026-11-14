/** @import { ComponentId, ComponentName } from '../typedef'*/

import { ComponentHooks } from './hooks'

/**
 * Represents registration metadata associated with one component type.
 *
 * The ECS uses this value to retain the component's identity and lifecycle-hook
 * configuration while the type is registered. Configure hooks through
 * {@linkcode World#setComponentHooks} or {@linkcode App#setComponentHooks}; most
 * API users inspect rather than construct {@linkcode ComponentInfo} values.
 */
export class ComponentInfo {

  /**
   * Numeric identifier assigned to this component during registration.
   *
   * Component IDs are dense, zero-based values assigned in registration order.
   * This metadata identifier is distinct from the component type's string name
   * or type ID.
   *
   * @readonly
   * @type {ComponentId}
   */
  id = 0

  /**
   * String type name or type ID associated with this component.
   *
   * The value is stored exactly as supplied; this class does not derive,
   * validate, or normalize it.
   *
   * @readonly
   * @type {ComponentName}
   */
  name

  /**
   * Lifecycle hooks currently associated with this component.
   *
   * The value starts as an empty {@linkcode ComponentHooks} instance and is
   * replaced by {@linkcode ComponentInfo#setHooks} when hooks are configured. The
   * field is internal; use {@linkcode World#setComponentHooks} or
   * {@linkcode App#setComponentHooks} to configure it.
   *
   * @private
   * @type {ComponentHooks}
   */
  hooks = new ComponentHooks()

  /**
   * Creates metadata for a registered component type.
   *
   * The constructor stores `id` and `name` as supplied. Constructing one does
   * not register a component with a {@linkcode World} or install its hooks; the
   * new value starts with an empty {@linkcode ComponentHooks} configuration.
   *
   * @param {ComponentId} id - Numeric identifier assigned during registration.
   * @param {ComponentName} name - Component type name or type ID.
   */
  constructor(id, name) {
    this.id = id
    this.name = name
  }

  /**
   * Returns this component's current lifecycle hooks.
   *
   * The stored {@linkcode ComponentHooks} object is returned directly, not copied.
   * Changes to that object are visible to the world using this metadata.
   *
   * @returns {ComponentHooks} The hooks currently associated with the component.
   */
  getHooks() {
    return this.hooks
  }

  /**
   * Replaces this component's lifecycle hooks.
   *
   * The replacement is stored as-is; existing callbacks are not merged with it.
   * Most API users should use {@linkcode World#setComponentHooks} or
   * {@linkcode App#setComponentHooks} to configure component hooks.
   *
   * @param {ComponentHooks} hooks - New lifecycle hooks for the component.
   * @returns {void}
   */
  setHooks(hooks) {
    this.hooks = hooks
  }
}
