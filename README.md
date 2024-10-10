# simecs

A simple ECS library for Javascript runtimes and the browser.

## Installation

### npm

```sh
npx jsr add @mapokapo/simecs
```

### Deno

```sh
deno add @mapokapo/simecs
```

### Bun

```sh
bunx jsr add @mapokapo/simecs
```

## Usage

```ts
import App from "@mapokapo/simecs";
// or in Deno
import App from "jsr:@mapokapo/simecs@^0.0.1";

import { Position, Velocity } from "@mapokapo/simecs/core/components";
import { MovementSystem } from "@mapokapo/simecs/core/systems";
import { DebugHook } from "@mapokapo/simecs/core/hooks";
import { UPDATE_SCHEDULE } from "@mapokapo/simecs/core/constants";

export default async function main() {
  const app = new App()
    .addEntity(null, new Position(0, 0), new Velocity(1, 1)) // sequential id
    .addEntity(5, new Position(0, 0), new Velocity(-1, 1)) // specific id (5)
    .addSystem(UPDATE_SCHEDULE, MovementSystem) // specific schedule for systems to run on
    .addHook(new DebugHook()); // hooks

  await app.run();
}

main();
```

## Features

### Lightweight

This package uses no dependencies and is made of around 200 lines of code. 300
if you count the `@mapokapo/simecs/core` package.

Every piece of code is written with performance in mind, and the ECS library is
designed to be as lightweight as possible.

### Customizable

Every aspect of the ECS library is customizable. You can create your own
components, systems, and hooks, and even system schedules to fit your needs.

The example above mostly contains `@mapokapo/simecs/core` components, systems,
hooks, and schedules, which are not part of the ECS library itself but are
pieces of code built on top of the ECS library.

#### Components

`simecs` provides a base abstract `Component` class from which you can extend to
create your own components.

```ts
import { Component } from "@mapokapo/simecs";

export class Health extends Component {
  // component data
  constructor(public value: number) {
    super("health"); // component name
  }
}
```

#### Systems

`simecs` provides a base abstract `System` class from which you can extend to
create your own systems. The `System` class is made to enhance type safety as
best it can, and takes heavy inspiration from other ECS frameworks like Rust's
Bevy.

```ts
import { System } from "@mapokapo/simecs";

export class HealthSystem extends System<[Health]> {
  // which components the system operate on
  select() {
    return this.archetypeTable.find(Health); // query for entities which have specific components. `archetypeTable` comes from `System`.
  }

  update(
    entity: Entity, // the current entity
    components: [Health] // properly typed components
    // can be async
  ): void | Promise<void> {
    if (components[0].value <= 0) {
      this.archetypeTable.delete(entity); // remove entity from the system
    }
  }
}
```

#### Hooks

Hooks are a way to respond to lifecycle events in the ECS library. They can be
used to log, debug, or even modify the ECS library's behavior.

```ts
import { Hook } from "@mapokapo/simecs";

export class DebugHook extends Hook {
  beforeSystemUpdate(
    // the system that is about to be updated
    system: System<Component[]>,
    // the queries that matched the system's requirements (as specified in the system's `select` method)
    queries: Query<Component[]>[]
  ): void | Promise<void> {
    // `queries` will never be empty, because if a system did not match any entities, it would not be called, and neither would its hooks
    console.log(
      `System ${
        system.constructor.name
      } is about to run ${queries.length.toString()} times. It's dependencies are: ${queries[0].components
        .map(c => c.constructor.name)
        .join(", ")}`
    );

    console.log(
      `(before update) The state of the entities and their components: ${JSON.stringify(
        queries,
        null,
        2
      )}`
    );
  }

  afterSystemUpdate(
    system: System<Component[]>,
    queries: Query<Component[]>[]
  ): void | Promise<void> {
    console.log(
      `(after update) The state of the entities and their components: ${JSON.stringify(
        queries,
        null,
        2
      )}`
    );
  }
}
```

#### Schedules

Schedules are a way to group systems together and run them at specific times.
The ECS library comes with 2 schedules built-in: `UPDATE_SCHEDULE`, which runs
systems every frame, and `STARTUP_SCHEDULE`, which runs systems once at the
start of the ECS library.

You can create your own schedules by extending the `Schedule` class.

```ts
import { Schedule } from "@mapokapo/simecs";

export class DelayedUpdateSchedule extends Schedule {
  // custom data
  constructor(private timeout = 500) {
    super(
      // schedule name
      "delayedUpdate",
      // schedule order
      // eg. the built-in schedule StartupSchedule has an order of 0, and UpdateSchedule has an order of 1
      0,
      // supports async
      async () => {
        await new Promise(resolve => setTimeout(resolve, timeout));

        return true; // whether the schedule should run again, or stop and continue with the next schedule
      }
    );
  }
}
```

### Archetype-table based

The ECS library is based on the archetype-table pattern, which is a way to store
entities and their components in a way that is cache-friendly and allows for
fast iteration over entities with specific components.

This pattern is implemented in the `ArchetypeTable` class, which is used by the
`System` class to query for entities with specific components. It is also where
the `Query` class comes from, which connects an entity with some components
required by a system.

### Type-safe

The ECS library is built with TypeScript in mind, and it tries to provide as
much type safety as possible.

Generics, conditional types, and mapped types are used to ensure that
components, systems, and hooks are properly typed.

```ts
// ... inside a system's `select` method
const query = this.archetypeTable.find(Health, Position); // find all entities which have both Health and Position components

// `query` is of type `Query<[Health, Position]>`
const entity: Entity = query.entity;
const health: Health = query.components[0];
const position: Position = query.components[1];

if (health.value < 0) console.log(`Entity #${entity} is dead`);
position.x += 1;
position.y += 1;
```
