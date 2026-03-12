import { Contact2D } from '../../../core/index.js'
import { Capsule, Circle, ConvexPolygon, Rectangle, Triangle } from '../../../shapes/index.js'
import { Vector2, clamp, Affine2 } from '../../../../math/index.js'
import {
  getClosestPoints,
  closestPointOnTriangle,
  closestPointsSegmentSegment,
  closestPointOnSegment2D
} from '../../closestPoint/index.js'

/**
 * @param {Capsule} capsuleA
 * @param {Capsule} capsuleB
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function capsuleContacts(capsuleA, capsuleB, transform, invTransform) {
  const pointsA = [
    new Vector2(0, capsuleA.halfHeight),
    new Vector2(0, -capsuleA.halfHeight)
  ]
  const pointsB = [
    transform.transform(new Vector2(0, capsuleB.halfHeight)),
    transform.transform(new Vector2(0, -capsuleB.halfHeight))
  ]
  const radiusSum = capsuleA.radius + capsuleB.radius
  const closest = getClosestPoints(pointsA, pointsB)
  const contacts = closest.map((point) => {
    const distance = radiusSum - point.distance

    if (distance < 0) {
      return undefined
    }

    const normalA = Vector2.subtract(point.pointB, point.pointA).normalize()
    const normalB = Affine2.transformWithoutTranslation(invTransform, normalA).reverse()
    const pointB = invTransform.transform(point.pointB)

    return new Contact2D(
      Vector2.multiplyScalar(normalA, capsuleA.radius).add(point.pointA),
      Vector2.multiplyScalar(normalB, capsuleB.radius).add(pointB),
      normalA,
      normalB,
      distance
    )
  }).filter((e) => e !== undefined)

  if (!contacts.length) {
    return undefined
  }

  return contacts
}

/**
 * @param {Capsule} capsule
 * @param {Circle} circle
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function capsuleCircleContact(capsule, circle, transform, invTransform) {
  const position = new Vector2(
    transform.x,
    transform.y
  )
  const lineStart = new Vector2(0, capsule.halfHeight)
  const lineEnd = new Vector2(0, -capsule.halfHeight)

  const radiusSum = circle.radius + capsule.radius
  const l1 = Vector2.subtract(lineEnd, lineStart)
  const l2 = Vector2.subtract(position, lineStart)
  const lenSq = l1.magnitudeSquared()
  const t = clamp(Vector2.dot(l1, l2) / lenSq, 0, 1)
  const closest = Vector2.multiplyScalar(l1, t).add(lineStart)
  const dist = Vector2.subtract(position, closest)
  const distSq = dist.magnitudeSquared()

  if (distSq > radiusSum * radiusSum) {
    return undefined
  }

  const distance = Math.sqrt(distSq)
  const penetration = radiusSum - distance

  const normalA = distance !== 0 ? Vector2.divideScalar(dist, distance) : Vector2.Y.clone()
  const normalB = Affine2.transformWithoutTranslation(invTransform, normalA).reverse()

  return new Contact2D(
    Vector2.multiplyScalar(normalA, capsule.radius).add(closest),
    Vector2.multiplyScalar(normalB, circle.radius),
    normalA,
    normalB,
    penetration
  )
}

/**
 * @param {Capsule} a   // body A
 * @param {Rectangle} b // body B (OBB)
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function capsuleRectangleContact(a, b, transform, invTransform) {
  // --- Step 1: capsule segment endpoints in B local space ---
  const a0 = new Vector2(0, a.halfHeight)
  const a1 = new Vector2(0, -a.halfHeight)
  const a0B = Affine2.transform(invTransform, a0)
  const a1B = Affine2.transform(invTransform, a1)

  // --- Step 2: closest point between segment and OBB (in B space) ---
  const segDir = Vector2.subtract(a1B, a0B)
  const segLenSq = segDir.magnitudeSquared()

  let t = 0
  if (segLenSq > 0) {
    t = Vector2.dot(Vector2.multiplyScalar(a0B, -1), segDir) / segLenSq
    t = Math.max(0, Math.min(1, t))
  }

  const closestSegPoint = Vector2.add(a0B, Vector2.multiplyScalar(segDir, t))

  const clamped = new Vector2(
    Math.max(-b.halfWidth, Math.min(b.halfWidth, closestSegPoint.x)),
    Math.max(-b.halfHeight, Math.min(b.halfHeight, closestSegPoint.y))
  )

  const delta = Vector2.subtract(closestSegPoint, clamped)
  const distSq = delta.magnitudeSquared()

  if (distSq > a.radius * a.radius) {
    return undefined
  }

  const distance = Math.sqrt(distSq)
  const penetration = a.radius - distance

  // --- Step 3: normal in B local space ---
  let normalB
  if (distance !== 0) {
    normalB = Vector2.multiplyScalar(delta, 1 / distance)
  } else {
    // fallback: push out along dominant axis
    if (Math.abs(delta.x) > Math.abs(delta.y)) {
      normalB = new Vector2(Math.sign(delta.x), 0)
    } else {
      normalB = new Vector2(0, Math.sign(delta.y) || 1)
    }
  }

  // --- Step 4: contact points ---
  const contactB = clamped
  const contactA_B = Vector2.add(contactB, Vector2.multiplyScalar(normalB, a.radius))

  // convert A contact back to A local space
  const contactA = Affine2.transform(transform, contactA_B)

  // --- Step 5: normals in respective local spaces ---
  const normalA = Affine2.transformWithoutTranslation(transform, normalB)
  normalA.normalize()

  return new Contact2D(
    contactA,                            // A local
    contactB,                            // B local
    normalA,                             // A local (A -> B)
    normalB.clone().reverse(),           // B local (B -> A)
    penetration
  )
}

/**
 * @param {Capsule} a    // body A
 * @param {Triangle} b  // body B
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function capsuleTriangleContact(a, b, transform, invTransform) {
  // --- Step 1: capsule segment endpoints in triangle (B) local space ---
  const a0 = new Vector2(0, a.halfHeight)
  const a1 = new Vector2(0, -a.halfHeight)
  const a0B = Affine2.transform(invTransform, a0)
  const a1B = Affine2.transform(invTransform, a1)

  // --- Step 2: closest points between capsule segment and triangle ---
  let bestDistSq = Infinity
  let bestSegPoint = null
  let bestTriPoint = null
  const [v0, v1, v2] = b.getPoints()

  // Check segment vs triangle interior
  {
    const mid = Vector2.multiplyScalar(Vector2.add(a0B, a1B), 0.5)
    const triClosest = closestPointOnTriangle(mid, v0, v1, v2)
    const segClosest = closestPointOnSegment2D(triClosest, a0B, a1B)

    const d = Vector2.subtract(segClosest, triClosest)
    const dsq = d.magnitudeSquared()
    if (dsq < bestDistSq) {
      bestDistSq = dsq
      bestSegPoint = segClosest
      bestTriPoint = triClosest
    }
  }

  // Check against triangle edges
  const edges = [
    [v0, v1],
    [v1, v2],
    [v2, v0]
  ]

  for (let i = 0; i < 3; i++) {
    const [e0, e1] = edges[i]

    const p0 = closestPointOnSegment2D(e0, a0B, a1B)
    const p1 = closestPointOnSegment2D(e1, a0B, a1B)

    const d0 = Vector2.subtract(p0, e0)
    const d1 = Vector2.subtract(p1, e1)

    const dsq0 = d0.magnitudeSquared()
    const dsq1 = d1.magnitudeSquared()

    if (dsq0 < bestDistSq) {
      bestDistSq = dsq0
      bestSegPoint = p0
      bestTriPoint = e0
    }

    if (dsq1 < bestDistSq) {
      bestDistSq = dsq1
      bestSegPoint = p1
      bestTriPoint = e1
    }
  }

  if (bestDistSq > a.radius * a.radius) {
    return undefined
  }

  const distance = Math.sqrt(bestDistSq)
  const penetration = a.radius - distance

  // --- Step 3: normal in triangle (B) local space ---
  let normalB
  if (distance !== 0) {
    normalB = Vector2.multiplyScalar(
      Vector2.subtract(bestSegPoint, bestTriPoint),
      1 / distance
    )
  } else {
    // fallback: triangle face normal (2D perpendicular)
    const edge = Vector2.subtract(v1, v0)
    normalB = new Vector2(-edge.y, edge.x).normalize()
  }

  // --- Step 4: contact points ---
  const contactB = bestTriPoint
  const contactA_B = Vector2.add(
    contactB,
    Vector2.multiplyScalar(normalB, a.radius)
  )

  const contactA = Affine2.transform(transform, contactA_B)

  // --- Step 5: normals in respective local spaces ---
  const normalA = Affine2.transformWithoutTranslation(transform, normalB)
  normalA.normalize()

  return new Contact2D(
    contactA,                      // A local
    contactB,                      // B local
    normalA,                       // A local (A -> B)
    normalB.clone().reverse(),     // B local (B -> A)
    penetration
  )
}

/**
 * @param {Capsule} a          // body A
 * @param {ConvexPolygon} b   // body B
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function capsuleConvexPolygonContact(a, b, transform, invTransform) {
  // --- Step 1: capsule segment endpoints in polygon (B) local space ---
  const a0 = new Vector2(0, a.halfHeight)
  const a1 = new Vector2(0, -a.halfHeight)
  const a0B = Affine2.transform(invTransform, a0)
  const a1B = Affine2.transform(invTransform, a1)

  let bestDistSq = Infinity
  let bestSegPoint = null
  let bestPolyPoint = null

  const verts = b.getPoints()
  const count = verts.length

  // --- Step 2: check against polygon edges ---
  for (let i = 0; i < count; i++) {
    const v0 = verts[i]
    const v1 = verts[(i + 1) % count]

    const { pA, pB } = closestPointsSegmentSegment(a0B, a1B, v0, v1)
    const d = Vector2.subtract(pA, pB)
    const dsq = d.magnitudeSquared()

    if (dsq < bestDistSq) {
      bestDistSq = dsq
      bestSegPoint = pA
      bestPolyPoint = pB
    }
  }

  // --- Step 3: also test polygon vertices vs capsule segment ---
  for (let i = 0; i < count; i++) {
    const v = verts[i]
    const p = closestPointOnSegment2D(v, a0B, a1B)
    const d = Vector2.subtract(p, v)
    const dsq = d.magnitudeSquared()

    if (dsq < bestDistSq) {
      bestDistSq = dsq
      bestSegPoint = p
      bestPolyPoint = v
    }
  }

  if (bestDistSq > a.radius * a.radius) {
    return undefined
  }

  const distance = Math.sqrt(bestDistSq)
  const penetration = a.radius - distance

  // --- Step 4: normal in polygon (B) local space ---
  let normalB
  if (distance !== 0) {
    normalB = Vector2.multiplyScalar(
      Vector2.subtract(bestSegPoint, bestPolyPoint),
      1 / distance
    )
  } else {
    // fallback: outward normal of closest edge
    const edge = Vector2.subtract(
      verts[1],
      verts[0]
    )
    normalB = new Vector2(-edge.y, edge.x).normalize()
  }

  // --- Step 5: contact points ---
  const contactB = bestPolyPoint
  const contactA_B = Vector2.add(
    contactB,
    Vector2.multiplyScalar(normalB, a.radius)
  )

  const contactA = Affine2.transform(transform, contactA_B)

  // --- Step 6: normals in respective local spaces ---
  const normalA = Affine2.transformWithoutTranslation(transform, normalB)
  normalA.normalize()

  return new Contact2D(
    contactA,                  // capsule local
    contactB,                  // polygon local
    normalA,                   // A -> B
    normalB.clone().reverse(), // B -> A
    penetration
  )
}
