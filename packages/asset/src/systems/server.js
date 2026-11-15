/** @import { SystemFunc, World } from '@wimaengine/ecs' */
/** @import { Constructor } from '@wimaengine/type' */
/** @import { AssetDropped } from '../events' */
/** @import { AppSchedule, CoreSystems } from '@wimaengine/core' */
/** @import { AssetExporterPlugin, AssetPlugin, AssetServerPlugin } from '../plugins' */
/** @import { AssetImporterPlugin } from '../plugins' */
/** @import { EventPlugin } from '@wimaengine/event' */
import { Events } from '@wimaengine/event'
import { assert } from '@wimaengine/logger'
import { TypeRegistry } from '@wimaengine/reflect'
import { typeidGeneric } from '@wimaengine/type'
import { Exporter, Importer } from '../core'
import { AssetLoadFail, AssetLoadOperation, AssetLoadSuccess, AssetSaveSuccess } from '../events'
import { AssetServer, Assets, LoadState } from '../resources'

/**
 * Creates the Startup system that registers one typed asset pool with an
 * {@linkcode AssetServer}.
 *
 * The factory captures `type`; the returned {@linkcode SystemFunc} receives only
 * `world`. On execution it gets the world's {@linkcode AssetServer}, looks up
 * the typed {@linkcode Assets} pool under
 * {@linkcode typeidGeneric}({@linkcode Assets}, [type]), and passes that exact
 * pool to {@linkcode AssetServer#registerAsset}. The typed lookup asserts if the
 * matching pool has not been staged, and this factory does not create the pool
 * itself.
 *
 * {@linkcode AssetPlugin} stages the pool and installs the returned system in
 * {@linkcode AppSchedule.Startup} and {@linkcode CoreSystems.Start}. The world's
 * {@linkcode AssetServer} must be supplied by {@linkcode AssetServerPlugin} or
 * another setup path before {@linkcode AppSchedule.Startup} runs.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AssetServer, Assets, registerAssetOnAssetServer } from '@wimaengine/asset'
 * import { typeidGeneric } from '@wimaengine/type'
 *
 * class Texture {}
 * const world = new World()
 * world.setResource(new AssetServer())
 * world.setResourceByTypeId(typeidGeneric(Assets, [Texture]), new Assets(Texture))
 * registerAssetOnAssetServer(Texture)(world)
 * // AssetPlugin stages these resources and schedules this system automatically.
 * ```
 *
 * @template T
 * @param {Constructor<T>} type - Constructor identifying the typed asset pool
 * to look up and register.
 * @returns {SystemFunc} Startup system that registers the matching
 * {@linkcode Assets} resource with the world's {@linkcode AssetServer}.
 */
export function registerAssetOnAssetServer(type) {
  return function registerAssetOnAssetServer(world) {
    const server = world.getResource(AssetServer)
    const assets = world.getResourceByTypeId(typeidGeneric(Assets, [type]))

    server.registerAsset(assets)
  }
}

/**
 * Creates the Startup system used to register an {@linkcode Importer} with the
 * world's {@linkcode AssetServer}.
 *
 * The factory captures `type` and `importer`. The returned system accepts only
 * the `world` argument. When it runs, it gets the server and forwards both
 * captured values to {@linkcode AssetServer#registerImporter}.
 *
 * The server's {@linkcode AssetServer#registerImporter} method does not read or
 * validate its `type` argument. It indexes the importer by
 * {@linkcode Importer#asset} and the extensions returned by
 * {@linkcode Importer#getExtensions}; pass a matching constructor and importer.
 * The {@linkcode AssetImporterPlugin} installs this returned system in the
 * one-shot {@linkcode AppSchedule.Startup} schedule and
 * {@linkcode CoreSystems.Start} group.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AssetServer, Importer, registerAssetImporterOnAssetServer } from '@wimaengine/asset'
 *
 * class Texture {}
 * class TextureImporter extends Importer {
 *   constructor() { super(Texture) }
 *   getExtensions() { return ['png'] }
 * }
 *
 * const world = new World()
 * world.setResource(new AssetServer())
 * registerAssetImporterOnAssetServer(Texture, new TextureImporter())(world)
 * // AssetImporterPlugin schedules this registration during Startup/Start.
 * ```
 *
 * @template T
 * @param {Constructor<T>} type - Constructor forwarded to
 * {@linkcode AssetServer#registerImporter}.
 * @param {Importer<T>} importer - Importer instance whose asset constructor
 * and extensions are indexed by the server.
 * @returns {SystemFunc} Startup system that registers the importer with the
 * world's {@linkcode AssetServer}.
 */
export function registerAssetImporterOnAssetServer(type, importer) {
  return function registerAssetImporterOnAssetServer(world) {
    const server = world.getResource(AssetServer)

    server.registerImporter(type, importer)
  }
}

