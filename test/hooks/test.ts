import { Component, Hook, Query, System } from "../../mod";

export default class TestHook extends Hook {
  public static beforeUpdateStates = new Map<string, Query<Component[]>[]>();
  public static afterUpdateStates = new Map<string, Query<Component[]>[]>();

  override beforeSystemUpdate(
    system: System<Component[]>,
    queries: Query<Component[]>[]
  ): void {
    TestHook.beforeUpdateStates.set(
      system.constructor.name,
      structuredClone(queries)
    );
  }

  override afterSystemUpdate(
    system: System<Component[]>,
    queries: Query<Component[]>[]
  ): void {
    TestHook.afterUpdateStates.set(
      system.constructor.name,
      structuredClone(queries)
    );
  }
}
