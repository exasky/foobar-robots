import { Actions } from '../models/action.enum';
import { Ecosystem } from '../models/ecosystem';
import { AbstractWorkplace } from './abstract.worplace';

export class SellFoobarWorkplace extends AbstractWorkplace {
  constructor(ecosystem: Ecosystem) {
    super(ecosystem, Actions.SellFoobarAction);
    this.producedResources = {foobarCount: 0, moneyMoney: 0};
  }

  getTimeToCompleteAction(): number {
    return 10;
  }

  canDoAction(): boolean {
    return this.ecosystem.foobarCount > 0;
  }

  getCannotDoActionMessage(): string {
    if (this.ecosystem.foobarCount === 0) {
      return 'Not enough Foobar';
    }

    return '';
  }

  internalCompleteAction(): boolean {
    const nbFoobarToSell = Math.min(5, this.ecosystem.foobarCount);

    this.ecosystem.foobarCount -= nbFoobarToSell;
    this.ecosystem.moneyMoney += nbFoobarToSell;

    this.producedResources.nbFoobar -= nbFoobarToSell;
    this.producedResources.moneyMoney += nbFoobarToSell;

    return true;
  }
}
