import { Contact2D, SAT2d, sat2dCircle } from '../../../core/index.js'
import { Circle, Line2, Rectangle, ConvexPolygon, Triangle } from '../../../shapes/index.js'
import { Vector2, clamp, Affine2 } from '../../../../math/index.js'
import { getNearVertex } from './utils.js'

/**
 * @param {Rectangle} boxA
 * @param {Rectangle} boxB
 * @param {Affine2} transform
 */
export function rectangleContacts(boxA, boxB, transform,invTransform) {
  const pointsA = boxA.getPoints()
  const pointsB = boxB.getPoints().map((e) => transform.transform(e))
  
  if (pointsA.length < 4 || pointsB.length < 4) {
    throw '`Rectangle` is not properly implemented.'
  }

  const axes = [
    Vector2.subtract(pointsA[0], pointsA[1]).normalize(),
    Vector2.subtract(pointsA[1], pointsA[2]).normalize(),
    Vector2.subtract(pointsB[0], pointsB[1]).normalize(),
    Vector2.subtract(pointsB[1], pointsB[2]).normalize()
  ].map((axis) => Vector2.normal(axis, axis))

  return SAT2d(pointsA, pointsB, axes, transform,invTransform)
}

/**
 * @param {Circle} circle
 * @param {Rectangle} rectangle
 * @param {Affine2} transform
 */
export function circleRectangleContacts(circle, rectangle, transform,invTransform) {
  const points = rectangle.getPoints().map((e) => transform.transform(e.clone()))
  
  const nearestIndex = getNearVertex(Vector2.Zero, points)
  const axis = Vector2.copy(
    points[nearestIndex]
  )
  const length = axis.magnitudeSquared()

  if (length === 0) {
    axis.set(transform.x, transform.y)
  }
  
  axis.normalize()
  const axes = [
    axis,
    Vector2.normal(Vector2.subtract(points[0], points[1])).normalize(),
    Vector2.normal(Vector2.subtract(points[1], points[2])).normalize()
  ]

  return sat2dCircle(circle, points, axes, transform,invTransform)
}