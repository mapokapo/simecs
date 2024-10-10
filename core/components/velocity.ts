import Component from "../../src/component";

/**
 * Represents a velocity in 2D space.
 */
export default class Velocity extends Component {
  constructor(
    /**
     * The x-component of the velocity.
     */
    public x: number,
    /**
     * The y-component of the velocity.
     */
    public y: number
  ) {
    super("velocity");
  }
}
