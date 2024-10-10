/**
 * Represents an entity in the ECS.
 *
 * An entity is a "thing" which exists in the ECS world, identified using an id number.
 * In order to add functionality to an entity, components are attached to it.
 * The entity itself is just an id number, and the attached components are stored in a separate table-like data structure.
 */
export type Entity = number;
