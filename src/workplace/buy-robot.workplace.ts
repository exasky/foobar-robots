import { Actions } from '../models/action.enum';
import { Ecosystem } from '../models/ecosystem';
import { Robot } from '../models/robot';
import { AbstractWorkplace } from './abstract.worplace';

export class BuyRobotWorkplace extends AbstractWorkplace<Actions.BuyRobotAction> {
  constructor(ecosystem: Ecosystem) {
    super(ecosystem);
    this.producedResources = {
      moneyMoney: 0,
      nbFoo: 0,
      robots: 0,
    };
  }

  getWorkplaceRole(): Actions.BuyRobotAction {
    return Actions.BuyRobotAction;
  }

  getTimeToCompleteAction(): number {
    return 0;
  }

  canDoAction(): boolean {
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

  internalCompleteAction(): boolean {
    this.ecosystem.moneyMoney -= 3;
    this.ecosystem.nbFoo -= 6;
    this.ecosystem.robots.push(new Robot());

    this.producedResources.moneyMoney -= 3;
    this.producedResources.nbFoo -= 6;
    this.producedResources.robots += 1;

    return true;
  }
}
