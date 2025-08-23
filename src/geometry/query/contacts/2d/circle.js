import { Contact2D } from '../../../core/index.js'
import { Circle, Line2 } from '../../../shapes/index.js'
import { Vector2, clamp, Affine2 } from '../../../../math/index.js'

/**
 * @param {Circle} a
 * @param {Circle} b
 * @param {Affine2} transform
 */
export function circleContact(a, b, transform, invTransform) {
  const dx = transform.x
  const dy = transform.y
  const distSquared = dx * dx + dy * dy
  const radiiSum = a.radius + b.radius
  const distance = Math.sqrt(distSquared)
  
  if (distance >= radiiSum) {
    return undefined
  }
  
  const penetration = radiiSum - distance
  const normalA = distance !== 0 ? new Vector2(dx / distance, dy / distance) : Vector2.Y.clone()
  const normalB = Affine2.transformWithoutTranslation(invTransform, normalA).reverse()
  
  return new Contact2D(
    Vector2.multiplyScalar(normalA, a.radius),
    Vector2.multiplyScalar(normalB, b.radius),
    normalA,
    normalB,
    penetration
  )
}

/**
 * @param {Line2} line
 * @param {Circle} circle
 * @param {Affine2} transform
 */
export function lineCircleContact(line, circle, transform,invTransform) {
  const lineStart = Vector2.set(line.halfLength, 0)
  const lineEnd = Vector2.set(-line.halfLength, 0)
  const cx = transform.x
  const cy = transform.y
  const r = circle.radius
  
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y
  const lenSq = dx * dx + dy * dy
  
  let t = ((cx - lineStart.x) * dx + (cy - lineStart.y) * dy) / lenSq
  
  t = clamp(t, 0, 1)
  
  const closestX = lineStart.x + t * dx
  const closestY = lineStart.y + t * dy
  
  const distX = cx - closestX
  const distY = cy - closestY
  const distSq = distX * distX + distY * distY
  
  if (distSq > r * r) {
    return undefined
  }
  
  const distance = Math.sqrt(distSq)
  const penetration = r - distance
  const normalA = distance !== 0 ? new Vector2(distX / distance, distY / distance) : Vector2.Y.clone()
  const normalB = Affine2.transformWithoutTranslation(invTransform, normalA).reverse()
  
  return new Contact2D(
    new Vector2(closestX,closestY),
    Vector2.multiplyScalar(normalB, circle.radius),
    normalA,
    normalB,
    penetration
  )
}