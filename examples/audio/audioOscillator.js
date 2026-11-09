import {
  World,
  AudioOscillator,
  EntityCommands,
  Timer,
  TimerMode,
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
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = new EntityCommands(world)

  commands
    .spawn()
    .insertPrefab([
      new AudioOscillator(),
      new Timer({
        mode: TimerMode.Repeat
      })])
    .build()
}
