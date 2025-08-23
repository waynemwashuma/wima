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
  circle,
  linecircle,
  circleRectangle,
  circleTriangle,
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
  const circleA = new Circle(radius)
  const circleB = new Circle(radius)
  const center = new Vector2(100, 100)
  const transformA = new Affine2()
    .translate(center)
  
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const points = getShape2ClosestPoints(circleA, circleB, transformA, transformB)
  .map(point=>point.transform(transformA,transformB))
  
  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()
  
  for (let point of points) {
    const { pointA, pointB } = point
    
    gizmo
      .translate(pointA.x, pointA.y)
      .circle(2, Color.RED)
      .reset()
      .translate(pointB.x, pointB.y)
      .circle(2, Color.BLUE)
      .reset()
  }
}

/**
 * @param {World} world
 */
function linecircle(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const length = 40
  const center = new Vector2(100, 600)
  const line = new Line2(length)
  const circle = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)
  
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const points = getShape2ClosestPoints(line, circle, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()
  
  if (!points) return
  
  for (let point of points) {
    const { pointA, pointB, normalA, normalB } = point
    
    gizmo
      .translate(pointA.x, pointA.y)
      .arrow(normalA, 20, Color.PURPLE)
      .circle(2, Color.RED)
      .reset()
      .translate(pointB.x, pointB.y)
      .arrow(normalB, 20, Color.CYAN)
      .circle(2, Color.BLUE)
      .reset()
    
  }
}

/**
 * @param {World} world
 */
function circleRectangle(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(100, 800)
  const circleA = new Circle(radius)
  const circleB = new Rectangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const points = getShape2ClosestPoints(circleA, circleB, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()
  
  if (!points) return
  
  for (let point of points) {
    const { pointA, pointB, normalA, normalB } = point
    
    gizmo
      .translate(pointA.x, pointA.y)
      .arrow(normalA, 20, Color.PURPLE)
      .circle(2, Color.RED)
      .reset()
      .translate(pointB.x, pointB.y)
      .arrow(normalB, 20, Color.CYAN)
      .circle(2, Color.BLUE)
      .reset()
  }
}

/**
 * @param {World} world
 */
function circleTriangle(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(300, 1000)
  const circleA = new Circle(radius)
  const circleB = new Triangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const points = getShape2ClosestPoints(circleA, circleB, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(circleB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()
  
  if (!points) return
  
  for (let point of points) {
    const { pointA, pointB, normalA, normalB } = point
    
    gizmo
      .translate(pointA.x, pointA.y)
      .arrow(normalA, 20, Color.PURPLE)
      .circle(2, Color.RED)
      .reset()
      .translate(pointB.x, pointB.y)
      .arrow(normalB, 20, Color.CYAN)
      .circle(2, Color.BLUE)
      .reset()
  }
}