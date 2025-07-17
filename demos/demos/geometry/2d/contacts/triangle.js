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
  getShape2Contacts
} from 'wima'
import { Demo1Gizmo2D } from '../../../utils.js'

export default new Demo('geometry2d/triangle contacts', [init], [
  triangleContactDraw,
  triangleContactDraw2,
  triangleContactDraw3,
  triangleContactDraw4,
  rectangleTriangleContactDraw
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
function triangleContactDraw(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = new Triangle(50, 50)
  const rect2 = new Triangle(50, 50)
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
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
function triangleContactDraw2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = new Triangle(50, 50)
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(300, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
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
function triangleContactDraw3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = new Triangle(50, 50,-1)
  const rect2 = new Triangle(50, 50)
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
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
function triangleContactDraw4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = new Triangle(50, 50, 1)
  const rect2 = new Triangle(50, 50,-1)
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
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
function rectangleTriangleContactDraw(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = new Triangle(50, 50)
  const rect2 = new Rectangle(50, 50)
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()
    .setTransform(transformB)
    .aabb(rect2.halfWidth,rect2.halfHeight, Color.WHITE)
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
