import Component from "../../src/component";

export default class Velocity extends Component {
  constructor(
    public x: number,
    public y: number
  ) {
    super("velocity");
  }
}