/**
 * Creates the {@linkcode AppSchedule.Startup} system that registers an
 * {@linkcode Exporter} with the world's {@linkcode AssetServer}.
 *
 * The factory captures `type` and `exporter`. The returned {@linkcode SystemFunc}
 * accepts only the `world` argument. When it runs, it gets the server and
 * forwards both captured values to {@linkcode AssetServer#registerExporter}.
 *
 * The server's {@linkcode AssetServer#registerExporter} method does not read or
 * validate its `type` argument. It indexes the exporter by
 * {@linkcode Exporter#asset} and every extension returned by
 * {@linkcode Exporter#getExtensions}; pass a matching constructor and exporter.
 * The {@linkcode AssetExporterPlugin} installs this returned system in the
 * one-shot {@linkcode AppSchedule.Startup} schedule and
 * {@linkcode CoreSystems.Start} group.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AssetServer, Exporter, registerAssetExporterOnAssetServer } from '@wimaengine/asset'
 *
 * class Texture {}
 * class TextureExporter extends Exporter {
 *   constructor() { super(Texture) }
 *   getExtensions() { return ['png'] }
 * }
 *
 * const world = new World()
 * world.setResource(new AssetServer())
 * registerAssetExporterOnAssetServer(Texture, new TextureExporter())(world)
 * // AssetExporterPlugin schedules this registration during Startup/Start.
 * ```
 *
 * @template T
 * @param {Constructor<T>} type - Constructor forwarded to
 * {@linkcode AssetServer#registerExporter}.
 * @param {Exporter<T>} exporter - Exporter instance whose asset constructor
 * and extensions are indexed by the server.
 * @returns {SystemFunc} {@linkcode AppSchedule.Startup} system that registers
 * the exporter with the world's {@linkcode AssetServer}.
 */
export function registerAssetExporterOnAssetServer(type, exporter) {
  return function registerAssetExportedOnAssetServer(world) {
    const server = world.getResource(AssetServer)

    server.registerExporter(type, exporter)
  }
}

/* eslint-disable jsdoc/check-tag-names */
/**
 * Processes one batch of queued loads and saves for the world's
 * {@linkcode AssetServer}.
 *
 * {@linkcode AssetServerPlugin} registers this function directly in the repeating
 * {@linkcode AppSchedule.Update} schedule's {@linkcode CoreSystems.PostMain} group.
 * It resolves the world's {@linkcode AssetServer}, {@linkcode TypeRegistry}, and
 * typed result-event resources, drains both server queues, and processes the
 * drained load batch before the drained save batch. A request queued while a
 * batch is being processed belongs to the next update, because queue draining
 * replaces the server's pending queue before the asynchronous work starts.
 *
 * Loads are resolved by the asset type ID and the path extension through
 * {@linkcode AssetServer#getImporter}. The system fetches the path, requires an
 * OK response, and passes the response and {@linkcode TypeRegistry} to
 * {@linkcode Importer#deserialize}. A truthy imported value is written to the
 * registered {@linkcode Assets} pool at the requested asset ID; only then is its
 * {@linkcode LoadState} changed to `Loaded` and an {@linkcode AssetLoadSuccess} event
 * written. A missing importer, unsuccessful response, falsy imported value,
 * missing asset pool, or thrown error changes that request to `Failed` and
 * writes {@linkcode AssetLoadFail}; the system then continues with the next load.
 * Failure text is taken from a thrown string or `Error.message`, with a
 * generic fallback for other values.
 *
 * Saves with a pre-existing request reason immediately write
 * {@linkcode AssetLoadFail} with {@linkcode AssetLoadOperation.Saving}. Other saves
 * read the asset from its typed pool, resolve an {@linkcode Exporter} by asset
 * type and path extension, serialize with the {@linkcode TypeRegistry}, and send
 * the result with `fetch(path, { method: 'POST', body })`. An OK response
 * writes {@linkcode AssetSaveSuccess}; missing assets, exporter lookup failures,
 * serialization or request failures write a saving {@linkcode AssetLoadFail} and
 * do not mutate the asset pool or load metadata. Save failures also do not
 * stop later saves in the drained batch.
 *
 * The typed result-event resources are the {@linkcode Events} resources created
 * by the nested event plugins in {@linkcode AssetServerPlugin}; this system only
 * writes their events. Missing required resources or failures while draining
 * the queues occur before request-level `try` blocks and therefore reject the
 * system call.
 *
 * @example
 * ```js
 * class Texture {}
 *
 * function requestTexture(world) {
 *   const server = world.getResource(AssetServer)
 *   return server.load(Texture, '/textures/player.png')
 * }
 *
 * function queueConfiguredTexture(world) {
 *   // AssetPlugin, an importer for `png`, and AssetServerPlugin are configured.
 *   // AssetServerPlugin runs updateAssets in Update/PostMain automatically.
 *   return requestTexture(world)
 * }
 * ```
 *
 * @param {World} world - World containing the {@linkcode AssetServer},
 * {@linkcode TypeRegistry}, and typed load/save result-event resources.
 * @returns {Promise<void>} Resolves after this update's drained load and save
 * requests have been processed.
 * @category system
 */
