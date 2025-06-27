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
  TimerMode
} from 'wima'

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10

export default new Demo('cpu emitter duration', [init])

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResourceByTypeId(typeidGeneric(Assets, [Mesh]))
  const materials = world.getResourceByTypeId(typeidGeneric(Assets, [Material]))
  
  const mesh = meshes.add('material', Mesh.quad2D(
    itemHeight - paddingWidth,
    itemWidth - paddingHeight
  ))
  const material = materials.add('basic', new CanvasMeshedMaterial({
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
        ...createCPUEmitter2D(particle),
        new Cleanup()
      ])
      .insert(new EmitterTimer(0.2 * i, TimerMode.Repeat))
      .insert(new Position2D(0,offset + i * width))
      
      .build()
  }
}