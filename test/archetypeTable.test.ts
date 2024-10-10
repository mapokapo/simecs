import { beforeEach, describe, expect, it } from "bun:test";
import { ArchetypeTable, Query } from "../mod";
import { Position, Velocity } from "../core/components/mod";

let table: ArchetypeTable;

beforeEach(() => {
  table = new ArchetypeTable();
});

describe("Add", () => {
  it("should create an entity and add a component to it", () => {
    table.add(10, new Position(0, 0));

    expect(table.exists(10)).toBeTrue();
    expect(table.has(10, Position)).toBeTrue();
    expect(table.get(10, Position)).toEqual(new Position(0, 0));
    expect(table.getAll(10)).toEqual([new Position(0, 0)]);
    expect(table.find(Position)).toEqual([new Query(10, [new Position(0, 0)])]);
  });

  it("should add a component to an existing entity", () => {
    table.add(10, new Position(0, 0));

    expect(table.exists(10)).toBeTrue();
    expect(table.has(10, Position)).toBeTrue();
    expect(table.has(10, Velocity)).toBeFalse();
    expect(table.get(10, Position)).toEqual(new Position(0, 0));
    expect(table.getAll(10)).toEqual([new Position(0, 0)]);
    expect(table.find(Position)).toEqual([new Query(10, [new Position(0, 0)])]);
    expect(table.find(Velocity)).toEqual([]);
    expect(table.find(Position, Velocity)).toEqual([]);

    table.add(10, new Velocity(1, 1));

    expect(table.exists(10)).toBeTrue();
    expect(table.has(10, Velocity)).toBeTrue();
    expect(table.get(10, Velocity)).toEqual(new Velocity(1, 1));
    expect(table.getAll(10)).toEqual([new Position(0, 0), new Velocity(1, 1)]);
    expect(table.find(Position)).toEqual([new Query(10, [new Position(0, 0)])]);
    expect(table.find(Velocity)).toEqual([new Query(10, [new Velocity(1, 1)])]);
    expect(table.find(Position, Velocity)).toEqual([
      new Query(10, [new Position(0, 0), new Velocity(1, 1)]),
    ]);
  });
});

describe("AddAll", () => {
  it("should create an entity and add multiple components to it", () => {
    table.addAll(10, [new Position(0, 0), new Velocity(1, 1)]);

    expect(table.exists(10)).toBeTrue();
    expect(table.has(10, Position)).toBeTrue();
    expect(table.has(10, Velocity)).toBeTrue();
    expect(table.get(10, Position)).toEqual(new Position(0, 0));
    expect(table.get(10, Velocity)).toEqual(new Velocity(1, 1));
    expect(table.getAll(10)).toEqual([new Position(0, 0), new Velocity(1, 1)]);
    expect(table.find(Position)).toEqual([new Query(10, [new Position(0, 0)])]);
    expect(table.find(Velocity)).toEqual([new Query(10, [new Velocity(1, 1)])]);
    expect(table.find(Position, Velocity)).toEqual([
      new Query(10, [new Position(0, 0), new Velocity(1, 1)]),
    ]);
  });

  it("should add multiple components to an existing entity", () => {
    table.addAll(10, [new Position(0, 0)]);

    expect(table.exists(10)).toBeTrue();
    expect(table.has(10, Position)).toBeTrue();
    expect(table.has(10, Velocity)).toBeFalse();
    expect(table.get(10, Position)).toEqual(new Position(0, 0));
    expect(table.getAll(10)).toEqual([new Position(0, 0)]);
    expect(table.find(Position)).toEqual([new Query(10, [new Position(0, 0)])]);
    expect(table.find(Velocity)).toEqual([]);
    expect(table.find(Position, Velocity)).toEqual([]);

    table.addAll(10, [new Velocity(1, 1)]);

    expect(table.exists(10)).toBeTrue();
    expect(table.has(10, Velocity)).toBeTrue();
    expect(table.get(10, Velocity)).toEqual(new Velocity(1, 1));
    expect(table.getAll(10)).toEqual([new Position(0, 0), new Velocity(1, 1)]);
    expect(table.find(Position)).toEqual([new Query(10, [new Position(0, 0)])]);
    expect(table.find(Velocity)).toEqual([new Query(10, [new Velocity(1, 1)])]);
    expect(table.find(Position, Velocity)).toEqual([
      new Query(10, [new Position(0, 0), new Velocity(1, 1)]),
    ]);
  });
});

describe("Exists", () => {
  it("should return false for a non-existent entity", () => {
    expect(table.exists(10)).toBeFalse();
  });

  it("should return true for an existing entity", () => {
    table.add(10, new Position(0, 0));

    expect(table.exists(10)).toBeTrue();
  });
});

describe("Has", () => {
  it("should return false for an entity without a component", () => {
    expect(table.has(10, Position)).toBeFalse();
  });

  it("should return true for an entity with a component", () => {
    table.add(10, new Position(0, 0));

    expect(table.has(10, Position)).toBeTrue();
  });
});

describe("Get", () => {
  it("should return the component for an entity", () => {
    table.add(10, new Position(0, 0));

    expect(table.get(10, Position)).toEqual(new Position(0, 0));
  });

  it("should return undefined for an entity without a component", () => {
    expect(table.get(10, Position)).toBeUndefined();
  });
});

describe("GetAll", () => {
  it("should return all components for an entity", () => {
    table.addAll(10, [new Position(0, 0), new Velocity(1, 1)]);

    expect(table.getAll(10)).toEqual([new Position(0, 0), new Velocity(1, 1)]);
  });

  it("should return undefined for an entity without components", () => {
    expect(table.getAll(10)).toBeUndefined();
  });
});

describe("Find", () => {
  it("should return an empty array for no entities with the components", () => {
    expect(table.find(Position)).toBeEmpty();
  });

  it("should return an array of queries for entities with the components", () => {
    table.addAll(10, [new Position(0, 0), new Velocity(1, 1)]);

    expect(table.find(Position)).toEqual([new Query(10, [new Position(0, 0)])]);
    expect(table.find(Velocity)).toEqual([new Query(10, [new Velocity(1, 1)])]);
    expect(table.find(Position, Velocity)).toEqual([
      new Query(10, [new Position(0, 0), new Velocity(1, 1)]),
    ]);
  });
});

describe("Delete", () => {
  it("should delete an entity", () => {
    table.addAll(10, [new Position(0, 0), new Velocity(1, 1)]);

    expect(table.exists(10)).toBeTrue();

    table.delete(10);

    expect(table.exists(10)).toBeFalse();
    expect(table.getAll(10)).toBeUndefined();
    expect(table.find(Position)).toBeEmpty();
    expect(table.find(Velocity)).toBeEmpty();
    expect(table.find(Position, Velocity)).toBeEmpty();
  });

  it("should do nothing if the entity does not exist", () => {
    expect(table.exists(10)).toBeFalse();

    table.delete(10);

    expect(table.exists(10)).toBeFalse();
  });
});
