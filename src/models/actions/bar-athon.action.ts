import { Ecosystem } from '../ecosystem';
import { AbstractAction } from './abstract-action';

export class BarAthonAction extends AbstractAction {
  constructor(private ecosystem: Ecosystem) {
    super(BarAthonAction.getRandomTimeToComplete(), 'Barathon mining');
  }

  internalCompleteAction(): void {
    this.ecosystem.barCount += 1;
    this.timeToComplete = BarAthonAction.getRandomTimeToComplete();
  }

  /**
   *
   * @returns A number between 0.5 & 2 rounded to tenths
   */
  private static getRandomTimeToComplete(): number {
    return Math.floor(Math.random() * (20 - 5 + 1) + 5) / 10;
  }
}
