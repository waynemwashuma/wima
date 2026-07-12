---
title: Audio
---

`@wimaengine/audio` is the engine's ECS-driven audio runtime. It keeps playback state on entities, routes sound through an audio graph resource, and loads audio through the asset pipeline so playback stays synchronized with the world.

## ECS-Driven Playback

The main entity-level primitives are `AudioPlayer` and `AudioOscillator`. They hold the state that a system needs to start, stop, attach, or retarget audio without leaving ECS. That makes audio behave like the rest of the engine: state lives on entities, and systems turn that state into runtime behavior.

`AudioPlayer` is the handle-based path. It points at an `Audio` asset and stores playback node state. `AudioOscillator` is the procedural path. It stores oscillator settings directly and lets the runtime create and maintain the Web Audio node behind the component.

## Assets, Graphs, And Commands

Audio content enters through the asset layer. `AudioImporter` decodes supported audio files into `Audio` assets, and `AudioAssets` gives the package a typed `Assets<Audio>` pool. That is the same stable-identity story used by [Assets and handles](../26-assets-and-handles/index.md), just applied to sound instead of render data.

The runtime graph lives in `AudioGraph`, while `AudioCommands` provides the imperative control surface for playback. The graph owns the Web Audio context and node connections; the command helper gives higher-level code a simple way to trigger playback changes without wiring nodes by hand.

## Systems And Hooks

`AudioPlugin` ties everything together. It registers component hooks so audio nodes are released when components go away, installs the asset plugin and importer, stores the graph and command resources, and adds update systems for player playback and oscillators.

There is also a browser-specific detail that matters: the plugin resumes the audio context on pointer interaction. That keeps autoplay restrictions from silently breaking runtime audio and connects the package to [Windowing](../34-windowing/index.md) and [Input](../29-input/index.md) in practice, even though the audio package still owns the actual playback model.

## Where Audio Shows Up

Scenes can snapshot and restore audio playback state, which is why the package uses handle snapshots instead of raw buffer references. That makes it possible to move audio-rich content through [Scenes](../31-scenes/index.md) without losing the connection between the entity and the audio asset.

The practical rule is: assets supply sound data, ECS components store playback state, the audio graph owns runtime wiring, and systems keep the two in sync.
