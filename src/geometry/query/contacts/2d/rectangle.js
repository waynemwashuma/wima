import { Contact2D, SAT2d, sat2dCircle } from '../../../core/index.js'
import { Circle, Line2, Rectangle, ConvexPolygon, Triangle } from '../../../shapes/index.js'
import { Vector2, clamp, Affine2 } from '../../../../math/index.js'
import { getNearVertex } from './utils.js'

/**
 * @param {Rectangle} boxA
 * @param {Rectangle} boxB
 * @param {Affine2} transformAB
 */
export function rectangleContacts(boxA, boxB, transformAB) {
  const pointsA = boxA.getPoints()
  const pointsB = boxB.getPoints().map((e) => transformAB.transform(e))
  
  if (pointsA.length < 4 || pointsB.length < 4) {
    throw '`Rectangle` is not properly implemented.'
  }

  const axes = [
    Vector2.subtract(pointsA[0], pointsA[1]).normalize(),
    Vector2.subtract(pointsA[1], pointsA[2]).normalize(),
    Vector2.subtract(pointsB[0], pointsB[1]).normalize(),
    Vector2.subtract(pointsB[1], pointsB[2]).normalize()
  ].map((axis) => Vector2.normal(axis, axis))

  return SAT2d(pointsA, pointsB, axes, transformAB)
}

/**
 * @param {Circle} circle
 * @param {Rectangle} rectangle
 * @param {Affine2} transformAB
 */
export function circleRectangleContacts(circle, rectangle, transformAB) {
  const pointsB = rectangle.getPoints().map((e) => transformAB.transform(e.clone()))
  
  const nearestIndex = getNearVertex(Vector2.Zero, pointsB)
  const axis = Vector2.copy(
    pointsB[nearestIndex]
  )
  const length = axis.magnitudeSquared()

  if (length === 0) {
    axis.set(transformAB.x, transformAB.y)
  }
  
  axis.normalize()
  const axes = [
    axis,
    Vector2.normal(Vector2.subtract(pointsB[0], pointsB[1])).normalize(),
    Vector2.normal(Vector2.subtract(pointsB[1], pointsB[2])).normalize()
  ]

  return sat2dCircle(circle, pointsB, axes, transformAB)
}