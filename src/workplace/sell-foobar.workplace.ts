import { Actions } from '../models/action.enum';
import { Ecosystem } from '../models/ecosystem';
import { AbstractWorkplace } from './abstract.worplace';

export class SellFoobarWorkplace extends AbstractWorkplace<Actions.SellFoobarAction> {
  constructor(ecosystem: Ecosystem) {
    super(ecosystem);
    this.producedResources = {
      nbFoobar: 0,
      moneyMoney: 0,
    };
  }

  getWorkplaceRole(): Actions.SellFoobarAction {
    return Actions.SellFoobarAction;
  }

  getTimeToCompleteAction(): number {
    return 10;
  }

  canDoAction(): boolean {
    return this.ecosystem.nbFoobar > 0;
  }

  getCompletionNotPossibleMessage(): string {
    if (this.ecosystem.nbFoobar === 0) {
      return 'Not enough Foobar';
    }

    return '';
  }

  internalCompleteAction(): boolean {
    const nbFoobarToSell =
      this.ecosystem.nbFoobar > 5 ? 5 : this.ecosystem.nbFoobar;

    this.ecosystem.nbFoobar -= nbFoobarToSell;
    this.ecosystem.moneyMoney += nbFoobarToSell;

    this.producedResources.nbFoobar -= nbFoobarToSell;
    this.producedResources.moneyMoney += nbFoobarToSell;

    return true;
  }
}