export async function updateAssets(world) {
  const server = world.getResource(AssetServer)

  /** @type {Events<AssetLoadSuccess>} */
  const loadSuccessEvents = world.getResourceByTypeId(typeidGeneric(Events, [AssetLoadSuccess]))

  /** @type {Events<AssetSaveSuccess>} */
  const saveSuccessEvents = world.getResourceByTypeId(typeidGeneric(Events, [AssetSaveSuccess]))

  /** @type {Events<AssetLoadFail>} */
  const loadFailEvents = world.getResourceByTypeId(typeidGeneric(Events, [AssetLoadFail]))
  const typeRegistry = world.getResource(TypeRegistry)

  const loadRequests = server.flushLoadRequests()
  const saveRequests = server.flushSaveRequests()

  for (let i = 0; i < loadRequests.length; i++) {
    const { assetId, info, path, typeId } = loadRequests[i]

    try {
      const importer = server.getImporter(typeId, path)
      const response = await fetch(path)

      if (!response.ok) {
        throw response.statusText
      }

      const asset = await importer.deserialize(response, typeRegistry)

      if (!asset) {
        throw 'Could not deserialize the asset.'
      }

      const assets = server.getAssets(typeId)

      assert(assets, `No assets registered for the asset type \`${typeId}\` on \`AssetServer\``)

      assets.setUsingAssetId(assetId, asset)
      server.setLoadState(info, LoadState.Loaded)
      loadSuccessEvents.write(new AssetLoadSuccess(typeId, assetId, path))
    } catch(error) {
      server.setLoadState(info, LoadState.Failed)
      let message = 'Could not load the asset.'

      if (typeof error === 'string') {
        message = error
      } else if (error instanceof Error) {
        const { message: errorMessage } = error

        message = errorMessage
      }

      loadFailEvents.write(new AssetLoadFail(typeId, assetId, path, message))
    }
  }

  for (let i = 0; i < saveRequests.length; i++) {
    const { assetId, path, reason, typeId } = saveRequests[i]

    if (reason) {
      loadFailEvents.write(new AssetLoadFail(typeId, assetId, path, reason, AssetLoadOperation.Saving))
      continue
    }

    try {
      const assets = server.getAssets(typeId)

      assert(assets, `No assets registered for the asset type \`${typeId}\` on \`AssetServer\``)

      const asset = assets.getByAssetId(assetId)

      if (asset === undefined) {
        throw 'Could not find the asset to export.'
      }

      const exporter = server.getExporter(typeId, path)
      const response = await fetch(path, {
        method: 'POST',
        body: await exporter.serialize(asset, typeRegistry)
      })

      if (!response.ok) {
        throw response.statusText
      }

      saveSuccessEvents.write(new AssetSaveSuccess(typeId, assetId, path))
    } catch(error) {
      let message = 'Could not export the asset.'

      if (typeof error === 'string') {
        message = error
      } else if (error instanceof Error) {
        const { message: errorMessage } = error

        message = errorMessage
      }

      loadFailEvents.write(new AssetLoadFail(typeId, assetId, path, message, AssetLoadOperation.Saving))
    }
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * Creates a cleanup system that removes dropped-asset metadata from the world's
 * {@linkcode AssetServer}.
 *
 * The factory captures the constructor for one typed {@linkcode AssetDropped}
 * payload. The returned {@linkcode SystemFunc} receives only `world`, then looks
 * up `Events<U>` under {@linkcode typeidGeneric}(`Events`, [dropEvent]) and the
 * {@linkcode AssetServer} resource. It visits the events currently readable by
 * {@linkcode Events#each}; each callback exposes the dropped asset ID, and the
 * system calls {@linkcode AssetServer#dropAssetInfo} for that ID.
 *
 * This system removes server metadata only. It does not clear the event
 * buffer, remove an asset from {@linkcode Assets}, or release a handle. The
 * {@linkcode AssetPlugin} stages the typed event resource through
 * {@linkcode EventPlugin} and registers this returned system in the repeating
 * {@linkcode AppSchedule.Update} schedule's {@linkcode CoreSystems.End} group when
 * `events.dropped` is provided.
 *
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { AssetDropped, AssetServer, Events, unloadDroppedAssets } from '@wimaengine/asset'
 * import { typeidGeneric } from '@wimaengine/type'
 *
 * class Texture {}
 * const world = new World()
 * const dropped = new Events()
 * world.setResource(new AssetServer())
 * world.setResourceByTypeId(typeidGeneric(Events, [AssetDropped]), dropped)
 * dropped.write(new AssetDropped(Texture, 0))
 * dropped.clear()
 * unloadDroppedAssets(AssetDropped)(world)
 * // AssetPlugin schedules this cleanup in Update/CoreSystems.End.
 * ```
 *
 * @template T
 * @template {AssetDropped<T>} U
 * @param {Constructor<U>} dropEvent - Constructor identifying the typed
 * dropped-event resource to read.
 * @returns {SystemFunc} Cleanup system that removes metadata for each
 * readable dropped event.
 */
export function unloadDroppedAssets(dropEvent) {
  return function unloadDroppedAssets(world) {

    /** @type {Events<U>} */
    const events = world.getResourceByTypeId(typeidGeneric(Events, [dropEvent]))
    const server = world.getResource(AssetServer)

    events.each((event) => {
      const { data } = event

      server.dropAssetInfo(data.id)
    })
  }
}
