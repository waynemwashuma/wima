/** @import { World } from '@wimaengine/ecs' */
import { Command } from '@wimaengine/command'
import { EntityHandle } from '@wimaengine/ecs'
import { Children, Parent } from '@wimaengine/hierarchy'
import { assert, warn } from '@wimaengine/logger'
import { TypeRegistry } from '@wimaengine/reflect'
import { RelationshipQuery } from '@wimaengine/relationship'
import { typeid } from '@wimaengine/type'
import { SpawnCommand } from './spawn'

const entityTypeId = typeid(EntityHandle)
const parentTypeId = typeid(Parent)
const childrenTypeId = typeid(Children)

/**
 * @param {World} world
 * @param {EntityHandle} entity
 * @param {EntityHandle[]} ordered
 */
function collectHierarchy(world, entity, ordered) {
  ordered.push(entity)

  const query = new RelationshipQuery(world, Children, Parent)

  query.treedfs(entity, ([descendant]) => {
    ordered.push(/** @type {EntityHandle} */ (descendant))
  })
}

/**
 * Builds a deferred clone of an entity hierarchy.
 *
 * {@linkcode CloneCommand.create} walks the source root and its descendants,
 * allocates an empty clone handle for each entity immediately, and stores one
 * {@linkcode SpawnCommand} for each handle. The component insertions remain deferred
 * until {@linkcode CloneCommand#execute} runs those child commands in
 * source-hierarchy order. The cloned root handle is available through
 * {@linkcode CloneCommand#entity} as soon as the command is created.
 *
 * @example
 * ```js
 * const command = CloneCommand.create(world, root)
 * command.execute(world)
 *
 * const clonedRoot = command.entity
 * ```
 */
export class CloneCommand extends Command {

  /**
   * Child spawn commands in source-hierarchy traversal order.
   *
   * Each command targets an already allocated clone handle and contains the
   * cloned components for the corresponding source entity.
   *
   * @readonly
   * @type {SpawnCommand[]}
   */
  commands

  /**
   * Handle of the cloned hierarchy's root entity.
   *
   * @readonly
   * @type {EntityHandle}
   */
  entity

  /**
   * Creates a clone command from child spawn commands.
   *
   * The commands are stored in the supplied order. At least one command is
   * required, and the first command's entity is exposed as the cloned root.
   * Use {@linkcode CloneCommand.create} to build the commands from a world
   * hierarchy.
   *
   * @param {SpawnCommand[]} commands - Child commands in hierarchy order.
   */
  constructor(commands) {
    super()
    assert(commands.length > 0, 'A clone command must contain at least one entity.')
    this.commands = commands
    this.entity = commands[0].entity
  }

  /**
   * Builds a clone command for an entity and all of its descendants.
   *
   * The source must exist. The root and descendants are collected in
   * relationship traversal order. {@linkcode World#spawn} then allocates one
   * empty entity for each source, and a {@linkcode SpawnCommand} is stored for
   * each handle; those component insertions do not happen until
   * {@linkcode CloneCommand#execute} runs.
   *
   * Each registered component is copied with its registered `clone` method.
   * {@linkcode EntityHandle} and {@linkcode Children} components are omitted. The
   * The root's {@linkcode Parent} component keeps its original parent. Descendant
   * {@linkcode Parent} components are remapped to the corresponding cloned
   * entities. Registered `map`
   * methods receive the complete source-to-clone entity map, so other entity
   * references can be remapped as well. When hierarchy hooks are installed, the
   * inserted {@linkcode Parent} components rebuild the cloned {@linkcode Children}
   * relationships.
   *
   * Components without a registry entry or without a registered `clone`
   * method are skipped with a warning. If setup throws after clone handles
   * have been recorded, {@linkcode CloneCommand.create} despawns each handle in
   * the child-command list and does not rethrow that error. It then constructs
   * a {@linkcode CloneCommand} from that list; if no child command was added, the
   * constructor's non-empty-list assertion is raised.
   *
   * @param {World} world - World containing the source hierarchy and type registry.
   * @param {EntityHandle} entity - Root entity to clone.
   * @returns {CloneCommand} Command containing the allocated clone hierarchy.
   */
  static create(world, entity) {
    const cell = world.getEntity(entity)

    assert(cell.exists(), `The entity ${entity.id()} cannot be cloned because it does not exist.`)

    const registry = world.getResource(TypeRegistry)

    /** @type {EntityHandle[]} */
    const ordered = []

    /** @type {SpawnCommand[]} */
    const cloneCommands = []

    /** @type {Map<number, number>} */
    const entityMap = new Map()

    collectHierarchy(world, entity, ordered)

    try {
      for (let i = 0; i < ordered.length; i++) {
        const cloneEntity = world.spawn([])

        cloneCommands.push(new SpawnCommand(cloneEntity))
        entityMap.set(ordered[i].id(), cloneEntity.id())
      }

      for (let i = 0; i < ordered.length; i++) {
        const source = ordered[i]
        const sourceCell = world.getEntity(source)

        /** @type {object[]} */
        const clonedComponents = []
        const typeIds = sourceCell.components()

        for (let j = 0; j < typeIds.length; j++) {
          const typeId = typeIds[j]

          if (typeId === entityTypeId || typeId === childrenTypeId) {
            continue
          }

          const entry = registry.getByTypeId(typeId)

          if (!entry) {
            warn(`The type \`${typeId}\` is not registered in the type registry`)
            continue
          }

          const component = /** @type {object | undefined} */ (sourceCell.getTypeId(typeId))

          if (!component) {
            continue
          }

          const clonedComponent = /** @type {object | undefined} */ (entry.call('clone', [component]))

          if (!clonedComponent) {
            warn(
              `The type \`${typeId}\` has not been cloned as there is no \`clone\` method registered in the \`TypeRegistry\``
            )
            continue
          }

          if (typeId !== parentTypeId || !source.equals(entity)) {
            entry.getMethod('map')?.method?.call(clonedComponent, entityMap)
          }

          clonedComponents.push(clonedComponent)
        }

        cloneCommands[i].insertPrefab(clonedComponents)
      }
    } catch {
      for (let i = 0; i < cloneCommands.length; i++) {
        world.despawn(cloneCommands[i].entity)
      }
    }

    return new CloneCommand(cloneCommands)
  }

  /**
   * Executes every child {@linkcode SpawnCommand} in hierarchy order.
   *
   * Component insertion is delegated to each child command. This method does
   * not allocate additional handles or rebuild the component payload.
   *
   * @param {World} world - World in which the clone handles were allocated.
   * @returns {void}
   */
  execute(world) {
    for (let i = 0; i < this.commands.length; i++) {
      this.commands[i].execute(world)
    }
  }
}
