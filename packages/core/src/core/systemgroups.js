/**
 * First core execution-group label in each schedule.
 *
 * Use `Start` for setup work at the beginning of a schedule.
 */
class Start {}

/**
 * Core execution-group label after `Start` and before `Main` in both schedules.
 *
 * Use `PreMain` for work that belongs in an early preparation phase.
 */
class PreMain {}

/**
 * Default core execution-group label for the startup and update schedules.
 *
 * `Main` follows `Start` and `PreMain`, and precedes `PostMain` and `End`.
 * Configurations without an explicit `systemGroup` use this group.
 */
class Main {}

/**
 * Core execution-group label after `Main` and before `End` in both schedules.
 *
 * Use `PostMain` for work that belongs in a later phase after ordinary work.
 */
class PostMain {}

/**
 * Last core execution-group label in each schedule.
 *
 * Use `End` for finalization or cleanup work at the end of a schedule.
 */
class End {}

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides five ordered core execution-group labels for the core schedules:
 * `Start`, `PreMain`, `Main`, `PostMain`, and `End`.
 *
 * `Main` is the default group. Choose another label when work belongs to an
 * earlier or later phase, or register a custom group relative to a core label.
 *
 * @example
 * ```js
 * import { AppSchedule, CoreSystems } from '@wimaengine/core'
 *
 * const updateGroup = {
 *   schedule: AppSchedule.Update,
 *   systemGroup: CoreSystems.PostMain
 * }
 * ```
 *
 * @enum {Function}
 * @category systemgroup-label
 */
export const CoreSystems = Object.freeze({

  /**
   * First group in each core schedule.
   *
   * Use `Start` for setup work at the beginning of a schedule.
   */
  Start,

  /**
   * Group after `Start` and before `Main` in each core schedule.
   *
   * Use `PreMain` for work that belongs in an early preparation phase.
   *
   */
  PreMain,

  /**
   * Default group for scheduled work in each core schedule.
   *
   * Use `Main` for ordinary work when no specialized phase is needed.
   */
  Main,

  /**
   * Group after `Main` and before `End` in each core schedule.
   *
   * Use `PostMain` for work that belongs in a later phase after ordinary work.
   */
  PostMain,

  /**
   * Final group in each core schedule.
   *
   * Use `End` for finalization or cleanup work at the end of a schedule.
   */
  End
})
/* eslint-enable jsdoc/check-tag-names */
