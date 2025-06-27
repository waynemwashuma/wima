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
  ParticleEmitter,
  EmitterTimer,
  typeidGeneric,
  createParticleEmitter2D
} from 'wima'

export default new Demo('basic cpu particle system', [init], [update])

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResourceByTypeId(typeidGeneric(Assets,[Mesh]))
  const materials = world.getResourceByTypeId(typeidGeneric(Assets,[Material]))
  
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
      ...createParticleEmitter2D(particle),
      new Cleanup()
    ])
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const commands = world.getResource(EntityCommands)
}