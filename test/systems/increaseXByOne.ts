import { Query, System } from "../../mod";
import { Position } from "../../core/components/mod";

export default class IncreaseXByOneSystem extends System<[Position]> {
  override select(): Query<[Position]>[] {
    return this.archetypeTable.find(Position);
  }

  override update(_: number, components: [Position]): void {
    components[0].x += 1;
  }
}
