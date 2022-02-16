import { Subject } from 'rxjs';
import { Ecosystem } from '../models/ecosystem';
import { Robot } from '../models/robot';
import { Actions } from "../models/action.enum";

class ProducedResource {
  [key: string]: number
}

export abstract class AbstractWorkplace {
  protected assignedRobots: Robot[] = [];
  protected producedResources: ProducedResource = {};

  private reportingSubject = new Subject<unknown>();
  reporting$ = this.reportingSubject.asObservable();

  protected constructor(protected ecosystem: Ecosystem, public readonly workplaceRole: Actions) {
  }

  registerRobot(robot: Robot) {
    robot.setCurrentWorkplace(this);
    this.assignedRobots.push(robot);
  }

  unregisterRobot(robot: Robot) {
    robot.setCurrentWorkplace(undefined);
    this.assignedRobots.splice(this.assignedRobots.indexOf(robot), 1);
  }

  makeRobotsWorkForTime(timeToRunInSeconds: number) {
    this.assignedRobots.forEach((robot) => robot.doJobForTime(timeToRunInSeconds));
  }

  canDoAction(): boolean {
    return true;
  }

  getCannotDoActionMessage(): string {
    return '';
  }

  startAction(): void {
    if (!this.canDoAction()) {
      throw new Error(this.getCannotDoActionMessage());
    }

    this.internalStartAction();
  }

  /**
   * Remove resources from ecosystem at action start
   */
  protected internalStartAction(): void {
    return;
  }

  /**
   * Produce resources into ecosystem at action complete
   *
   * @returns True if action succeeded, false otherwise
   */
  completeAction(): void {
    if (this.internalCompleteAction()) {
      console.log(`YaY action '${this.workplaceRole}' complete !`);
    } else {
      console.warn(`An error occurred while completing action '${this.workplaceRole}' :(`);
      this.reportingSubject.next(this.producedResources);
    }
  }

  /**
   * @returns True if action succeeded, false otherwise
   */
  protected abstract internalCompleteAction(): boolean;

  abstract getTimeToCompleteAction(): number;
}
