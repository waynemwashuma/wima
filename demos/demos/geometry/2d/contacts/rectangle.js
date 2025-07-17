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
  getShape2Contacts
} from 'wima'
import { Demo1Gizmo2D } from '../../../utils.js'

export default new Demo('geometry2d/rectangle contacts', [init], [
  rectangleContactDraw,
  rectangleContactDraw2,
  rectangleContactDraw3,
  rectangleContactDraw4
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
function rectangleContactDraw(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width = 50
  const height = 50
  const rect1 = new Rectangle(width, height)
  const rect2 = new Rectangle(width, height)
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
    .transform(transformA)
    .aabb(width, height)
    .axes(30)
    .reset()
    .transform(transformB)
    .aabb(width, height)
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
function rectangleContactDraw2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width = 40
  const height = 40
  const rect1 = new Rectangle(width, height)
  const rect2 = new Rectangle(width, height)
  const center = new Vector2(300, 100)
  const transformA = new Affine2().translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(70, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .transform(transformA)
    .aabb(width, height)
    .axes(30)
    .reset()
    .transform(transformB)
    .aabb(width, height)
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
function rectangleContactDraw3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width = 50
  const height = 50
  const rect1 = new Rectangle(width, height)
  const rect2 = new Rectangle(width, height)
  const center = new Vector2(100, 300)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(70, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .transform(transformA)
    .aabb(width, height)
    .axes(30)
    .reset()
    .transform(transformB)
    .aabb(width, height)
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
function rectangleContactDraw4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width1 = 50
  const height1 = 50
  const width2 = 100
  const height2 = 100
  const rect1 = new Rectangle(width2, height2)
  const rect2 = new Rectangle(width1, height1)
  const center = new Vector2(100, 550)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .transform(transformA)
    .aabb(width2, height2)
    .axes(30)
    .reset()
    .transform(transformB)
    .aabb(width1, height1)
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