import { Vector2, Affine2 } from '../../math/index.js'

export class Contact2D {

  /**
   * @type {Vector2}
   */
  pointA

  /**
   * @type {Vector2}
   */
  pointB

  /**
   * @type {Vector2}
   */
  normalA

  /**
   * @type {Vector2}
   */
  normalB

  /**
   * @type {Vector2}
   */
  tangentA

  /**
   * @type {Vector2}
   */
  tangentB

  /**
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

  clone() {
    return new Contact2D(this.pointA, this.pointB, this.normalA, this.normalB, this.depth)
  }

  /**
   * @param {Affine2} transformA
   * @param {Affine2} transformB
   */
  transform(transformA, transformB) {
    transformA.transform(this.pointA)
    transformB.transform(this.pointB)
    this.normalA = Affine2.transformWithoutTranslation(transformA, this.normalA)
    this.normalB = Affine2.transformWithoutTranslation(transformB, this.normalB)

    // TODO: Transform tangents
    return this
  }

  flip() {
    const { pointA, normalA, tangentA } = this

    this.pointA = this.pointB
    this.pointB = pointA
    this.normalA = this.normalB
    this.normalB = normalA
    this.tangentA = this.tangentB
    this.tangentB = tangentA

    return this
  }
}