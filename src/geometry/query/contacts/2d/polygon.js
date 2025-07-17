import { Contact2D, SAT2d, sat2dCircle } from '../../../core/index.js'
import { Circle, Line2, Rectangle, ConvexPolygon, Triangle } from '../../../shapes/index.js'
import { Vector2, clamp, Affine2 } from '../../../../math/index.js'
import { getNearVertex } from './utils.js'

/**
 * @param {ConvexPolygon} boxA
 * @param {ConvexPolygon} boxB
 * @param {Affine2} transformAB
 */
export function polygonContacts(boxA, boxB, transformAB) {
  const pointsA = boxA.points.map((e) => e.clone())
  const pointsB = boxB.points.map((e) => transformAB.transform(e.clone()))
  
  const axes = [
    ...boxA.normals.map((e) => e.clone()),
    ...boxB.normals.map((e) => Affine2.transformWithoutTranslation(transformAB, e))
  ]

  return SAT2d(pointsA, pointsB, axes, transformAB)
}

/**
 * @param {Circle} circle
 * @param {ConvexPolygon} polygon
 * @param {Affine2} transformAB
 */
export function circlePolygonContact(circle, polygon, transformAB) {
  const pointsB = polygon.points.map((e) => transformAB.transform(e.clone()))
  
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
    ...polygon.normals.map((e) => Affine2.transformWithoutTranslation(transformAB, e))
  ]

  return sat2dCircle(circle, pointsB, axes, transformAB)
}

/**
 * @param {ConvexPolygon} boxA
 * @param {Rectangle} boxB
 * @param {Affine2} transformAB
 */
export function polygonRectangleContacts(boxA, boxB, transformAB) {
  const pointsA = boxA.points.map((e) => e.clone())
  const pointsB = boxB.getPoints().map((e) => transformAB.transform(e))
  
  if (pointsB.length < 3) {
    return undefined
  }

  const axes = [
    ...boxA.normals.map((e) => e.clone()),
    Vector2.normal(Vector2.subtract(pointsB[0], pointsB[1])).normalize(),
    Vector2.normal(Vector2.subtract(pointsB[1], pointsB[2])).normalize()
  ]

  return SAT2d(pointsA, pointsB, axes, transformAB)
}

/**
 * @param {ConvexPolygon} boxA
 * @param {Triangle} boxB
 * @param {Affine2} transformAB
 */
export function polygonTriangleContacts(boxA, boxB, transformAB) {
  const pointsA = boxA.points.map((e) => e.clone())
  const pointsB = boxB.getPoints().map((e) => transformAB.transform(e))

  if (pointsA.length < 3) {
    return undefined
  }
  
  const axes = [
    ...boxA.normals.map((e) => e.clone()),
    Vector2.normal(Vector2.subtract(pointsB[0], pointsB[1])).normalize(),
    Vector2.normal(Vector2.subtract(pointsB[1], pointsB[2])).normalize(),
    Vector2.normal(Vector2.subtract(pointsB[2], pointsB[0])).normalize()
  ]

  return SAT2d(pointsA, pointsB, axes, transformAB)
}