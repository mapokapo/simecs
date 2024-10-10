import Schedule from "../../src/schedule";

/**
 * A schedule that runs once at startup.
 */
export default class StartupSchedule extends Schedule {
  /**
   * Whether this is the first time the schedule is running.
   */
  private firstTime = true;

  constructor() {
    super("startup", 0, () => {
      if (this.firstTime) {
        this.firstTime = false;
        return true;
      }
      return false;
    });
  }
}
