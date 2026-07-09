# Broadphase

`@wimaengine/broadphase` is the ECS-oriented collision candidate stage for Wima engine. It identifies potential overlaps, tracks pair state, and hands candidate pairs to the narrowphase layer.

## Package Role Summary

This package sits between entity data and narrowphase collision handling. Its documented job is to gather broad-phase hitbox participation, build candidate collision pairs, and keep those pairs available to the rest of the pipeline.

## Capability Highlights

- Marks entities for broad-phase participation through hitbox components.
- Provides helpers for working with collision pairs and pair state.
- Stores detected pair sets in resources so the current broad-phase result is easy to consume.
- Runs naive broad-phase implementations through ECS systems.
- Acts as a candidate-generation layer rather than a full collision resolution package.

## Core Concepts

### Hitbox Components

The component layer is the entry point for broad-phase participation. Future README copy should treat these as the data that opt entities into broad-phase collision candidate generation.

### Collision Pair Helpers

Pair helpers are the supporting utilities for working with entity pairs discovered during the broad-phase pass. The package README already frames these as part of the pair-tracking story, so future documentation should keep the emphasis on pair construction and management rather than on downstream collision response.

### Pair Resources

Resources hold the currently detected broad-phase pair set. This is the package's stateful bridge between the detection pass and any later systems that need to inspect or consume candidate collisions.

### Naive Broad-Phase Algorithms

The README explicitly describes the implementations as naive. That wording is useful because it sets expectations: the package provides straightforward broad-phase candidate generation, not an advanced spatial partitioning strategy that should be oversold without source-backed evidence.

### Systems

The systems layer is how the package runs inside ECS. Future README language should describe these systems as the execution path that scans participating entities, produces pair candidates, and updates the pair resources.

## Notes For A Future README

- Keep the summary short and pipeline-oriented: broad-phase candidate generation, pair tracking, and narrowphase handoff.
- Preserve the ECS framing. The package reads like engine infrastructure, not a standalone geometry utility.
- Do not imply final contact resolution, response, or solver behavior; the documented responsibility stops at candidate pairs.
- The package manifest exposes both the package root and a `./src` entrypoint, so any future README should stay consistent with that split if it documents module layout.
- If a README is rewritten later, keep the current install command close to the top: `npm i @wimaengine/broadphase`.
