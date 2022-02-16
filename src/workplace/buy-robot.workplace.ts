import { Actions } from '../models/action.enum';
import { Ecosystem } from '../models/ecosystem';
import { Robot } from '../models/robot';
import { AbstractWorkplace } from './abstract.worplace';

export class BuyRobotWorkplace extends AbstractWorkplace {
  constructor(ecosystem: Ecosystem) {
    super(ecosystem, Actions.BuyRobotAction);
    this.producedResources = {moneyMoney: 0, nbFoo: 0, robots: 0};
  }

  getTimeToCompleteAction(): number {
    return 0;
  }

  canDoAction(): boolean {
    return this.ecosystem.moneyMoney >= 3 && this.ecosystem.fooCount >= 6;
  }

  getCannotDoActionMessage(): string {
    const resultWarning = [];
    if (this.ecosystem.moneyMoney < 3) {
      resultWarning.push('Not enough money');
    }
    if (this.ecosystem.fooCount < 6) {
      resultWarning.push('Not enough foo');
    }
    return resultWarning.join(' & ');
  }

  protected internalStartAction() {
    this.ecosystem.moneyMoney -= 3;
    this.ecosystem.fooCount -= 6;
    this.producedResources.moneyMoney -= 3;
    this.producedResources.fooCount -= 6;
  }

  internalCompleteAction(): boolean {
    this.ecosystem.robots.push(new Robot());
    this.producedResources.robots += 1;

    return true;
  }
}
