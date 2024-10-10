import Schedule from "../../src/schedule";

/**
 * A schedule that runs every update.
 */
export default class UpdateSchedule extends Schedule {
  constructor() {
    super("update", 1, () => true);
  }
}
