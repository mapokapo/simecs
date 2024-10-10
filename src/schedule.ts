/**
 * @module schedule.ts Contains the base `Schedule` class.
 */

/**
 * A schedule is a way to group systems together and run them in a specific order.
 */
export default abstract class Schedule {
  constructor(
    /**
     * A descriptive name of the schedule.
     */
    public name: string,
    /**
     * The order in which the schedule should run. Lower values run
     * sooner.
     */
    public order: number,
    /**
     * A function that determines if the schedule should run. Once this function
     * returns false, the app will move on to the next schedule in the list.
     * Otherwise, the schedule will run indefinitely.
     */
    public shouldRun: () => boolean
  ) {}
}
