import { PhysicsHitbox } from '@wimaengine/broadphase'
import { Query, World, EntityHandle } from '@wimaengine/ecs'
import { Vector2 } from '@wimaengine/math'
import { Velocity2D } from '@wimaengine/movable'
import { Contacts, Collider2D } from '@wimaengine/narrowphase'
import { vertices } from '@wimaengine/render-canvas2d'
import { Position2D } from '@wimaengine/transform'
import { MainWindow, Windows } from '@wimaengine/window'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Draws the current {@linkcode PhysicsHitbox} bounds on the main window canvas.
 *
 * {@linkcode Physics2DDebuggerPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule when its `drawBounds` option is enabled. The
 * system queries every entity with a {@linkcode PhysicsHitbox}, then draws its
 * `min`/`max` rectangle with a red, 3-pixel stroke. It reads the values already
 * stored by the physics systems; it does not calculate or update the bounds.
 *
 * The system finds the entity matching {@linkcode MainWindow} together with its
 * {@linkcode EntityHandle}, then looks up that handle in the {@linkcode Windows}
 * resource. The world must provide that main-window match and resource. If the
 * handle has no registered canvas, or the canvas cannot provide a 2D context,
 * the function returns without drawing.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { drawBounds } from '@wimaengine/physics'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: drawBounds
 * })
 * // Physics2DDebuggerPlugin registers this when drawBounds is enabled.
 * ```
 *
 * @param {World} world - World containing PhysicsHitbox components and the main window.
 * @returns {void}
 * @category system
 */
export function drawBounds(world) {
  const query = new Query(world, [PhysicsHitbox])
  const windows = new Query(world, [EntityHandle, MainWindow])
  const canvases = world.getResource(Windows)
  const window = /** @type {[EntityHandle,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const ctx = canvas.getContext('2d')

  if (!ctx) return

  ctx.beginPath()
  ctx.lineWidth = 3
  ctx.strokeStyle = 'red'
  query.each(([bound]) => {

    const w = (bound.max.x - bound.min.x)
    const h = (bound.max.y - bound.min.y)

    ctx.strokeRect(
      bound.min.x,
      bound.min.y,
      w,
      h
    )
    ctx.closePath()
    ctx.stroke()
  })
}

/**
 * Draws a white marker at every entity's current {@linkcode Position2D}.
 *
 * {@linkcode Physics2DDebuggerPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule when its `drawPosition` option is enabled. The
 * query requires {@linkcode Position2D}; each matching position becomes a filled
 * white circle with radius `4` on the main window's 2D canvas.
 *
 * As with the other debugger overlays, the system finds the entity matching
 * {@linkcode MainWindow} together with its {@linkcode EntityHandle} and resolves its
 * canvas through the {@linkcode Windows} resource. The world must provide that
 * main-window match and resource. A missing canvas or unavailable 2D context
 * causes an immediate return without drawing.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { drawPosition } from '@wimaengine/physics'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: drawPosition
 * })
 * // Physics2DDebuggerPlugin registers this when drawPosition is enabled.
 * ```
 *
 * @param {World} world - World containing Position2D components and the main window.
 * @returns {void}
 * @category system
 */
