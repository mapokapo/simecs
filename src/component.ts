/**
 * @module component.ts Contains the base `Component` class.
 */

/**
 * Represents a component that can be added to an entity.
 *
 * Components are usually data-only classes that store information about an entity.
 * The actual behavior of an entity is defined in systems, which use the data stored in components.
 */
export default abstract class Component {
  constructor(
    /**
     * A descriptive name of the component.
     */
    public name: string
  ) {}
}
