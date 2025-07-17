import { Shape2 } from './shape2.js'
import { Vector2, fuzzyEqual } from '../../../math/index.js'

export class ConvexPolygon extends Shape2 {

  /**
   * @type {Vector2[]}
   */
  points

  /**
   * @type {Vector2[]}
   */
  normals
  
  /**
   * @param {Vector2[]} points
   * @param {Vector2[]} normals
   */
  constructor(points, normals) {
    super()
    this.points = points
    this.normals = normals
  }
  
  getPoints() {
    return this.points
  }
  
  /**
   * @param {Vector2[]} points
   */
  static fromPoints(points) {
    const normals = calcFaceNormals2D(points)

    return new ConvexPolygon(points, normals)
  }
}

/**
 * @param {Vector2[]} vertices
 * @param {undefined} [tolerance]
 * @returns {Vector2[]}
 */
function calcFaceNormals2D(vertices, tolerance) {
  const axes = []
  const { length } = vertices
  
  for (let i = 0, j = length - 1; i < length; j = i, i++) {
    const previous = vertices[j]
    const current = vertices[i]
    const axis = Vector2.subtract(previous, current)
    
    Vector2.normal(axis, axis)
    Vector2.normalize(axis, axis)

    if (!checkifEquals(axis, axes, tolerance)) axes.push(axis)
  }
  
  return axes
}

/**
 * @param {Vector2} axis
 * @param {Vector2[]} axes
 * @param {number} [tolerance]
 */
function checkifEquals(axis, axes, tolerance) {
  const reverse = axis.clone().reverse()
  
  for (let i = 0; i < axes.length; i++) {
    const refAxis = axes[i]

    if (
      absEqual(axis, refAxis, tolerance) ||
      absEqual(reverse, refAxis, tolerance)
    ) return true
  }

  return false
}

/**
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {number} [tolerance]
 */
function absEqual(v1, v2, tolerance) {
  return (
    fuzzyEqual(v1.x, v2.x, tolerance) &&
    fuzzyEqual(v1.y, v2.y, tolerance)
  )
}