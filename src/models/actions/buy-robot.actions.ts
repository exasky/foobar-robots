import { Ecosystem } from '../ecosystem';
import { Robot } from '../robot';
import { AbstractAction } from './abstract-action';

export class BuyRobotAction extends AbstractAction {
  constructor(private ecosystem: Ecosystem) {
    super(0, 'Buying robot');
  }

  completionPossible(): boolean {
    return this.ecosystem.moneyMoney >= 3 && this.ecosystem.nbFoo >= 6;
  }

  getCompletionNotPossibleMessage(): string {
    const resultWarning = [];
    if (this.ecosystem.moneyMoney < 3) {
      resultWarning.push('Not enough money');
    }
    if (this.ecosystem.nbFoo < 6) {
      resultWarning.push('Not enough foo');
    }
    return resultWarning.join(' & ');
  }

  internalCompleteAction(): void {
    this.ecosystem.moneyMoney -= 3;
    this.ecosystem.nbFoo -= 6;
    this.ecosystem.robots.push(new Robot());
  }
}
