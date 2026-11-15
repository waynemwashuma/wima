/**
 * Label value for `AppSchedule.Startup`.
 */
class Startup {}

/**
 * Label value for `AppSchedule.Update`.
 */
class Update {}

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the two application schedule labels: `Startup` for one-time
 * application setup and `Update` for recurring application work.
 *
 * Choose `Startup` for initialization associated with app startup. Choose
 * `Update` for work associated with the app's repeating update cycle.
 *
 * @enum {Function}
 * @category schedule-label
 *
 * @example
 * ```js
 * import { AppSchedule } from 'wima'
 *
 * const startupSchedule = AppSchedule.Startup
 * const updateSchedule = AppSchedule.Update
 * ```
 */
export const AppSchedule = Object.freeze({

  /**
   * Label for recurring application update work.
   *
   * Use `Update` for work associated with each app update. The
   * `systemGroup` option can place that work in a core phase.
   *
   */
  Update,

  /**
   * Label for one-time application setup.
   *
   * Use `Startup` for initialization associated with app startup. The
   * `systemGroup` option can place that work in a core phase.
   *
   */
  Startup
})
/* eslint-enable jsdoc/check-tag-names */
