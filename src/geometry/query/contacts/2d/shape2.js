import { Circle, Capsule, Line2, Rectangle, ConvexPolygon, Triangle, Shape2 } from '../../../shapes/index.js'
import { Affine2 } from '../../../../math/index.js'
import {
  circleContact,
  lineCircleContact
} from './circle.js'
import {
  linesContact,
  lineRectangleContact,
  lineTriangleContact,
  lineCapsuleContact,
  lineConvexPolygonContact
} from './line.js'
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
  capsuleCircleContact,
  capsuleRectangleContact,
  capsuleTriangleContact,
  capsuleConvexPolygonContact
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

  if (shapeA instanceof Circle && shapeB instanceof Circle) {
    const contact = circleContact(shapeA, shapeB, transform, transformInv)

    if (contact) return [contact]

    return undefined
  } else if (shapeA instanceof Capsule && shapeB instanceof Capsule) {
    return capsuleContacts(shapeA, shapeB, transform, transformInv)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Rectangle) {
    return rectangleContacts(shapeA, shapeB, transform, transformInv)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof ConvexPolygon) {
    return polygonContacts(shapeA, shapeB, transform, transformInv)
  } else if (shapeA instanceof Triangle && shapeB instanceof Triangle) {
    return triangleContacts(shapeA, shapeB, transform, transformInv)
  } else if (shapeA instanceof Line2 && shapeB instanceof Circle) {
    const contact = lineCircleContact(shapeA, shapeB, transform, transformInv)

    if (contact) {
      return [contact]
    }

    return undefined
  } else if (shapeA instanceof Line2 && shapeB instanceof Line2) {
    const contact = linesContact(shapeA, shapeB, transform, transformInv)

    if (contact) {
      return [contact]
    }

    return undefined
  } else if (shapeA instanceof Line2 && shapeB instanceof Rectangle) {
    const contact = lineRectangleContact(shapeA, shapeB, transform, transformInv)

    if (contact) {
      return [contact]
    }

    return undefined
  } else if (shapeA instanceof Rectangle && shapeB instanceof Line2) {
    const contact = lineRectangleContact(shapeB, shapeA, transformInv, transform)

    if (contact) {
      return [contact.flip()]
    }

    return undefined
  } else if (shapeA instanceof Line2 && shapeB instanceof Triangle) {
    const contact = lineTriangleContact(shapeA, shapeB, transform, transformInv)

    if (contact) {
      return [contact]
    }

    return undefined
  } else if (shapeA instanceof Triangle && shapeB instanceof Line2) {
    const contact = lineTriangleContact(shapeB, shapeA, transformInv, transform)

    if (contact) {
      return [contact.flip()]
    }

    return undefined
  } else if (shapeA instanceof Line2 && shapeB instanceof Capsule) {
    const contact = lineCapsuleContact(shapeA, shapeB, transform, transformInv)

    if (contact) {
      return [contact]
    }

    return undefined
  } else if (shapeA instanceof Capsule && shapeB instanceof Line2) {
    const contact = lineCapsuleContact(shapeB, shapeA, transformInv, transform)

    if (contact) {
      return [contact.flip()]
    }

    return undefined
  } else if (shapeA instanceof Line2 && shapeB instanceof ConvexPolygon) {
    const contact = lineConvexPolygonContact(shapeA, shapeB, transform, transformInv)

    if (contact) {
      return [contact]
    }

    return undefined
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Line2) {
    const contact = lineConvexPolygonContact(shapeB, shapeA, transformInv, transform)

    if (contact) {
      return [contact.flip()]
    }

    return undefined
  } else if (shapeA instanceof Circle && shapeB instanceof Line2) {
    const contact = lineCircleContact(shapeB, shapeA, transformInv, transform)

    if (contact) {
      return [contact.flip()]
    }

    return undefined
  } else if (shapeA instanceof Triangle && shapeB instanceof Rectangle) {
    return triangleRectangleContacts(shapeA, shapeB, transform, transformInv)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Triangle) {
    const contacts = triangleRectangleContacts(shapeB, shapeA, transformInv, transform)

    if(contacts){
      contacts.forEach((c) => c.flip())
    }

    return contacts
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Triangle) {
    return polygonTriangleContacts(shapeA, shapeB, transform, transformInv)
  } else if (shapeA instanceof Triangle && shapeB instanceof ConvexPolygon) {
    const contacts = polygonTriangleContacts(shapeB, shapeA, transformInv, transform)

    if(contacts){
      contacts.forEach((c) => c.flip())
    }

    return contacts
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Rectangle) {
    return polygonRectangleContacts(shapeA, shapeB, transform, transformInv)
  } else if (shapeA instanceof Rectangle && shapeB instanceof ConvexPolygon) {
    const contacts = polygonRectangleContacts(shapeB, shapeA, transformInv, transform)

    if(contacts){
      contacts.forEach((c) => c.flip())
    }

    return contacts
  } else if (shapeA instanceof Circle && shapeB instanceof Triangle) {
    return circleTriangleContacts(shapeA, shapeB, transform, transformInv)
  } else if (shapeA instanceof Triangle && shapeB instanceof Circle) {
    const contacts = circleTriangleContacts(shapeB, shapeA, transformInv, transform)

    if(contacts){
      contacts.forEach((c) => c.flip())
    }

    return contacts
  } else if (shapeA instanceof Circle && shapeB instanceof Rectangle) {
    return circleRectangleContacts(shapeA, shapeB, transform, transformInv)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Circle) {
    const contacts = circleRectangleContacts(shapeB, shapeA, transformInv, transform)

    if(contacts){
      contacts.forEach((c) => c.flip())
    }

    return contacts
  } else if (shapeA instanceof Circle && shapeB instanceof ConvexPolygon) {
    return circlePolygonContact(shapeA, shapeB, transform, transformInv)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Circle) {
    const contacts = circlePolygonContact(shapeB, shapeA, transformInv, transform)

    if(contacts){
      contacts.forEach((c) => c.flip())
    }

    return contacts
  } else if (shapeA instanceof Capsule && shapeB instanceof Circle) {
    const contact = capsuleCircleContact(shapeA, shapeB, transform, transformInv)

    if (contact){ 
      return [contact]
    }

    return undefined
  } else if (shapeA instanceof Capsule && shapeB instanceof Rectangle) {
    const contact = capsuleRectangleContact(shapeA, shapeB, transform, transformInv)

    if (contact) {
      return [contact]
    }

    return undefined
  } else if (shapeA instanceof Rectangle && shapeB instanceof Capsule) {
    const contact = capsuleRectangleContact(shapeB, shapeA, transformInv, transform)

    if (contact) {
      return [contact.flip()]
    }

    return undefined
  } else if (shapeA instanceof Capsule && shapeB instanceof Triangle) {
    const contact = capsuleTriangleContact(shapeA, shapeB, transform, transformInv)

    if (contact) {
      return [contact]
    }

    return undefined
  } else if (shapeA instanceof Triangle && shapeB instanceof Capsule) {
    const contact = capsuleTriangleContact(shapeB, shapeA, transformInv, transform)

    if (contact) {
      return [contact.flip()]
    }

    return undefined
  } else if (shapeA instanceof Capsule && shapeB instanceof ConvexPolygon) {
    const contact = capsuleConvexPolygonContact(shapeA, shapeB, transform, transformInv)

    if (contact) {
      return [contact]
    }

    return undefined
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Capsule) {
    const contact = capsuleConvexPolygonContact(shapeB, shapeA, transformInv, transform)

    if (contact) {
      return [contact.flip()]
    }

    return undefined
  } else if (shapeA instanceof Circle && shapeB instanceof Capsule) {
    const contact = capsuleCircleContact(shapeB, shapeA, transformInv, transform)

    if (contact){
      return [contact.flip()]
    }

    return undefined
  }

  return undefined
}
