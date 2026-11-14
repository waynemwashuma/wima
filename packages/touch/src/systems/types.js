import { World } from '@wimaengine/ecs'
import { OpaqueInfo, TypeRegistry } from '@wimaengine/reflect'
import { Touches } from '../resources'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers opaque reflection metadata for touch input.
 *
 * {@linkcode TouchPlugin} schedules this function as a one-shot Startup system.
 * It reads the world's {@linkcode TypeRegistry} and registers {@linkcode Touches}
 * with {@linkcode OpaqueInfo}. Reflection-aware code can therefore identify the
 * resource by type without receiving field metadata for its internal state.
 *
 * No component or resource instance is created, and no serialization methods
 * are attached by this function. The function changes only
 * {@linkcode TypeRegistry} metadata.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { TouchPlugin } from '@wimaengine/touch'
 * import { WindowPlugin } from '@wimaengine/window'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new WindowPlugin({ initPrimaryWindow: false }))
 *   .registerPlugin(new TouchPlugin())
 * // Startup registers opaque metadata for Touches.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry} resource.
 * @returns {void}
 * @throws {Error} If the world does not contain a {@linkcode TypeRegistry} resource.
 * @category system
 */
export function registerTouchTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Touches, new OpaqueInfo())
}
/* eslint-enable jsdoc/check-tag-names */
