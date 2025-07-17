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
  Triangle,
  Rectangle,
  ConvexPolygon,
  getShape2Contacts
} from 'wima'
import { Demo1Gizmo2D } from '../../../utils.js'

export default new Demo('geometry2d/polygon contacts', [init], [
  polygons,
  rectanglePolygon,
  rectanglePolygon2,
  trianglePolygon,
  trianglePolygon2,
  circlePolygon,
  circlePolygon2
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
function polygons(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(100, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.points, Color.WHITE, true)
    .axes(30)
    .reset()
    .setTransform(transformB)
    .lineStrip(rect2.points, Color.WHITE, true)
    .axes(30)
    .reset()
  
  if (!contacts) return
  
  for (let contact of contacts) {
    const { pointA, pointB, normalA, normalB } = contact
    
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
function rectanglePolygon(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = new Rectangle(50, 50)
  const center = new Vector2(100, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.points, Color.WHITE, true)
    .axes(30)
    .reset()
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
    .axes(30)
    .reset()
  
  if (!contacts) return
  
  for (let contact of contacts) {
    const { pointA, pointB, normalA, normalB } = contact
    
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
function rectanglePolygon2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const rect2 = new Rectangle(50, 50)
  const center = new Vector2(300, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.points, Color.WHITE, true)
    .axes(30)
    .reset()
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
    .axes(30)
    .reset()
  
  if (!contacts) return
  
  for (let contact of contacts) {
    const { pointA, pointB, normalA, normalB } = contact
    
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
function trianglePolygon(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(100, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.points, Color.WHITE, true)
    .axes(30)
    .reset()
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()
  if (!contacts) return
  
  for (let contact of contacts) {
    const { pointA, pointB, normalA, normalB } = contact
    
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
function trianglePolygon2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(300, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.points, Color.WHITE, true)
    .axes(30)
    .reset()
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()
  
  if (!contacts) return
  
  for (let contact of contacts) {
    const { pointA, pointB, normalA, normalB } = contact
    
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
function circlePolygon(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = new Circle(50)
  const center = new Vector2(100, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect2, rect1, transformB, transformA)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.points, Color.WHITE, true)
    .axes(30)
    .reset()
    .setTransform(transformB)
    .circle(rect2.radius)
    .axes(30)
    .reset()
  
  if (!contacts) return
  
  for (let contact of contacts) {
    const { pointA, pointB, normalA, normalB } = contact
    
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
function circlePolygon2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const rect2 = new Circle(50)
  const center = new Vector2(300, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect2, rect1, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.points, Color.WHITE, true)
    .axes(30)
    .reset()
    .setTransform(transformB)
    .circle(rect2.radius)
    .axes(30)
    .reset()
  
  if (!contacts) return
  
  for (let contact of contacts) {
    const { pointA, pointB, normalA, normalB } = contact
    
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