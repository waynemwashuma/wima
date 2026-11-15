/** @import { MeshAttributeDataSerial } from '../core' */
import { Vector2, Vector3 } from '@wimaengine/math'
import { MeshAttributeData } from '../core'

/**
 * Represents vertex geometry as a mesh asset.
 *
 * @example
 * ```js
 * import { Mesh, MeshAssets, MeshAttributeData } from '@wimaengine/render-core'
 *
 * const mesh = Mesh.quad2D(2, 1)
 * mesh.setAttribute('uv', new MeshAttributeData(new Float32Array([
 *   0, 0, 0, 1, 1, 1, 1, 0
 * ])))
 *
 * const handle = world.getResource(MeshAssets).add(mesh)
 * // Pass `handle` to `new Meshed(handle)` when attaching the asset to an entity.
 * ```
 */
export class Mesh {

  /**
   * Optional index buffer for the mesh.
   *
   * The supplied `Uint16Array` is stored directly, so `undefined` represents
   * a non-indexed mesh and mutations to the array are visible through the
   * mesh.
   *
   * @type {Uint16Array | undefined}
   */
  indices

  /**
   * Named mesh attributes held by the mesh.
   *
   * The map is initialized empty. Its values are {@linkcode MeshAttributeData}
   * instances, and both the map and its values are stored directly rather
   * than copied.
   *
   * @type {Map<string,MeshAttributeData>}
   */
  attributes = new Map()

  /**
   * Returns the mesh's current index buffer without copying it.
   *
   * The returned value is the same `Uint16Array` stored in `indices`, or
   * `undefined` for a non-indexed mesh.
   *
   * @returns {Uint16Array | undefined} The current index buffer, if present.
   */
  getIndices() {
    return this.indices
  }

  /**
   * Replaces the mesh's index buffer and returns this mesh for chaining.
   *
   * Passing `undefined` clears the buffer and makes the mesh non-indexed. A
   * supplied `Uint16Array` is stored as-is and is not copied.
   *
   * @param {Uint16Array | undefined} indices
   * @returns {Mesh} This mesh.
   */
  setIndices(indices) {
    this.indices = indices

    return this
  }

  /**
   * Returns the {@linkcode MeshAttributeData} stored under `name`.
   *
   * The stored value is returned directly; `undefined` is returned when the
   * name has no entry.
   *
   * @param {string} name
   * @returns {MeshAttributeData | undefined} The named attribute, if present.
   */
  getAttribute(name) {
    return this.attributes.get(name)
  }

  /**
   * Adds or replaces a named {@linkcode MeshAttributeData}.
   *
   * The supplied attribute is stored directly without copying, and this mesh
   * is returned for chaining.
   *
   * @param {string} name
   * @param {MeshAttributeData} attribute
   * @returns {Mesh} This mesh.
   */
  setAttribute(name, attribute) {
    this.attributes.set(name, attribute)

    return this
  }

  /**
   * Returns the live map of all named {@linkcode MeshAttributeData} values.
   *
   * This is the mesh's actual attribute collection, not a copy. Changes to the
   * returned map therefore change the mesh.
   *
   * @returns {Map<string,MeshAttributeData>} The mesh's attribute map.
   */
  getAttributes() {
    return this.attributes
  }

  /**
   * Removes the named attribute if it exists.
   *
   * If no entry has `name`, the method does nothing. It always returns
   * `undefined`.
   *
   * @param {string} name
   * @returns {void}
   */
  deleteAttribute(name) {
    this.attributes.delete(name)
  }

  /**
   * Converts a mesh to its serializable form without mutating it.
   *
   * When an index buffer is present, `indices` is a new number array made
   * from it; otherwise it is `undefined`. `attributes` is a new array of
   * `[name, serializedAttribute]` entries in map order, with each attribute
   * converted by {@linkcode MeshAttributeData.serialize}.
   *
   * @param {Mesh} value
   * @returns {MeshSerial} The mesh's plain serial representation.
   */
  static serialize(value) {
    return {
      indices: value.indices ? Array.from(value.indices) : undefined,
      attributes: Array.from(value.attributes.entries()).map(([name, attribute]) => [
        name,
        MeshAttributeData.serialize(attribute)
      ])
    }
  }

