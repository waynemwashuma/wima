/** @import { AppSchedule, CoreSystems } from '@wimaengine/core' */
/** @import { EventPlugin } from '@wimaengine/event' */
/** @import { SystemFunc, World } from '@wimaengine/ecs' */
/** @import { Constructor } from '@wimaengine/type' */

import { Events } from '@wimaengine/event'
import { error, warnOnce } from '@wimaengine/logger'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { AssetAdded, AssetDropped, AssetModified, AssetLoadFail, AssetLoadOperation } from '../events'
import { Assets as ResourceAssets } from '../resources'

/**
 * Creates a system that forwards one typed asset pool's queued lifecycle
 * events to typed {@linkcode Events} resources.
 *
 * The factory captures `assetType` and the three constructors in `eventType`
 * and uses them to compute these resource IDs:
 * `typeidGeneric(Assets, [assetType])`,
 * `typeidGeneric(Events, [eventType.added])`,
 * `typeidGeneric(Events, [eventType.modified])`, and
 * `typeidGeneric(Events, [eventType.dropped])`. The factory does not look up
 * resources or run a system until the returned function receives a `World`.
 * The event constructors identify the typed `Events` resources; routing uses
 * the {@linkcode AssetAdded}, {@linkcode AssetModified}, and {@linkcode AssetDropped}
 * lifecycle base classes produced by {@linkcode Assets}.
 *
 * Each invocation gets all four resources with
 * {@linkcode World#getResourceByTypeId}, so a missing typed resource throws. It
 * then calls {@linkcode Assets#flushEvents}, which returns the queued batch in
 * mutation order and starts a fresh queue when that batch is non-empty.
 * Added, modified, and dropped values are written to their matching
 * `Events` resource. Writing makes them pending; they become readable when
 * the event resource is cleared. Any other event value is discarded after
 * `warnOnce` logs that its constructor is not handled.
 *
 * When {@linkcode AssetPlugin} receives an `events` option, it creates the typed
 * event resources and registers this system in the repeating
 * {@linkcode AppSchedule.Update} schedule's {@linkcode CoreSystems.End} group.
 * Releases processed during the same update can produce an
 * {@linkcode AssetDropped} value for this flush. The nested {@linkcode EventPlugin}
 * instances provide the event resources and automatic buffer clearing. For
 * manual setup, stage those same resources under the IDs above and register
 * the returned system in the corresponding Update/End phase.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetAdded, AssetDropped, AssetModified, AssetPlugin, updateAssetEvents } from '@wimaengine/asset'
 *
 * class Texture {}
 * const events = {
 *   added: AssetAdded,
 *   modified: AssetModified,
 *   dropped: AssetDropped
 * }
 *
 * const system = updateAssetEvents(Texture, events)
 * const app = new App()
 * app.registerPlugin(new AssetPlugin({ asset: Texture, events }))
 * // AssetPlugin creates an equivalent system and places it in
 * // AppSchedule.Update/CoreSystems.End.
 * ```
 *
 * @template T
 * @param {Constructor<T>} assetType - Constructor identifying the typed
 * asset pool and its `Assets<T>` resource ID.
 * @param {AssetEvents<T>} eventType - Constructors identifying the typed
 * `Events` resources for added, modified, and dropped lifecycle values.
 * @returns {SystemFunc} System that accepts a {@linkcode World}, flushes the
 * asset pool, and writes recognized lifecycle values to typed event resources.
 * @throws {Error} If the returned system cannot find the typed asset or event
 * resource in its world.
 */
export function updateAssetEvents(assetType, eventType) {
  const assetsId = typeidGeneric(ResourceAssets, [assetType])
  const addEventsId = typeidGeneric(Events, [eventType.added])
  const modifiedEventsId = typeidGeneric(Events, [eventType.modified])
  const droppedEventsId = typeidGeneric(Events, [eventType.dropped])

  return function updateAssetEvents(world) {

    /** @type {ResourceAssets<T>} */
    const assets = world.getResourceByTypeId(assetsId)

    /** @type {Events<AssetAdded<T>>} */
    const addedEvents = world.getResourceByTypeId(addEventsId)

    /** @type {Events<AssetModified<T>>} */
    const modifiedEvents = world.getResourceByTypeId(modifiedEventsId)

    /** @type {Events<AssetDropped<T>>} */
    const droppedEvents = world.getResourceByTypeId(droppedEventsId)

    const events = assets.flushEvents()

    for (let i = 0; i < events.length; i++) {
      const event = events[i]

      if (event instanceof AssetAdded) {
        addedEvents.write(event)
      } else if (event instanceof AssetModified) {
        modifiedEvents.write(event)
      } else if (event instanceof AssetDropped) {
        droppedEvents.write(event)
      } else {
        const name = typeid(/** @type {Constructor}*/(event.constructor))

        warnOnce(`The asset event \`${name}\` is not handled!`)
      }
    }
  }
}

/* eslint-disable jsdoc/check-tag-names */
/**
 * Logs the readable failure-event batch published by the asset server.
 *
 * This function is registered directly in the repeating
 * {@linkcode AppSchedule.Update} schedule's {@linkcode CoreSystems.End} system
 * group by {@linkcode AssetServerPlugin}. The world must already contain a typed
 * asset-load failure event resource stored under
 * `typeidGeneric(Events, [AssetLoadFail])`. The system does not create or
 * clear it; {@linkcode AssetServerPlugin} stages it through {@linkcode EventPlugin}.
 *
 * Each invocation visits only the batch currently readable by
 * {@linkcode Events#each}, in write order. It logs one error per
 * {@linkcode AssetLoadFail} using its `path` and `reason`. A saving failure is
 * identified by {@linkcode AssetLoadOperation.Saving}; every other operation
 * value produces a loading message. The resulting messages have the form
 * ``AssetServer error loading "path": reason`` (or `saving`).
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { AssetServerPlugin } from '@wimaengine/asset'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * const app = new App()
 * app
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new AssetServerPlugin())
 *   .setRunner(() => {})
 *   .run()
 * // AssetServerPlugin stages Events<AssetLoadFail> and registers this system
 * // in AppSchedule.Update/CoreSystems.End.
 * ```
 *
 * @param {World} world - World containing the typed `Events<AssetLoadFail>`
 * resource.
 * @returns {void} Nothing; the readable failure batch is left unchanged.
 * @category system
 */
export function logFailedLoads(world) {

  /** @type {Events<AssetLoadFail>} */
  const events = world.getResourceByTypeId(typeidGeneric(Events, [AssetLoadFail]))

  events.each((event) => {
    const { data } = event
    const operation = data.operation === AssetLoadOperation.Saving ? 'saving' : 'loading'

    error(`\`AssetServer\` error ${operation} "${data.path}": ${data.reason}`)
  })
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @template T
 * @typedef AssetEvents
 * @property {Constructor<AssetAdded<T>>} added
 * @property {Constructor<AssetModified<T>>} modified
 * @property {Constructor<AssetDropped<T>>} dropped
 */
