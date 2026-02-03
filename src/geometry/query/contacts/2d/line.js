

/**
 * @param {LineSegment} a
 * @param {LineSegment} b
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function linesContact(a, b, transform, invTransform) {
  // Transform A line into B local space
  const a0 = Affine2.transformPoint(invTransform, a.p0)
  const a1 = Affine2.transformPoint(invTransform, a.p1)

  const b0 = b.p0
  const b1 = b.p1

  const da = Vector2.subtract(a1, a0)
  const db = Vector2.subtract(b1, b0)
  const r = Vector2.subtract(a0, b0)

  const aLenSq = Vector2.dot(da, da)
  const bLenSq = Vector2.dot(db, db)
  const ab = Vector2.dot(da, db)

  const EPS = 1e-8

  let s, t

  if (aLenSq < EPS && bLenSq < EPS) {
    s = t = 0
  } else if (aLenSq < EPS) {
    s = 0
    t = Math.max(0, Math.min(1, Vector2.dot(db, r) / bLenSq))
  } else if (bLenSq < EPS) {
    t = 0
    s = Math.max(0, Math.min(1, -Vector2.dot(da, r) / aLenSq))
  } else {
    const denom = aLenSq * bLenSq - ab * ab
    if (Math.abs(denom) < EPS) {
      // Parallel
      s = 0
      t = Math.max(0, Math.min(1, Vector2.dot(db, r) / bLenSq))
    } else {
      s = (ab * Vector2.dot(db, r) - bLenSq * Vector2.dot(da, r)) / denom
      t = (aLenSq * Vector2.dot(db, r) - ab * Vector2.dot(da, r)) / denom

      s = Math.max(0, Math.min(1, s))
      t = Math.max(0, Math.min(1, t))
    }
  }

  const closestA = Vector2.add(a0, Vector2.multiplyScalar(da, s))
  const closestB = Vector2.add(b0, Vector2.multiplyScalar(db, t))

  const delta = Vector2.subtract(closestA, closestB)
  const distSq = Vector2.dot(delta, delta)

  if (distSq > EPS * EPS) return undefined

  // Choose a stable normal (perpendicular to B)
  let normalB = new Vector2(db.y, -db.x)
  if (normalB.lengthSquared() < EPS) {
    normalB = new Vector2(da.y, -da.x)
  }
  normalB.normalize()

  // Normal in A space
  const normalA = Affine2
    .transformWithoutTranslation(transform, normalB)
    .reverse()

  // Contact points
  const contactB = closestB
  const contactA = Vector2.add(
    a.p0,
    Vector2.multiplyScalar(Vector2.subtract(a.p1, a.p0), s)
  )

  return new Contact2D(
    contactA,
    contactB,
    normalA,
    normalB,
    0
  )
}

/**
 * @param {LineSegment} a   // body A
 * @param {OBB} b           // body B
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function lineOBBContact(a, b, transform, invTransform) {
  // Transform line endpoints into B local space
  const p0 = Affine2.transformPoint(invTransform, a.p0)
  const p1 = Affine2.transformPoint(invTransform, a.p1)

  const d = Vector2.subtract(p1, p0)

  let tMin = 0
  let tMax = 1
  let hitNormalB = null

  // Slab test on X and Y
  for (let axis = 0; axis < 2; axis++) {
    const origin = axis === 0 ? p0.x : p0.y
    const direction = axis === 0 ? d.x : d.y
    const min = axis === 0 ? -b.hx : -b.hy
    const max = axis === 0 ?  b.hx :  b.hy

    if (Math.abs(direction) < 1e-8) {
      // Parallel to slab
      if (origin < min || origin > max) return undefined
      continue
    }

    const invD = 1 / direction
    let t1 = (min - origin) * invD
    let t2 = (max - origin) * invD

    let sign = -1
    if (t1 > t2) {
      const tmp = t1
      t1 = t2
      t2 = tmp
      sign = 1
    }

    if (t1 > tMin) {
      tMin = t1
      hitNormalB = axis === 0
        ? new Vector2(sign, 0)
        : new Vector2(0, sign)
    }

    tMax = Math.min(tMax, t2)
    if (tMin > tMax) return undefined
  }

  // Contact point in B space
  const contactB = Vector2.add(p0, Vector2.multiplyScalar(d, tMin))

  // Normal in B space (points from B -> A)
  const normalB = hitNormalB

  // Transform normal into A space and flip
  const normalA = Affine2
    .transformWithoutTranslation(transform, normalB)
    .reverse()

  // Contact point on line in A space
  const contactA = Vector2.add(
    a.p0,
    Vector2.multiplyScalar(Vector2.subtract(a.p1, a.p0), tMin)
  )

  // Penetration: distance from contact to exit point
  const penetration = Math.max(0, tMax - tMin) * d.length()

  return new Contact2D(
    contactA,
    contactB,
    normalA,
    normalB,
    penetration
  )
}

/**
 * @param {LineSegment} a
 * @param {Triangle} b
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function lineTriangleContact(a, b, transform, invTransform) {
  // Transform line into triangle local space
  const p0 = Affine2.transformPoint(invTransform, a.p0)
  const p1 = Affine2.transformPoint(invTransform, a.p1)
  const d = Vector2.subtract(p1, p0)

  let bestT = Infinity
  let bestNormalB = null

  // Triangle edges
  const verts = [b.v0, b.v1, b.v2]

  for (let i = 0; i < 3; i++) {
    const v0 = verts[i]
    const v1 = verts[(i + 1) % 3]

    const edge = Vector2.subtract(v1, v0)
    const edgeNormal = new Vector2(edge.y, -edge.x) // outward for CCW

    const denom = Vector2.dot(edgeNormal, d)
    if (Math.abs(denom) < 1e-8) continue

    const t = Vector2.dot(edgeNormal, Vector2.subtract(v0, p0)) / denom
    if (t < 0 || t > 1) continue

    const hit = Vector2.add(p0, Vector2.multiplyScalar(d, t))

    // Barycentric inside-edge test
    const edgeDir = Vector2.subtract(v1, v0)
    const toHit = Vector2.subtract(hit, v0)
    const proj = Vector2.dot(toHit, edgeDir)
    if (proj < 0 || proj > Vector2.dot(edgeDir, edgeDir)) continue

    if (t < bestT) {
      bestT = t
      bestNormalB = edgeNormal.normalize()
    }
  }

  if (bestNormalB === null) return undefined

  // Contact point in B space
  const contactB = Vector2.add(p0, Vector2.multiplyScalar(d, bestT))

  // Normal in A space
  const normalA = Affine2
    .transformWithoutTranslation(transform, bestNormalB)
    .reverse()

  // Contact point on line in A space
  const contactA = Vector2.add(
    a.p0,
    Vector2.multiplyScalar(Vector2.subtract(a.p1, a.p0), bestT)
  )

  // Penetration is zero for pure segment intersection
  const penetration = 0

  return new Contact2D(
    contactA,
    contactB,
    normalA,
    bestNormalB,
    penetration
  )
}

/**
 * @param {LineSegment} a
 * @param {Capsule} b
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function lineCapsuleContact(a, b, transform, invTransform) {
  // Transform line into capsule (B) local space
  const a0 = Affine2.transformPoint(invTransform, a.p0)
  const a1 = Affine2.transformPoint(invTransform, a.p1)

  const b0 = b.p0
  const b1 = b.p1
  const r = b.radius

  // Segment directions
  const da = Vector2.subtract(a1, a0)
  const db = Vector2.subtract(b1, b0)
  const r0 = Vector2.subtract(a0, b0)

  const daLenSq = Vector2.dot(da, da)
  const dbLenSq = Vector2.dot(db, db)
  const dab = Vector2.dot(da, db)

  const a = daLenSq
  const e = dbLenSq
  const f = Vector2.dot(db, r0)

  let s, t

  const EPS = 1e-8
  if (a <= EPS && e <= EPS) {
    // Both segments degenerate
    s = t = 0
  } else if (a <= EPS) {
    // Line A is a point
    s = 0
    t = Math.max(0, Math.min(1, f / e))
  } else {
    const c = Vector2.dot(da, r0)

    if (e <= EPS) {
      // Capsule spine is a point
      t = 0
      s = Math.max(0, Math.min(1, -c / a))
    } else {
      const denom = a * e - dab * dab

      if (denom !== 0) {
        s = Math.max(0, Math.min(1, (dab * f - c * e) / denom))
      } else {
        s = 0
      }

      t = (dab * s + f) / e

      if (t < 0) {
        t = 0
        s = Math.max(0, Math.min(1, -c / a))
      } else if (t > 1) {
        t = 1
        s = Math.max(0, Math.min(1, (dab - c) / a))
      }
    }
  }

  // Closest points
  const closestA = Vector2.add(a0, Vector2.multiplyScalar(da, s))
  const closestB = Vector2.add(b0, Vector2.multiplyScalar(db, t))

  const delta = Vector2.subtract(closestA, closestB)
  const distSq = Vector2.dot(delta, delta)

  if (distSq > r * r) return undefined

  const distance = Math.sqrt(distSq)
  const penetration = r - distance

  // Normal in B space (capsule -> line)
  const normalB =
    distance > EPS ? Vector2.multiplyScalar(delta, 1 / distance)
                   : Vector2.Y.clone()

  // Contact point on capsule surface (B space)
  const contactB = Vector2.add(
    closestB,
    Vector2.multiplyScalar(normalB, r)
  )

  // Normal in A space (line -> capsule)
  const normalA = Affine2
    .transformWithoutTranslation(transform, normalB)
    .reverse()

  // Contact point on line (A space)
  const contactA = Vector2.add(
    a.p0,
    Vector2.multiplyScalar(Vector2.subtract(a.p1, a.p0), s)
  )

  return new Contact2D(
    contactA,
    contactB,
    normalA,
    normalB,
    penetration
  )
}

/**
 * @param {LineSegment} a
 * @param {ConvexPolygon} b
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function lineConvexPolygonContact(a, b, transform, invTransform) {
  // Transform line into polygon (B) local space
  const p0 = Affine2.transformPoint(invTransform, a.p0)
  const p1 = Affine2.transformPoint(invTransform, a.p1)
  const d = Vector2.subtract(p1, p0)

  let tEnter = 0
  let tExit = 1
  let enterNormalB = null

  const verts = b.vertices
  const count = verts.length
  const EPS = 1e-8

  for (let i = 0; i < count; i++) {
    const v0 = verts[i]
    const v1 = verts[(i + 1) % count]

    const edge = Vector2.subtract(v1, v0)
    // Outward normal for CCW polygon
    const normal = new Vector2(edge.y, -edge.x).normalize()

    const w = Vector2.subtract(p0, v0)
    const denom = Vector2.dot(normal, d)
    const numer = -Vector2.dot(normal, w)

    if (Math.abs(denom) < EPS) {
      // Line parallel to edge
      if (numer < 0) return undefined // outside
      continue
    }

    const t = numer / denom

    if (denom < 0) {
      // Entering
      if (t > tEnter) {
        tEnter = t
        enterNormalB = normal
      }
    } else {
      // Exiting
      tExit = Math.min(tExit, t)
    }

    if (tEnter > tExit) return undefined
  }

  // Contact point in B space at entry
  const contactB = Vector2.add(p0, Vector2.multiplyScalar(d, tEnter))
  const normalB = enterNormalB ?? Vector2.Y.clone()

  // Transform normal to A space and flip
  const normalA = Affine2
    .transformWithoutTranslation(transform, normalB)
    .reverse()

  // Contact point on line in A space
  const contactA = Vector2.add(
    a.p0,
    Vector2.multiplyScalar(Vector2.subtract(a.p1, a.p0), tEnter)
  )

  // Penetration for a zero-thickness line is zero
  const penetration = 0

  return new Contact2D(
    contactA,
    contactB,
    normalA,
    normalB,
    penetration
  )
}


