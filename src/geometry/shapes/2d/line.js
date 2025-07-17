import { Shape2 } from './shape2.js'

export class Line2 extends Shape2 {

  /**
   * @type {number}
   */
  halfLength

  /**
   * @param {number} halfLength
   */
  constructor(halfLength){
    super()
    this.halfLength = halfLength
  }
}