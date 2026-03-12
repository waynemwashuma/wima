import { ClosestPoint2D } from '../../../core/index.js'
import { Vector2, clamp, sqrt } from '../../../../math/index.js'

/**
 * Get closest point on a segment AB to point P.
 * @param {Vector2} a 
 * @param {Vector2} b 
 * @param {Vector2} p 
 * @returns {Vector2}
 */
export function closestPointOnSegment2D(a, b, p) {
  const ab = Vector2.subtract(b, a)
  const ap = Vector2.subtract(p, a)
  const length = Vector2.magnitude(ab)
  const direction = ab.divideScalar(length)
  const t = clamp(Vector2.dot(ap, direction) / length, 0, 1)
  const delta = Vector2.multiplyScalar(ab, t * length)

  return Vector2.add(a, delta)
}

/**
 * Closest points between two segments in 2D.
 * @param {Vector2} a0
 * @param {Vector2} a1
 * @param {Vector2} b0
 * @param {Vector2} b1
 * @returns {{pA: Vector2, pB: Vector2}}
 */
export function closestPointsSegmentSegment(a0, a1, b0, b1) {
  const d1 = Vector2.subtract(a1, a0)
  const d2 = Vector2.subtract(b1, b0)
  const r = Vector2.subtract(a0, b0)

  const a = Vector2.dot(d1, d1)
  const e = Vector2.dot(d2, d2)
  const f = Vector2.dot(d2, r)

  const EPS = 1e-8
  let s = 0
  let t = 0

  if (a <= EPS && e <= EPS) {
    s = 0
    t = 0
  } else if (a <= EPS) {
    s = 0
    t = clamp(f / e, 0, 1)
  } else {
    const c = Vector2.dot(d1, r)
    if (e <= EPS) {
      t = 0
      s = clamp(-c / a, 0, 1)
    } else {
      const b = Vector2.dot(d1, d2)
      const denom = a * e - b * b

      if (Math.abs(denom) > EPS) {
        s = clamp((b * f - c * e) / denom, 0, 1)
      } else {
        s = 0
      }

      const tNom = b * s + f
      if (tNom < 0) {
        t = 0
        s = clamp(-c / a, 0, 1)
      } else if (tNom > e) {
        t = 1
        s = clamp((b - c) / a, 0, 1)
      } else {
        t = tNom / e
      }
    }
  }

  const pA = Vector2.add(a0, Vector2.multiplyScalar(d1, s))
  const pB = Vector2.add(b0, Vector2.multiplyScalar(d2, t))

  return { pA, pB }
}

/**
 * Get closest points between two convex vertex polygons.
 * @param {Vector2[]} verticesA 
 * @param {Vector2[]} verticesB 
 * @returns {ClosestPoint2D[]}
 */
export function getClosestPoints(verticesA, verticesB) {
  const { length: lengthA } = verticesA
  const { length: lengthB } = verticesB
  let minDistSq = Infinity
  let closestA = null
  let closestB = null
  
  if (lengthA < 2 || lengthB < 2) {
    return []
  }
  
  for (let i = 0, j = lengthA - 1; i < lengthA; j = i, i++) {
    const a1 = verticesA[j]
    const a2 = verticesA[i]
    
    for (let k = 0, l = lengthB - 1; k < lengthB; l = k, k++) {
      const b1 = verticesB[l]
      const b2 = verticesB[k]
      
      // todo: Unroll this
      for (const bv of [b1, b2]) {
        const pa = closestPointOnSegment2D(a1, a2, bv)
        const distSq = Vector2.distanceToSquared(pa, bv)
        
        if (distSq < minDistSq) {
          minDistSq = distSq
          closestA = pa
          closestB = bv
        }
      }
      
      // PERF: Unroll this
      for (const av of [a1, a2]) {
        const pb = closestPointOnSegment2D(b1, b2, av)
        const distSq = Vector2.distanceToSquared(pb, av)
        
        if (distSq < minDistSq) {
          minDistSq = distSq
          closestA = av
          closestB = pb
        }
      }
    }
  }
  
  return [new ClosestPoint2D(closestA, closestB, sqrt(minDistSq))]
}

/**
 * @param {Vector2} p
 * @param {Vector2} a
 * @param {Vector2} b
 * @param {Vector2} c
 */
export function closestPointOnTriangle(p, a, b, c) {
  // Standard Voronoi-region solution
  const ab = Vector2.subtract(b, a)
  const ac = Vector2.subtract(c, a)
  const ap = Vector2.subtract(p, a)

  const d1 = Vector2.dot(ab, ap)
  const d2 = Vector2.dot(ac, ap)
  if (d1 <= 0 && d2 <= 0) return a.clone()

  const bp = Vector2.subtract(p, b)
  const d3 = Vector2.dot(ab, bp)
  const d4 = Vector2.dot(ac, bp)
  if (d3 >= 0 && d4 <= d3) return b.clone()

  const vc = d1 * d4 - d3 * d2
  if (vc <= 0 && d1 >= 0 && d3 <= 0) {
    const v = d1 / (d1 - d3)
    return Vector2.add(a, Vector2.multiplyScalar(ab, v))
  }

  const cp = Vector2.subtract(p, c)
  const d5 = Vector2.dot(ab, cp)
  const d6 = Vector2.dot(ac, cp)
  if (d6 >= 0 && d5 <= d6) return c.clone()

  const vb = d5 * d2 - d1 * d6
  if (vb <= 0 && d2 >= 0 && d6 <= 0) {
    const w = d2 / (d2 - d6)
    return Vector2.add(a, Vector2.multiplyScalar(ac, w))
  }

  const va = d3 * d6 - d5 * d4
  if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {
    const w = (d4 - d3) / ((d4 - d3) + (d5 - d6))
    const bc = Vector2.subtract(c, b)
    return Vector2.add(b, Vector2.multiplyScalar(bc, w))
  }

  const denom = 1 / (va + vb + vc)
  const v = vb * denom
  const w = vc * denom
  return Vector2.add(
    a,
    Vector2.add(
      Vector2.multiplyScalar(ab, v),
      Vector2.multiplyScalar(ac, w)
    )
  )
}

/**
 * Closest point on an OBB to a point
 * OBB is centered at origin, axis-aligned in its local space
 *
 * @param {Vector2} p
 * @param {Vector2} halfExtents
 * @returns {Vector2}
 */
export function closestPointPointAABB(p, halfExtents) {
  const q = p.clone()

  const clampedX = Math.max(-halfExtents.x, Math.min(halfExtents.x, q.x))
  const clampedY = Math.max(-halfExtents.y, Math.min(halfExtents.y, q.y))

  return new Vector2(clampedX, clampedY)
}
