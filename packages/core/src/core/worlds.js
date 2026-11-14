/** @import { App } from '@wimaengine/app' */
/** @import { World } from '@wimaengine/ecs' */
/** @import { CorePlugin } from '../plugin' */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Constructor label for the app's main world.
 *
 * {@linkcode MainWorld} is a label, not a {@linkcode World} instance. Use it with
 * {@linkcode App#setWorld} to create a world under this label and with
 * {@linkcode App#defaultWorld} to select it as the app's default. The
 * {@linkcode CorePlugin} uses this label for the app's main world.
 *
 * If you configure an app without {@linkcode CorePlugin}, create the world with
 * {@linkcode App#setWorld} before selecting it with {@linkcode App#defaultWorld};
 * selecting a label does not create a world.
 *
 * @example
 * ```js
 * import { App, MainWorld } from 'wima'
 *
 * const app = new App()
 *   .setWorld(MainWorld)
 *   .defaultWorld(MainWorld)
 *
 * const mainWorld = app.getWorld(MainWorld)
 * const defaultWorld = app.getWorld()
 * ```
 *
 * @category world-label
 */
export class MainWorld {}
/* eslint-enable jsdoc/check-tag-names */
