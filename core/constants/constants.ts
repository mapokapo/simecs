import StartupSchedule from "../schedules/startup";
import UpdateSchedule from "../schedules/update";

/**
 * The schedule that runs every update.
 */
export const UPDATE_SCHEDULE: UpdateSchedule = new UpdateSchedule();
/**
 * The schedule that runs once at startup.
 */
export const STARTUP_SCHEDULE: StartupSchedule = new StartupSchedule();
