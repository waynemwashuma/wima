---
title: Command
---

`@wimaengine/command` provides deferred world mutation through commands and queues. It keeps mutation logic separate from the systems that request it.

## Installation

```sh
npm i @wimaengine/command
```

## Capability Highlights

- Deferred command execution for world changes.
- Queue-backed command storage.
- Command function typedefs for typed mutation helpers.

## Core Concepts

### Command

The command module defines the command object or function shape used to capture world mutations before they are applied.

### Queue

The queue module stores pending commands and gives the runtime a place to flush them in order.

### Typedefs

The typedef module describes command function signatures for packages that generate or consume commands.

## Notes

- `@wimaengine/core` and other runtime packages use this layer to avoid direct mutation during system execution.
