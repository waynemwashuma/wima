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
  getShape2Contacts
} from 'wima'
import { Demo1Gizmo2D } from '../../../utils.js'

export default new Demo('geometry2d/circle contacts', [init], [
  circle1,
  circle2,
  circle3,
  circle4,
  linecircle,
  circleRectangle1,
  circleRectangle2,
  circleTriangle1,
  circleTriangle2
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
function circle1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const circleA = new Circle(radius)
  const circleB = new Circle(radius)
  const center = new Vector2(100, 100)
  const transformA = new Affine2()
    .translate(center)
  
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()
  
  if (!contacts) return
  contacts.map(contact=>contact.transform(transformA,transformB))
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
function circle2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const center = new Vector2(300, 100)
  const circleA = new Circle(radius)
  const circleB = new Circle(radius)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(center)
  
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()
  
  if (!contacts) return
  contacts.map(contact=>contact.transform(transformA,transformB))

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
function circle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius1 = 60
  const radius2 = 40
  const center = new Vector2(100, 300)
  const circleA = new Circle(radius1)
  const circleB = new Circle(radius2)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .circle(radius2)
    .axes(30)
    .reset()
  
  if (!contacts) return
  contacts.map(contact=>contact.transform(transformA,transformB))

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
function circle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius1 = 80
  const radius2 = 20
  const center = new Vector2(300, 300)
  const circleA = new Circle(radius1)
  const circleB = new Circle(radius2)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .circle(radius2)
    .axes(30)
    .reset()
  
  if (!contacts) return
  contacts.map(contact=>contact.transform(transformA,transformB))

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
  
  const contacts = getShape2Contacts(line, circle, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()
  
  if (!contacts) return
  contacts.map(contact=>contact.transform(transformA,transformB))

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
function circleRectangle1(world) {
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
  
  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()
  
  if (!contacts) return
  contacts.map(contact=>contact.transform(transformA,transformB))

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
function circleRectangle2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(300, 800)
  const circleA = new Circle(radius)
  const circleB = new Rectangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()
  
  if (!contacts) return
  contacts.map(contact=>contact.transform(transformA,transformB))

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
function circleTriangle1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(100, 1000)
  const circleA = new Circle(radius)
  const circleB = new Triangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(circleB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()
  
  if (!contacts) return
  contacts.map(contact=>contact.transform(transformA,transformB))

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
function circleTriangle2(world) {
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
  
  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(circleB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()
  
  if (!contacts) return
  contacts.map(contact=>contact.transform(transformA,transformB))

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