import {
  World,
  VirtualClock,
  Color,
  Demo,
  GizmoLineStyle,
  Circle,
  Line2,
  Affine2,
  Vector2,
  Rotary,
  Rectangle,
  Triangle,
  getShape2ClosestPoints
} from 'wima'
import { Demo1Gizmo2D } from '../../../utils.js'

export default new Demo('geometry2d/circle close points', [init], [
  circle
])

/**
 * @param {World} world
 */
function init(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)

  gizmo.settings.lineWidth = 1
  gizmo.settings.lineStyle = GizmoLineStyle.Solid
}

/**
 * @param {World} world
 */
function circle(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 20
  const shapeA = new Circle(radius)
  const shapeB = new Circle(radius)
  const center = new Vector2(100, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const points = getShape2ClosestPoints(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()
    
    if (!points) return
    points.map(point => point.transform(transformA, transformB))
    
    for (let point of points) {
      const { pointA, pointB } = point
      
      gizmo
      .translate(pointA.x, pointA.y)
      .circle(2, Color.RED)
      .reset()
      .translate(pointB.x, pointB.y)
      .circle(2, Color.BLUE)
      .reset()
      .line(pointA,pointB,Color.CYAN)
  }
}