import { deepStrictEqual, strictEqual } from 'assert'
import { LiveType, SnapshotType } from '@wimaengine/core'
import { test, describe } from 'vitest'
import { Scene } from '../../src/assets'
import { JSONSceneExporter } from '../../src/resources/exporters'
import { JSONSceneImporter } from '../../src/resources/importers'
import { TypeRegistry, Field, StructInfo } from '@wimaengine/reflect'

import { typeid } from '@wimaengine/type'

class TestSnapshot {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {TestSnapshot} target
   */
  static clone(target) {
    return new TestSnapshot(target.value)
  }

  /**
   * @param {TestSnapshot} value
   */
  static serialize(value) {
    return {
      value: value.value
    }
  }

  /**
   * @param {{ value: string }} value
   * @param {TestSnapshot} [out]
   */
  static deserialize(value, out = new TestSnapshot('')) {
    out.value = value.value

    return out
  }
}

class TestValue {}

describe('Testing scene JSON importer/exporter', () => {
  test('`JSONSceneExporter` serializes scene entities with type metadata', async () => {
    const registry = createRegistry()
    const exporter = new JSONSceneExporter()
    const scene = new Scene()
    const snapshot = new TestSnapshot('hello')

    scene.entities.set(42, [snapshot])
    scene.resources.set(typeid(TestValue), snapshot)

    const text = await exporter.serialize(scene, registry)
    const serial = JSON.parse(text)

    strictEqual(exporter.asset, Scene)
    deepStrictEqual(serial, {
      entities: {
        42: {
          [typeid(TestValue)]: {
            value: 'hello'
          }
        }
      },
      resources: {
        [typeid(TestValue)]: {
          value: 'hello'
        }
      }
    })
  })

  test('`JSONSceneImporter` restores scene entities and resources through the type registry', async () => {
    const registry = createRegistry()
    const importer = new JSONSceneImporter()
    const scene = await importer.deserialize(/** @type {Response} */ ({
      async json() {
        return {
          entities: {
            42: {
              [typeid(TestValue)]: {
                value: 'hello'
              }
            }
          },
          resources: {
            [typeid(TestValue)]: {
              value: 'hello'
            }
          }
        }
      }
    }), registry)

    strictEqual(importer.asset, Scene)
    strictEqual(scene.entities.size, 1)
    strictEqual(scene.entities.get(42)?.[0] instanceof TestSnapshot, true)
    deepStrictEqual(scene.entities.get(42)?.[0], new TestSnapshot('hello'))
    strictEqual(scene.resources.size, 1)
    strictEqual(scene.resources.get(typeid(TestValue)) instanceof TestSnapshot, true)
    deepStrictEqual(scene.resources.get(typeid(TestValue)), new TestSnapshot('hello'))
  })
})

function createRegistry() {
  const registry = new TypeRegistry()

  registry.register(TestSnapshot, new StructInfo({
    value: new Field(typeid(String))
  }))
  registry.get(TestSnapshot)?.setMethod(TestSnapshot.clone)
  registry.get(TestSnapshot)?.setMethod(TestSnapshot.serialize)
  registry.get(TestSnapshot)?.setMethod(TestSnapshot.deserialize)
  registry.register(TestValue, new StructInfo({}))
  registry.get(TestValue)?.setAttribute(new SnapshotType(typeid(TestSnapshot)))
  registry.get(TestSnapshot)?.setAttribute(new LiveType(typeid(TestValue)))

  return registry
}
