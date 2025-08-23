import { ClosestPoint2D } from '../../../core/index.js'
import { Circle, Line2 } from '../../../shapes/index.js'
import { Vector2, clamp, Affine2 } from '../../../../math/index.js'

export function getCircleClosestPoint(a, b, transformAB) {
  const dx = transformAB.x
  const dy = transformAB.y
  const distSquared = dx * dx + dy * dy
  const radiiSum = a.radius + b.radius
  const distance = Math.sqrt(distSquared)
  const normal1 = distance !== 0 ? new Vector2(dx / distance, dy / distance) : Vector2.Y.clone()
  const normal2 = Affine2.transformWithoutTranslation(transformAB.clone().invert(), normal1).reverse()
  
  const penetration = distance - radiiSum
  
  return new ClosestPoint2D(
    Vector2.multiplyScalar(normal1, a.radius),
    Vector2.multiplyScalar(normal2, b.radius),
    penetration
  )
}