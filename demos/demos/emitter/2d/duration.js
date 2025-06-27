import {
  Assets,
  Mesh,
  Material,
  CanvasMeshedMaterial,
  createTransform2D,
  World,
  Color,
  Demo,
  Query,
  EntityCommands,
  Cleanup,
  warn,
  Window,
  Entity,
  CPUEmitter,
  EmitterTimer,
  typeidGeneric,
  createCPUEmitter2D,
  Touches,
  Device,
  PlatformOS,
  MouseButtons,
  MouseButton,
  Position2D,
  TimerMode,
  Range
} from 'wima'

export default new Demo('cpu emitter duration', [init])

const ASSET_PATH = "particle"
/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResourceByTypeId(typeidGeneric(Assets, [Mesh]))
  const materials = world.getResourceByTypeId(typeidGeneric(Assets, [Material]))
  
  const mesh = meshes.get(ASSET_PATH) || meshes.add(ASSET_PATH, Mesh.quad2D(50, 50))
  const material = materials.get(ASSET_PATH) || materials.add(ASSET_PATH, new CanvasMeshedMaterial({
    fill: new Color(1, 1, 1)
  }))
  
  function particle() {
    return [
      ...createTransform2D(),
      mesh,
      material,
      new Cleanup()
    ]
  }
  
  const number = 10
  const width = 50
  const offset = -(50 * number) / 2
  
  for (var i = 0; i < number; i++) {
    commands
      .spawn()
      .insertPrefab([
        ...createCPUEmitter2D(),
        new Cleanup()
      ])
      .insert(new CPUEmitter({
        prefab: particle,
        lifetime: new Range(2, 4)
      }))
      // Sets the duration after which the emitter emits particles and how often.
      .insert(new EmitterTimer(0.2 * i, TimerMode.Repeat))
      .insert(new Position2D(0, offset + i * width))
      .build()
  }
}