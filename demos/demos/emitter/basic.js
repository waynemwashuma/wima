import {
  Mesh,
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
  CPUParticleEmitter,
  EmitterTimer
} from 'wima'

export default new Demo('despawn', [init], [update])

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResourceByName('assets<mesh>')
  const materials = world.getResourceByName('assets<material>')
  const window = new Query(world, [Window]).single()
  
  if (!window) return warn('No window set up')
  
  const width = window[0].getWidth()
  const height = window[0].getHeight()
  const nx = Math.floor(width / itemWidth)
  const ny = Math.floor(height / itemHeight)
  const mesh = meshes.add('material', Mesh.quad2D(
    itemHeight - paddingWidth,
    itemWidth - paddingHeight
  ))
  const material = materials.add('basic', new CanvasMeshedMaterial({
    fill: new Color(1, 1, 1)
  }))
  
  function particle(){
    return [
      createTransform2D(x, y),
      mesh,
      material
    ]
  }
  commands
    .spawn()
    .insertPrefab(createParticleEmitter2D(particle))
    .insert(new Cleanup())
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const commands = world.getResource(EntityCommands)
}