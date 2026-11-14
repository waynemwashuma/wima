import { Assets } from '@wimaengine/asset'
import { BasicMaterial, Mesh, Image } from '../assets'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Typed resource alias for the shared {@linkcode Assets} pool of {@linkcode Mesh}
 * assets. It inherits {@linkcode Assets} behavior, including {@linkcode Assets#add}
 * and {@linkcode Assets#get}, for storing and resolving mesh handles.
 * {@linkcode RenderCorePlugin} registers the pool for access through
 * `world.getResource` and {@linkcode MeshAssets}.
 *
 * @example
 * ```js
 * import { MeshAssets } from '@wimaengine/render-core'
 *
 * function lookupMesh(world, meshHandle) {
 *   const meshes = world.getResource(MeshAssets)
 *   return meshes.get(meshHandle)
 * }
 * ```
 *
 * @augments {Assets<Mesh>}
 * @category resource-alias
 */
export class MeshAssets extends Assets { }
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Typed resource alias for the shared {@linkcode Assets} pool of
 * {@linkcode BasicMaterial} assets. It inherits {@linkcode Assets} behavior,
 * including {@linkcode Assets#add} and {@linkcode Assets#get}, for storing and
 * resolving material handles. {@linkcode RenderCorePlugin} registers the pool
 * for access through `world.getResource` and {@linkcode BasicMaterialAssets}.
 *
 * @example
 * ```js
 * import { BasicMaterialAssets } from '@wimaengine/render-core'
 *
 * function lookupMaterial(world, materialHandle) {
 *   const materials = world.getResource(BasicMaterialAssets)
 *   return materials.get(materialHandle)
 * }
 * ```
 *
 * @augments {Assets<BasicMaterial>}
 * @category resource-alias
 */
export class BasicMaterialAssets extends Assets { }
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Typed resource alias for the shared {@linkcode Assets} pool of {@linkcode Image}
 * assets. It inherits {@linkcode Assets} behavior, including {@linkcode Assets#add}
 * and {@linkcode Assets#get}, for storing and resolving image handles.
 *
 * {@linkcode RenderCorePlugin} registers the pool for access through
 * `world.getResource` and {@linkcode ImageAssets}. {@linkcode AssetServer} can
 * supply a handle while an image loads; resolve it with {@linkcode Assets#get}
 * after the asset becomes available.
 *
 * @example
 * ```js
 * import { AssetServer } from '@wimaengine/asset'
 * import { Image, ImageAssets } from '@wimaengine/render-core'
 *
 * function requestImage(world, path) {
 *   const server = world.getResource(AssetServer)
 *   const handle = server.load(Image, path)
 *   const images = world.getResource(ImageAssets)
 *   const image = images.get(handle)
 *
 *   // Loading is processed asynchronously, so `image` may be undefined yet.
 *   return image?.dimensions
 * }
 * ```
 *
 * @augments {Assets<Image>}
 * @category resource-alias
 */
export class ImageAssets extends Assets { }
/* eslint-enable jsdoc/check-tag-names */
