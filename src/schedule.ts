/**
 * A schedule is a way to group systems together and run them in a specific order.
 */
export default abstract class Schedule {
  constructor(
    public name: string,
    public order: number,
    public shouldRun: () => boolean
  ) {}
}
