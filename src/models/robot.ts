import { Observable, Subject } from 'rxjs';
import { adjectives, animals, colors, Config, uniqueNamesGenerator } from 'unique-names-generator';
import { AbstractWorkplace } from '../workplace/abstract.worplace';

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  length: 3,
};

export class Robot {
  readonly name: string;

  private currentWorkplace?: AbstractWorkplace;
  private nextWorkplace?: AbstractWorkplace;

  private timeToCompleteAction = -1;
  protected elapsedTimeOnAction = 0;

  private actionFinishedSubject = new Subject<Robot>();
  private actionFinished$: Observable<Robot> = this.actionFinishedSubject.asObservable();

  constructor() {
    this.name = uniqueNamesGenerator(customConfig);
  }

  getCurrentWorkplace(): AbstractWorkplace | undefined {
    return this.currentWorkplace;
  }

  setCurrentWorkplace(workplace?: AbstractWorkplace) {
    this.currentWorkplace = workplace;
    this.timeToCompleteAction = this.currentWorkplace ? this.currentWorkplace.getTimeToCompleteAction() : -1;
    this.nextWorkplace = undefined;
  }

  setNextWorkplace(workplace?: AbstractWorkplace) {
    this.nextWorkplace = workplace;
  }

  doJobForTime(timeToRunInSeconds: number) {
    if (!this.currentWorkplace && this.nextWorkplace) {
      if (this.elapsedTimeOnAction >= 5) {
        this.nextWorkplace.addRobot(this);
        this.nextWorkplace = undefined;
      }
    }

    if (this.currentWorkplace) {
      this.elapsedTimeOnAction += timeToRunInSeconds;
      if (this.elapsedTimeOnAction >= this.timeToCompleteAction) {
        console.log(
            `${this.name} is trying to finish task '${this.currentWorkplace.getWorkplaceRole()}'!`
            + ` (But not sure he'll success)`
        );

        if (this.currentWorkplace.completeAction()) {
          this.actionFinishedSubject.next(this);
        }

        if (this.nextWorkplace) {
          console.log(
              `${this.name} changing workplace `
              + `from '${this.currentWorkplace.getWorkplaceRole()}' `
              + `to '${this.nextWorkplace.getWorkplaceRole()}!'`
          );
          this.currentWorkplace.removeRobot(this);
        }
        // The robot continues his action until a new one is set
        this.elapsedTimeOnAction = 0;
      }
    }
  }

  hasAction(): boolean {
    return !!this.currentWorkplace || !!this.nextWorkplace;
  }

  actionFinished(): Observable<Robot> {
    return this.actionFinished$;
  }
}
