import Component from "../../src/component";

/**
 * Represents a position in 2D space.
 */
export default class Position extends Component {
  constructor(
    /**
     * The x-coordinate of the position.
     */
    public x: number,
    /**
     * The y-coordinate of the position.
     */
    public y: number
  ) {
    super("position");
  }
}
