/** @import { TypeId } from '@wimaengine/type' */
/** @import { World } from '@wimaengine/ecs' */
import { Command } from '@wimaengine/command'
import { warnOnce } from '@wimaengine/logger'

/**
 * Sets one resource value, or one value inside an existing resource.
 *
 * An empty path replaces the resource. Non-empty paths update the existing
 * resource in place.
 */
export class SetResourceCommand extends Command {
  /** @type {TypeId} */
  resourceType

  /** @type {unknown} */
  value

  /** @type {(number|string)[]} */
  path

  /**
   * @param {TypeId} resourceType
   * @param {unknown} value
   * @param {(number|string)[]} [path=[]]
   */
  constructor(resourceType, value, path = []) {
    super()
    this.resourceType = resourceType
    this.value = value
    this.path = path
  }

  /** @param {World} world */
  execute(world) {
    if (this.path.length === 0) {
      world.setResourceByTypeId(this.resourceType, this.value)
      return
    }

    const resource = world.getOptionalResourceByTypeId(this.resourceType)
    if (resource === undefined) return

    setValueAtPath(resource, this.path, this.value)
  }
}

/**
 * Applies a typed path to an object, array, or Map.
 *
 * @param {unknown} target
 * @param {(number|string)[]} path
 * @param {unknown} value
 */
export function setValueAtPath(target, path, value) {
  let current = target
  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = /**@type {number | string}*/(path[index])
    const next = current instanceof Map
      ? current.get(segment)
      : typeof current === 'object' && current !== null
        ? Reflect.get(current, segment)
        : undefined
    if (next === undefined || next === null) {
      warnOnce(`Cannot resolve value path \`${formatPath(path)}\`.`)
      return
    }
    current = next
  }

  const segment = path[path.length - 1]
  if (segment === undefined) return
  if (current instanceof Map) {
    current.set(segment, value)
  } else if (typeof current !== 'object' || current === null) {
    warnOnce(`Cannot resolve value path \`${formatPath(path)}\`.`)
  } else {
    if (!Reflect.has(current, segment)) {
      warnOnce(`Cannot resolve value path \`${formatPath(path)}\`.`)
    } else {
      Reflect.set(current, segment, value)
    }
  }

  return target
}

/** @param {(number|string)[]} path */
function formatPath(path) {
  return path.join('/')
}

