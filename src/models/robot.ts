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
          `${this.name} was already moving to ${this.nextWorkplace?.workplaceRole} `
          + `but manager decided change the destination... Resetting elapsed time on action to 0`
      );
      this.elapsedTimeOnAction = 0;
    }
    this.nextWorkplace = workplace;
  }

  doJobForTime(timeToRunInSeconds: number) {
    switch (this.state) {
      case RobotState.IDLE:
        this.handleIdleState();
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

  /*
    IDLE STATE
   */
  private setIdleState(): void {
    this.currentWorkplace = undefined;
    this.nextWorkplace = undefined;
    this.elapsedTimeOnAction = 0;
    this.timeToCompleteAction = -1;
    this.state = RobotState.IDLE;
  }

  private handleIdleState() {
    if (this.currentWorkplace) {
      this.setWorkingState();
    } else if (this.nextWorkplace) {
      this.setMovingState();
    }
  }

  /*
    WORKING STATE
   */
  private setWorkingState(): void {
    this.state = RobotState.WORKING;
    this.elapsedTimeOnAction = 0;
  }

  private handleWorkingState(timeToRunInSeconds: number): void {
    if (!this.currentWorkplace) {
      throw new Error(`Cannot work as no current workplace for robot ${this.name}`);
    }

    if (!this.isActionStarted()) {
      try {
        this.currentWorkplace.startAction();
      } catch (e) {
        console.error(`${this.name} cannot start task '${this.currentWorkplace.workplaceRole}'. Reason ${e}`);
        if (this.nextWorkplace) {
          this.setMovingState();
        }
        return;
      }
    }

    this.elapsedTimeOnAction += timeToRunInSeconds;
    if (this.elapsedTimeOnAction >= this.timeToCompleteAction) {
      console.log(`${this.name} is trying to finish task '${this.currentWorkplace.workplaceRole}'!`);

      this.currentWorkplace.completeAction();

      // The robot continues his action until a new one is set
      this.timeToCompleteAction = this.currentWorkplace.getTimeToCompleteAction();
      this.elapsedTimeOnAction = 0;

      if (this.nextWorkplace) {
        this.setMovingState();
      }
    }
  }

  private isActionStarted(): boolean {
    return this.elapsedTimeOnAction !== 0;
  }

  /*
    MOVING STATE
   */
  private setMovingState(): void {
    console.log(
        `${this.name} changing workplace`
        + ` from '${this.currentWorkplace?.workplaceRole}'`
        + ` to '${this.nextWorkplace?.workplaceRole}!'`
    );
    this.state = RobotState.MOVING;
    this.currentWorkplace?.unregisterRobot(this);
    this.timeToCompleteAction = 5;
    this.elapsedTimeOnAction = 0;
  }

  private handleMovingState(timeToRunInSeconds: number) {
    if (!this.nextWorkplace) {
      throw new Error(`Cannot move as no next workplace for robot ${this.name}`);
    }

    if (this.currentWorkplace) {
      throw new Error(
          `Cannot move as already have workplace (${this.currentWorkplace.workplaceRole}) for robot ${this.name}`
      );
    }

    this.elapsedTimeOnAction += timeToRunInSeconds;

    if (this.elapsedTimeOnAction >= this.timeToCompleteAction) {
      console.log(`${this.name} arrived in workplace '${this.nextWorkplace.workplaceRole}'!`);
      this.nextWorkplace.registerRobot(this);
      this.nextWorkplace = undefined;
    }
  }
}
