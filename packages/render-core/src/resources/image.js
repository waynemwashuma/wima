/** @import { TypeRegistry } from '@wimaengine/reflect' */
import { Importer } from '@wimaengine/asset'
import { Vector2 } from '@wimaengine/math'
import { Image } from '../assets'

/**
 * Converts browser image responses into `Image` assets.
 *
 * `RenderCorePlugin` registers this importer for `Image`. It reports the exact
 * `png` and `jpeg` extension labels, so API users can load those image paths
 * through `AssetServer`.
 *
 * @example
 * ```js
 * import { AssetServer } from '@wimaengine/asset'
 * import { Image, ImageAssets } from '@wimaengine/render-core'
 *
 * // RenderCorePlugin and AssetServerPlugin are registered and started.
 * const server = world.getResource(AssetServer)
 * const handle = server.load(Image, '/textures/player.png')
 *
 * // The request is queued; `image` is available after loading completes.
 * const image = world.getResource(ImageAssets).get(handle)
 * // `image` is undefined until the load has completed.
 * ```
 *
 * @augments {Importer<Image>}
 */
export class ImageImporter extends Importer {

  /**
   * Associates this importer with the `Image` asset constructor.
   *
   * @inheritdoc
   */
  constructor() {
    super(Image)
  }

  /**
   * Returns the exact extension labels `['png', 'jpeg']`.
   *
   * @inheritdoc
   */
  getExtensions() {

    // TODO: Actually get the supported image formats
    return ['png', 'jpeg']
  }

  /**
   * Reads the response body as an `ArrayBuffer`, then uses the browser to
   * determine the image dimensions.
   *
   * The returned `Image` stores the response bytes in a `Uint8ClampedArray`
   * together with the browser-derived width and height. The `_typeRegistry`
   * argument is accepted for the inherited importer contract but is unused
   * for this image format.
   *
   * @inheritdoc
   * @param {Response} response - Response containing the image bytes.
   * @param {TypeRegistry} _typeRegistry - Importer type registry, unused for
   * this image format.
   * @returns {Promise<Image>} The image containing the response bytes and
   * browser-derived dimensions.
   */
  async deserialize(response, _typeRegistry) {
    const raw = await response.arrayBuffer()
    const dimensions = await getDimensions(raw)

    return new Image(new Uint8ClampedArray(raw), dimensions)
  }
}

/**
 * @param {BlobPart} raw
 * @returns {Promise<Vector2>}
 */
function getDimensions(raw) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([raw]))
    const img = document.createElement('img')

    img.onload = () => {
      resolve(new Vector2(img.width, img.height))
      URL.revokeObjectURL(url)
    }
    img.src = url

  })
}
