import {
  createCamera3D,
  BasicMaterial,
  Mesh,
  Position3D,
  World,
  Query,
  EntityCommands,
  VirtualClock,
  Meshed,
  createBasicMesh3D,
  BasicMaterialAssets,
  MeshAssets,
  App,
  AppSchedule,
  DOMWindowPlugin,
  DefaultPlugin,
  FPSDebugger,
  WebglRendererPlugin
} from 'wima'

const app = new App()

app
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerDebugger(new FPSDebugger())
  .registerSystem({ schedule: AppSchedule.Startup, system: spawnMesh })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera3D })
  .registerSystem({ schedule: AppSchedule.Update, system: updateMesh })
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
function spawnMesh(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.triangle3D())
  const material = materials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh3D(mesh, material)])
    .build()
}

/**
 * @param {World} world
 */
function updateMesh(world) {
  const query = new Query(world, [Position3D, Meshed])
  const clock = world.getResource(VirtualClock)
  const dt = clock.getElapsed()

  query.each(([position]) => {
    position.x = Math.sin(dt) * 0.5
    position.y = Math.cos(dt) * 0.5
    position.z = -2
  })
}
