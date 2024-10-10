/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, it, expect, beforeAll } from "bun:test";
import App from "../mod";
import { Position, Velocity } from "../core/components/mod";
import { STARTUP_SCHEDULE, UPDATE_SCHEDULE } from "../core/constants/mod";
import IncreaseXByOneSystem from "./systems/increaseXByOne";
import { MovementSystem } from "../core/systems/mod";
import NoopSystem from "./systems/noop";
import TestHook from "./hooks/test";

describe("Hooks", () => {
  let app: App;
  beforeAll(() => {
    app = new App()
      .addEntity(10, new Position(0, 0), new Velocity(1, 1))
      .addEntity(15, new Position(5, 5), new Velocity(-1, -1))
      .addSystem(STARTUP_SCHEDULE, IncreaseXByOneSystem)
      .addSystem(UPDATE_SCHEDULE, MovementSystem)
      .addSystem(UPDATE_SCHEDULE, NoopSystem)
      .addHook(new TestHook());
  });

  it("should have not run the hook yet", () => {
    expect(app.getCurrentSchedule()).toBeNull();
    expect(TestHook.beforeUpdateStates.size).toBe(0);
    expect(TestHook.afterUpdateStates.size).toBe(0);
  });

  it("should run the hook before and after the systems have been ran during the startup schedule", async () => {
    app.advanceSchedule();
    await app.step(app.getCurrentSchedule()!);

    expect(app.getCurrentSchedule()).toBe(STARTUP_SCHEDULE);

    const beforeQueries = TestHook.beforeUpdateStates.get(
      "IncreaseXByOneSystem"
    );
    expect(beforeQueries).toBeDefined();
    expect(beforeQueries?.length).toBe(2);
    expect(beforeQueries?.[0]?.entity).toBe(10);
    expect(beforeQueries?.[0]?.components).toEqual([new Position(0, 0)]);
    expect(beforeQueries?.[1]?.entity).toBe(15);
    expect(beforeQueries?.[1]?.components).toEqual([new Position(5, 5)]);

    const afterQueries = TestHook.afterUpdateStates.get("IncreaseXByOneSystem");
    expect(afterQueries).toBeDefined();
    expect(afterQueries?.length).toBe(2);
    expect(afterQueries?.[0]?.entity).toBe(10);
    expect(afterQueries?.[0]?.components).toEqual([new Position(1, 0)]);
    expect(afterQueries?.[1]?.entity).toBe(15);
    expect(afterQueries?.[1]?.components).toEqual([new Position(6, 5)]);
  });

  it("should run the hook before and after the systems have been ran during the update schedule", async () => {
    app.advanceSchedule();
    await app.step(app.getCurrentSchedule()!);

    expect(app.getCurrentSchedule()).toBe(UPDATE_SCHEDULE);

    const beforeQueries = TestHook.beforeUpdateStates.get("MovementSystem");
    expect(beforeQueries).toBeDefined();
    expect(beforeQueries?.length).toBe(2);
    expect(beforeQueries?.[0]?.entity).toBe(10);
    expect(beforeQueries?.[0]?.components).toEqual([
      new Position(1, 0),
      new Velocity(1, 1),
    ]);
    expect(beforeQueries?.[1]?.entity).toBe(15);
    expect(beforeQueries?.[1]?.components).toEqual([
      new Position(6, 5),
      new Velocity(-1, -1),
    ]);

    const afterQueries = TestHook.afterUpdateStates.get("MovementSystem");
    expect(afterQueries).toBeDefined();
    expect(afterQueries?.length).toBe(2);
    expect(afterQueries?.[0]?.entity).toBe(10);
    expect(afterQueries?.[0]?.components).toEqual([
      new Position(2, 1),
      new Velocity(1, 1),
    ]);
    expect(afterQueries?.[1]?.entity).toBe(15);
    expect(afterQueries?.[1]?.components).toEqual([
      new Position(5, 4),
      new Velocity(-1, -1),
    ]);
  });

  it("should not run hooks for systems which have no dependencies", async () => {
    app.advanceSchedule();
    await app.step(app.getCurrentSchedule()!);

    expect(NoopSystem.noopSystemRan).toBeFalse();

    const noopBeforeQueries = TestHook.beforeUpdateStates.get("NoopSystem");
    expect(noopBeforeQueries).toBeUndefined();

    const noopAfterQueries = TestHook.afterUpdateStates.get("NoopSystem");
    expect(noopAfterQueries).toBeUndefined();
  });
});
