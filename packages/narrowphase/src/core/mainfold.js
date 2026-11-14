/** @import { EntityHandle } from '@wimaengine/ecs'*/
/** @import {Contacts} from '../resources/contacts' */
import { Vector2, Angle, clamp } from '@wimaengine/math'
import { PhysicsSettings } from '../settings'

/**
 * Stores the collision and solver state for one pair of 2D bodies.
 *
 * Collision detection exposes the current manifolds through the
 * {@linkcode Contacts} resource. Each manifold combines the pair's
 * {@linkcode CollisionData} with the Jacobians, material values, and accumulated
 * impulses used by {@linkcode prepare} and {@linkcode solve}.
 *
 * @example
 * ```js
 * import { CollisionManifold, Contacts } from '@wimaengine/narrowphase'
 *
 * const manifold = world.getResource(Contacts)[0]
 * if (manifold) {
 *   CollisionManifold.prepare(
 *     manifold,
 *     positionA,
 *     positionB,
 *     velocityA,
 *     velocityB,
 *     rotationA,
 *     rotationB,
 *     1 / deltaTime
 *   )
 *   CollisionManifold.solve(manifold)
 * }
 * ```
 */
export class CollisionManifold {

  /**
   * Entity handle for body A in this collision pair.
   *
   * @type {EntityHandle}
   */
  entityA

  /**
   * Entity handle for body B in this collision pair.
   *
   * @type {EntityHandle}
   */
  entityB

  /**
   * Mutable linear velocity used for body A while the solver applies
   * impulses.
   *
   * @type {Vector2}
   */
  velocityA

  /**
   * Mutable linear velocity used for body B while the solver applies
   * impulses.
   *
   * @type {Vector2}
   */
  velocityB

  /**
   * Mutable rotational value used for body A by the solver.
   *
   * @type {Angle}
   */
  rotationA

  /**
   * Mutable rotational value used for body B by the solver.
   *
   * @type {Angle}
   */
  rotationB

  /**
   * Position associated with body A when this manifold is created.
   *
   * @type {Vector2}
   */
  positionA

  /**
   * Position associated with body B when this manifold is created.
   *
   * @type {Vector2}
   */
  positionB

  /**
   * Geometric result supplied by the narrowphase for this pair.
   *
   * {@linkcode prepare} reads its contact axis, tangent, overlap, points, and
   * contact count. A new manifold starts with a new {@linkcode CollisionData}
   * instance.
   *
   * @type {CollisionData}
   */
  contactData = new CollisionData()

  /**
   * Normal impulse accumulated or calculated for each contact point.
   *
   * {@linkcode solve} uses this as accumulated state when impulse accumulation is
   * enabled, and as the current normal impulse otherwise.
   *
   * @type {number[]}
   */
  impulse = [0.0, 0.0]

  /**
   * Tangential impulse accumulated or calculated for each contact point.
   *
   * @type {number[]}
   */
  tImpulse = [0.0, 0.0]

  /**
   * Normal velocity bias for each contact point, calculated by
   * {@linkcode prepare} from penetration and restitution.
   *
   * @type {number[]}
   */
  nbias = [0.0, 0.0]

  /**
   * Normal constraint Jacobian for each contact point.
   *
   * Each entry is a {@linkcode Jacobian} built from the collision axis.
   *
   * @type {Jacobian[]}
   */
  nJacobian = [new Jacobian(), new Jacobian()]

  /**
   * Tangential constraint Jacobian for each contact point.
   *
   * Each entry is a {@linkcode Jacobian} built from the collision tangent.
   *
   * @type {Jacobian[]}
   */
  tJacobian = [new Jacobian(), new Jacobian()]

  /**
   * Restitution coefficient used when {@linkcode prepare} calculates normal
   * velocity bias.
   *
   * @type {number}
   */
  restitution = 0

  /**
   * Static-friction coefficient used by accumulated impulse solving.
   *
   * @type {number}
   */
  staticFriction = 0

