import { ClosestPoint2D } from '../../../core/index.js'
import { Vector2, Affine2 } from '../../../../math/index.js'
import { Circle } from '../../../shapes/index.js'

/**
 * @param {Circle} circleA
 * @param {Circle} circleB
 * @param {Affine2} transform
 */
export function getCircleClosestPoint(circleA, circleB, transform) {
  const dx = transform.x
  const dy = transform.y
  const distSquared = dx * dx + dy * dy
  const radiiSum = circleA.radius + circleB.radius
  const distance = Math.sqrt(distSquared)
  const normal1 = distance !== 0 ? new Vector2(dx / distance, dy / distance) : Vector2.Y.clone()
  const normal2 = Affine2.transformWithoutTranslation(transform.clone().invert(), normal1).reverse()
  
  const penetration = distance - radiiSum
  
  return new ClosestPoint2D(
    Vector2.multiplyScalar(normal1, circleA.radius),
    Vector2.multiplyScalar(normal2, circleB.radius),
    penetration
  )
}

