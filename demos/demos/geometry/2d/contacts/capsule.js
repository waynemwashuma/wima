import {
  World,
  VirtualClock,
  Color,
  Demo,
  GizmoLineStyle,
  Capsule,
  Circle,
  Affine2,
  Vector2,
  Rotary,
  getShape2Contacts
} from 'wima'
import { Demo1Gizmo2D } from '../../../utils.js'

export default new Demo('geometry2d/capsule contacts', [init], [
  capsule1,
  capsule2,
  capsule3,
  capsule4,
  capsule5,
  capsuleCircle1,
  capsuleCircle2,
  capsuleCircle3,
  capsuleCircle4,
  capsuleCircle5
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
function capsule1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 20
  const halfHeight = 20
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Capsule(radius, halfHeight)
  const center = new Vector2(100, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .capsule(radius, halfHeight)
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
function capsule2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 20
  const halfHeight = 20
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Capsule(radius, halfHeight)
  const center = new Vector2(300, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .capsule(radius, halfHeight)
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
function capsule3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 20
  const halfHeight = 20
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Capsule(radius, halfHeight)
  const center = new Vector2(500, 100)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .capsule(radius, halfHeight)
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
function capsule4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 20
  const halfHeight = 20
  const radius2 = 10
  const halfHeight2 = 10
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Capsule(radius2, halfHeight2)
  const center = new Vector2(700, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(new Vector2(20, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .capsule(radius2, halfHeight2)
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
function capsule5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 20
  const halfHeight = 20
  const radius2 = 10
  const halfHeight2 = 10
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Capsule(radius2, halfHeight2)
  const center = new Vector2(900, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(20, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .capsule(radius2, halfHeight2)
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
function capsuleCircle1(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 20
  const halfHeight = 20
  const center = new Vector2(100, 300)
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-clock.getElapsed() * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
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
function capsuleCircle2(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 20
  const halfHeight = 20
  const center = new Vector2(300, 300)
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
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
function capsuleCircle3(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius = 20
  const halfHeight = 20
  const center = new Vector2(500, 300)
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Circle(radius)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(clock.getElapsed() * -0.4))
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(clock.getElapsed() * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
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
function capsuleCircle4(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius1 = 20
  const halfHeight1 = 20
  const radius2 = 10
  const center = new Vector2(700, 300)
  const circleA = new Capsule(radius1, halfHeight1)
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
    .capsule(radius1, halfHeight1)
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
function capsuleCircle5(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)
  const clock = world.getResource(VirtualClock)
  const radius1 = 30
  const halfHeight1 = 30
  const radius2 = 10
  const center = new Vector2(900, 300)
  const circleA = new Capsule(radius1, halfHeight1)
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
    .capsule(radius1, halfHeight1)
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
