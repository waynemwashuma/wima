import {
  createCamera3D,
  Mesh,
  createRawMovable3D,
  createBasicMesh3D,
  createTransform3D,
  World,
  EntityCommands,
  BasicMaterial,
  Scene,
  SceneInstance,
  SceneAssets,
  Assets,
  EntityHandle,
  Query,
  MeshAssets,
  BasicMaterialAssets,
  Color,
  App,
  AppSchedule,
  Angular3DDamping,
  Rotation3D,
  rand,
  Torque3D,
  RelationshipQuery,
  Children,
  Parent,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  WebglRendererPlugin
} from 'wima'

const instanceConfigs = [
  { offsetX: -1.7, offsetY: -0.35, offsetZ: -2 },
  { offsetX: 1.7, offsetY: 0.15, offsetZ: -1.35 },
  { offsetX: 0, offsetY: 0.5, offsetZ: -2.85 }
]

const app = new App()

app
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerSystem({ schedule: AppSchedule.Update, system: applyRandomDescendantTorque })
  .registerDebugger(new FPSDebugger())
  .registerSystem({ schedule: AppSchedule.Startup, system: init })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera3D })
  .run()

/**
 * @param {World} world
 */
function addDefaultCamera3D(world) {
  const commands = new EntityCommands(world)

  commands
    .spawn()
    .insertPrefab([...createCamera3D(0, 0, 2)])
    .build()
}

/**
 * @param {World} world
 */
function init(world) {
  const commands = new EntityCommands(world)
  const angularDamping = world.getResource(Angular3DDamping)
  const scenes = world.getResource(SceneAssets)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const scene = scenes.add(createScene(meshes, materials))

  for (let i = 0; i < instanceConfigs.length; i++) {
    const { offsetX, offsetY, offsetZ } = instanceConfigs[i]

    commands
      .spawn()
      .insertPrefab([
        ...createTransform3D(offsetX, offsetY, offsetZ),
        ...createRawMovable3D(),
        new SceneInstance(scene)
      ])
      .build()
  }

  angularDamping.value = 0
}

/**
 * @param {World} world
 */
function applyRandomDescendantTorque(world) {
  const roots = new Query(world, [EntityHandle, SceneInstance])
  const descendants = new RelationshipQuery(world, Children, Parent, [Torque3D])

  roots.each(([entity]) => {
    descendants.treebfs(entity, ([torque]) => {
      torque.x = rand(-1.2, 1.2)
      torque.y = rand(-1.2, 1.2)
      torque.z = rand(-1.2, 1.2)
    })
  })
}

/**
 * @param {Assets<Mesh>} meshes
 * @param {Assets<BasicMaterial>} materials
 */
function createScene(meshes, materials) {
  const scene = new Scene()
  const mesh = meshes.add(Mesh.cube(0.8, 0.8, 0.8))
  const material = materials.add(new BasicMaterial({
    color: new Color(1, 1, 1)
  }))

  const offsets = [
    { x: -0.6, y: -0.6, z: -0.6 },
    { x: 0.6, y: -0.6, z: -0.6 },
    { x: 0, y: 0.6, z: 0.6 }
  ]

  for (let i = 0; i < offsets.length; i++) {
    scene.set(new EntityHandle(i, 1), [
      ...createBasicMesh3D(mesh.clone(), material.clone(), offsets[i].x, offsets[i].y, offsets[i].z),
      new Rotation3D(),
      new Torque3D()
    ])
  }

  mesh.drop()
  material.drop()

  return scene
}
