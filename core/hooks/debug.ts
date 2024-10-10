import type { Query } from "../../src/archetypeTable";
import type Component from "../../src/component";
import type System from "../../src/system";
import Hook from "../../src/hook";

export default class DebugHook extends Hook {
  override beforeSystemUpdate(
    system: System<Component[]>,
    queries: Query<Component[]>[]
  ): void | Promise<void> {
    if (queries.length === 0) {
      return;
    }

    const entities = queries.map(query => query.entity);
    const requiredComponents = queries[0]?.components ?? [];
    console.log(
      `System '${
        system.constructor.name
      }' running on ${entities.length.toString()} entities with components: ${requiredComponents
        .map(component => component.constructor.name)
        .join(", ")}`
    );
    console.log("--------------------------------");
  }

  override afterSystemUpdate(
    system: System<Component[]>,
    queries: Query<Component[]>[]
  ): void | Promise<void> {
    if (queries.length === 0) {
      return;
    }

    const entities = queries.map(query => query.entity);
    const requiredComponents = queries[0]?.components ?? [];
    console.log("--------------------------------");
    console.log(
      `System '${
        system.constructor.name
      }' finished running on ${entities.length.toString()} entities with components: ${requiredComponents
        .map(component => component.constructor.name)
        .join(", ")}`
    );
  }
}
