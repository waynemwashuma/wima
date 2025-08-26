import { Circle, Capsule, Line2, Rectangle, ConvexPolygon, Triangle, Shape2 } from '../../../shapes/index.js'
import { Affine2 } from '../../../../math/index.js'
import { getCircleClosestPoint } from './circle.js'


/**
 * @param {Shape2} shapeA
 * @param {Shape2} shapeB
 * @param {Affine2} transformA
 * @param {Affine2} transformB
 */
export function getShape2ClosestPoints(shapeA, shapeB, transformA, transformB) {
  const transform = Affine2.invert(transformA).multiply(transformB)
  
  if(shapeA instanceof Circle && shapeB instanceof Circle) {
    return [getCircleClosestPoint(shapeA, shapeB, transform)]
  }

  return undefined
}