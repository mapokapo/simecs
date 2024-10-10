/**
 * @module hook.ts Contains the base `Hook` class.
 */

import type { Query } from "./archetypeTable";
import type Component from "./component";
import type System from "./system";

/**
 * A hook that can be used to run code at specific points in the ECS lifecycle.
 */
export default abstract class Hook {
  /**
   * Runs before a system runs a round of updates on a list of pre-known entities and their components.
   * @param system The system that is about to run.
   * @param queries An array of queries which are matched by the system.
   */
  beforeSystemUpdate?(
    system: System<Component[]>,
    queries: Query<Component[]>[]
  ): void | Promise<void>;

  /**
   * Runs after a system runs a round of updates on a list of pre-known entities and their components.
   * @param system The system that just ran.
   * @param queries An array of queries which are matched by the system.
   */
  afterSystemUpdate?(
    system: System<Component[]>,
    queries: Query<Component[]>[]
  ): void | Promise<void>;
}
