import {
  createCamera2D,
  Mesh,
  createBasicMesh2D,
  World,
  EntityCommands,
  BasicMaterial,
  BasicMaterialAssets,
  MeshAssets,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger
} from 'wima'

const app = new App()

app
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem({ schedule: AppSchedule.Startup, system: init })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera2D })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function addDefaultCamera2D(world) {
  const commands = new EntityCommands(world)

  commands
    .spawn()
    .insertPrefab([...createCamera2D()])
    .build()
}

/**
 * @param {World} world
 */
function init(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const basicMaterials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.quad2D(0.2, 0.2))
  const material = basicMaterials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh2D(mesh, material, -0.5, 0)])
    .build()
}
