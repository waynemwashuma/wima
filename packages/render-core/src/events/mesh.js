/** @import { RenderCorePlugin } from '../plugin' */

import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { Mesh } from '../assets'

/**
 * Identifies a mesh asset becoming available in the typed mesh lifecycle
 * stream.
 *
 * {@linkcode RenderCorePlugin} registers this {@linkcode AssetAdded} subtype for
 * the {@linkcode Mesh} asset family. This class adds no fields or constructor;
 * it inherits the `type` and `id` payload from {@linkcode AssetAdded}. The
 * `type` identifies the {@linkcode Mesh} family, and `id` identifies the
 * affected mesh asset. Consumers read the payload from `event.data`.
 *
 * @inheritdoc
 * @augments AssetAdded<Mesh>
 */
export class MeshAdded extends AssetAdded {}

/**
 * Identifies replacement of an existing mesh asset in the typed mesh
 * lifecycle stream.
 *
 * {@linkcode RenderCorePlugin} registers this {@linkcode AssetModified} subtype for
 * the {@linkcode Mesh} asset family. This class adds no fields or constructor;
 * it inherits the `type` and `id` payload from {@linkcode AssetModified}. The
 * payload identifies the changed entry through its `id` and `type`; it does
 * not include either mesh value.
 *
 * @inheritdoc
 * @augments AssetModified<Mesh>
 */
export class MeshModified extends AssetModified {}

/**
 * Identifies removal of a mesh asset from the typed mesh lifecycle stream.
 *
 * {@linkcode RenderCorePlugin} registers this {@linkcode AssetDropped} subtype for
 * the {@linkcode Mesh} asset family. When the mesh's final reference is
 * released, the event inherits the `type` and `id` payload from
 * {@linkcode AssetDropped}. The `type` identifies the {@linkcode Mesh} family and
 * `id` identifies the removed entry; the dropped mesh value is not included.
 *
 * @inheritdoc
 * @augments AssetDropped<Mesh>
 */
export class MeshDropped extends AssetDropped {}
