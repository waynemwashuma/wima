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

export default new Demo('geometry2d/triangle contacts', [init], [
  triangle1,
  triangle2,
  triangle3,
  triangle4,
  triangle5,
  triangleRectangle1,
  triangleRectangle2,
  triangleRectangle3,
  triangleRectangle4,
  triangleRectangle5,
  triangleCircle1,
  triangleCircle2,
  triangleCircle3,
  triangleCircle4,
  triangleCircle5,
  trianglePolygon1,
  trianglePolygon2,
  trianglePolygon3,
  trianglePolygon4,
  trianglePolygon5
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
function triangle1(world) {
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
function triangle2(world) {
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
function triangle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = new Triangle(50, 50,-1)
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(500, 100)
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
function triangle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = new Triangle(50, 50, 1)
  const rect2 = new Triangle(50, 50,-1)
  const center = new Vector2(700, 100)
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
    .setTransform(transformB)
    .aabb(rect2.halfWidth,rect2.halfHeight, Color.WHITE)
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
function triangle5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const rect1 = new Triangle(60, 60)
  const rect2 = new Triangle(40, 40)
  const center = new Vector2(900, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
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
function triangleRectangle1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(50, 50)
  const rect2 = new Rectangle(40, 40)
  const center = new Vector2(100, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight)
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
function triangleRectangle2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(50, 50)
  const rect2 = new Rectangle(40, 40)
  const center = new Vector2(300, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight)
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
function triangleRectangle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(50, 50)
  const rect2 = new Rectangle(40, 40)
  const center = new Vector2(500, 300)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight)
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
function triangleRectangle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(60, 60)
  const rect2 = new Rectangle(30, 30)
  const center = new Vector2(700, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight)
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
function triangleRectangle5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(60, 60)
  const rect2 = new Rectangle(30, 30)
  const center = new Vector2(900, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight)
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
function triangleCircle1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(50, 50)
  const circle2 = new Circle(40)
  const center = new Vector2(100, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, circle2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .circle(circle2.radius)
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
function triangleCircle2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(50, 50)
  const circle2 = new Circle(40)
  const center = new Vector2(300, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, circle2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .circle(circle2.radius)
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
function triangleCircle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(50, 50)
  const circle2 = new Circle(40)
  const center = new Vector2(500, 500)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, circle2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .circle(circle2.radius)
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
function triangleCircle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(60, 60)
  const circle2 = new Circle(30)
  const center = new Vector2(700, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, circle2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .circle(circle2.radius)
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
function triangleCircle5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(60, 60)
  const circle2 = new Circle(30)
  const center = new Vector2(900, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, circle2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .circle(circle2.radius)
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
function trianglePolygon1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const tri1 = new Triangle(50, 50)
  const poly2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const center = new Vector2(100, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, poly2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(poly2.getPoints(), Color.WHITE, true)
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
  const tri1 = new Triangle(50, 50)
  const poly2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const center = new Vector2(300, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, poly2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(poly2.getPoints(), Color.WHITE, true)
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
  const tri1 = new Triangle(50, 50)
  const poly2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const center = new Vector2(500, 700)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, poly2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(poly2.getPoints(), Color.WHITE, true)
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
  const tri1 = new Triangle(60, 60)
  const poly2 = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(700, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, poly2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(poly2.getPoints(), Color.WHITE, true)
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
  const tri1 = new Triangle(60, 60)
  const poly2 = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(900, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, poly2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE, true)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(poly2.getPoints(), Color.WHITE, true)
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
