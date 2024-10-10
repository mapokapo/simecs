import type { Query } from "../../src/archetypeTable";
import type Component from "../../src/component";
import type System from "../../src/system";
import Hook from "../../src/hook";

/**
 * This hook is used to debug the ECS by logging information about systems and their entities.
 *
 * Information logged includes:
 * - The name of the system that is running.
 * - The number of entities that the system is operating on.
 * - The components that the system requires from said entity.
 */
export default class DebugHook extends Hook {
  override beforeSystemUpdate(
    system: System<Component[]>,
    queries: Query<Component[]>[]
  ): void | Promise<void> {
    // Although `queries` cannot be empty at this point, we still need to check for it in order to satisfy the type system.
    if (queries.length === 0) {
      return;
    }

    /**
     * The entities that the system is operating on.
     */
    const entities = queries.map(query => query.entity);
    /**
     * The components that the system requires from the entities.
     */
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
    // Although `queries` cannot be empty at this point, we still need to check for it in order to satisfy the type system.
    if (queries.length === 0) {
      return;
    }

    /**
     * The entities that the system operated on.
     */
    const entities = queries.map(query => query.entity);
    /**
     * The components that the system required from the entities.
     */
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
