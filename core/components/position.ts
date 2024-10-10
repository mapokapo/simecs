import Component from "../../src/component";

export default class Position extends Component {
  constructor(
    public x: number,
    public y: number
  ) {
    super("position");
  }
}
