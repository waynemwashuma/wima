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
  MouseButton
} from 'wima'

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10

export default new Demo('basic cpu emitter', [init], [update])

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
  
  commands
    .spawn()
    .insertPrefab([
      ...createCPUEmitter2D(particle),
      new Cleanup()
    ])
    .build()
}

function update(world) {
  const emitters = new Query(world, [EmitterTimer, CPUEmitter])
  const touches = world.getResource(Touches)
  const mouse = world.getResource(MouseButtons)
  const device = world.getResource(Device)
  
  if (device.platform === PlatformOS.Android || device.platform === PlatformOS.Ios) {
    const touch = touches.getFirst()
    
    if (!touch) return
  } else {
    if (!mouse.justPressed(MouseButton.Left)) {
      return
    }
  }
  
  emitters.each(([timer]) => {
    timer.reset()
  })
}