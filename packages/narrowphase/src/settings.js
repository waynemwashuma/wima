/**
 * Selects the geometric representation stored by a {@linkcode Collider2D}.
 *
 * Use {@linkcode ShapeType.POLYGON} for vertex-based polygon shapes and
 * {@linkcode ShapeType.Circle} for the center-and-radius circle representation.
 *
 * @readonly
 * @enum {number}
 * @example
 * ```js
 * import { Collider2D, ShapeType } from '@wimaengine/narrowphase'
 *
 * const collider = Collider2D.circle(1)
 * const isCircle = collider.type === ShapeType.Circle
 * ```
 */
export const ShapeType = {

  /** Circle representation created by {@linkcode Collider2D.circle}. */
  Circle: 0,

  /** Polygon representation created by {@linkcode Collider2D.rectangle}, {@linkcode Collider2D.triangle}, and {@linkcode Collider2D.line}. */
  POLYGON: 1
}

/**
 * Selects the expected movement mode of a physics body.
 *
 * Use these labels when application code distinguishes simulated, externally
 * driven, and fixed bodies.
 *
 * @readonly
 * @enum {number}
 * @example
 * ```js
 * import { BodyType } from '@wimaengine/narrowphase'
 *
 * const bodyType = BodyType.DYNAMIC
 * const isSimulated = bodyType === BodyType.DYNAMIC
 * ```
 */
export const BodyType = Object.freeze({

  /** A body whose movement is determined by simulation. */
  DYNAMIC: 2,

  /** A body whose movement is supplied by application or animation code. */
  KINEMATIC: 1,

  /** A body that remains fixed. */
  STATIC: 0
})

/**
 * Provides shared mutable defaults for 2D physics configuration.
 *
 * The exported object is shared by reference. Read it when constructing or
 * updating physics values, or change it before those values are consumed.
 * Changes are not copied into a separate configuration object automatically.
 *
 * @example
 * ```js
 * import { PhysicsSettings } from '@wimaengine/narrowphase'
 *
 * PhysicsSettings.velocitySolverIterations = 12
 * PhysicsSettings.penetrationSlop = 0.05
 * ```
 *
 */
export const PhysicsSettings = {

  // For the world
  posDampen: 0.3,
  linearDamping: 0.001,
  angularDamping: 0.001,
  velocitySolverIterations: 10,
  fixedFrameRate: 1 / 60,
  penetrationSlop: 0.1,
  positionCorrection: true,
  warmStarting: false,
  impulseAccumulation: false,
  separationTolerance: 0.1,
  mass: 1,
  restitution: 0.6,
  staticFriction: 1,
  kineticFriction: 0.5,
  boundPadding: 0,
  allowSleep: false,
  aabbDetectionOnly: false,
  collisionResponse: true,
  autoUpdateBound: true
}