export function drawPosition(world) {
  const query = new Query(world, [Position2D])
  const windows = new Query(world, [EntityHandle, MainWindow])
  const canvases = world.getResource(Windows)
  const window = /** @type {[EntityHandle,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const ctx = canvas.getContext('2d')

  if (!ctx) return

  query.each(([position]) => {
    ctx.beginPath()
    ctx.arc(position.x, position.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()
  })
}

/**
 * Draws each entity's velocity as a cyan vector from its
 * {@linkcode Position2D}.
 *
 * {@linkcode Physics2DDebuggerPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule when its `drawVelocity` option is enabled. The
 * query requires both {@linkcode Position2D} and {@linkcode Velocity2D}. For each
 * match, the system draws from `(position.x, position.y)` to that point plus
 * the velocity vector, then strokes the shared path in cyan.
 *
 * The main-window entity is found through {@linkcode EntityHandle} and
 * {@linkcode MainWindow}, and its canvas is resolved through the {@linkcode Windows}
 * resource. The world must provide that main-window match and resource. If no
 * canvas is registered for the handle, or the canvas has no 2D context, the
 * function returns without drawing.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { drawVelocity } from '@wimaengine/physics'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: drawVelocity
 * })
 * // Physics2DDebuggerPlugin registers this when drawVelocity is enabled.
 * ```
 *
 * @param {World} world - World containing Position2D/Velocity2D pairs and the main window.
 * @returns {void}
 * @category system
 */
export function drawVelocity(world) {
  const query = new Query(world, [Position2D, Velocity2D])
  const windows = new Query(world, [EntityHandle, MainWindow])
  const canvases = world.getResource(Windows)

  const window = /** @type {[EntityHandle,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const ctx = canvas.getContext('2d')

  if (!ctx) return

  ctx.beginPath()
  ctx.strokeStyle = 'cyan'
  query.each(([position, velocity]) => {
    drawArm(ctx, position, velocity)
  })
  ctx.stroke()
  ctx.closePath()
}

/**
 * Draws the current {@linkcode Collider2D} geometry on the main window canvas.
 *
 * {@linkcode Physics2DDebuggerPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule when its `drawShapes` option is enabled. The
 * system queries every entity with a collider and uses its current `vertices`
 * rather than the collider's original geometry. Polygon paths are closed and
 * stroked in light green. Circle colliders use `vertices[0]` as the center and
 * `vertices[1].x` as the radius; they also draw a radius-length orientation
 * arm from the angle stored in `shape.angle`.
 *
 * Before querying colliders, the system finds the entity matching
 * {@linkcode MainWindow} together with its {@linkcode EntityHandle} and resolves its
 * canvas through the {@linkcode Windows} resource. The world must provide that
 * main-window match and resource. A missing canvas or unavailable 2D context
 * causes an immediate return without drawing.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { drawShapes } from '@wimaengine/physics'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: drawShapes
 * })
 * // Physics2DDebuggerPlugin enables this overlay by default.
 * ```
 *
 * @param {World} world - World containing Collider2D components and the main window.
 * @returns {void}
 * @category system
 */
export function drawShapes(world) {
  const windows = new Query(world, [EntityHandle, MainWindow])
  const canvases = world.getResource(Windows)
  const window = /** @type {[EntityHandle,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const ctx = canvas.getContext('2d')

  if (!ctx) return

  const query = new Query(world, [Collider2D])

  query.each(([shape]) => {
    ctx.beginPath()

    if (shape.type === Collider2D.Circle) {
      ctx.arc(
        shape.vertices[0].x,
        shape.vertices[0].y,
        shape.vertices[1].x,
        0,
        Math.PI * 2
      )
      const r = Vector2.fromAngle(shape.angle)

      Vector2.multiplyScalar(r, shape.vertices[1].x, r)
      drawArm(ctx, shape.vertices[0], r)
    } else {
      vertices(ctx, shape.vertices.flatMap((v) => [...v]), true)
    }

    ctx.strokeStyle = 'lightgreen'
    ctx.stroke()
    ctx.closePath()
  })
}

/**
 * Draws yellow arms from colliding bodies to their current contact points.
 *
 * {@linkcode Physics2DDebuggerPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule when its `drawCollisionArm` option is enabled.
 * The system reads the current {@linkcode Contacts} resource. For every manifold,
 * it resolves each body's {@linkcode Position2D} with the manifold's entity
 * handles, then draws a line from each position to every contact point covered
 * by {@linkcode CollisionData#contactNo}. All lines are stroked together in yellow.
 *
 * The main-window entity is found through {@linkcode EntityHandle} and
 * {@linkcode MainWindow}, and its canvas is resolved through the {@linkcode Windows}
 * resource. The world must provide the {@linkcode Contacts} and {@linkcode Windows}
 * resources and a main-window match. A missing canvas or unavailable 2D
 * context returns without drawing. If either contact body has no
 * {@linkcode Position2D}, the function also returns immediately before stroking
 * the path, so earlier lines from that invocation are not rendered.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { drawArms } from '@wimaengine/physics'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: drawArms
 * })
 * // Physics2DDebuggerPlugin maps drawCollisionArm to drawArms.
 * ```
 *
 * @param {World} world - World containing Contacts, Position2D components, and the main window.
 * @returns {void}
 * @category system
 */
export function drawArms(world) {
  const windows = new Query(world, [EntityHandle, MainWindow])
  const contacts = world.getResource(Contacts)
  const canvases = world.getResource(Windows)
  const window = /** @type {[EntityHandle,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const ctx = canvas.getContext('2d')

  if (!ctx) return

  ctx.beginPath()

  for (let i = 0; i < contacts.length; i++) {
    const posA = world.get(contacts[i].entityA, Position2D)
    const posB = world.get(contacts[i].entityB, Position2D)

    if (!posA || !posB) return

    for (let j = 0; j < contacts[i].contactData.contactNo; j++) {
      drawArmRaw(ctx, posA, contacts[i].contactData.contactPoints[j])
      drawArmRaw(ctx, posB, contacts[i].contactData.contactPoints[j])
    }
  }

  ctx.strokeStyle = 'yellow'
  ctx.stroke()
  ctx.closePath()
}

/**
 * Draws white markers for the current contact points in {@linkcode Contacts}.
 *
 * {@linkcode Physics2DDebuggerPlugin} registers this exact function directly in the
 * repeating {@linkcode AppSchedule.Update} schedule when its `drawContacts` option is enabled. The
 * system reads each manifold's `contactData.contactPoints` and uses
 * {@linkcode CollisionData#contactNo} to decide whether to draw the second point. The
 * first contact slot is always drawn; a second slot is drawn only when
 * `contactNo === 2`. Each marker is a white filled arc with radius `5` from
 * angle `0` to `Math.PI`, so the implementation draws semicircular markers,
 * not full circles.
 *
 * The main-window entity is found through {@linkcode EntityHandle} and
 * {@linkcode MainWindow}, and its canvas is resolved through the {@linkcode Windows}
 * resource. The world must provide the {@linkcode Contacts} and {@linkcode Windows}
 * resources and a main-window match. A missing canvas or unavailable 2D
 * context causes an immediate return without drawing any contact markers.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { drawContacts } from '@wimaengine/physics'
 *
 * app.registerSystem({
 *   schedule: AppSchedule.Update,
 *   system: drawContacts
 * })
 * // Physics2DDebuggerPlugin registers this when drawContacts is enabled.
 * ```
 *
 * @param {World} world - World containing Contacts and the main window.
 * @returns {void}
 * @category system
 */
export function drawContacts(world) {
  const windows = new Query(world, [EntityHandle, MainWindow])
  const canvases = world.getResource(Windows)
  const clmd = world.getResource(Contacts)

  const window = /** @type {[EntityHandle,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const ctx = canvas.getContext('2d')

  if (!ctx) return

  for (let i = 0; i < clmd.length; i++) {
    const [p1, p2] = clmd[i].contactData.contactPoints

    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.arc(p1.x, p1.y, 5, 0, Math.PI)

    if (clmd[i].contactData.contactNo === 2) ctx.arc(p2.x, p2.y, 5, 0, Math.PI)

    ctx.fill()
    ctx.closePath()
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Vector2} position
 * @param {Vector2} arm
 */
function drawArm(ctx, position, arm) {
  ctx.moveTo(position.x, position.y)
  ctx.lineTo(
    position.x + arm.x,
    position.y + arm.y
  )
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Vector2} position
 * @param {Vector2} arm
 */
function drawArmRaw(ctx, position, arm) {
  ctx.moveTo(position.x, position.y)
  ctx.lineTo(
    arm.x,
    arm.y
  )
}
