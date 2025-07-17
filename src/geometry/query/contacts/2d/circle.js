import { Contact2D } from '../../../core/index.js'
import { Circle, Line2 } from '../../../shapes/index.js'
import { Vector2, clamp, Affine2 } from '../../../../math/index.js'

/**
 * @param {Circle} a
 * @param {Circle} b
 * @param {Affine2} transformAB
 */
export function circleContact(a, b, transformAB) {
  const dx = transformAB.x
  const dy = transformAB.y
  const distSquared = dx * dx + dy * dy
  const radiiSum = a.radius + b.radius
  const distance = Math.sqrt(distSquared)

  if (distance >= radiiSum) {
    return undefined
  }
  
  let normalX = dx / distance
  let normalY = dy / distance

  if (distance === 0) {
    normalX = 0
    normalY = 1
  }
  
  const penetration = radiiSum - distance

  return new Contact2D(
    new Vector2(
      normalX * a.radius,
      normalY * a.radius
    ),
    new Vector2(
      normalX * (a.radius - penetration),
      normalY * (a.radius - penetration)
    ),
    new Vector2(normalX, normalY),
    new Vector2(-normalX, -normalY),
    penetration
  )
}

/**
 * @param {Line2} line
 * @param {Circle} circle
 * @param {Affine2} transformAB
 */
export function lineCircleContact(line, circle, transformAB) {
  const lineStart = Vector2.set(line.halfLength, 0)
  const lineEnd = Vector2.set(-line.halfLength, 0)
  const cx = transformAB.x
  const cy = transformAB.y
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
  
  let nx = distX / distance
  let ny = distY / distance
  
  if (distance === 0) {
    nx = 0
    ny = 1
  }
  
  return new Contact2D(
    new Vector2(closestX, closestY),
    new Vector2(
      cx - nx * r,
      cy - ny * r
    ),
    new Vector2(nx, ny),
    new Vector2(-nx, -ny),
    penetration
  )
}