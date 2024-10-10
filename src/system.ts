/**
 * @module system.ts Contains the base `System` class.
 */

import type { Query } from "./archetypeTable";
import type ArchetypeTable from "./archetypeTable";
import type Component from "./component";
import type { Entity } from "./entity";

/**
 * Represents a system in the ECS.
 *
 * @template T The type of components that the system operates on.
 */
export default abstract class System<T extends Component[]> {
  constructor(
    /**
     * The archetype table that the system can use to create, read, update, and
     * delete entities and components.
     */
    public archetypeTable: ArchetypeTable
  ) {}

  /**
   * Queries entities from the archetype table.
   * @returns The entities that match the system's query, with the needed components.
   */

  abstract select(): Query<T>[];
  /**
   * Updates an entity.
   * @param entity The entity to update.
   * @param components The selected components of the entity.
   */
  abstract update(entity: Entity, components: T): void | Promise<void>;
}
