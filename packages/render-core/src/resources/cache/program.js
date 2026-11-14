/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides the numeric-ID program cache resource used by the renderer.
 *
 * @example
 * ```js
 * import { ProgramCache } from '@wimaengine/render-core'
 *
 * function cacheProgram(world, programId, program) {
 *   const programs = world.getResource(ProgramCache)
 *   programs.set(programId, program)
 *
 *   return programs.get(programId)
 * }
 * ```
 *
 * @template T
 * @augments {Map<number,T>}
 * @category resource
 */
export class ProgramCache extends Map { }
/* eslint-enable jsdoc/check-tag-names */
