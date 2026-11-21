import { deepStrictEqual, strictEqual } from 'assert'
import { LiveType, SnapshotType } from '@wimaengine/core'
import { test, describe } from 'vitest'
import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { Parent } from '@wimaengine/hierarchy'
import { Scene, SceneFilter, SceneFilterMode } from '../../src/assets'
import { SceneInstance } from '../../src/components'
import { StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'

class PureComponent {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {PureComponent} target
   */
  static clone(target) {
    return new PureComponent(target.value)
  }

  /**
   * @param {PureComponent} target
   * @param {World} _world
   * @returns {ComponentSnapshot}
   */
  static toSnapshot(target, _world) {
    return new ComponentSnapshot(target.value)
  }

  /**
   * @param {ComponentSnapshot} snapshot
   * @param {World} _world
   * @returns {PureComponent}
   */
  static fromSnapshot(snapshot, _world) {
    return new PureComponent(snapshot.value)
  }
}

class PureResource {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {PureResource} target
   */
  static clone(target) {
    return new PureResource(target.value)
  }

  /**
   * @param {PureResource} target
   * @param {World} _world
   * @returns {ResourceSnapshot}
   */
  static toSnapshot(target, _world) {
    return new ResourceSnapshot(target.value)
  }

  /**
   * @param {ResourceSnapshot} snapshot
   * @param {World} _world
   * @returns {PureResource}
   */
  static fromSnapshot(snapshot, _world) {
    return new PureResource(snapshot.value)
  }
}

class ComponentSnapshot {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

}

class ResourceSnapshot {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

}

class PatchableResource {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {PatchableResourceSnapshot} _snapshot
   * @param {World} _world
   * @returns {PatchableResource}
   */
  static fromSnapshot(_snapshot, _world) {
    throw new Error('`fromSnapshot` should not be called when patching is available')
  }
}

class PatchableResourceSnapshot {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {PatchableResourceSnapshot} sceneResource
   * @param {World} _world
   */
  static patch(sceneResource, _world) {
    if (!_world.hasResource(PatchableResource)) {
      return false
    }

    const worldResource = _world.getResource(PatchableResource)

    worldResource.value = `${worldResource.value}:${sceneResource.value}`

    return true
  }

}

class DeferredPatchResource {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {DeferredPatchResourceSnapshot} snapshot
   * @param {World} _world
   * @returns {DeferredPatchResource}
   */
  static fromSnapshot(snapshot, _world) {
    return new DeferredPatchResource(snapshot.value)
  }
}

class DeferredPatchResourceSnapshot {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {DeferredPatchResourceSnapshot} _sceneResource
   * @param {World} _world
   * @returns {boolean}
   */
  static patch(_sceneResource, _world) {
    return false
  }

}

/**
 * @returns {TypeRegistry}
 */
function createRegistry() {
  const registry = new TypeRegistry()

  registry.register(EntityHandle, StructInfo.default())
  registry.get(EntityHandle)?.setMethod(/** @param {EntityHandle} target */ function clone(target) {
    return EntityHandle.from(target.id())
  })

  registry.register(PureComponent, StructInfo.default())
  registry.get(PureComponent)?.setMethod(PureComponent.clone)
  registry.get(PureComponent)?.setMethod(PureComponent.toSnapshot)
  registry.get(PureComponent)?.setMethod(PureComponent.fromSnapshot)
  registry.get(PureComponent)?.setAttribute(new SnapshotType(typeid(ComponentSnapshot)))

  registry.register(ComponentSnapshot, StructInfo.default())
  registry.get(ComponentSnapshot)?.setAttribute(new LiveType(typeid(PureComponent)))

  registry.register(PureResource, StructInfo.default())
  registry.get(PureResource)?.setMethod(PureResource.clone)
  registry.get(PureResource)?.setMethod(PureResource.toSnapshot)
  registry.get(PureResource)?.setMethod(PureResource.fromSnapshot)
  registry.get(PureResource)?.setAttribute(new SnapshotType(typeid(ResourceSnapshot)))

  registry.register(ResourceSnapshot, StructInfo.default())
  registry.get(ResourceSnapshot)?.setAttribute(new LiveType(typeid(PureResource)))

  return registry
}

describe.sequential('Testing `Scene`', () => {
  describe.sequential('with pure types', () => {
    test('`Scene.fromWorld` restores pure entities', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([])
      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 1)
      strictEqual(scene.resources.size, 0)
      deepStrictEqual(scene.entities.get(entity.id()), [
        new EntityHandle(entity.index, entity.generation)
      ])
    })

    test('`Scene.toWorld` restores pure entities', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = new EntityHandle(42, 1)
      const scene = new Scene()
      const instance = new SceneInstance(/** @type {any} */ (null))
      const instanceEntity = new EntityHandle(99, 1)

      scene.entities.set(entity.id(), [
        new EntityHandle(entity.index, entity.generation)
      ])

      scene.toWorld(world, instance, registry, instanceEntity)

      strictEqual(world.getResources().size, 0)
      strictEqual(instance.entityMap.size, 1)

      const single = new Query(world, [EntityHandle]).single()

      strictEqual(single !== null, true)

      const [restoredEntity] = single
      const cell = world.getEntity(restoredEntity)

      strictEqual(cell.hasTypeid([typeid(EntityHandle), typeid(Parent)]), true)
      deepStrictEqual(cell.get(EntityHandle), restoredEntity)
      deepStrictEqual(cell.get(Parent), new Parent(instanceEntity))
      strictEqual(instance.entityMap.get(restoredEntity.id()), entity.id())
    })

    test('`Scene.fromWorld` restores pure resources', () => {
      const registry = createRegistry()
      const world = new World()

      world.setResource(new PureResource('resource'))

      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 0)
      strictEqual(scene.resources.size, 1)
      deepStrictEqual(
        scene.resources.get(typeid(PureResource)),
        new ResourceSnapshot('resource')
      )
    })

    test('`Scene.toWorld` restores pure resources', () => {
      const registry = createRegistry()
      const scene = new Scene()
      const world = new World()
      const instance = new SceneInstance(/** @type {any} */ (null))

      scene.resources.set(
        typeid(PureResource),
        new PureResource('resource')
      )

      scene.toWorld(world, instance, registry, new EntityHandle(99, 1))

      strictEqual(new Query(world, [EntityHandle]).count(), 0)
      strictEqual(world.getResources().size, 1)
      strictEqual(instance.entityMap.size, 0)
      deepStrictEqual(world.getResource(PureResource), new PureResource('resource'))
    })

    test('`Scene.toWorld` applies allow-list filters to components and resources', () => {
      const registry = createRegistry()
      const scene = new Scene()
      const world = new World()
      const entity = new EntityHandle(42, 1)

      scene.entities.set(entity.id(), [
        new EntityHandle(entity.index, entity.generation),
        new ComponentSnapshot('component')
      ])
      scene.resources.set(typeid(PureResource), new ResourceSnapshot('resource'))

      scene.toWorld(
        world,
        new SceneInstance(/** @type {any} */ (null)),
        registry,
        new EntityHandle(99, 1),
        new SceneFilter([typeid(PureComponent)], SceneFilterMode.Allow)
      )

      const [restoredEntity] = new Query(world, [EntityHandle]).single()

      deepStrictEqual(world.get(restoredEntity, PureComponent), new PureComponent('component'))
      strictEqual(world.getEntity(restoredEntity).hasTypeid([typeid(Parent)]), false)
      strictEqual(world.hasResource(PureResource), false)
    })

    test('`Scene.toWorld` applies deny-list filters to components and resources', () => {
      const registry = createRegistry()
      const scene = new Scene()
      const world = new World()
      const entity = new EntityHandle(42, 1)

      scene.entities.set(entity.id(), [
        new EntityHandle(entity.index, entity.generation),
        new ComponentSnapshot('component')
      ])
      scene.resources.set(typeid(PureResource), new ResourceSnapshot('resource'))

      scene.toWorld(
        world,
        new SceneInstance(/** @type {any} */ (null)),
        registry,
        new EntityHandle(99, 1),
        new SceneFilter([typeid(PureResource)], SceneFilterMode.Deny)
      )

      const [restoredEntity] = new Query(world, [EntityHandle]).single()

      deepStrictEqual(world.get(restoredEntity, PureComponent), new PureComponent('component'))
      strictEqual(world.hasResource(PureResource), false)
    })

    test('`Scene.fromWorld` restores entities and components', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([new PureComponent('component')])
      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 1)
      strictEqual(scene.resources.size, 0)
      deepStrictEqual(scene.entities.get(entity.id()), [
        new ComponentSnapshot('component'),
        new EntityHandle(entity.index, entity.generation)
      ])
    })

    test('`Scene.toWorld` restores entities and components', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([new PureComponent('component')])
      const scene = Scene.fromWorld(world, registry)
      const targetWorld = new World()
      const instance = new SceneInstance(/** @type {any} */ (null))
      const instanceEntity = new EntityHandle(99, 1)

      scene.toWorld(targetWorld, instance, registry, instanceEntity)

      strictEqual(targetWorld.getResources().size, 0)
      strictEqual(instance.entityMap.size, 1)

      const single = new Query(targetWorld, [EntityHandle]).single()

      strictEqual(single !== null, true)

      const [restoredEntity] = single
      const cell = targetWorld.getEntity(restoredEntity)

      strictEqual(
        cell.hasTypeid([typeid(EntityHandle), typeid(PureComponent), typeid(Parent)]),
        true
      )
      deepStrictEqual(cell.get(EntityHandle), restoredEntity)
      deepStrictEqual(cell.get(PureComponent), new PureComponent('component'))
      deepStrictEqual(cell.get(Parent), new Parent(instanceEntity))
      strictEqual(instance.entityMap.get(restoredEntity.id()), entity.id())
    })
  })

  describe.sequential('with snapshots', () => {
    test('`Scene.fromWorld` restores pure entities', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([])
      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 1)
      strictEqual(scene.resources.size, 0)
      deepStrictEqual(scene.entities.get(entity.id()), [
        new EntityHandle(entity.index, entity.generation)
      ])
    })

    test('`Scene.toWorld` restores pure entities', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = new EntityHandle(42, 1)
      const scene = new Scene()
      const instance = new SceneInstance(/** @type {any} */ (null))
      const instanceEntity = new EntityHandle(99, 1)

      scene.entities.set(entity.id(), [
        new EntityHandle(entity.index, entity.generation)
      ])

      scene.toWorld(world, instance, registry, instanceEntity)

      strictEqual(world.getResources().size, 0)
      strictEqual(instance.entityMap.size, 1)

      const single = new Query(world, [EntityHandle]).single()

      strictEqual(single !== null, true)

      const [restoredEntity] = single
      const cell = world.getEntity(restoredEntity)

      strictEqual(cell.hasTypeid([typeid(EntityHandle), typeid(Parent)]), true)
      deepStrictEqual(cell.get(EntityHandle), restoredEntity)
      deepStrictEqual(cell.get(Parent), new Parent(instanceEntity))
      strictEqual(instance.entityMap.get(restoredEntity.id()), entity.id())
    })

    test('`Scene.fromWorld` restores pure resources', () => {
      const registry = createRegistry()
      const world = new World()

      world.setResource(new PureResource('resource'))

      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 0)
      strictEqual(scene.resources.size, 1)
      deepStrictEqual(
        scene.resources.get(typeid(PureResource)),
        new ResourceSnapshot('resource')
      )
    })

    test('`Scene.toWorld` restores pure resources', () => {
      const registry = createRegistry()
      const scene = new Scene()
      const world = new World()
      const instance = new SceneInstance(/** @type {any} */ (null))

      scene.resources.set(
        typeid(ResourceSnapshot),
        new ResourceSnapshot('resource')
      )

      scene.toWorld(world, instance, registry, new EntityHandle(99, 1))

      strictEqual(new Query(world, [EntityHandle]).count(), 0)
      strictEqual(world.getResources().size, 1)
      strictEqual(instance.entityMap.size, 0)
      deepStrictEqual(world.getResource(PureResource), new PureResource('resource'))
    })

    test('`Scene.fromWorld` restores entities and components', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([new PureComponent('component')])
      const scene = Scene.fromWorld(world, registry)

      strictEqual(scene.entities.size, 1)
      strictEqual(scene.resources.size, 0)
      deepStrictEqual(scene.entities.get(entity.id()), [
        new ComponentSnapshot('component'),
        new EntityHandle(entity.index, entity.generation)
      ])
    })

    test('`Scene.toWorld` restores entities and components', () => {
      const registry = createRegistry()
      const world = new World()
      const entity = world.spawn([new PureComponent('component')])
      const scene = Scene.fromWorld(world, registry)
      const targetWorld = new World()
      const instance = new SceneInstance(/** @type {any} */ (null))
      const instanceEntity = new EntityHandle(99, 1)

      scene.toWorld(targetWorld, instance, registry, instanceEntity)

      strictEqual(targetWorld.getResources().size, 0)
      strictEqual(instance.entityMap.size, 1)

      const single = new Query(targetWorld, [EntityHandle]).single()

      strictEqual(single !== null, true)

      const [restoredEntity] = single
      const cell = targetWorld.getEntity(restoredEntity)

      strictEqual(
        cell.hasTypeid([typeid(EntityHandle), typeid(PureComponent), typeid(Parent)]),
        true
      )
      deepStrictEqual(cell.get(EntityHandle), restoredEntity)
      deepStrictEqual(cell.get(PureComponent), new PureComponent('component'))
      deepStrictEqual(cell.get(Parent), new Parent(instanceEntity))
      strictEqual(instance.entityMap.get(restoredEntity.id()), entity.id())
    })
  })

  describe.sequential('with patching', () => {
    test('`Scene.toWorld` patches existing world resources', () => {
      const registry = new TypeRegistry()
      registry.register(PatchableResource, StructInfo.default())
      registry.register(PatchableResourceSnapshot, StructInfo.default())
      registry.get(PatchableResource)?.setMethod(PatchableResource.fromSnapshot)
      registry.get(PatchableResource)?.setAttribute(new SnapshotType(typeid(PatchableResourceSnapshot)))
      registry.get(PatchableResourceSnapshot)?.setMethod(PatchableResourceSnapshot.patch)
      registry.get(PatchableResourceSnapshot)?.setAttribute(new LiveType(typeid(PatchableResource)))

      const world = new World()
      const worldResource = new PatchableResource('world')
      world.setResource(worldResource)
      world.setResourceAlias(typeid(PatchableResource), PatchableResourceSnapshot)

      const scene = new Scene()
      scene.resources.set(
        typeid(PatchableResource),
        new PatchableResourceSnapshot('scene')
      )

      const instance = new SceneInstance(/** @type {any} */ (null))

      scene.toWorld(world, instance, registry, new EntityHandle(99, 1))

      strictEqual(world.getResource(PatchableResource), worldResource)
      strictEqual(world.getResources().size, 1)
      strictEqual(instance.entityMap.size, 0)
      deepStrictEqual(worldResource, new PatchableResource('world:scene'))
    })

    test('`Scene.toWorld` restores resources when patching declines', () => {
      const registry = new TypeRegistry()
      registry.register(DeferredPatchResource, StructInfo.default())
      registry.register(DeferredPatchResourceSnapshot, StructInfo.default())
      registry.get(DeferredPatchResource)?.setMethod(DeferredPatchResource.fromSnapshot)
      registry.get(DeferredPatchResource)?.setAttribute(new SnapshotType(typeid(DeferredPatchResourceSnapshot)))
      registry.get(DeferredPatchResourceSnapshot)?.setMethod(DeferredPatchResourceSnapshot.patch)
      registry.get(DeferredPatchResourceSnapshot)?.setAttribute(new LiveType(typeid(DeferredPatchResource)))

      const scene = new Scene()
      scene.resources.set(
        typeid(DeferredPatchResource),
        new DeferredPatchResourceSnapshot('resource')
      )

      const world = new World()
      const instance = new SceneInstance(/** @type {any} */ (null))

      scene.toWorld(world, instance, registry, new EntityHandle(99, 1))

      strictEqual(world.getResources().size, 1)
      strictEqual(instance.entityMap.size, 0)
      deepStrictEqual(world.getResource(DeferredPatchResource), new DeferredPatchResource('resource'))
    })
  })
})
