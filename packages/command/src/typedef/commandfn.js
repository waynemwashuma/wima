/** @import { Command } from "../core" */
/** @import {World} from '@wimaengine/ecs' */

/**
 * Processes a command with access to its world context.
 *
 * `CommandFn` is generic over a {@linkcode Command} subtype. The callback receives
 * that command and the {@linkcode World} it can inspect or mutate, then returns no
 * value.
 *
 * @template {Command} T
 * @callback CommandFn
 * @param {T} command - Command to process.
 * @param {World} registry - World context for processing the command.
 * @returns {void} No value is returned.
 */
export {}