  /**
   * Kinetic-friction coefficient used to limit tangential impulses.
   *
   * @type {number}
   */
  kineticFriction = 0

  /**
   * Effective normal mass for each contact point, calculated by
   * {@linkcode prepare}.
   *
   * @type {number[]}
   */
  effectiveMass = [0, 0]

  /**
   * Normal impulse change calculated by {@linkcode solve} for each contact point.
   *
   * @type {number[]}
   */
  nLambda = [0, 0]

  /**
   * Tangential impulse change calculated by {@linkcode solve} for each contact
   * point.
   *
   * @type {number[]}
   */
  tLambda = [0, 0]

  /**
   * Inverse mass of body A.
   *
   * @type {number}
   */
  invmassA = 0

  /**
   * Inverse mass of body B.
   *
   * @type {number}
   */
  invmassB = 0

  /**
   * Inverse moment of inertia of body A.
   *
   * @type {number}
   */
  invinertiaA = 0

  /**
   * Inverse moment of inertia of body B.
   *
   * @type {number}
   */
  invinertiaB = 0

  /**
   * Creates a manifold for a pair of bodies.
   *
   * The entity, position, velocity, and rotation arguments are stored by
   * reference. Collision geometry and body properties remain at their field
   * defaults until the narrowphase fills them before {@linkcode prepare} runs.
   *
   * @param {EntityHandle} a - Entity handle for body A.
   * @param {EntityHandle} b - Entity handle for body B.
   * @param {Vector2} pA - Position associated with body A.
   * @param {Vector2} pB - Position associated with body B.
   * @param {Vector2} vA - Mutable linear velocity for body A.
   * @param {Vector2} vB - Mutable linear velocity for body B.
   * @param {Angle} rA - Mutable rotational value for body A.
   * @param {Angle} rB - Mutable rotational value for body B.
   */
  constructor(a, b, pA, pB, vA, vB, rA, rB) {
    this.entityA = a
    this.entityB = b
    this.velocityA = vA
    this.velocityB = vB
    this.rotationA = rA
    this.rotationB = rB
    this.positionA = pA
    this.positionB = pB
  }

  /**
   * Applies one constraint impulse to both bodies.
   *
   * The linear velocity vectors and the `value` of each rotation are mutated
   * using the vector and angular components stored in {@linkcode Jacobian}.
   *
   * @param {Jacobian} jacobian - Constraint coefficients to apply.
   * @param {Vector2} velocityA - Mutable linear velocity for body A.
   * @param {Vector2} velocityB - Mutable linear velocity for body B.
   * @param {Angle} rotationA - Mutable rotational value for body A.
   * @param {Angle} rotationB - Mutable rotational value for body B.
   * @param {number} invmassA - Inverse mass of body A.
   * @param {number} invmassB - Inverse mass of body B.
   * @param {number} invinertiaA - Inverse moment of inertia of body A.
   * @param {number} invinertiaB - Inverse moment of inertia of body B.
   * @param {number} lambda - Constraint impulse magnitude.
   * @returns {void}
   */
  static applyImpulse(
    jacobian,
    velocityA,
    velocityB,
    rotationA,
    rotationB,
    invmassA,
    invmassB,
    invinertiaA,
    invinertiaB,
    lambda
  ) {
    const va = Vector2.multiplyScalar(jacobian.va, invmassA * lambda)
    const vb = Vector2.multiplyScalar(jacobian.vb, invmassB * lambda)

    Vector2.add(velocityA, va, velocityA)
    Vector2.add(velocityB, vb, velocityB)
    rotationA.value += invinertiaA * jacobian.wa * lambda
    rotationB.value += invinertiaB * jacobian.wb * lambda
  }

