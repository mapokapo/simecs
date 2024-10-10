import type Component from "./component";
import type { Entity } from "./entity";

/**
 * Represents a query for a system. A query is a component and the entity that owns that component.
 */
export class Query<T extends Component[]> {
  constructor(
    public entity: Entity,
    public components: T
  ) {}
}

/**
 * Represents a constructor for a component.
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
  private table = new Map<Entity, Component[]>();

  /**
   * Adds a component to an entity.
   * @param entity The entity to add the component to.
   * @param component The component to add.
   */
  public add(entity: Entity, component: Component): void {
    const item = this.table.get(entity);

    if (!item) {
      this.table.set(entity, [component]);
    } else {
      item.push(component);
    }
  }

  /**
   * Adds multiple components to an entity.
   * @param entity The entity to add the components to.
   * @param components The components to add.
   */
  public addAll(entity: Entity, components: Component[]): void {
    const item = this.table.get(entity);

    if (!item) {
      this.table.set(entity, components);
    } else {
      item.push(...components);
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
   * @param componentClass The component to check. Specified as a class, not an instance.
   * @returns True if the entity has the component, false otherwise.
   */
  public has(entity: Entity, componentClass: ComponentConstructor): boolean {
    const components = this.table.get(entity);

    if (!components) {
      return false;
    }

    return components.some(c => c instanceof componentClass);
  }

  /**
   * Checks if an entity has all of the provided components.
   * @param entity The entity to check.
   * @param componentClasses The components to check. Components are specified as classes, not instances.
   * @returns True if the entity has all of the components, false otherwise.
   */
  public hasAll(
    entity: Entity,
    componentClasses: ComponentConstructor[]
  ): boolean {
    const entityComponents = this.table.get(entity);

    if (!entityComponents) {
      return false;
    }

    return componentClasses.every(componentClass =>
      entityComponents.some(c => c instanceof componentClass)
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
    ...componentClasses: { [K in keyof T]: ComponentConstructor<T[K]> }
  ): Query<T>[] {
    const queries: Query<T>[] = [];

    for (const [entity, components] of this.table) {
      // Filter to check if all required components are present in the entity
      const matchedComponents = componentClasses.map(componentClass =>
        components.find(c => c instanceof componentClass)
      );

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
