import { Vector2 } from '../../math/index.js'

export class ClosestPoint2D {

  /**
   * @type {number}
   */
  distanceSquared

  /**
   * @type {Vector2}
   */
  pointA

  /**
   * @type {Vector2}
   */
  pointB

  /**
   * @param {Vector2} pointA
   * @param {Vector2} pointB
   * @param {number} distanceSquared
   */
  constructor(pointA, pointB, distanceSquared) {
    this.pointA = pointA
    this.pointB = pointB
    this.distanceSquared = distanceSquared
  }
}