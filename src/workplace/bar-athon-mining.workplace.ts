import { Actions } from '../models/action.enum';
import { Ecosystem } from '../models/ecosystem';
import { AbstractWorkplace } from './abstract.worplace';

export class BarAthonMiningWorkplace extends AbstractWorkplace {
  constructor(ecosystem: Ecosystem) {
    super(ecosystem, Actions.BarAthonMiningAction);
    this.producedResources = {barCount: 0};
  }

  /**
   * @returns A number between 0.5 & 2 rounded to tenths
   */
  getTimeToCompleteAction(): number {
    return Math.floor(Math.random() * (20 - 5 + 1) + 5) / 10;
  }

  internalCompleteAction(): boolean {
    this.producedResources.barCount += 1;
    this.ecosystem.barCount += 1;
    return true;
  }
}
