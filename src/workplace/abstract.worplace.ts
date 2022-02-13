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

  protected constructor(protected ecosystem: Ecosystem) {
  }

  abstract getWorkplaceRole(): Actions;

  addRobot(robot: Robot) {
    this.assignedRobots.push(robot);
    robot.setCurrentWorkplace(this);
  }

  removeRobot(robot: Robot) {
    this.assignedRobots.splice(this.assignedRobots.indexOf(robot));
    robot.setCurrentWorkplace(undefined);
  }

  makeRobotsWorkForTime(timeToRunInSeconds: number) {
    this.assignedRobots.forEach((robot) => robot.doJobForTime(timeToRunInSeconds));
  }

  canDoAction(): boolean {
    return true;
  }

  getCompletionNotPossibleMessage(): string {
    return '';
  }

  /**
   * @returns True if acction succeeded, false otherwise
   */
  completeAction(): boolean {
    if (!this.canDoAction()) {
      console.warn(
          `Cannot complete action '${this.getWorkplaceRole()}'.`
          + ` Reason: '${this.getCompletionNotPossibleMessage()}'`
      );
      return false;
    } else {
      this.internalCompleteAction();
      console.log(`YaY action '${this.getWorkplaceRole()}' complete !`);
      this.reportingSubject.next(this.producedResources);
      return true;
    }

  }

  /**
   * @returns True if action succeeded, false otherwise
   */
  protected abstract internalCompleteAction(): boolean;

  abstract getTimeToCompleteAction(): number;
}
