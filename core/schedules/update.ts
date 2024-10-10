import Schedule from "../../src/schedule";

export default class UpdateSchedule extends Schedule {
  constructor() {
    super("update", 1, () => true);
  }
}
