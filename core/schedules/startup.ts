import Schedule from "../../src/schedule";

export default class StartupSchedule extends Schedule {
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