  /**
   * Restores a mesh from serialized indices and attribute entries.
   *
   * A present `indices` array becomes a new `Uint16Array`; an absent or
   * `undefined` value clears the index buffer. The attribute entries become a
   * new map, with each value rebuilt by {@linkcode MeshAttributeData.deserialize}.
   * When `out` is supplied, its index buffer and attribute map are replaced
   * and that same mesh is returned; otherwise a new mesh is created.
   *
   * @param {MeshSerial} value
   * @param {Mesh} [out]
   * @returns {Mesh} The restored mesh.
   */
  static deserialize(value, out = new Mesh()) {
    out.indices = value.indices ? new Uint16Array(value.indices) : undefined
    out.attributes = new Map(
      value.attributes.map(([name, attribute]) => [name, MeshAttributeData.deserialize(attribute)])
    )

    return out
  }

  /**
   * Builds a new centered, non-indexed 2D quad.
   *
   * The `position2d` attribute contains four vertices in the order
   * `(-width / 2, -height / 2)`, `(-width / 2, height / 2)`,
   * `(width / 2, height / 2)`, `(width / 2, -height / 2)`. The mesh has no
   * index buffer, normal attribute, or UV attribute.
   *
   * @param {number} width
   * @param {number} height
   * @returns {Mesh}
   */
  static quad2D(width, height) {
    const geometry = new Mesh()
    const positions = new Float32Array([
      -width / 2,
      -height / 2,
      -width / 2,
      height / 2,
      width / 2,
      height / 2,
      width / 2,
      -height / 2
    ])

    geometry.setAttribute('position2d', new MeshAttributeData(positions))

    return geometry
  }

  /**
   * Builds a new non-indexed 2D circle vertex list.
   *
   * The `position2d` attribute starts with the center, followed by
   * `resolution + 1` circumference samples for an integer resolution. These
   * samples use angles from `0` through `2 * Math.PI` in steps of
   * `2 * Math.PI / resolution`, so the final sample closes the circle for a
   * positive integer resolution. The mesh has no index buffer or other
   * attributes; `resolution` is used directly and is not floored.
   *
   * @param {number} radius
   * @param {number} [resolution=16]
   * @returns {Mesh}
   */
  static circle2D(radius, resolution = 16) {
    const geometry = new Mesh()
    const positions = [0, 0]

    const spacing = Math.PI * 2 / resolution

    for (let i = 0; i <= resolution; i++) {
      const position = Vector2.fromAngle(spacing * i)

      Vector2.multiplyScalar(position, radius, position)

      positions.push(position.x, position.y)
    }

    geometry
      .setAttribute('position2d', new MeshAttributeData(new Float32Array(positions)))

    return geometry
  }

  /**
   * Builds a new indexed 2D triangle.
   *
   * The `position2d` attribute contains the two base vertices followed by the
   * upper vertex. The vertices are
   * `(-base / 2, -height / 2)`, `(base / 2, -height / 2)`, and
   * `(base * baseRatio / 2, height / 2)`. `baseRatio` defaults to `0`, and
   * the index buffer is `[0, 1, 2]`; no other attributes are added.
   *
   * @param {number} base
   * @param {number} height
   * @param {number} [baseRatio=0]
   * @returns {Mesh}
   */
  static triangle2D(base, height, baseRatio = 0) {
    const mesh = new Mesh()

    mesh
      .setIndices(new Uint16Array([0, 1, 2]))
      .setAttribute('position2d', new MeshAttributeData(new Float32Array([
        -base / 2,
        -height / 2,
        +base / 2,
        -height / 2,
        base / 2 * baseRatio,
        height / 2
      ])))

    return mesh
  }

