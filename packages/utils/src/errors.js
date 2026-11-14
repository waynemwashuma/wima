/** @import {Constructor} from '@wimaengine/type' */

import { formatString } from './common'

/**
 * Message templates used when {@linkcode abstractClass} or
 * {@linkcode abstractMethod} reports an abstract-class violation.
 *
 * The templates use numbered placeholders that are filled by
 * {@linkcode formatString}. The abstract helpers throw the resulting strings
 * directly rather than wrapping them in `Error` instances.
 *
 * @type {{
 *   Unconstructable: string,
 *   MethodUnimplemented: string,
 *   MethodUncallable: string
 * }}
 * @property {string} Unconstructable Message for constructing the abstract
 * class directly. `{0}` is the class name.
 * @property {string} MethodUnimplemented Message for an inherited abstract
 * method that was not overridden. `{0}` is the class name and `{1}` is the
 * method name.
 * @property {string} MethodUncallable Message for calling an abstract method
 * on the abstract class itself. `{0}` is the class name and `{1}` is the method
 * name.
 */
export const AbstractClassError = {
  Unconstructable: 'The class `{0}` is not constructible.Extend the class.',
  MethodUnimplemented: 'The method `{0}.{1}()` is not implemented. Override the method without using `super.{1}()`.',
  MethodUncallable: 'The method `{0}.{1}()` is not callable.`{0}` is an abstract class.'
}

/**
 * Throws a message explaining why an abstract method cannot be called for an
 * item.
 *
 * When `item.constructor` is exactly `baseConstructor`, the method is not
 * callable because the base class is abstract. For any other constructor, the
 * method is treated as unimplemented and should be overridden. The thrown
 * value is a formatted string, not an `Error` instance.
 *
 * @example
 * ```js
 * class Base {
 *   run() {
 *     throw abstractMethod(this, Base, Base.prototype.run)
 *   }
 * }
 *
 * class Child extends Base {}
 * new Child().run() // throws: the method is not implemented
 * ```
 *
 * @template {Constructor} U
 * @template {InstanceType<U>} T
 * @param {T} item - Instance on which the abstract method was called.
 * @param {U} baseConstructor - Abstract base constructor to compare with the
 * item's constructor.
 * @param {(...args: any[]) => any} method - Abstract method whose name appears
 * in the thrown message.
 * @throws {string} Always. Throws a "not callable" message when the item's
 * constructor is the base constructor; otherwise throws a "not implemented"
 * message.
 * @returns {never} This function never returns.
 */
export function abstractMethod(item, baseConstructor, method) {
  if (item.constructor === baseConstructor) {
    throw formatString(AbstractClassError.MethodUncallable, item.constructor.name, method.name)
  }

  throw formatString(AbstractClassError.MethodUnimplemented, item.constructor.name, method.name)
}

/**
 * Guards an abstract base class against direct construction.
 *
 * The guard compares `item.constructor` with `baseConstructor`. A direct
 * instance throws a formatted string; an instance of a subclass passes and the
 * function returns normally.
 *
 * @example
 * ```js
 * class Base {
 *   constructor() {
 *     abstractClass(this, Base)
 *   }
 * }
 *
 * class Child extends Base {}
 * new Child() // allowed
 * new Base() // throws a string
 * ```
 *
 * @param {object} item - Instance being checked for direct construction.
 * @param {Constructor} baseConstructor - Abstract base constructor to guard.
 * @throws {string} If `item.constructor` is exactly `baseConstructor`.
 * @returns {void} Nothing for an instance whose constructor differs from the
 * base constructor.
 */
export function abstractClass(item, baseConstructor) {
  if (item.constructor === baseConstructor) {
    throw formatString(AbstractClassError.Unconstructable, item.constructor.name)
  }
}
