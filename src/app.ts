import type System from "./system";
import type Hook from "./hook";
import type Component from "./component";
import type Schedule from "./schedule";
import ArchetypeTable from "./archetypeTable";

/**
 * The main class for the ECS. This class is responsible for managing entities, systems, and hooks. It also runs the main loop of the ECS.
 */
export default class App {
  private archetypeTable: ArchetypeTable = new ArchetypeTable();
  private scheduledSystems: {
    schedule: Schedule;
    system: System<Component[]>;
  }[] = [];
  private hooks: Hook[] = [];

  private lastEntityId = 0;
  private currentSchedule: Schedule | null = null;

  /**
   * Returns a read-only archetype table.
   * @returns The archetype table.
   */
  public getArchetypeTable(): Readonly<ArchetypeTable> {
    return Object.freeze(this.archetypeTable);
  }

  /**
   * Returns the current schedule, i.e. the schedule that will be ran
   * @returns The current schedule.
   */
  public getCurrentSchedule(): Schedule | null {
    return this.currentSchedule;
  }

  /**
   * Adds an entity to the app and attaches components to it.
   * @param id The id of the entity to add. If null, a new id will be generated. If there is an entity with the same id, an error will be thrown.
   * @param components The components to attach to the entity.
   * @returns The app instance.
   */
  public addEntity(id: number | null, ...components: Component[]): this {
    if (id === null) {
      id = this.lastEntityId++;
    }

    if (this.archetypeTable.exists(id)) {
      throw new Error(`Entity with id ${id.toString()} already exists`);
    }

    this.archetypeTable.addAll(id, components);

    return this;
  }

  /**
   * Adds a system to the app.
   * @param schedule The schedule to run the system on.
   * @param system The system to add.
   * @returns The app instance.
   */
  public addSystem<T extends Component[]>(
    schedule: Schedule,
    systemClass: new (archetypeTable: ArchetypeTable) => System<T>
  ): this {
    const system = new systemClass(this.archetypeTable);

    this.scheduledSystems.push({
      schedule,
      system,
    });

    return this;
  }

  /**
   * Adds a lifecycle hook to the app.
   * @param hook The hook to add.
   * @returns The app instance.
   */
  public addHook(hook: Hook): this {
    this.hooks.push(hook);

    return this;
  }

  /**
   * Runs systems for a given schedule.
   * @param schedule The schedule to run systems for.
   */
  public async step(schedule: Schedule): Promise<void> {
    // First get all systems that are scheduled to run for the given schedule.
    const scheduledSystems = this.scheduledSystems.filter(
      scheduledSystem => scheduledSystem.schedule === schedule
    );

    for (const scheduledSystem of scheduledSystems) {
      // The system defines which components it needs to run. Each query is a component that the system can run on and the entity that owns that component.
      const queries = scheduledSystem.system.select();

      // If there are no queries, skip the system.
      if (queries.length === 0) {
        continue;
      }

      // Run hooks before the system update.
      for (const hook of this.hooks) {
        if (hook.beforeSystemUpdate) {
          await hook.beforeSystemUpdate(scheduledSystem.system, queries);
        }
      }

      // Run the system update for each query.
      for (const query of queries) {
        const res = scheduledSystem.system.update(
          query.entity,
          query.components
        );

        // Properly handle async system updates.
        if (res instanceof Promise) {
          await res;
        }
      }

      // Run hooks after the system update.
      for (const hook of this.hooks) {
        if (hook.afterSystemUpdate) {
          await hook.afterSystemUpdate(scheduledSystem.system, queries);
        }
      }
    }
  }

  /**
   * Advances the current schedule to the next one if possible.
   */
  public advanceSchedule(): void {
    if (this.scheduledSystems.length === 0) {
      throw new Error("No systems to run");
    }

    const schedules: Schedule[] = this.scheduledSystems.map(
      scheduledSystem => scheduledSystem.schedule
    );

    // first run
    if (this.currentSchedule === null) {
      // Sorted in ascending order so that the schedule with the lowest order value is ran first.
      schedules.sort((a, b) => a.order - b.order);

      this.currentSchedule = schedules[0] ?? null;
    } else {
      this.currentSchedule =
        schedules[schedules.indexOf(this.currentSchedule) + 1] ?? null;
    }
  }

  /**
   * Runs systems and hooks according to each schedule in an infinite loop.
   */
  public async run(): Promise<void> {
    this.advanceSchedule();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      // no more schedules to run
      if (this.currentSchedule === null) {
        break;
      }

      if (this.currentSchedule.shouldRun()) {
        await this.step(this.currentSchedule);
      } else {
        this.advanceSchedule();
      }
    }
  }
}
