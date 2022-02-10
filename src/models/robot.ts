import { uniqueNamesGenerator, adjectives, colors, animals, Config } from 'unique-names-generator';
import { AbstractAction } from './actions/abstract-action';

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  length: 3,
};

export class Robot {
  private name: string;
  private currentAction?: AbstractAction;
  protected elapsedTimeOnAction: number = 0;

  constructor() {
    this.name = uniqueNamesGenerator(customConfig);
  }

  getName() {
    return this.name;
  }

  getAction(): AbstractAction | undefined {
    return this.currentAction;
  }

  setAction(action: AbstractAction) {
    this.currentAction = action;
    this.elapsedTimeOnAction = 0;
  }

  doJobForTime(timeToRunInSeconds: number) {
    if (this.currentAction) {
      this.elapsedTimeOnAction += timeToRunInSeconds;
      if (this.elapsedTimeOnAction >= this.currentAction.getTimeToComplete()) {
        console.log(`${this.name} is trying to finish task ${this.currentAction.getActionName()}! (But not sure he'll success)`)
        this.currentAction.completeAction();
        // The robot continues his action until a new one is set
        this.elapsedTimeOnAction = 0;
      }
    }
  }

  hasAction(): boolean {
    return !!this.currentAction;
  }
}
