import {
  World,
  VirtualClock,
  Color,
  Demo,
  GizmoLineStyle,
  Circle,
  Line2,
  Capsule,
  Affine2,
  Vector2,
  Rotary,
  Rectangle,
  Triangle,
  ConvexPolygon,
  getShape2Contacts
} from 'wima'
import { Demo1Gizmo2D } from '../../../utils.js'

export default new Demo('geometry2d/circle contacts', [init], [
  circle1,
  circle2,
  circle3,
  circle4,
  circle5,
  circleLine1,
  circleLine2,
  circleLine3,
  circleLine4,
  circleLine5,
  circleRectangle1,
  circleRectangle2,
  circleRectangle3,
  circleRectangle4,
  circleRectangle5,
  circleTriangle1,
  circleTriangle2,
  circleTriangle3,
  circleTriangle4,
  circleTriangle5,
  circleCapsule1,
  circleCapsule2,
  circleCapsule3,
  circleCapsule4,
  circleCapsule5,
  circlePolygon1,
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
function circle1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const shapeA = new Circle(radius)
  const shapeB = new Circle(radius)
  const center = new Vector2(100, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circle2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const center = new Vector2(300, 100)
  const shapeA = new Circle(radius)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const center = new Vector2(500, 100)
  const shapeA = new Circle(radius)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius1 = 40
  const radius2 = 20
  const center = new Vector2(700, 100)
  const shapeA = new Circle(radius1)
  const shapeB = new Circle(radius2)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .circle(radius2)
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
function circle5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius1 = 60
  const radius2 = 20
  const center = new Vector2(900, 100)
  const shapeA = new Circle(radius1)
  const shapeB = new Circle(radius2)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .circle(radius2)
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
function circleLine1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const length = 40
  const center = new Vector2(100, 300)
  const shapeA = new Circle(radius)
  const shapeB = new Line2(length)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
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
function circleLine2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const length = 40
  const center = new Vector2(300, 300)
  const shapeA = new Circle(radius)
  const shapeB = new Line2(length)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
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
function circleLine3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const length = 40
  const center = new Vector2(500, 300)
  const shapeA = new Circle(radius)
  const shapeB = new Line2(length)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
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
function circleLine4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const length = 20
  const center = new Vector2(700, 300)
  const shapeA = new Circle(radius)
  const shapeB = new Line2(length)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
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
function circleLine5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 60
  const length = 10
  const center = new Vector2(900, 300)
  const shapeA = new Circle(radius)
  const shapeB = new Line2(length)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
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
function circleRectangle1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(100, 500)
  const shapeA = new Circle(radius)
  const shapeB = new Rectangle(width, height)
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
    .circle(radius)
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
function circleRectangle2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(300, 500)
  const shapeA = new Circle(radius)
  const shapeB = new Rectangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circleRectangle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(500, 500)
  const shapeA = new Circle(radius)
  const shapeB = new Rectangle(width, height)
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
    .circle(radius)
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
function circleRectangle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 20
  const height = 20
  const center = new Vector2(700, 500)
  const shapeA = new Circle(radius)
  const shapeB = new Rectangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circleRectangle5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 60
  const width = 10
  const height = 10
  const center = new Vector2(900, 500)
  const shapeA = new Circle(radius)
  const shapeB = new Rectangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circleTriangle1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(100, 700)
  const shapeA = new Circle(radius)
  const shapeB = new Triangle(width, height)
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
    .circle(radius)
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
function circleTriangle2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(300, 700)
  const shapeA = new Circle(radius)
  const shapeB = new Triangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circleTriangle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(500, 700)
  const shapeA = new Circle(radius)
  const shapeB = new Triangle(width, height)
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
    .circle(radius)
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
function circleTriangle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 50
  const width = 20
  const height = 20
  const center = new Vector2(700, 700)
  const shapeA = new Circle(radius)
  const shapeB = new Triangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circleTriangle5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 60
  const width = 10
  const height = 10
  const center = new Vector2(900, 700)
  const shapeA = new Circle(radius)
  const shapeB = new Triangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circleCapsule1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const capRadius = 20
  const capHalfHeight = 30
  const center = new Vector2(100, 900)
  const shapeA = new Circle(radius)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
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
function circleCapsule2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const capRadius = 20
  const capHalfHeight = 30
  const center = new Vector2(300, 900)
  const shapeA = new Circle(radius)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
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
function circleCapsule3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const capRadius = 20
  const capHalfHeight = 30
  const center = new Vector2(500, 900)
  const shapeA = new Circle(radius)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
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
function circleCapsule4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius1 = 60
  const capRadius = 15
  const capHalfHeight = 25
  const center = new Vector2(700, 900)
  const shapeA = new Circle(radius1)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
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
function circleCapsule5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius1 = 60
  const capRadius = 15
  const capHalfHeight = 25
  const center = new Vector2(900, 900)
  const shapeA = new Circle(radius1)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
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
function circlePolygon1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(100, 1100)
  const shapeA = new Circle(radius)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(polygonB.getPoints(), Color.WHITE, true)
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
function circlePolygon2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(300, 1100)
  const shapeA = new Circle(radius)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(polygonB.getPoints(), Color.WHITE, true)
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
function circlePolygon3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(500, 1100)
  const shapeA = new Circle(radius)
  const shapeB = polygonB
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(polygonB.getPoints(), Color.WHITE, true)
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
function circlePolygon4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius1 = 60
  const polygonB = ConvexPolygon.fromPoints(new Circle(40).getPoints(8))
  const center = new Vector2(700, 1100)
  const shapeA = new Circle(radius1)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(polygonB.getPoints(), Color.WHITE, true)
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
function circlePolygon5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius1 = 60
  const polygonB = ConvexPolygon.fromPoints(new Circle(40).getPoints(8))
  const center = new Vector2(900, 1100)
  const shapeA = new Circle(radius1)
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
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(polygonB.getPoints(), Color.WHITE, true)
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
