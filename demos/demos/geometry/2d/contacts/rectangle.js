import {
  World,
  VirtualClock,
  Color,
  Demo,
  GizmoLineStyle,
  Affine2,
  Vector2,
  Rotary,
  Rectangle,
  getShape2Contacts,
  Circle,
  Triangle,
  ConvexPolygon
} from 'wima'
import { Demo1Gizmo2D } from '../../../utils.js'

export default new Demo('geometry2d/rectangle contacts', [init], [
  rectangle1,
  rectangle2,
  rectangle3,
  rectangle4,
  rectangle5,
  rectangleCircle1,
  rectangleCircle2,
  rectangleCircle3,
  rectangleCircle4,
  rectangleCircle5,
  rectangleTriangle1,
  rectangleTriangle2,
  rectangleTriangle3,
  rectangleTriangle4,
  rectangleTriangle5,
  rectanglePolygon1,
  rectanglePolygon2,
  rectanglePolygon3,
  rectanglePolygon4,
  rectanglePolygon5
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
function rectangle1(world) {
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
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangle2(world) {
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
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width = 40
  const height = 40
  const rect1 = new Rectangle(width, height)
  const rect2 = new Rectangle(width, height)
  const center = new Vector2(500, 100)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(70, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width1 = 20
  const height1 = 20
  const width2 = 60
  const height2 = 60
  const rect1 = new Rectangle(width2, height2)
  const rect2 = new Rectangle(width1, height1)
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
    .aabb(width2, height2)
    .axes(30)
    .setTransform(transformB)
    .aabb(width1, height1)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangle5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width1 = 10
  const height1 = 10
  const width2 = 60
  const height2 = 60
  const rect1 = new Rectangle(width2, height2)
  const rect2 = new Rectangle(width1, height1)
  const center = new Vector2(900, 100)
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
    .aabb(width2, height2)
    .axes(30)
    .setTransform(transformB)
    .aabb(width1, height1)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangleCircle1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(100, 500)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangleCircle2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(300, 500)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangleCircle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(500, 500)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangleCircle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 20
  const width = 50
  const height = 50
  const center = new Vector2(700, 500)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangleCircle5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 10
  const width = 50
  const height = 50
  const center = new Vector2(900, 500)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangleTriangle1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width = 40
  const height = 40
  const triBase = 50
  const triHeight = 50
  const center = new Vector2(100, 700)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Triangle(triBase, triHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangleTriangle2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width = 40
  const height = 40
  const triBase = 50
  const triHeight = 50
  const center = new Vector2(300, 700)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Triangle(triBase, triHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangleTriangle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width = 40
  const height = 40
  const triBase = 50
  const triHeight = 50
  const center = new Vector2(500, 700)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Triangle(triBase, triHeight)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangleTriangle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width1 = 50
  const height1 = 50
  const triBase = 40
  const triHeight = 40
  const center = new Vector2(700, 700)
  const shapeA = new Rectangle(width1, height1)
  const shapeB = new Triangle(triBase, triHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width1, height1)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectangleTriangle5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width1 = 60
  const height1 = 60
  const triBase = 35
  const triHeight = 35
  const center = new Vector2(900, 700)
  const shapeA = new Rectangle(width1, height1)
  const shapeB = new Triangle(triBase, triHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(20, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width1, height1)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
function rectanglePolygon1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const width = 40
  const height = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const center = new Vector2(100, 900)
  const shapeA = new Rectangle(width, height)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
  const width = 40
  const height = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const center = new Vector2(300, 900)
  const shapeA = new Rectangle(width, height)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
  const width = 40
  const height = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const center = new Vector2(500, 900)
  const shapeA = new Rectangle(width, height)
  const shapeB = polygonB
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
  const width1 = 50
  const height1 = 50
  const polygonB = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(700, 900)
  const shapeA = new Rectangle(width1, height1)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width1, height1)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
  const width1 = 60
  const height1 = 60
  const polygonB = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(900, 900)
  const shapeA = new Rectangle(width1, height1)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(20, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width1, height1)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE, true)
    .axes(30)
    .reset()

  if (!contacts) return
  contacts.map(contact => contact.transform(transformA, transformB))

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
