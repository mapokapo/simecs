import { beforeAll, describe, expect, it } from "bun:test";
import App, { ArchetypeTable } from "../mod";
import { Position, Velocity } from "../core/components/mod";
import { STARTUP_SCHEDULE, UPDATE_SCHEDULE } from "../core/constants/mod";
import { MovementSystem } from "../core/systems/mod";
import IncreaseXByOneSystem from "./systems/increaseXByOne";
import NoopSystem from "./systems/noop";

describe("Systems (and schedules)", () => {
  let app: App;
  let table: Readonly<ArchetypeTable>;
  beforeAll(() => {
    app = new App()
      .addEntity(10, new Position(0, 0), new Velocity(1, 1))
      .addEntity(15, new Position(5, 5), new Velocity(-1, -1))
      .addSystem(STARTUP_SCHEDULE, IncreaseXByOneSystem)
      .addSystem(UPDATE_SCHEDULE, MovementSystem)
      .addSystem(UPDATE_SCHEDULE, NoopSystem);

    table = app.getArchetypeTable();
  });

  it("should have the correct initial values", () => {
    expect(table.getAll(10)).toEqual([new Position(0, 0), new Velocity(1, 1)]);
    expect(table.getAll(15)).toEqual([
      new Position(5, 5),
      new Velocity(-1, -1),
    ]);
  });

  it("should be in a `null` schedule initially", () => {
    expect(app.getCurrentSchedule()).toBeNull();
  });

  it("should advance into the startup schedule", () => {
    app.advanceSchedule();
    expect(app.getCurrentSchedule()).toBe(STARTUP_SCHEDULE);
  });

  it("should run systems on the startup schedule", async () => {
    await app.step(app.getCurrentSchedule()!);
    expect(app.getCurrentSchedule()).toBe(STARTUP_SCHEDULE);
    expect(table.getAll(10)).toEqual([new Position(1, 0), new Velocity(1, 1)]);
    expect(table.getAll(15)).toEqual([
      new Position(6, 5),
      new Velocity(-1, -1),
    ]);
  });

  it("should advance into the update schedule", async () => {
    expect(app.getCurrentSchedule()).toBe(STARTUP_SCHEDULE);
    app.advanceSchedule();
    expect(app.getCurrentSchedule()).toBe(UPDATE_SCHEDULE);
  });

  it("should run the update schedule", async () => {
    await app.step(app.getCurrentSchedule()!);
    expect(app.getCurrentSchedule()).toBe(UPDATE_SCHEDULE);
    expect(table.getAll(10)).toEqual([new Position(2, 1), new Velocity(1, 1)]);
    expect(table.getAll(15)).toEqual([
      new Position(5, 4),
      new Velocity(-1, -1),
    ]);
  });

  it("should run the update schedule multiple times", async () => {
    app.advanceSchedule();
    await app.step(app.getCurrentSchedule()!);
    expect(app.getCurrentSchedule()).toBe(UPDATE_SCHEDULE);
    expect(table.getAll(10)).toEqual([new Position(3, 2), new Velocity(1, 1)]);
    expect(table.getAll(15)).toEqual([
      new Position(4, 3),
      new Velocity(-1, -1),
    ]);
  });

  it("should not run systems which have no dependencies", async () => {
    app.advanceSchedule();
    await app.step(app.getCurrentSchedule()!);
    expect(NoopSystem.noopSystemRan).toBeFalse();
  });
});
