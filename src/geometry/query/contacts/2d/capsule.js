import { Contact2D } from '../../../core/index.js'
import { Capsule, Circle } from '../../../shapes/index.js'
import { Vector2, sqrt, clamp, Affine2 } from '../../../../math/index.js'
import { getClosestPoints } from '../../distance/index.js'


/**
 * @param {Capsule} capsuleA
 * @param {Capsule} capsuleB
 * @param {Affine2} transform
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
    const axis = Vector2.subtract(point.pointB, point.pointA).normalize()
    const axisReverse = axis.clone().reverse()
    const distance = radiusSum - point.distance
    
    if (distance < 0) {
      return undefined
    }
    const normalA = axis.clone()
    const normalB = Affine2.transformWithoutTranslation(invTransform, axis).reverse()
    const pointB = invTransform.transform(point.pointB)
    return new Contact2D(
      Vector2.multiplyScalar(normalA, capsuleA.radius).add(point.pointA),
      Vector2.multiplyScalar(normalB, capsuleB.radius).add(pointB),
      normalA,
      normalB,
      distance
    )
    return new Contact2D(
      Vector2.multiplyScalar(axis, capsuleA.radius).add(point.pointA),
      Vector2.multiplyScalar(axis, -capsuleB.radius).add(point.pointB),
      axis,
      axisReverse,
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
 */
export function capsuleCircleContact(capsule, circle, transform,invTransform) {
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
  console.log(position)
  return new Contact2D(
    Vector2.multiplyScalar(normalA, capsule.radius).add(closest),
    Vector2.multiplyScalar(normalB, circle.radius),
    normalA,
    normalB,
    penetration
  )
}