  /**
   * Builds a new indexed 3D triangle in the `z = 0` plane.
   *
   * The `position3d` attribute contains the two base vertices followed by the
   * upper vertex at `(base * baseL / 2, height / 2, 0)`. `baseL` defaults to
   * `0`, and the index buffer is `[0, 1, 2]`; no other attributes are added.
   *
   * @param {number} [base=1]
   * @param {number} [height=1]
   * @param {number} [baseL=0]
   * @returns {Mesh}
   */
  static triangle3D(base = 1, height = 1, baseL = 0) {
    const mesh = new Mesh()

    mesh
      .setIndices(new Uint16Array([0, 1, 2]))
      .setAttribute('position3d', new MeshAttributeData(new Float32Array([
        -base / 2,
        -height / 2,
        0,
        +base / 2,
        -height / 2,
        0,
        base / 2 * baseL,
        height / 2,
        0
      ])))

    return mesh
  }

  /**
   * Builds a new indexed, planar 3D circle fan.
   *
   * The mesh has `position3d`, `normal3d`, and `uv` attributes. The first
   * vertex is the center; subsequent vertices are sampled in the `z = 0`
   * plane from `arcstart` in increments of `arclength / segments`, while the
   * sample angle is below `arclength` with a small endpoint tolerance. Each
   * consecutive pair is joined to the center by the index buffer. `segments`
   * is used directly and is not floored or clamped; the upper-bound comparison
   * uses `arclength`, not `arcstart + arclength`.
   *
   * @param {number} [radius=0.5]
   * @param {number} [segments=32]
   * @param {number} [arcstart=0]
   * @param {number} [arclength=Math.PI * 2]
   * @returns {Mesh}
   */
  static circle3D(radius = 0.5, segments = 32, arcstart = 0, arclength = Math.PI * 2) {
    const mesh = new Mesh()
    const vertices = [0, 0, 0]
    const normals = [0, 0, 1]
    const uvs = [0.5, 0.5]
    const indices = []
    const angleIncrement = arclength / segments
    const epilson = Math.pow(2, -31)

    for (let i = arcstart; i < arclength + epilson; i += angleIncrement) {
      const cos = Math.cos(i)
      const sin = Math.sin(i)

      vertices.push(
        radius * cos,
        radius * sin,
        0
      )
      normals.push(0, 0, 1)
      uvs.push((cos + 1) * 0.5, (sin + 1) * 0.5)
    }

    for (let i = 2; i < vertices.length / 3; i++) {
      indices.push(i - 1, i, 0)
    }

    mesh
      .setIndices(
        new Uint16Array(indices)
      )
      .setAttribute(
        'position3d',
        new MeshAttributeData(new Float32Array(vertices))
      )
      .setAttribute(
        'normal3d',
        new MeshAttributeData(new Float32Array(normals))
      )
      .setAttribute(
        'uv',
        new MeshAttributeData(new Float32Array(uvs))
      )

    return mesh
  }

  /**
   * Builds a new indexed 3D plane grid in the `z = 0` plane.
   *
   * The mesh contains `position3d`, `normal3d`, and `uv` attributes, with
   * normals pointing along positive z. `widthSegments` and `heightSegments`
   * are floored before generation, and each resulting grid cell contributes
   * two triangles to the index buffer.
   *
   * @param {number} [width=1]
   * @param {number} [height=1]
   * @param {number} [widthSegments=1]
   * @param {number} [heightSegments=1]
   * @returns {Mesh}
   */
  static plane3D(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
    const mesh = new Mesh()
    const widthHalf = width / 2
    const heightHalf = height / 2

    const gridX = Math.floor(widthSegments)
    const gridY = Math.floor(heightSegments)

    const gridX1 = gridX + 1
    const gridY1 = gridY + 1

    const segmentWidth = width / gridX
    const segmentHeight = height / gridY

    //

    const indices = []
    const vertices = []
    const normals = []
    const uvs = []

    for (let iy = 0; iy < gridY1; iy++) {
      const y = iy * segmentHeight - heightHalf

      for (let ix = 0; ix < gridX1; ix++) {
        const x = ix * segmentWidth - widthHalf

        vertices.push(x, -y, 0)
        normals.push(0, 0, 1)
        uvs.push(ix / gridX)
        uvs.push(1 - (iy / gridY))

      }

    }

    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + gridX1 * iy
        const b = ix + gridX1 * (iy + 1)
        const c = (ix + 1) + gridX1 * (iy + 1)
        const d = (ix + 1) + gridX1 * iy

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new MeshAttributeData(new Float32Array(vertices)))
      .setAttribute('normal3d', new MeshAttributeData(new Float32Array(normals)))
      .setAttribute('uv', new MeshAttributeData(new Float32Array(uvs)))

