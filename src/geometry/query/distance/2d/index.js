import { ClosestPoint2D } from '../../../core/index.js'
import { Vector2, clamp, Affine2 } from '../../../../math/index.js'

/**
 * Get closest point on a segment AB to point P.
 * @param {Vector2} a 
 * @param {Vector2} b 
 * @param {Vector2} p 
 * @returns {Vector2}
 */
export function closestPointOn2DSegment(a, b, p) {
  const ab = Vector2.subtract(b, a)
  const ap = Vector2.subtract(p, a)
  const length = Vector2.magnitude(ab)
  const direction = ab.divideScalar(length)
  const t = clamp(Vector2.dot(ap, direction) / length, 0, 1)
  const delta = Vector2.multiplyScalar(ab, t * length)
  return Vector2.add(a, delta)
}

/**
 * Get closest points between two convex polygons.
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
  
  if(lengthA < 2 || lengthB < 2){
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
        const pa = closestPointOn2DSegment(a1, a2, bv)
        const distSq = Vector2.distanceToSquared(pa, bv)

        if (distSq < minDistSq) {
          minDistSq = distSq
          closestA = pa
          closestB = bv
        }
      }
      
      // todo: Unroll this
      for (const av of [a1, a2]) {
        const pb = closestPointOn2DSegment(b1, b2, av)
        const distSq = Vector2.distanceToSquared(pb, av)

        if (distSq < minDistSq) {
          minDistSq = distSq
          closestA = av
          closestB = pb
        }
      }
    }
  }
  
  return [new ClosestPoint2D(closestA, closestB, minDistSq)]
}