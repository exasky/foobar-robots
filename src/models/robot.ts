import { Observable, Subject } from 'rxjs';
import { adjectives, animals, colors, Config, uniqueNamesGenerator } from 'unique-names-generator';
import { AbstractWorkplace } from '../workplace/abstract.worplace';

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  length: 3,
};

export const enum RobotState {
  IDLE,
  WORKING,
  MOVING,
}

export class Robot {
  readonly name: string;

  private state: RobotState;

  private currentWorkplace?: AbstractWorkplace;
  private nextWorkplace?: AbstractWorkplace;

  private timeToCompleteAction = -1;
  protected elapsedTimeOnAction = 0;

  private actionFinishedSubject = new Subject<Robot>();
  private actionFinished$: Observable<Robot> = this.actionFinishedSubject.asObservable();

  constructor() {
    this.name = uniqueNamesGenerator(customConfig);
    this.state = RobotState.IDLE;
  }

  getCurrentWorkplace(): AbstractWorkplace | undefined {
    return this.currentWorkplace;
  }

  setCurrentWorkplace(workplace?: AbstractWorkplace) {
    this.currentWorkplace = workplace;
    if (workplace) {
      this.currentWorkplace = workplace;
      this.timeToCompleteAction = workplace.getTimeToCompleteAction();
      this.nextWorkplace = undefined;
      this.setWorkingState();
    }
  }

  getCurrentState(): RobotState {
    return this.state;
  }

  isIdle(): boolean {
    return this.state === RobotState.IDLE;
  }

  setNextWorkplace(workplace?: AbstractWorkplace) {
    if (this.state === RobotState.MOVING && this.nextWorkplace !== workplace) {
      console.warn(
        `${this.getName()} was already moving to ${this.nextWorkplace?.getWorkplaceRole()} but manager decided change the destination... Reseting elapsed time on action to 0`
      );
      this.elapsedTimeOnAction = 0;
    }
    this.nextWorkplace = workplace;
  }

  doJobForTime(timeToRunInSeconds: number) {
    switch (this.state) {
      case RobotState.IDLE:
        if (this.currentWorkplace) {
          this.setWorkingState();
        } else if (this.nextWorkplace) {
          this.setMovingState();
        }
        break;
      case RobotState.WORKING:
        try {
          this.handleWorkingState(timeToRunInSeconds);
        } catch (e) {
          console.error(e);
          this.setIdleState();
        }
        break;
      case RobotState.MOVING:
        try {
          this.handleMovingState(timeToRunInSeconds);
        } catch (e) {
          console.error(e);
          if (this.currentWorkplace) {
            this.setWorkingState();
          }
        }
        break;
    }
  }

  private handleWorkingState(timeToRunInSeconds: number) {
    if (!this.currentWorkplace) {
      throw new Error(`Cannot work as no current workplace for robot ${this.getName()}`);
    }

    this.elapsedTimeOnAction += timeToRunInSeconds;
    if (this.elapsedTimeOnAction >= this.timeToCompleteAction) {
      console.log(
        `${this.getName()} is trying to finish task '${this.currentWorkplace.getWorkplaceRole()}'! (But not sure he'll success)`
      );

      if (this.currentWorkplace.completeAction()) {
        this.actionFinishedSubject.next(this);
      }
      // The robot continues his action until a new one is set
      this.elapsedTimeOnAction = 0;

      if (this.nextWorkplace) {
        this.setMovingState();
      }
    }
  }

  private handleMovingState(timeToRunInSeconds: number) {
    if (!this.nextWorkplace) {
      throw new Error(`Cannot move as no next workplace for robot ${this.getName()}`);
    }

    if (this.currentWorkplace) {
      throw new Error(
        `Cannot move as already have workplace (${this.currentWorkplace.getWorkplaceRole()}) for robot ${this.getName()}`
      );
    }

    this.elapsedTimeOnAction += timeToRunInSeconds;

    if (this.elapsedTimeOnAction >= this.timeToCompleteAction) {
      console.log(`${this.getName()} arrived in workplace '${this.nextWorkplace?.getWorkplaceRole()}'!'`);
      this.nextWorkplace.registerRobot(this);
      this.nextWorkplace = undefined;
    }
  }

  private setWorkingState(): void {
    this.state = RobotState.WORKING;
    this.elapsedTimeOnAction = 0;
  }

  private setMovingState(): void {
    console.log(
      `${this.getName()} changing workplace from '${this.currentWorkplace?.getWorkplaceRole()}' to '${this.nextWorkplace?.getWorkplaceRole()}!'`
    );
    this.state = RobotState.MOVING;
    this.currentWorkplace?.unregisterRobot(this);
    this.timeToCompleteAction = 5;
    this.elapsedTimeOnAction = 0;
  }

  private setIdleState(): void {
    this.currentWorkplace = undefined;
    this.nextWorkplace = undefined;
    this.elapsedTimeOnAction = 0;
    this.timeToCompleteAction = -1;
    this.state = RobotState.IDLE;
  }

  actionFinished(): Observable<Robot> {
    return this.actionFinished$;
  }
}
