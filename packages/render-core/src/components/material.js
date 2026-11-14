/** @import { ComponentHook } from '@wimaengine/ecs' */
/** @import { Constructor } from '@wimaengine/type' */
import { Handle } from '@wimaengine/asset'
import { Material } from '../assets'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Abstract component for associating an entity with a typed {@linkcode Material}
 * asset.
 *
 * Extend this class for a concrete material component. Its generic parameter
 * identifies the {@linkcode Material} type associated with that component, as in
 * {@linkcode BasicMaterialInstance}.
 *
 * @abstract
 * @template {Material} T
 * @category component
 */
export class MaterialInstance {

  /**
   * Handle for the material asset associated with this component.
   *
   * The generic `T` keeps the handle aligned with the component's material
   * type. The supplied handle is retained as the component's live asset
   * reference.
   *
   * @type {Handle<T>}
   */
  handle

  /**
   * Creates a material component from a typed material handle.
   *
   * The supplied handle is stored directly and is not copied or resolved.
   * Concrete material components pass their material handle to `super`.
   *
   * @param {Handle<T>} handle
   */
  constructor(handle) {
    this.handle = handle
  }
}

/**
 * Creates a {@linkcode ComponentHook} that releases a material component's
 * handle when the component is removed.
 *
 * The returned callback looks up the supplied component type on the entity. It
 * does nothing when the component is absent; otherwise it calls
 * {@linkcode Handle#drop} on the component's handle. The handle release remains
 * deferred according to {@linkcode Handle#drop}.
 *
 * @template {Material} T
 * @param {Constructor<MaterialInstance<T>>} type - Concrete material component constructor to look up.
 * @returns {ComponentHook} Remove callback for the supplied material component.
 * @category component-hook
 */
export function dropMaterialInstance(type) {
  return function dropMaterialInstance(entity, world) {
    const material = world.get(entity, type)

    if (!material) {
      return
    }

    material.handle.drop()
  }
}
/* eslint-enable jsdoc/check-tag-names */
