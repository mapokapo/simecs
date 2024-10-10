import StartupSchedule from "../schedules/startup";
import UpdateSchedule from "../schedules/update";

/**
 * The schedule that runs every frame/update cycle.
 */
export const UPDATE_SCHEDULE: UpdateSchedule = new UpdateSchedule();
/**
 * The schedule that runs first, and only once.
 */
export const STARTUP_SCHEDULE: StartupSchedule = new StartupSchedule();
