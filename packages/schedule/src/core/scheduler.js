/** @import { CrossWorldSchedule } from './crossworldschedule' */
/** @import { Schedule } from './schedule' */
/** @import { Constructor } from '@wimaengine/type' */
import { typeid } from '@wimaengine/type'
import { Executable } from './executable'

/**
 * Maintains separate normal-world and cross-world registries. Each registry
 * maps a schedule-label constructor to an {@linkcode Executable}. Normal-world
 * entries expose a {@linkcode Schedule}; cross-world entries expose a
 * {@linkcode CrossWorldSchedule} with target and source worlds. Register entries
 * with {@linkcode Scheduler#set} or {@linkcode Scheduler#setCrossWorld}, then
 * retrieve their schedules with {@linkcode Scheduler#get} or
 * {@linkcode Scheduler#getCrossWorld}.
 *
 * @example
 * ```js
 * import { CrossWorldSchedule, Executable, Scheduler } from '@wimaengine/schedule'
 *
 * class Update {}
 * class Sync {}
 * class MainWorld {}
 * class SourceWorld {}
 *
 * const scheduler = new Scheduler()
 * scheduler.set(new Executable({
 *   label: Update,
 *   world: MainWorld,
 *   sourceWorld: undefined
 * }))
 * scheduler.setCrossWorld(new Executable({
 *   label: Sync,
 *   world: MainWorld,
 *   sourceWorld: SourceWorld,
 *   schedule: new CrossWorldSchedule()
 * }))
 *
 * scheduler.get(Update)?.add((world) => console.log('update', world))
 * scheduler.getCrossWorld(Sync)?.add((target, source) => {
 *   console.log('sync', target, source)
 * })
 *
 * ```
 */
export class Scheduler {

  /**
   * Normal executable registry keyed by schedule-label type ID.
   *
   * @private
   * @type {Map<string, Executable<Schedule, undefined>>}
   */
  executables = new Map()

  /**
   * Cross-world executable registry keyed by schedule-label type ID.
   *
   * @private
   * @type {Map<string, Executable<CrossWorldSchedule, Constructor>>}
   */
  crossWorldExecutables = new Map()

  /**
   * Registers an {@linkcode Executable} in the normal-world registry.
   *
   * The registry key is `typeid(executable.label)`. Registering another
   * executable with the same key replaces the previous entry. Its
   * {@linkcode Schedule} is returned by {@linkcode Scheduler#get} for the same
   * label.
   *
   * @param {Executable<Schedule, undefined>} executable
   * @returns {void}
   */
  set(executable) {
    this.executables.set(typeid(executable.label), executable)
  }

  /**
   * Registers an {@linkcode Executable} in the cross-world registry.
   *
   * The registry key is `typeid(executable.label)`. Registering another
   * executable with the same key replaces the previous entry. This registry
   * is separate from the normal-world registry used by
   * {@linkcode Scheduler#set}. Its {@linkcode CrossWorldSchedule} is returned by
   * {@linkcode Scheduler#getCrossWorld} for the same label.
   *
   * @param {Executable<CrossWorldSchedule, Constructor>} executable
   * @returns {void}
   */
  setCrossWorld(executable) {
    this.crossWorldExecutables.set(typeid(executable.label), executable)
  }

  /**
   * Returns the normal-world {@linkcode Schedule} registered for a label.
   *
   * The lookup uses `typeid(label)` in the normal-world registry and returns
   * the matching {@linkcode Executable#schedule}, not the {@linkcode Executable}.
   * If the label has no normal-world registration, the result is `undefined`.
   *
   * @param {Constructor} label
   * @returns {Schedule | undefined}
   */
  get(label) {
    return this.executables.get(typeid(label))?.schedule
  }

  /**
   * Returns the cross-world {@linkcode CrossWorldSchedule} registered for a
   * label.
   *
   * The lookup uses `typeid(label)` in the cross-world registry and returns
   * the matching {@linkcode Executable#schedule}, not the {@linkcode Executable}.
   * If the label has no cross-world registration, the result is `undefined`.
   *
   * @param {Constructor} label
   * @returns {CrossWorldSchedule | undefined}
   */
  getCrossWorld(label) {
    return this.crossWorldExecutables.get(typeid(label))?.schedule
  }

  /**
   * Returns the values iterator for the normal-world executable registry.
   *
   * This is the iterator returned directly by `this.executables.values()`.
   * It yields complete {@linkcode Executable} records from the normal-world
   * registry in `Map` insertion order. A new label registered through
   * {@linkcode Scheduler#set} is appended; replacing an existing label updates
   * its record without moving that label's position.
   *
   * @returns {MapIterator<Executable<Schedule, undefined>>}
   */
  values() {
    return this.executables.values()
  }

  /**
   * Returns the values iterator for the cross-world executable registry.
   *
   * This is the iterator returned directly by
   * `this.crossWorldExecutables.values()`. It yields complete
   * {@linkcode Executable} records with cross-world schedules from the
   * cross-world registry in `Map` insertion order. A new label registered
   * through {@linkcode Scheduler#setCrossWorld} is appended;
   * replacing an existing label updates its record without moving that
   * label's position.
   *
   * @returns {MapIterator<Executable<CrossWorldSchedule, Constructor>>}
   */
  crossWorldValues() {
    return this.crossWorldExecutables.values()
  }
}
