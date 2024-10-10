import { Query, System } from "../../mod";

export default class NoopSystem extends System<[]> {
  public static noopSystemRan = false;

  override select(): Query<[]>[] {
    return [];
  }

  override update(): void {
    NoopSystem.noopSystemRan = true;
  }
}
