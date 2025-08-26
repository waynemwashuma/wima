import { Affine2, Vector2 } from '../../math/index.js'

export class ClosestPoint2D {

  /**
   * @type {number}
   */
  distance

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
   * @param {number} distance
   */
  constructor(pointA, pointB, distance) {
    this.pointA = pointA
    this.pointB = pointB
    this.distance = distance
  }
  
  clone(){
    return new ClosestPoint2D(this.pointA, this.pointB, this.distance)
  }
  
  /**
   * @param {Affine2} transformA
   * @param {Affine2} transformB
   */
  transform(transformA, transformB){
    this.pointA = transformA.transform(this.pointA)
    this.pointB = transformB.transform(this.pointB)

    return this
  }

  flip() {
    const { pointA } = this

    this.pointA = this.pointB
    this.pointB = pointA

    return this
  }
}