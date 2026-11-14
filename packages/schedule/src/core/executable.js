/** @import { Constructor, TypeId } from '@wimaengine/type' */
import { World } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'
import { Schedule } from './schedule'

/**
 * @template ScheduleType
 * @template {Constructor | undefined} SourceWorldType
 * @typedef {{
 *   label: Constructor,
 *   repeat?: boolean,
 *   delay?: number,
 *   errorHandler?: (error: Error, world: World) => void,
 *   defaultSystemGroup?: Constructor,
 *   world: Constructor,
 *   sourceWorld: SourceWorldType,
 *   schedule?: ScheduleType
 * }} ExecutableConfig
 */

/**
 * @typedef {{
 *   label: Constructor,
 *   repeat?: boolean,
 *   delay?: number,
 *   errorHandler?: (error: Error, world: World) => void,
 *   defaultSystemGroup?: Constructor,
 *   world?: Constructor
 * }} ScheduleConfig
 */

/**
 * Represents the execution metadata for a labeled schedule.
 *
 * An executable pairs a schedule label with its schedule, target world,
 * timing and repeat options, and optional source-world, group, and
 * error-handling settings. Normal schedules use a {@linkcode Schedule}.
 * Schedules that pass callbacks between two worlds use a
 * {@linkcode CrossWorldSchedule}.
 *
 * @template ScheduleType
 * @template {Constructor | undefined} SourceWorldType
 *
 * @example
 * ```js
 * import { CrossWorldSchedule, Executable } from '@wimaengine/schedule'
 *
 * class Update {}
 * class Sync {}
 * class MainWorld {}
 * class SourceWorld {}
 *
 * const normal = new Executable({
 *   label: Update,
 *   world: MainWorld,
 *   sourceWorld: undefined
 * })
 * const crossWorld = new Executable({
 *   label: Sync,
 *   world: MainWorld,
 *   sourceWorld: SourceWorld,
 *   schedule: new CrossWorldSchedule()
 * })
 * ```
 */
export class Executable {

  /**
   * Schedule label used to identify this executable.
   *
   * The {@linkcode Executable#typeId} getter derives an ID from this
   * constructor.
   *
   * @readonly
   * @type {Constructor}
   */
  label

  /**
   * Schedule run for this label.
   *
   * A normal executable uses a {@linkcode Schedule}. A cross-world executable
   * uses a {@linkcode CrossWorldSchedule}. When no schedule is supplied, the
   * constructor creates a new {@linkcode Schedule}.
   *
   * @readonly
   * @type {ScheduleType}
   */
  schedule

  /**
   * Whether the runner schedules another run after this executable runs.
   *
   * It defaults to `true`. Set it to `false` for a one-shot executable.
   *
   * @readonly
   * @type {boolean}
   */
  repeat

  /**
   * Delay before the first run and between repeated runs.
   *
   * The runner interprets this value in its own time units. It defaults to
   * `0`.
   *
   * @readonly
   * @type {number}
   */
  delay

  /**
   * Optional default group label for callbacks on this schedule.
   *
   * Callbacks without an explicit group use this label as their fallback. It
   * is `undefined` when no default group was configured.
   *
   * @readonly
   * @type {Constructor | undefined}
   */
  defaultSystemGroup

  /**
   * Constructor identifying the target world for this schedule.
   *
   * The runner resolves it to the world that receives the schedule's
   * callbacks.
   *
   * @readonly
   * @type {Constructor}
   */
  world

  /**
   * Constructor identifying the source world for a cross-world schedule.
   *
   * Normal schedules use `undefined`. For a cross-world schedule, the runner
   * resolves this label and passes the resulting world as the second callback
   * argument to {@linkcode CrossWorldSchedule}.
   *
   * @readonly
   * @type {SourceWorldType}
   */
  sourceWorld

  /**
   * Optional handler for errors thrown by schedule callbacks.
   *
   * The handler receives the normalized error and target world. When it is
   * `undefined`, {@linkcode Schedule#run} and {@linkcode CrossWorldSchedule#run}
   * use their default error behavior.
   *
   * @readonly
   * @type {((error: Error, world: World) => void) | undefined}
   */
  errorHandler

  /**
   * Creates an executable binding from the supplied configuration.
   *
   * Normal configurations use `sourceWorld: undefined`; cross-world
   * configurations provide a source-world label and a
   * {@linkcode CrossWorldSchedule}. A nullish schedule defaults to a new
   * {@linkcode Schedule}. Nullish `repeat` and `delay` values default to `true`
   * and `0`.
   *
   * @param {ExecutableConfig<ScheduleType, SourceWorldType>} config
   */
  constructor(config) {
    this.label = config.label
    this.repeat = config.repeat ?? true
    this.delay = config.delay ?? 0
    this.errorHandler = config.errorHandler
    this.defaultSystemGroup = config.defaultSystemGroup
    this.world = config.world
    this.sourceWorld = config.sourceWorld
    this.schedule = /** @type {ScheduleType} */ (config.schedule ?? new Schedule())
  }

  /**
   * Returns the type ID for the executable's schedule label.
   *
   * The value is derived from `label` with {@linkcode typeid} when this getter is
   * read.
   *
   * @returns {TypeId} Type ID for the schedule label.
   */
  get typeId() {
    return typeid(this.label)
  }
}
