import Position from "../components/position";
import Velocity from "../components/velocity";
import type { Entity } from "../../src/entity";
import System from "../../src/system";
import type { Query } from "../../mod";

export default class MovementSystem extends System<[Position, Velocity]> {
  override select(): Query<[Position, Velocity]>[] {
    return this.archetypeTable.find(Position, Velocity);
  }

  override update(
    _: Entity,
    components: [Position, Velocity]
  ): void | Promise<void> {
    components[0].x += components[1].x;
    components[0].y += components[1].y;
  }
}
