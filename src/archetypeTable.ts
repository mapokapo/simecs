/**
 * @module archetypeTable.ts Contains the `ArchetypeTable`, `Query`, and `ComponentConstructor` types.
 *
 * @example
 * ```ts
 * import ArchetypeTable, { Query } from "./archetypeTable";
 * import Component from "./component";
 * import { Entity } from "./entity";
 *
 * const archetypeTable = new ArchetypeTable();
 *
 * archetypeTable.add(entity, new Position(0, 0));
 *
 * if (archetypeTable.has(entity, Position)) {
 *  const position = archetypeTable.get(entity, Position);
 *  console.log(position.x, position.y);
 * }
 *
 * const queries = archetypeTable.find(Position, Velocity);
 * queries.forEach((query) => {
 *  const entity = query.entity;
 *  const [position, velocity] = query.components;
 * });
 *
 * archetypeTable.delete(entity);
 * ```
 */

import type Component from "./component";
import type { Entity } from "./entity";

/**
 * Represents a query for a system. A query is a component and the entity that owns that component.
 * @template T The components of the query.
 */
export class Query<T extends Component[]> {
  constructor(
    /**
     * The entity that owns the components.
     */
    public entity: Entity,
    /**
     * The components of the entity.
     */
    public components: T
  ) {}
}

/**
 * Represents a constructor for a component.
 * @template T The component type.
 * @param args The arguments to pass to the constructor. This is simply used to satisfy the type system.
 */
export type ComponentConstructor<T extends Component = Component> = new (
  ...args: never[]
) => T;

/**
 * An archetype table is a map of entities to sets of components.
 *
 * It is similar to a table in a relational database, but the columns are dynamic and the first column is always the entity id (primary key).
 */
export default class ArchetypeTable {
  /**
   * The table of entities and components.
   *
   * @todo This could benefit from a more efficient data structure.
   */
  private table = new Map<Entity, Component[]>();

  /**
   * Adds a component to an entity.
   * @param entity The entity to add the component to.
   * @param component The component to add.
   */
  public add(entity: Entity, component: Component): void {
    /**
     * The components of the entity, if it exists.
     */
    const components = this.table.get(entity);

    if (!components) {
      this.table.set(entity, [component]);
    } else {
      components.push(component);
    }
  }

  /**
   * Adds multiple components to an entity.
   * @param entity The entity to add the components to.
   * @param components The components to add.
   */
  public addAll(entity: Entity, newComponents: Component[]): void {
    /**
     * The components of the entity, if it exists.
     */
    const components = this.table.get(entity);

    if (!components) {
      this.table.set(entity, newComponents);
    } else {
      components.push(...components);
    }
  }

  /**
   * Checks if an entity exists.
   * @param entity The entity to check.
   * @returns True if the entity exists, false otherwise.
   */
  public exists(entity: Entity): boolean {
    return this.table.has(entity);
  }

  /**
   * Checks if an entity has a component.
   * @param entity The entity to check.
   * @param component The component to check. Specified as a class, not an instance.
   * @returns True if the entity has the component, false otherwise.
   */
  public has(entity: Entity, component: ComponentConstructor): boolean {
    /**
     * The components of the entity, if it exists.
     */
    const components = this.table.get(entity);

    if (!components) {
      return false;
    }

    return components.some(c => c instanceof component);
  }

  /**
   * Checks if an entity has all of the provided components.
   * @param entity The entity to check.
   * @param componentClasses The components to check. Components are specified as classes, not instances.
   * @returns True if the entity has all of the components, false otherwise.
   */
  public hasAll(
    entity: Entity,
    requiredComponents: ComponentConstructor[]
  ): boolean {
    /**
     * The components of the entity, if it exists.
     */
    const components = this.table.get(entity);

    if (!components) {
      return false;
    }

    return requiredComponents.every(component =>
      components.some(c => c instanceof component)
    );
  }

  /**
   * Gets a component of an entity.
   * @param entity The entity to get the component of.
   * @param component The component to get.
   * @returns The component of the entity, or undefined if the entity does not exist or the component is not attached to the entity.
   */
  public get<T extends Component>(
    entity: Entity,
    component: ComponentConstructor<T>
  ): T | undefined {
    /**
     * The components of the entity, if it exists.
     */
    const components = this.table.get(entity);

    if (!components) {
      return undefined;
    }

    return components.find(c => c instanceof component) as T | undefined;
  }

  /**
   * Gets the components of an entity.
   * @param entity The entity to get the components of.
   * @returns The components of the entity, or undefined if the entity does not exist.
   */
  public getAll(entity: Entity): Component[] | undefined {
    return this.table.get(entity);
  }

  /**
   * Finds entities which contain the provided components.
   * @param components The components to find. Components are specified as classes, not instances.
   * @returns An array of queries, each representing an entity that contains all of the provided components.
   *
   * @example
   * ```ts
   * const queries = archetypeTable.find(Position, Velocity);
   * queries.forEach((query) => {
   *  const entity = query.entity; // Entity
   *  const [position, velocity] = query.components; // [Position, Velocity]
   * });
   */
  public find<T extends Component[]>(
    ...requiredComponents: { [K in keyof T]: ComponentConstructor<T[K]> }
  ): Query<T>[] {
    /**
     * The queries for the entities that contain the components.
     */
    const queries: Query<T>[] = [];

    for (const [entity, components] of this.table) {
      /**
       * The components of the entity that match the required components in the parameters.
       */
      const matchedComponents = requiredComponents.map(component =>
        components.find(c => c instanceof component)
      );

      // If all of the required components are present, add the entity to the queries.
      if (matchedComponents.every(c => c !== undefined)) {
        queries.push({
          entity,
          components: matchedComponents as T,
        });
      }
    }

    return queries;
  }

  /**
   * Deletes an entity.
   * @param entity The entity to delete.
   */
  public delete(entity: Entity): void {
    this.table.delete(entity);
  }
}
