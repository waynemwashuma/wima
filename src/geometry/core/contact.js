import { Vector2 } from '../../math/index.js'

export class Contact2D {

  /**
   * @readonly
   * @type {Vector2}
   */
  pointA

  /**
   * @readonly
   * @type {Vector2}
   */
  pointB

  /**
   * @readonly
   * @type {Vector2}
   */
  normalA

  /**
   * @readonly
   * @type {Vector2}
   */
  normalB

  /**
   * @readonly
   * @type {Vector2}
   */
  tangentA

  /**
   * @readonly
   * @type {Vector2}
   */
  tangentB

  /**
   * @readonly
   * @type {number}
   */
  depth

  /**
   * @param {Vector2} pointA 
   * @param {Vector2} pointB 
   * @param {Vector2} normalA 
   * @param {Vector2} normalB 
   * @param {number} depth 
   */
  constructor(pointA, pointB, normalA, normalB, depth) {
    this.pointA = pointA
    this.pointB = pointB
    this.normalA = normalA
    this.normalB = normalB
    this.depth = depth
  }
}