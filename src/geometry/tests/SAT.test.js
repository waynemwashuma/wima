import test from "node:test"
import { Vector2, Affine2 } from "../../math/index.js"
import { SAT2d } from "../core/SAT.js"
// All tests are relative to first body
// Contact points are for the first body.

test("Contact on one point", () => {
  const pointsA = [
    new Vector2(2, 8),
    new Vector2(6, 4),
    new Vector2(9, 7),
    new Vector2(5, 11),
  ]
  const pointsB = [
    new Vector2(4, 2),
    new Vector2(12, 2),
    new Vector2(12, 5),
    new Vector2(4, 5),
  ]
  
  const axes = [
    Vector2.subtract(pointsA[0], pointsA[1]),
    Vector2.subtract(pointsA[1], pointsA[2]),
    Vector2.subtract(pointsB[0], pointsB[1]),
    Vector2.subtract(pointsB[1], pointsB[2])
  ].map(axis => Vector2.normal(axis))
  
  const contacts = SAT2d(pointsA, pointsB, axes, new Affine2(1, 0, 0, 1, 0, 0))
  
  // should be [(6,4)]
})

test("Contact on two points", () => {
  const pointsA = [
    new Vector2(8, 4),
    new Vector2(14, 4),
    new Vector2(14, 9),
    new Vector2(8, 9),
  ]
  const pointsB = [
    new Vector2(4, 2),
    new Vector2(12, 2),
    new Vector2(12, 5),
    new Vector2(4, 5),
  ]
  
  const axes = [
    Vector2.subtract(pointsA[0], pointsA[1]),
    Vector2.subtract(pointsA[1], pointsA[2]),
    Vector2.subtract(pointsB[0], pointsB[1]),
    Vector2.subtract(pointsB[1], pointsB[2])
  ].map(axis => Vector2.normal(axis))
  
  const contacts = SAT2d(pointsA, pointsB, axes, new Affine2(1, 0, 0, 1, 0, 0))
  // should be [(12,5),(8,5)]
})

test("Contact on two points", () => {
  const pointsA = [
    new Vector2(9, 4),
    new Vector2(13, 3),
    new Vector2(14, 7),
    new Vector2(10, 8),
  ]
  const pointsB = [
    new Vector2(4, 2),
    new Vector2(12, 2),
    new Vector2(12, 5),
    new Vector2(4, 5),
  ]
  
  const axes = [
    Vector2.subtract(pointsA[0], pointsA[1]),
    Vector2.subtract(pointsA[1], pointsA[2]),
    Vector2.subtract(pointsB[0], pointsB[1]),
    Vector2.subtract(pointsB[1], pointsB[2])
  ].map(axis => Vector2.normal(axis))
  
  const contacts = SAT2d(pointsA, pointsB, axes, new Affine2(1, 0, 0, 1, 0, 0))
  // should be [(12,5),(9.25,5)]
})