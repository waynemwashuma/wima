import { Shape2 } from './shape2.js'
import { Vector2, TAU } from '../../../math/index.js'

export class Circle extends Shape2 {

  /**
   * @type {number}
   */
  radius

  /**
   * @param {number} radius
   */
  constructor(radius) {
    super()
    this.radius = radius
  }
  
  /**
   * @param {Vector2} axis
   */
  getVertices(axis) {
    const v1 = Vector2.setMagnitude(axis, this.radius)
    const v2 = Vector2.setMagnitude(axis, -this.radius)

    return [v1, v2]
  }
  
  getPoints(resolution = 32) {
    const vertices = []

    for (let i = 0; i < resolution; i++) {
      const angle = TAU * i / resolution

      vertices.push(
        new Vector2(
          Math.cos(angle),
          Math.sin(angle)
        )
          .multiplyScalar(this.radius)
      )
    }

    return vertices
  }
}