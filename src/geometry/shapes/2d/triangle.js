import { Shape2 } from './shape2.js'
import { Vector2 } from '../../../math/index.js'

export class Triangle extends Shape2 {

  /**
   * @type {number}
   */
  halfBase

  /**
   * @type {number}
   */
  halfHeight

  /**
   * @type {number}
   */
  baseRatio

  /**
   * @param {number} halfBase
   * @param {number} halfHeight
   * @param {number} baseRatio
   */
  constructor(halfBase, halfHeight, baseRatio = 0) {
    super()
    this.halfBase = halfBase
    this.halfHeight = halfHeight
    this.baseRatio = baseRatio
  }
  
  getPoints() {
    const { baseRatio, halfBase, halfHeight } = this
    const positions = [
      new Vector2(-halfBase, -halfHeight),
      new Vector2(halfBase, -halfHeight),
      new Vector2(halfBase * baseRatio, halfHeight)
    ]
    
    return positions
  }
}