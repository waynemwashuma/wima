import { Contact2D, SAT2d, sat2dCircle } from '../../../core/index.js'
import { Circle, Capsule, Line2, Rectangle, ConvexPolygon, Triangle, Shape2 } from '../../../shapes/index.js'
import { Vector2, clamp, Affine2 } from '../../../../math/index.js'
import {
  circleContact,
  lineCircleContact
} from './circle.js'
import {
  rectangleContacts,
  circleRectangleContacts
} from './rectangle.js'
import {
  triangleContacts,
  circleTriangleContacts,
  triangleRectangleContacts
} from './triangle.js'
import {
  polygonContacts,
  polygonRectangleContacts,
  polygonTriangleContacts,
  circlePolygonContact
} from './polygon.js'
import {
  capsuleContacts,
  capsuleCircleContact
} from './capsule.js'

/**
 * @param {Shape2} shapeA
 * @param {Shape2} shapeB
 * @param {Affine2} transformA
 * @param {Affine2} transformB
 */
export function getShape2Contacts(shapeA, shapeB, transformA, transformB) {
  const transform = Affine2.invert(transformA).multiply(transformB)
  const transformInv = Affine2.invert(transform)
  
  let contacts = undefined

  if (shapeA instanceof Circle && shapeB instanceof Circle) {
    const contact = circleContact(shapeA, shapeB, transform,transformInv)

    if (contact) contacts = [contact]
  } else if (shapeA instanceof Capsule && shapeB instanceof Capsule) {
    contacts = capsuleContacts(shapeA, shapeB, transform,transformInv)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Rectangle) {
    contacts = rectangleContacts(shapeA, shapeB, transform,transformInv)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof ConvexPolygon) {
    contacts = polygonContacts(shapeA, shapeB, transform,transformInv)
  } else if (shapeA instanceof Triangle && shapeB instanceof Triangle) {
    contacts = triangleContacts(shapeA, shapeB, transform,transformInv)
  } else if (shapeA instanceof Line2 && shapeB instanceof Circle) {
    const contact = lineCircleContact(shapeA, shapeB, transform,transformInv)

    if (contact) contacts = [contact]
  } else if (shapeA instanceof Triangle && shapeB instanceof Rectangle) {
    contacts = triangleRectangleContacts(shapeA, shapeB, transform,transformInv)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Triangle) {
    contacts = polygonTriangleContacts(shapeA, shapeB, transform,transformInv)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Rectangle) {
    contacts = polygonRectangleContacts(shapeA, shapeB, transform,transformInv)
  } else if (shapeA instanceof Circle && shapeB instanceof Triangle) {
    contacts = circleTriangleContacts(shapeA, shapeB, transform,transformInv)
  } else if (shapeA instanceof Circle && shapeB instanceof Rectangle) {
    contacts = circleRectangleContacts(shapeA, shapeB, transform,transformInv)
  } else if (shapeA instanceof Circle && shapeB instanceof ConvexPolygon) {
    contacts = circlePolygonContact(shapeA, shapeB, transform,transformInv)
  } else if (shapeA instanceof Capsule && shapeB instanceof Circle) {
    const contact = capsuleCircleContact(shapeA, shapeB, transform,transformInv)

    if (contact) contacts = [contact]
  }
  
  if (!contacts) return undefined
  
  return contacts
}