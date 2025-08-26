/** @import { Constructor } from '../../reflect/index.js' */
import { Color } from '../../color/index.js'
import { Affine2, Affine3, Vector2, Vector3, BVector2, TAU, PI, Rotary } from '../../math/index.js'
import { GizmoSettings } from './settings.js'

/**
 * @template T
 */
export class GizmoBuffer {
  
  /**
   * @type {T[]}
   */
  positions = []
  
  /**
   * @type {Color[]}
   */
  colors = []
  
  /**
   * @type {T[]}
   */
  stripPositions = []
  
  /**
   * @type {Color[]}
   */
  stripColors = []
  clear() {
    this.positions.length = 0
    this.colors.length = 0
    this.stripPositions.length = 0
    this.stripColors.length = 0
  }
}

/**
 * @template T
 * Immediate mode drawing of defined 2d shapes.
 * Should be used for visual debugging.
 */
export class Gizmo2D {
  
  /**
   * @readonly
   * @type {Constructor<T>}
   */
  type
  
  /**
   * @private
   * @type {Affine2}
   */
  transformation = new Affine2()
  
  /**
   * @type {GizmoBuffer<Vector2>}
   */
  buffer = new GizmoBuffer()
  
  /**
   * @type {GizmoSettings}
   */
  settings
  
  /**
   * @param {Constructor<T>} type 
   * @param {GizmoSettings} settings
   */
  constructor(type, settings) {
    this.settings = settings
    this.type = type
  }
  
  /**
   * @returns {this}
   */
  reset() {
    Affine2.identity(this.transformation)
    
    return this
  }
  
  /**
   * @param {Affine2} matrix 
   */
  setTransform(matrix) {
    this.transformation.copy(matrix)
    
    return this
  }
  
  /**
   * @param {Affine2} matrix 
   * @returns {this}
   */
  transform(matrix) {
    this.transformation.multiply(matrix)
    
    return this
  }
  
  /**
   * @param {number} x 
   * @param {number} y 
   * @returns {this}
   */
  translate(x, y) {
    this.transformation.translate(new Vector2(x, y))
    
    return this
  }
  
  /**
   * @param {number} angle 
   * @returns {this}
   */
  rotate(angle) {
    this.transformation.rotate(Rotary.fromAngle(angle))
    
    return this
  }
  
  /**
   * @param {number} x 
   * @param {number} y 
   * @returns {this}
   */
  scale(x, y) {
    this.transformation.scale(new Vector2(x, y))
    
    return this
  }
  
  /**
   * @param {Vector2} start 
   * @param {Vector2} end 
   * @param {Color} color 
   * @returns 
   */
  line(
    start = Vector2.Zero.clone(),
    end = Vector2.X.clone(),
    color = Color.WHITE
  ) {
    this.lineGradient(start, end, color, color)
    
    return this
  }
  
  /**
   * @param {Vector2} start 
   * @param {Vector2} end 
   * @param {Color} colorStart 
   * @param {Color} colorEnd 
   * @returns {this}
   */
  lineGradient(start, end, colorStart = Color.WHITE, colorEnd = Color.WHITE) {
    this.buffer.positions.push(
      this.transformation.transform(start.clone()),
      this.transformation.transform(end.clone())
    )
    this.buffer.colors.push(colorStart, colorEnd)
    
    return this
  }
  
  /**
   * @param {Vector2[]} strips
   * @param {Color} color
   * @param {boolean} closed
   * @returns {this}
   */
  lineStrip(strips, color = Color.WHITE, closed = false) {
    for (let i = 0; i < strips.length; i++) {
      this.buffer.stripPositions.push(this.transformation.transform(strips[i].clone()))
      this.buffer.stripColors.push(color)
    }
    
    if (closed && strips[0]) {
      this.buffer.stripPositions.push(this.transformation.transform(strips[0].clone()))
      this.buffer.stripColors.push(color)
    }
    
    this.buffer.stripPositions.push(new Vector2(NaN, NaN))
    this.buffer.stripColors.push(new Color(NaN, NaN, NaN, NaN))
    
    return this
  }
  
  /**
   * @param {[Vector2,Color][]} strips
   * @param {boolean} closed
   * @returns {this}
   */
  lineStripGradient(strips, closed = false) {
    for (let i = 0; i < strips.length; i++) {
      this.buffer.stripPositions.push(this.transformation.transform(strips[i][0].clone()))
      this.buffer.stripColors.push(strips[i][1].clone())
    }
    
    if (closed && strips[0]) {
      this.buffer.stripPositions.push(this.transformation.transform(strips[0][0].clone()))
      this.buffer.stripColors.push(strips[0][1].clone())
    }

    this.buffer.stripPositions.push(new Vector2(NaN, NaN))
    this.buffer.stripColors.push(new Color(NaN, NaN, NaN, NaN))
    
    return this
  }
  
  /**
   * @param {number} arcStart 
   * @param {number} arcEnd 
   * @param {number} radiusX 
   * @param {number} radiusY 
   * @param {Color} color 
   * @param {number} resolution 
   * @returns {this}
   */
  arc(arcStart, arcEnd, radiusX = 1, radiusY = 1, color = Color.WHITE.clone(), resolution = 32) {
    const spacing = (arcEnd - arcStart) / resolution
    const radii = new Vector2(radiusX, radiusY)
    const positions = []
    
    for (let i = 0; i <= resolution; i++) {
      const position = Vector2.fromAngle(arcStart + spacing * i).multiply(radii)
      
      positions.push(position)
    }
    
    this.lineStrip(positions, color, false)
    
    return this
  }
  