    return mesh
  }

  /**
   * Builds a new indexed annular 3D surface in the `z = 0` plane.
   *
   * The mesh includes `position3d`, `normal3d`, and `uv` attributes, with
   * normals pointing along positive z. `phiSegments` subdivides the radius
   * from `innerRadius` to `outerRadius`; each angular row contains samples
   * from `thetaStart` through `thetaStart + thetaLength`. The supplied
   * segment counts are used directly and are not floored. Adjacent radial and
   * angular samples form cells of two indexed triangles.
   *
   * @param {number} [innerRadius=0.25]
   * @param {number} [outerRadius=0.5]
   * @param {number} [thetaSegments=32]
   * @param {number} [phiSegments=1]
   * @param {number} [thetaStart=0]
   * @param {number} [thetaLength=Math.PI * 2]
   * @returns {Mesh}
   */
  static ring3D(innerRadius = 0.25, outerRadius = 0.5, thetaSegments = 32, phiSegments = 1, thetaStart = 0, thetaLength = Math.PI * 2) {
    const mesh = new Mesh()
    const indices = []
    const vertices = []
    const normals = []
    const uvs = []

    let radius = innerRadius
    const radiusStep = ((outerRadius - innerRadius) / phiSegments)
    const vertex = new Vector3()
    const uv = new Vector2()

    for (let j = 0; j <= phiSegments; j++) {
      for (let i = 0; i <= thetaSegments; i++) {

        const segment = thetaStart + i / thetaSegments * thetaLength

        vertex.x = radius * Math.cos(segment)
        vertex.y = radius * Math.sin(segment)

        vertices.push(vertex.x, vertex.y, vertex.z)

        normals.push(0, 0, 1)

        uv.x = (vertex.x / outerRadius + 1) / 2
        uv.y = (vertex.y / outerRadius + 1) / 2

        uvs.push(uv.x, uv.y)
      }

      radius += radiusStep
    }

    for (let j = 0; j < phiSegments; j++) {
      const thetaSegmentLevel = j * (thetaSegments + 1)

      for (let i = 0; i < thetaSegments; i++) {
        const segment = i + thetaSegmentLevel
        const a = segment
        const b = segment + thetaSegments + 1
        const c = segment + thetaSegments + 2
        const d = segment + 1

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new MeshAttributeData(new Float32Array(vertices)))
      .setAttribute('normal3d', new MeshAttributeData(new Float32Array(normals)))
      .setAttribute('uv', new MeshAttributeData(new Float32Array(uvs)))

    return mesh
  }

  /**
   * Builds a new indexed surface by revolving a 2D profile around the y-axis.
   *
   * Each profile point supplies a radial coordinate from its x value and a y
   * coordinate. The default profile is `(0, -0.5)`, `(0.5, 0)`, and
   * `(0, 0.5)`. The mesh includes `position3d`, `normal3d`, and `uv`
   * attributes, and samples angles from `phiStart` through
   * `phiStart + phiLength`. `segments` is used directly for the revolution
   * rows and is not floored; adjacent profile and revolution rows form two
   * indexed triangles per cell.
   *
   * @param {Vector2[]} [points]
   * @param {number} [segments=12]
   * @param {number} [phiStart=0]
   * @param {number} [phiLength=Math.PI * 2]
   * @returns {Mesh}
   */
  static lathe3D(points = [new Vector2(0, -0.5), new Vector2(0.5, 0), new Vector2(0, 0.5)], segments = 12, phiStart = 0, phiLength = Math.PI * 2) {
    const mesh = new Mesh()
    const indices = []
    const vertices = []
    const uvs = []
    const initNormals = []
    const normals = []

    const inverseSegments = 1.0 / segments
    const vertex = new Vector3()
    const uv = new Vector2()
    const normal = new Vector3()
    const curNormal = new Vector3()
    const prevNormal = new Vector3()
    let dx
    let dy

    for (let j = 0; j <= (points.length - 1); j++) {
      switch (j) {

        // special handling for 1st vertex on path
        case 0:
          dx = points[j + 1].x - points[j].x
          dy = points[j + 1].y - points[j].y

          normal.x = dy * 1.0
          normal.y = -dx
          normal.z = dy * 0.0

          prevNormal.copy(normal)

          normal.normalize()

          initNormals.push(normal.x, normal.y, normal.z)

          break

          // special handling for last Vertex on path
        case (points.length - 1):

          initNormals.push(prevNormal.x, prevNormal.y, prevNormal.z)

          break

        // default handling for all vertices in between
        default:

          dx = points[j + 1].x - points[j].x
          dy = points[j + 1].y - points[j].y

          normal.x = dy * 1.0
          normal.y = -dx
          normal.z = dy * 0.0

          curNormal.copy(normal)

          normal.x += prevNormal.x
          normal.y += prevNormal.y
          normal.z += prevNormal.z

          normal.normalize()

          initNormals.push(normal.x, normal.y, normal.z)

          prevNormal.copy(curNormal)

      }

    }

    for (let i = 0; i <= segments; i++) {
      const phi = phiStart + i * inverseSegments * phiLength

      const sin = Math.sin(phi)
      const cos = Math.cos(phi)

      for (let j = 0; j <= (points.length - 1); j++) {
        vertex.x = points[j].x * sin
        vertex.y = points[j].y
        vertex.z = points[j].x * cos

        vertices.push(vertex.x, vertex.y, vertex.z)

        uv.x = i / segments
        uv.y = j / (points.length - 1)

        uvs.push(uv.x, uv.y)

        const x = initNormals[3 * j + 0] * sin
        const y = initNormals[3 * j + 1]
        const z = initNormals[3 * j + 0] * cos

        normals.push(x, y, z)

      }

    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < (points.length - 1); j++) {
        const base = j + i * points.length

        const a = base
        const b = base + points.length
        const c = base + points.length + 1
        const d = base + 1

        indices.push(a, b, d)
        indices.push(c, d, b)
      }

    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new MeshAttributeData(new Float32Array(vertices)))
      .setAttribute('normal3d', new MeshAttributeData(new Float32Array(normals)))
      .setAttribute('uv', new MeshAttributeData(new Float32Array(uvs)))

    return mesh
  }

  /**
   * Builds a new indexed six-sided box centered at the origin.
   *
   * The mesh has `position3d`, `normal3d`, and `uv` attributes. The width,
   * height, and depth segment arguments control subdivisions along their
   * corresponding dimensions on the box faces and are used directly. The
   * subdivided faces are combined into the index buffer.
   *
   * @param {number} [width=1]
   * @param {number} [height=1]
   * @param {number} [depth=1]
   * @param {number} [widthSegments=1]
   * @param {number} [heightSegments=1]
   * @param {number} [depthSegments=1]
   * @returns {Mesh}
   */
  static cube(width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
    const mesh = new Mesh()

    // SAFETY:We already know they number arrays.
    // @ts-ignore
    const indices = [],

      // @ts-ignore
      vertices = [],

      // @ts-ignore

      normals = [],

      // @ts-ignore
      uvs = []

    let numberOfVertices = 0

    // px
    buildPlane('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments)

    // nx
    buildPlane('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments)

    // py
    buildPlane('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments)

    // ny
    buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments)

    // pz
    buildPlane('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments)

    // nz
    buildPlane('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments)

    // SAFETY: Already guaranteed arrays contain number type.
    mesh

      // @ts-ignore
      .setIndices(new Uint16Array(indices))

      // @ts-ignore
      .setAttribute('position3d', new MeshAttributeData(new Float32Array(vertices)))

      // @ts-ignore
      .setAttribute('normal3d', new MeshAttributeData(new Float32Array(normals)))

      // @ts-ignore
      .setAttribute('uv', new MeshAttributeData(new Float32Array(uvs)))

    /**
     * Appends one subdivided cube face to the mesh buffers.
     *
     * @private
     * @param {string} u
     * @param {string} v
     * @param {string} w
     * @param {number} udir
     * @param {number} vdir
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     * @param {number} gridX
     * @param {number} gridY
     */
    function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY) {
      const segmentWidth = width / gridX
      const segmentHeight = height / gridY

      const widthHalf = width / 2
      const heightHalf = height / 2
      const depthHalf = depth / 2

      const gridX1 = gridX + 1
      const gridY1 = gridY + 1

      let vertexCounter = 0

      const vector = new Vector3()

      for (let iy = 0; iy < gridY1; iy++) {
        const y = iy * segmentHeight - heightHalf

        for (let ix = 0; ix < gridX1; ix++) {
          const x = ix * segmentWidth - widthHalf

          // SAFETY: only used in `Mesh.cube()`,should be fine
          // @ts-ignore
          vector[u] = x * udir

          // @ts-ignore
          vector[v] = y * vdir

          // @ts-ignore
          vector[w] = depthHalf

          vertices.push(vector.x, vector.y, vector.z)

          // SAFETY: only used in `Mesh.cube()`,should be fine
          // @ts-ignore
          vector[u] = 0

          // @ts-ignore
          vector[v] = 0

          // @ts-ignore
          vector[w] = depth > 0 ? 1 : -1

          normals.push(vector.x, vector.y, vector.z)

          uvs.push(ix / gridX)
          uvs.push(1 - (iy / gridY))

          vertexCounter += 1
        }
      }

      for (let iy = 0; iy < gridY; iy++) {
        for (let ix = 0; ix < gridX; ix++) {

          const a = numberOfVertices + ix + gridX1 * iy
          const b = numberOfVertices + ix + gridX1 * (iy + 1)
          const c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1)
          const d = numberOfVertices + (ix + 1) + gridX1 * iy

          indices.push(a, b, d)
          indices.push(b, c, d)
        }
      }

      numberOfVertices += vertexCounter
    }

    return mesh
  }

  /**
   * Builds a new indexed UV sphere, optionally limited to angular ranges.
   *
   * The mesh contains `position3d`, `normal3d`, and `uv` attributes.
   * `widthSegments` and `heightSegments` control the subdivisions around the
   * phi and theta directions. Vertices use phi angles from `phiStart` through
   * `phiStart + phiLength` and theta angles from `thetaStart` through
   * `thetaStart + thetaLength`. For index generation, the effective theta end
   * is `Math.min(thetaStart + thetaLength, Math.PI)`; pole-row triangles are
   * omitted when the corresponding pole is reached. Segment counts are used
   * directly and are not floored; the remaining grid cells are connected by
   * the index buffer.
   *
   * @param {number} [radius=0.5]
   * @param {number} [widthSegments=32]
   * @param {number} [heightSegments=16]
   * @param {number} [phiStart=0]
   * @param {number} [phiLength=Math.PI * 2]
   * @param {number} [thetaStart=0]
   * @param {number} [thetaLength=Math.PI]
   * @returns {Mesh}
   */
  static uvSphere(radius = 0.5, widthSegments = 32, heightSegments = 16, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI) {
    const mesh = new Mesh()
    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI)
    let index = 0
    const grid = []
    const vertex = new Vector3()
    const normal = new Vector3()

    const indices = []
    const vertices = []
    const normals = []
    const uvs = []

    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow = []
      const v = iy / heightSegments
      let uOffset = 0

      if (iy === 0 && thetaStart === 0) {
        uOffset = 0.5 / widthSegments
      } else if (iy === heightSegments && thetaEnd === Math.PI) {
        uOffset = -0.5 / widthSegments
      }

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments

        vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)
        vertex.y = radius * Math.cos(thetaStart + v * thetaLength)
        vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)

        vertices.push(vertex.x, vertex.y, vertex.z)

        normal.copy(vertex).normalize()
        normals.push(normal.x, normal.y, normal.z)

        uvs.push(u + uOffset, 1 - v)
        verticesRow.push(index += 1)
      }

      grid.push(verticesRow)
    }

    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1]
        const b = grid[iy][ix]
        const c = grid[iy + 1][ix]
        const d = grid[iy + 1][ix + 1]

        if (iy !== 0 || thetaStart > 0) indices.push(a, b, d)
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d)
      }

    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new MeshAttributeData(new Float32Array(vertices)))
      .setAttribute('normal3d', new MeshAttributeData(new Float32Array(normals)))
      .setAttribute('uv', new MeshAttributeData(new Float32Array(uvs)))

    return mesh

  }

  /**
   * Builds a new indexed torus.
   *
   * The mesh contains `position3d`, `normal3d`, and `uv` attributes. `radius`
   * is the distance from the origin to the tube centerline, `tube` is the
   * tube radius, and `arc` is the sweep around the central ring from angle `0`
   * through `arc`. The radial and tubular segment counts are used directly
   * and are not floored; each grid cell contributes two indexed triangles.
   *
   * @param {number} [radius=0.375]
   * @param {number} [tube=0.125]
   * @param {number} [radialSegments=12]
   * @param {number} [tubularSegments=48]
   * @param {number} [arc=Math.PI * 2]
   * @returns {Mesh}
   */
  static torus(radius = 0.375, tube = 0.125, radialSegments = 12, tubularSegments = 48, arc = Math.PI * 2) {
    const mesh = new Mesh()
    const indices = []
    const vertices = []
    const normals = []
    const uvs = []

    const center = new Vector3()
    const vertex = new Vector3()
    const normal = new Vector3()

    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments * arc
        const v = j / radialSegments * Math.PI * 2

        vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u)
        vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u)
        vertex.z = tube * Math.sin(v)

        vertices.push(vertex.x, vertex.y, vertex.z)

        center.x = radius * Math.cos(u)
        center.y = radius * Math.sin(u)

        Vector3.subtract(vertex, center, normal).normalize()

        normals.push(normal.x, normal.y, normal.z)

        uvs.push(i / tubularSegments)
        uvs.push(j / radialSegments)
      }
    }

    for (let j = 1; j <= radialSegments; j++) {

      for (let i = 1; i <= tubularSegments; i++) {
        const a = (tubularSegments + 1) * j + i - 1
        const b = (tubularSegments + 1) * (j - 1) + i - 1
        const c = (tubularSegments + 1) * (j - 1) + i
        const d = (tubularSegments + 1) * j + i

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new MeshAttributeData(new Float32Array(vertices)))
      .setAttribute('normal3d', new MeshAttributeData(new Float32Array(normals)))
      .setAttribute('uv', new MeshAttributeData(new Float32Array(uvs)))

    return mesh

  }

  /**
   * Builds a new indexed cylinder or tapered cylinder with optional end caps.
   *
   * The mesh contains `position3d`, `normal3d`, and `uv` attributes. The side
   * linearly changes from `radiusTop` at `y = height / 2` to `radiusBottom`
   * at `y = -height / 2`. `radialSegments` and `heightSegments` control the
   * angular and vertical subdivisions and are used directly. Side and cap
   * vertices use angles from `thetaStart` through `thetaStart + thetaLength`.
   * When `openEnded` is exactly `false`, a top cap is added only when
   * `radiusTop > 0`, and a bottom cap is added only when `radiusBottom > 0`;
   * side cells and cap sectors are added to the index buffer.
   *
   * @param {number} [radiusTop=0.5]
   * @param {number} [radiusBottom=0.5]
   * @param {number} [height=1]
   * @param {number} [radialSegments=32]
   * @param {number} [heightSegments=1]
   * @param {boolean} [openEnded=false]
   * @param {number} [thetaStart=0]
   * @param {number} [thetaLength=Math.PI * 2]
   * @returns {Mesh}
   */
  static cylinder(radiusTop = 0.5, radiusBottom = 0.5, height = 1, radialSegments = 32, heightSegments = 1, openEnded = false, thetaStart = 0, thetaLength = Math.PI * 2) {
    const mesh = new Mesh()
    const indices = []
    const vertices = []
    const normals = []
    const uvs = []
    const indexArray = []

    let offset = 0
    const halfHeight = height / 2

    const normal = new Vector3()
    const slope = (radiusBottom - radiusTop) / height

    for (let y = 0; y <= heightSegments; y++) {
      const indexRow = []
      const v = y / heightSegments
      const radius = v * (radiusBottom - radiusTop) + radiusTop

      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments
        const theta = u * thetaLength + thetaStart
        const sinTheta = Math.sin(theta)
        const cosTheta = Math.cos(theta)

        vertices.push(
          radius * sinTheta,
          -v * height + halfHeight,
          radius * cosTheta
        )
        normal.set(sinTheta, slope, cosTheta).normalize()
        normals.push(normal.x, normal.y, normal.z)
        uvs.push(u, 1 - v)
        indexRow.push(offset += 1)
      }

      indexArray.push(indexRow)
    }

    for (let x = 0; x < radialSegments; x++) {
      for (let y = 0; y < heightSegments; y++) {
        const a = indexArray[y][x]
        const b = indexArray[y + 1][x]
        const c = indexArray[y + 1][x + 1]
        const d = indexArray[y][x + 1]

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    if (openEnded === false) {

      if (radiusTop > 0) generateCap(true)
      if (radiusBottom > 0) generateCap(false)

    }

    mesh
      .setIndices(new Uint16Array(indices))
      .setAttribute('position3d', new MeshAttributeData(new Float32Array(vertices)))
      .setAttribute('normal3d', new MeshAttributeData(new Float32Array(normals)))
      .setAttribute('uv', new MeshAttributeData(new Float32Array(uvs)))

    /**
     * @param {boolean} top
     */
    function generateCap(top) {
      const centerIndexStart = offset

      const uv = new Vector2()
      const vertex = new Vector3()
      const radius = (top === true) ? radiusTop : radiusBottom
      const sign = (top === true) ? 1 : -1

      for (let x = 1; x <= radialSegments; x++) {
        vertices.push(0, halfHeight * sign, 0)
        normals.push(0, sign, 0)
        uvs.push(0.5, 0.5)
        offset += 1
      }

      const centerIndexEnd = offset

      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments
        const theta = u * thetaLength + thetaStart
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)

        vertex.x = radius * sinTheta
        vertex.y = halfHeight * sign
        vertex.z = radius * cosTheta
        vertices.push(vertex.x, vertex.y, vertex.z)
        normals.push(0, sign, 0)
        uv.x = (cosTheta * 0.5) + 0.5
        uv.y = (sinTheta * 0.5 * sign) + 0.5
        uvs.push(uv.x, uv.y)
        offset += 1
      }

      for (let x = 0; x < radialSegments; x++) {
        const c = centerIndexStart + x
        const i = centerIndexEnd + x

        if (top === true) {
          indices.push(i, i + 1, c)
        } else {
          indices.push(i + 1, i, c)
        }
      }
    }

    return mesh
  }

  /**
   * Builds a new indexed cone using {@linkcode Mesh.cylinder} with a zero top
   * radius and the supplied radius as its bottom radius.
   *
   * The cylinder's attributes, segment handling, angular range, and cap
   * behavior are preserved. With `openEnded` exactly `false`, only the bottom
   * cap can be generated, and only when `radius > 0`; the zero top radius
   * cannot produce a top cap.
   *
   * @param {number} [radius=0.5]
   * @param {number} [height=1]
   * @param {number} [radialSegments=32]
   * @param {number} [heightSegments=1]
   * @param {boolean} [openEnded=false]
   * @param {number} [thetaStart=0]
   * @param {number} [thetaLength=Math.PI * 2]
   * @returns {Mesh}
   */
  static cone(radius = 0.5, height = 1, radialSegments = 32, heightSegments = 1, openEnded = false, thetaStart = 0, thetaLength = Math.PI * 2) {

    return Mesh.cylinder(0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
  }

  /**
   * Creates and returns a new empty mesh.
   *
   * The returned mesh has `indices` set to `undefined` and a new empty
   * attribute map. Each call returns a distinct mesh.
   *
   * @returns {Mesh}
   */
  static default() {
    return new Mesh()
  }
}

/**
 * Plain serialized representation produced by {@linkcode Mesh.serialize}.
 *
 * @typedef MeshSerial
 * @property {number[] | undefined} indices
 * @property {[string, MeshAttributeDataSerial][]} attributes
 */
