import { Shape2 } from './shape2.js'
import { Vector2 } from '../../../math/index.js'

export class Rectangle extends Shape2 {

  /**
   * @type {number}
   */
  halfWidth

  /**
   * @type {number}
   */
  halfHeight

  /**
   * @param {number} halfWidth
   * @param {number} halfHeight
   */
  constructor(halfWidth, halfHeight) {
    super()
    this.halfWidth = halfWidth
    this.halfHeight = halfHeight
  }
  
  getPoints() {
    const { halfWidth, halfHeight } = this
    const positions = [
      new Vector2(-halfWidth, -halfHeight),
      new Vector2(halfWidth, -halfHeight),
      new Vector2(halfWidth, halfHeight),
      new Vector2(-halfWidth, halfHeight)
    ]
    
    return positions
  }
}