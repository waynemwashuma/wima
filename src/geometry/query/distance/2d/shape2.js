import { Contact2D, SAT2d, sat2dCircle } from '../../../core/index.js'
import { Circle, Capsule, Line2, Rectangle, ConvexPolygon, Triangle, Shape2 } from '../../../shapes/index.js'
import { Vector2, clamp, Affine2 } from '../../../../math/index.js'
import {getCircleClosestPoint} from './circle.js';
export function getShape2ClosestPoints(shapeA, shapeB, transformA, transformB) {
  const transform = Affine2.invert(transformA).multiply(transformB)
  
  if(shapeA instanceof Circle && shapeB instanceof Circle) {
    return [getCircleClosestPoint(shapeA,shapeB,transform)]
  }
  return undefined
}