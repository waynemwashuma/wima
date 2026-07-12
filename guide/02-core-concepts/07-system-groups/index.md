---
title: System Groups
---

System groups are the structure inside a schedule. They let the engine split one schedule into named phases, nest related work together, and keep ordering rules readable instead of scattering them across individual systems.

If schedules decide *when* work runs, system groups decide *where* it belongs inside that schedule. That is why they sit between [Schedules](../07-schedules/index.md) and [Systems](../06-systems/index.md) in the runtime flow.

## Why Groups Exist

A schedule with no groups is just a flat list of systems. That works for tiny apps, but real engine startup and frame loops need more structure. A group gives you a stable phase name, a place for related systems, and an anchor for ordering constraints such as "run this before the main work" or "flush cleanup at the end."

`@wimaengine/core` shows the pattern clearly with `CoreSystems.Start`, `CoreSystems.PreMain`, `CoreSystems.Main`, `CoreSystems.PostMain`, and `CoreSystems.End`. Those labels are not arbitrary buckets. They create a readable frame shape:

- startup or frame setup
- pre-main preparation
- main gameplay or simulation work
- post-main follow-up
- end-of-schedule cleanup

That structure is what lets a package like physics or rendering say, "insert my systems into the main phase," while a package like command flushing says, "run me at the end."

## Groups As Structure, Not Execution

System groups do not execute on their own. They are labels and ordering constraints that the scheduler flattens into a runnable plan. A group can also contain other groups through parent relationships, which makes the schedule read like a hierarchy even though the runtime ultimately sorts it into one ordered list of systems.

This is important because it keeps the runtime model simple:

- the app records groups as setup data
- the scheduler resolves nesting and ordering
- the runner executes the final system order

That separation keeps the group logic out of the systems themselves.

## Ordering Patterns

Groups support explicit `before` and `after` references, so a phase can anchor itself around another phase or system without relying on fragile registration order. When a system does not name a group, the schedule can still place it through a default system group, which is how `CoreSystems.Main` becomes the landing zone for ungrouped work in core startup and update schedules.

That default is what makes plugin code simpler. A feature package can register a system without repeating the whole phase structure, and the app still knows where the system should live.

## Related Concepts

- [Systems](../06-systems/index.md) for the work units that groups organize
- [Schedules](../07-schedules/index.md) for the lanes that groups sit inside
- [Plugins](../10-plugins/index.md) for packaging grouped runtime setup
