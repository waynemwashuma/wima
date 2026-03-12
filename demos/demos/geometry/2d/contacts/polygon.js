import {
  World,
  VirtualClock,
  Color,
  Demo,
  GizmoLineStyle,
  Circle,
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
  polygons2,
  polygons3,
  polygons4,
  polygons5,
  rectanglePolygon,
  rectanglePolygon2,
  rectanglePolygon3,
  rectanglePolygon4,
  rectanglePolygon5,
  trianglePolygon,
  trianglePolygon2,
  trianglePolygon3,
  trianglePolygon4,
  trianglePolygon5,
  circlePolygon,
  circlePolygon2,
  circlePolygon3,
  circlePolygon4,
  circlePolygon5
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .circle(rect2.radius)
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
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .circle(rect2.radius)
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
function polygons2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
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
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
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
function polygons3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(500, 100)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
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
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
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
function polygons4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(700, 100)
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
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
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
function polygons5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(900, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
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
function rectanglePolygon3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const rect2 = new Rectangle(50, 50)
  const center = new Vector2(500, 300)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
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
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
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
function rectanglePolygon4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Rectangle(50, 50)
  const center = new Vector2(700, 300)
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
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
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
function rectanglePolygon5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Rectangle(50, 50)
  const center = new Vector2(900, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
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
function trianglePolygon3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(500, 500)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
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
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
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
function trianglePolygon4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Triangle(40, 40)
  const center = new Vector2(700, 500)
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
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
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
function trianglePolygon5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Triangle(40, 40)
  const center = new Vector2(900, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE, true)
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
function circlePolygon3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const rect2 = new Circle(40)
  const center = new Vector2(500, 700)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
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
    .setTransform(transformB)
    .circle(rect2.radius)
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
function circlePolygon4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Circle(30)
  const center = new Vector2(700, 700)
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
    .setTransform(transformB)
    .circle(rect2.radius)
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
function circlePolygon5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Circle(30)
  const center = new Vector2(900, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .circle(rect2.radius)
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
