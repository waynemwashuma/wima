---
title: Integrator
---

`@wimaengine/integrator` provides Euler and Verlet motion integration systems.

## Installation

```sh
npm i @wimaengine/integrator
```

## Capability Highlights

- Euler integration systems for common motion updates.
- Verlet integration systems for alternate simulation styles.
- Plugin entry points for choosing the integration mode.

## Core Concepts

### Euler

The Euler plugin and system modules apply first-order motion integration.

### Verlet

The Verlet plugin and system modules provide a position-based integration path.

## Notes

- Use this package when you want motion integration as a focused runtime layer instead of part of a larger physics stack.