  /**
   * @param {Vector2} direction
   * @param {number} length
   * @param {Color} color
   * @returns {this}
   */
  arrow(
    direction = Vector2.X.clone(),
    length = 1,
    color = Color.RED
  ) {
    this.line(
      Vector2.Zero.clone(),
      direction.multiplyScalar(length),
      color
    )
    
    return this
  }
  
  /**
   * @param {Vector2} cellCount 
   * @param {Vector2} spacing 
   * @param {Color} color 
   * @param {BVector2} drawEdges 
   * @returns {this}
   */
  grid(
    cellCount = new Vector2(20, 20),
    spacing = new Vector2(1, 1),
    color = Color.WHITE,
    drawEdges = new BVector2()
  ) {
    const dimensions = Vector2.multiply(spacing, cellCount).multiplyScalar(0.5)
    const offset = new Vector2().set(
      drawEdges.x ? 0 : spacing.x,
      drawEdges.y ? 0 : spacing.y
    )
    
    for (let x = offset.x - dimensions.x; x <= dimensions.x - offset.x; x += spacing.x) {
      this.line(
        new Vector2(x, -dimensions.y),
        new Vector2(x, dimensions.y),
        color
      )
    }
    
    for (let y = offset.y - dimensions.y; y <= dimensions.y - offset.y; y += spacing.y) {
      this.line(
        new Vector2(-dimensions.x, y),
        new Vector2(dimensions.x, y),
        color
      )
    }
    
    return this
  }
  
  /**
   * @param {number} length 
   * @returns {this}
   */
  axes(length) {
    this
      .arrow(
        Vector2.X.clone(),
        length,
        Color.RED.clone()
      )
      .arrow(
        Vector2.Y.clone(),
        length,
        Color.GREEN.clone()
      )
    
    return this
  }
  
  /**
   * @param {number} radius 
   * @param {Color} color 
   * @param {number} resolution 
   * @returns {this}
   */
  circle(radius, color = Color.WHITE, resolution = 32) {
    this.arc(0, TAU, radius, radius, color, resolution)
    
    return this
  }
  
  /**
   * @param {number} halfWidth
   * @param {number} halfHeight
   * @param {Color} color
   * @returns {this}
   */
  aabb(halfWidth, halfHeight, color = Color.WHITE) {
    this.lineStrip(
      [
        new Vector2(-halfWidth, -halfHeight),
        new Vector2(-halfWidth, halfHeight),
        new Vector2(halfWidth, halfHeight),
        new Vector2(halfWidth, -halfHeight)
      ],
      color,
      true
    )
    
    return this
  }
  
  /**
   * @param {number} halfBase
   * @param {number} halfHeight
   * @param {number} baseRatio
   * @param {Color} color
   */
  triangle(halfBase, halfHeight, baseRatio, color = Color.WHITE) {
    this.lineStrip(
      [
        new Vector2(-halfBase, -halfHeight),
        new Vector2(halfBase, -halfHeight),
        new Vector2(halfBase * baseRatio, halfHeight)
      ],
      color,
      true
    )

    return this
  }
  
  /**
   * @param {number} radius
   * @param {number} halfHeight
   * @param {Color} [color]
   */
  capsule(radius, halfHeight, color = Color.WHITE) {
    const transform = this.transformation.clone()
    const delta = Affine2.transformWithoutTranslation(transform, new Vector2(0, halfHeight))
    
    this
      .line(
        new Vector2(radius, halfHeight),
        new Vector2(radius, -halfHeight),
        color
      )
      .line(
        new Vector2(-radius, halfHeight),
        new Vector2(-radius, -halfHeight),
        color
      )
      .translate(delta.x, delta.y)
      
      .arc(PI, 0, radius, radius, color)
      .translate(-delta.x * 2, -delta.y * 2)
      .arc(0, -PI, radius, radius, color)
      .setTransform(transform)
    
    return this
  }
  
  /**
   * @param {number} radiusX
   * @param {number} radiusY
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  ellipse(radiusX, radiusY, color = Color.WHITE, resolution = 32) {
    this.arc(0, TAU, radiusX, radiusY, color, resolution)
    
    return this
  }
}

/**
 * @template T
 * Immediate mode drawing of defined 3d shapes.
 * Should be used for visual debugging.
 */
export class Gizmo3D {
  
  /**
   * @readonly
   * @type {Constructor<T>}
   */
  type
  
  /**
   * @private
   * @type {Affine3}
   */
  transformation = new Affine3()
  
  /**
   * @type {GizmoBuffer<Vector3>}
   */
  buffer = new GizmoBuffer()
  
  /**
   * @type {GizmoSettings}
   */
  settings
  
  /**
   * @param {Constructor<T>} type
   * @param {GizmoSettings} settings
   */
  constructor(type, settings) {
    this.type = type
    this.settings = settings
  }
  
  reset() {
    Affine3.identity(this.transformation)
  }
}