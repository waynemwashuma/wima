import { Vector2 } from '@wimaengine/math'
import { PhysicsProperties, Collider2D } from '../components'

/**
 * Checks whether two bodies should proceed to narrowphase collision testing.
 *
 * Both bodies must pass the bidirectional collision filter: `propA.group` must
 * overlap `propB.mask`, and `propB.group` must overlap `propA.mask`. At least
 * one body must have a non-zero inverse mass, and a pair is skipped when both
 * bodies are sleeping.
 *
 * The helper reads the values from {@linkcode PhysicsProperties} but does not
 * change either object or inspect the bodies' {@linkcode Collider2D} shapes. The
 * `group` and `mask` fields are expected to be compatible BigInt bit fields.
 *
 * @example
 * ```js
 * import { PhysicsProperties, canCollide } from '@wimaengine/narrowphase'
 *
 * const dynamic = new PhysicsProperties()
 * dynamic.invmass = 1
 * const staticBody = new PhysicsProperties()
 *
 * canCollide(dynamic, staticBody) // true
 * ```
 *
 * @param {PhysicsProperties} propA - Collision and mass properties for the first body.
 * @param {PhysicsProperties} propB - Collision and mass properties for the second body.
 * @returns {boolean} `true` when the pair passes mass, filter, and sleeping checks.
 */
export function canCollide(
  propA,
  propB
) {
  if (
    !propA.invmass &&
    !propB.invmass
  ) return false
  if (
    !(propA.group & propB.mask) ||
    !(propB.group & propA.mask)
  ) return false
  if (
    propA.sleep &&
    propB.sleep
  ) return false

  return true
}

/**
 * Tests whether a point is inside or on the boundary of a circle.
 *
 * The distance is compared as squared values, so the helper avoids taking a
 * square root. A point exactly on the circumference is contained. A radius of
 * `0` contains only the center, while a negative radius is not rejected and
 * behaves like the corresponding positive radius because it is squared.
 * The vectors are read but not modified.
 *
 * @example
 * ```js
 * import { Vector2 } from '@wimaengine/math'
 * import { circleContains } from '@wimaengine/narrowphase'
 *
 * const center = new Vector2(0, 0)
 * circleContains(center, 2, new Vector2(1, 1)) // true
 * circleContains(center, 2, new Vector2(2, 1)) // false
 * ```
 *
 * @param {Vector2} position - Circle center.
 * @param {number} radius - Circle radius.
 * @param {Vector2} point - Point to test.
 * @returns {boolean} `true` when the point's squared distance from the center is at most `radius * radius`.
 */
export function circleContains(position, radius, point) {
  const dx = point.x - position.x,
    dy = point.y - position.y

  if (dx * dx + dy * dy > radius * radius) return false

  return true
}

/**
 * Tests a point against a convex polygon represented by ordered vertices.
 *
 * The engine's polygon colliders use clockwise winding, so the point must be
 * on or to the right of every directed edge. Points on an edge are contained.
 * The helper returns `false` for fewer than two vertices and does not mutate
 * the input array. It is a half-plane test rather than a general polygon
 * algorithm: concave polygons and counterclockwise vertex order are not valid
 * inputs for reliable containment results.
 *
 * Use the current vertices from a {@linkcode Collider2D}, such as the clockwise
 * vertices created by {@linkcode Collider2D.rectangle}.
 *
 * @example
 * ```js
 * import { Vector2 } from '@wimaengine/math'
 * import { Collider2D, verticesContain } from '@wimaengine/narrowphase'
 *
 * const square = Collider2D.rectangle(2, 2)
 * verticesContain(square.vertices, new Vector2(0, 0)) // true
 * verticesContain(square.vertices, new Vector2(2, 0)) // false
 * ```
 *
 * @param {Vector2[]} vertices - Convex polygon vertices in clockwise order.
 * @param {Vector2} point - Point to test.
 * @returns {boolean} `true` when the point is inside the polygon or on one of its edges.
 */
export function verticesContain(vertices, point) {
  const pointX = point.x,
    pointY = point.y,
    { length } = vertices
  let previous = vertices[length - 1],
    current

  if (length < 2) return false

  for (let i = 0; i < length; i++) {
    current = vertices[i]

    if ((pointX - previous.x) * (current.y - previous.y) +
      (pointY - previous.y) * (previous.x - current.x) < 0) {
      return false
    }

    previous = current
  }

  return true
}

/**
 * Tests a point against the current representation of a {@linkcode Collider2D}.
 *
 * A shape whose type is `Collider2D.Circle` is interpreted using the engine's
 * circle encoding: `shape.vertices[0]` is the center and
 * `shape.vertices[1].x` is the radius. Every other type is treated as a
 * polygon and passed to {@linkcode verticesContain}, which expects clockwise,
 * convex vertices. Circle and polygon boundaries are both considered
 * contained.
 *
 * The helper reads `type` and `vertices` only. It does not update the collider,
 * inspect its `geometry` or `angle`, or validate a manually assembled shape.
 *
 * @example
 * ```js
 * import { Vector2 } from '@wimaengine/math'
 * import { Collider2D, shapeContains } from '@wimaengine/narrowphase'
 *
 * const circle = Collider2D.circle(2)
 * shapeContains(circle, new Vector2(1, 1)) // true
 * ```
 *
 * @param {Collider2D} shape - Collider whose current shape is tested.
 * @param {Vector2} point - Point to test.
 * @returns {boolean} `true` when the point is inside or on the boundary of the collider.
 */
export function shapeContains(shape, point) {
  if (shape.type === Collider2D.Circle) return circleContains(shape.vertices[0], shape.vertices[1].x, point)

  return verticesContain(shape.vertices, point)
}

/**
 * Creates the stable string key used for an unordered entity pair.
 *
 * Numeric IDs are written with the larger value first and separated by a
 * space, so swapping the arguments produces the same key. Callers can use
 * this key to track an unordered entity pair without depending on argument
 * order.
 * Equal IDs are allowed and produce a repeated value, such as `"4 4"`.
 * Inputs are interpolated into a string without validation or entity lookup;
 * callers should pass the numeric entity indices used by the engine.
 *
 * @example
 * ```js
 * import { generatePairID } from '@wimaengine/narrowphase'
 *
 * generatePairID(12, 3) === generatePairID(3, 12) // true
 * generatePairID(12, 3) // "12 3"
 * ```
 *
 * @param {number} idA - Numeric index for the first entity.
 * @param {number} idB - Numeric index for the second entity.
 * @returns {string} The pair key with the larger ID first.
 */
export function generatePairID(idA, idB) {
  return idA > idB ? `${idA} ${idB}` : `${idB} ${idA}`
}
