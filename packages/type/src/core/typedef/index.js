/**
 * Branded string used as a type identifier. The brand distinguishes a
 * {@linkcode TypeId} from an ordinary string at the type level.
 *
 * @typedef {string & { __brand:'TypeId' }} TypeId
 */

/**
 * Generic constructable-value alias whose `new` expression returns `T`.
 * The constructor accepts any number of arguments, and `T` defaults to
 * `unknown` when omitted.
 *
 * @template [T = unknown]
 * @typedef {new (...args:any[])=>T} Constructor
 */

/**
 * Maps each element of an array or tuple type `T` to a matching
 * {@linkcode Constructor}, preserving the input tuple's positions.
 *
 * @template {unknown[]} T
 * @typedef {{[K in keyof T]:Constructor<T[K]>}} TupleConstructor
 */

/**
 * Generic copy contract for values of type `T`. Its `copy` method accepts a
 * source value and an optional `out` target, then returns a value of type `T`.
 *
 * @template T
 * @typedef {{ copy(value: T, out?: T): T }} Copy
 */

/**
 * Generic clone contract for values of type `T`. Its `clone` method accepts a
 * source value and returns a value of type `T`. Sharing, cloning depth, and
 * other implementation details are left unspecified.
 *
 * @template T
 * @typedef {{ clone(value: T): T }} Clone
 */
export {}