  /**
   * Prepares the per-contact constraints for solving.
   *
   * For every contact in {@linkcode CollisionData#contactNo},
   * this clears the stored impulses, builds normal and tangent
   * {@linkcode Jacobian} values, calculates the penetration and restitution bias,
   * and calculates effective normal mass. It reads the supplied positions,
   * velocities, and rotations to calculate relative velocity; it does not
   * replace the manifold's stored body references.
   *
   * Call this after the {@linkcode CollisionData} has been filled by collision
   * detection and before {@linkcode solve}.
   *
   * @param {CollisionManifold} manifold - Manifold whose contact constraints
   * should be prepared.
   * @param {Vector2} positionA - Current position of body A.
   * @param {Vector2} positionB - Current position of body B.
   * @param {Vector2} velocityA - Current linear velocity of body A.
   * @param {Vector2} velocityB - Current linear velocity of body B.
   * @param {Angle} rotationA - Current rotational value of body A.
   * @param {Angle} rotationB - Current rotational value of body B.
   * @param {number} invDt - Inverse simulation-step duration.
   * @returns {void}
   */
  static prepare(
    manifold,
    positionA,
    positionB,
    velocityA,
    velocityB,
    rotationA,
    rotationB,
    invDt
  ) {
    const { axis, overlap, tangent, contactPoints, contactNo } = manifold.contactData
    const { invmassA, invmassB, invinertiaA, invinertiaB } = manifold

    for (let i = 0; i < contactNo; i++) {
      manifold.impulse[i] = 0
      manifold.tImpulse[i] = 0
      const ca1 = Vector2.subtract(contactPoints[i], positionA)
      const ca2 = Vector2.subtract(contactPoints[i], positionB)
      const va = Vector2.crossScalar(ca1, rotationA.value)

      Vector2.add(va, velocityA, va)
      const vb = Vector2.crossScalar(ca2, rotationB.value)

      Vector2.add(vb, velocityB, vb)
      const relativeVelocity = Vector2.subtract(vb, va, vb)

      manifold.nbias[i] = 0.0
      manifold.nJacobian[i].set(
        axis,
        Vector2.reverse(axis),
        Vector2.cross(ca1, axis),
        -Vector2.cross(ca2, axis)
      )

      // manifold.contactData.tangent.multiply(-Math.sign(manifold.contactData.tangent.dot(relativeVelocity)))
      manifold.tJacobian[i].set(
        tangent,
        Vector2.reverse(tangent),
        Vector2.cross(ca1, tangent),
        -Vector2.cross(ca2, tangent)
      )
      const normalVelocity = Vector2.dot(axis, relativeVelocity)

      manifold.nbias[i] = -(PhysicsSettings.posDampen * invDt) * Math.max(overlap - PhysicsSettings.penetrationSlop, 0.0)
      manifold.nbias[i] += (manifold.restitution) * Math.min(normalVelocity, 0.0)
      const k =
        invmassA +
        invmassB +
        manifold.nJacobian[i].wa * invinertiaA * manifold.nJacobian[i].wa +
        manifold.nJacobian[i].wb * invinertiaB * manifold.nJacobian[i].wb

      manifold.effectiveMass[i] = k > 0.0 ? 1.0 / k : 0.0
    }
  }

