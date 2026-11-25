import { describe, expect, test } from 'vitest'
import { Affine2 } from '@wimaengine/math'
import { Gizmo2D, GizmoSettings } from '../../src/core/index.js'

class TestGizmo { }

describe('Gizmo2D transforms', () => {
  test('mutates the existing affine for transform helpers', () => {
    const gizmo = new Gizmo2D(TestGizmo, new GizmoSettings())
    const transformation = gizmo.transformation

    gizmo
      .setTransform(new Affine2(1, 0, 2, 0, 1, 3))
      .transform(new Affine2())
      .translate(4, 5)
      .rotate(Math.PI / 2)
      .scale(2, 3)

    expect(gizmo.transformation).toBe(transformation)
    expect(transformation.x).toBeCloseTo(-8)
    expect(transformation.y).toBeCloseTo(6)
    expect(transformation.a).toBeCloseTo(0)
    expect(transformation.b).toBeCloseTo(2)
    expect(transformation.c).toBeCloseTo(-3)
    expect(transformation.d).toBeCloseTo(0)
  })
})
