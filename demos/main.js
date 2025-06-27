import {
  App,
  AppSchedule,
  World,
  FPSDebugger,
  AudioPlugin,
  CommandsPlugin,
  DefaultTweenPlugin,
  DOMWindowPlugin,
  InputPlugin,
  StoragePlugin,
  TimePlugin,
  TransformPlugin,
  WindowPlugin,
  RenderCorePlugin,
  Canvas2DRendererPlugin,
  DemoPlugin,
  MainWindow,
  Query,
  warn,
  createCamera2D,
  Entity,
  WindowCommands,
  DevicePlugin,
  ParticleEmitter2DPlugin,
  EulerIntegrator2DPlugin,
  EntityCountDiagnosticPlugin
} from 'wima'
import {
  basicCPUEmitter,
  CPUEmitterDuration
} from './demos/index.js'

const app = new App()

app
  .registerPlugin(new CommandsPlugin())
  .registerPlugin(new DevicePlugin())
  .registerPlugin(new AudioPlugin())
  .registerPlugin(new TimePlugin())
  .registerPlugin(new WindowPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new InputPlugin())
  .registerPlugin(new EulerIntegrator2DPlugin())
  .registerPlugin(new TransformPlugin())
  .registerPlugin(new RenderCorePlugin())
  .registerPlugin(new ParticleEmitter2DPlugin())
  .registerPlugin(new StoragePlugin())
  .registerSystem(AppSchedule.Startup, setupViewport)
  .registerSystem(AppSchedule.Startup, setupCamera)
  .registerPlugin(new DefaultTweenPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerDebugger(new FPSDebugger())
  .registerPlugin(new DemoPlugin({
    demos: [
      basicCPUEmitter,
      CPUEmitterDuration
    ]
  }))
  .registerDebugger(new EntityCountDiagnosticPlugin())
  .run()

/**
 * @param {World} world
 */
function setupCamera(world) {
  world.create(createCamera2D())
}

/**
 * @param {World} world
 */
function setupViewport(world) {
  const windowcommands = world.getResource(WindowCommands)
  const window = new Query(world, [Entity, MainWindow]).single()
  
  if (!window) return warn('No main window defined.')
  
  windowcommands
    .window(window[0])
    .resize(innerWidth, innerHeight)
}

addEventListener('contextmenu', (e) => e.preventDefault())