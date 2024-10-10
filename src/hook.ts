import type { Query } from "./archetypeTable";
import type Component from "./component";
import type System from "./system";

/**
 * A hook that can be used to run code at specific points in the ECS lifecycle.
 */
export default abstract class Hook {
  beforeSystemUpdate?(
    system: System<Component[]>,
    queries: Query<Component[]>[]
  ): void | Promise<void>;
  afterSystemUpdate?(
    system: System<Component[]>,
    queries: Query<Component[]>[]
  ): void | Promise<void>;
}