  /**
   * Solves and applies the constraints for every contact in a manifold.
   *
   * Normal and tangential impulse changes are calculated from the prepared
   * Jacobians. With impulse accumulation enabled, normal impulses accumulate
   * and static friction can be used; otherwise the normal impulse is clamped
   * to zero or greater and tangential impulse is limited by kinetic friction.
   * The resulting impulses mutate the manifold's stored velocities and
   * rotations through {@linkcode applyImpulse}.
   *
   * Call {@linkcode prepare} first for the current contact data.
   *
   * @param {CollisionManifold} manifold - Prepared manifold to solve.
   * @returns {void}
   */
  static solve(
    manifold
  ) {
    const { velocityA, velocityB, rotationA, rotationB, invmassA, invmassB, invinertiaA, invinertiaB } = manifold

    for (let i = 0; i < manifold.contactData.contactNo; i++) {
      const nvaDot = Vector2.dot(
        manifold.nJacobian[i].va,
        velocityA
      )
      const nvbDot = Vector2.dot(
        manifold.nJacobian[i].vb,
        velocityB
      )
      const tvaDot = Vector2.dot(
        manifold.tJacobian[i].va,
        velocityA
      )
      const tvbDot = Vector2.dot(
        manifold.tJacobian[i].vb,
        velocityB
      )
      const jv = nvaDot +
        manifold.nJacobian[i].wa * rotationA.value +
        nvbDot +
        manifold.nJacobian[i].wb * rotationB.value
      const jt =
        tvaDot +
        manifold.tJacobian[i].wa * rotationA.value +
        tvbDot +
        manifold.tJacobian[i].wb * rotationB.value
      const nLambda = manifold.effectiveMass[i] * -(jv + manifold.nbias[i])
      const tLambda = manifold.effectiveMass[i] * -(jt)
      const oldImpulse = manifold.impulse[i]
      const oldtImpulse = manifold.tImpulse[i]

      if (PhysicsSettings.impulseAccumulation) {
        manifold.impulse[i] = Math.max(0.0, manifold.impulse[i] + nLambda)
        manifold.tImpulse[i] = Math.abs(tLambda) <= manifold.impulse[i] * manifold.staticFriction ?
          tLambda :
          tLambda * manifold.kineticFriction
        manifold.nLambda[i] = manifold.impulse[i] - oldImpulse
        manifold.tLambda[i] = manifold.tImpulse[i] - oldtImpulse
      } else {
        manifold.impulse[i] = Math.max(0.0, nLambda)
        const maxfriction = manifold.impulse[i] * manifold.kineticFriction

        // Math.abs(tLambda) <= manifold.impulse[i] * manifold.staticFriction ?
        manifold.tImpulse[i] = clamp(tLambda, -maxfriction, maxfriction)

        // tLambda :
        // -manifold.impulse[i] * manifold.kineticFriction
        manifold.nLambda[i] = manifold.impulse[i]
        manifold.tLambda[i] = manifold.tImpulse[i]
      }
    }

    for (let i = 0; i < manifold.contactData.contactNo; i++) {

      CollisionManifold.applyImpulse(
        manifold.nJacobian[i],
        manifold.velocityA,
        manifold.velocityB,
        manifold.rotationA,
        manifold.rotationB,
        invmassA,
        invmassB,
        invinertiaA,
        invinertiaB,
        manifold.nLambda[i]
      )

      if (manifold.nLambda[i] <= 0) continue

      CollisionManifold.applyImpulse(
        manifold.tJacobian[i],
        manifold.velocityA,
        manifold.velocityB,
        manifold.rotationA,
        manifold.rotationB,
        invmassA,
        invmassB,
        invinertiaA,
        invinertiaB,
        manifold.tLambda[i]
      ) /***/
    }
  }
}

/**
 * Stores the geometric result of narrowphase collision detection for one body pair.
 *
 * Collision detection writes the minimum-overlap axis, tangent, penetration,
 * and contact points here. A {@linkcode CollisionManifold} keeps one instance
 * and {@linkcode CollisionManifold.prepare} reads it when building solver
 * constraints.
 * The default constructor creates an empty result with reusable vectors and
 * two contact-point slots.
 *
 * @example
 * ```js
 * import { Contacts } from '@wimaengine/narrowphase'
 *
 * const manifold = world.getResource(Contacts)[0]
 * const collision = manifold?.contactData
 * if (collision?.done) {
 *   console.log(`${collision.contactNo} contact point(s)`)
 * }
 * ```
 */
export class CollisionData {

  /**
   * Penetration depth selected by the SAT projection.
   *
   * The narrowphase may reset this to `-Infinity` before testing a pair so
   * that the smallest valid overlap can replace it. A new instance starts at
   * `0`.
   *
   * @type {number}
   */
  overlap = 0

