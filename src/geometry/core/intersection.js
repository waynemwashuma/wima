import { Vector2 } from '../../math/index.js'

export class Intersection2D {

  /**
   * @readonly
   * @type {Vector2}
   */
  point

  /**
   * @readonly
   * @type {Vector2}
   */
  normal

  /**
   * @readonly
   * @type {number}
   */
  distance

  /**
   * @param {Vector2} point
   * @param {Vector2} normal
   * @param {number} distance
   */
  constructor(point, normal, distance){
    this.point = point
    this.normal = normal
    this.distance = distance
  }
  
  
}