  /**
   * Whether the SAT projection found a valid overlapping result.
   *
   * The narrowphase resets this flag before testing a pair and sets it after
   * all axes produce a valid minimum-overlap result.
   *
   * @type {boolean}
   */
  done = false

  /**
   * Collision axis selected by the minimum-overlap SAT test.
   *
   * The narrowphase uses this axis as the contact normal and derives
   * {@linkcode tangent} from it.
   *
   * @type {Vector2}
   */
  axis = new Vector2()

  /**
   * Tangent corresponding to {@linkcode axis}.
   *
   * The narrowphase derives this vector after the collision axis is selected;
   * the solver uses it to build tangential {@linkcode Jacobian} constraints.
   *
   * @type {Vector2}
   */
  tangent = new Vector2()

  /**
   * Reusable world-space contact-point slots.
   *
   * Only the first {@linkcode contactNo} entries are valid for the current
   * collision. The array is initialized with two vectors because the solver
   * supports at most two contact points for a manifold.
   *
   * @type {Vector2[]}
   */
  contactPoints = [new Vector2(), new Vector2()]

  /**
   * Number of valid entries in {@linkcode contactPoints}.
   *
   * The narrowphase sets this to `1` for circle contacts or clamps the
   * support-point count to the range `0`–`2` for other shapes.
   *
   * @type {number}
   */
  contactNo = 0
}

/**
 * Stores the linear and angular coefficients for one contact constraint.
 *
 * A {@linkcode CollisionManifold} keeps separate Jacobians for the normal and
 * tangent constraints at each contact point. Construct one with optional
 * coefficients or update an existing one with {@linkcode set}; vector inputs
 * are copied into the Jacobian's own vectors.
 *
 * @example
 * ```js
 * import { Jacobian } from '@wimaengine/narrowphase'
 *
 * const constraint = new Jacobian(normalA, normalB, angularA, angularB)
 * constraint.set(tangentA, tangentB, tangentAngularA, tangentAngularB)
 * ```
 */
export class Jacobian {

  /**
   * Linear constraint contribution for body A.
   *
   * @type {Vector2}
   */
  va = new Vector2()

  /**
   * Angular constraint contribution for body A.
   *
   * @type {number}
   */
  wa = 0

  /**
   * Linear constraint contribution for body B.
   *
   * @type {Vector2}
   */
  vb = new Vector2()

  /**
   * Angular constraint contribution for body B.
   *
   * @type {number}
   */
  wb = 0

  /**
   * Creates a Jacobian and applies the supplied coefficients.
   *
   * The vector arguments are copied into the new Jacobian. Angular arguments
   * are applied by {@linkcode set}; omitted or zero angular values leave the
   * initialized value unchanged.
   *
   * @param {Vector2} [va] - Linear contribution for body A.
   * @param {Vector2} [vb] - Linear contribution for body B.
   * @param {number} [wa] - Angular contribution for body A.
   * @param {number} [wb] - Angular contribution for body B.
   */
  constructor(va, vb, wa, wb) {
    this.set(va, vb, wa, wb)
  }

  /**
   * Updates this Jacobian in place.
   *
   * Truthy vector arguments are copied into {@linkcode va} and {@linkcode vb}.
   * Truthy angular arguments replace {@linkcode wa} and {@linkcode wb}; omitted or
   * zero angular arguments leave their current values unchanged.
   *
   * @param {Vector2} [va] - New linear contribution for body A.
   * @param {Vector2} [vb] - New linear contribution for body B.
   * @param {number} [wa] - New angular contribution for body A.
   * @param {number} [wb] - New angular contribution for body B.
   * @returns {void}
   */
  set(va, vb, wa, wb) {
    if (va) Vector2.copy(va, this.va)
    if (vb) Vector2.copy(vb, this.vb)
    if (wa) this.wa = wa
    if (wb) this.wb = wb
  }
}
