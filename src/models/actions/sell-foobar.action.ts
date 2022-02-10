import { Ecosystem } from '../ecosystem';
import { AbstractAction } from './abstract-action';

export class SellFoobarAction extends AbstractAction {
  constructor(private ecosystem: Ecosystem) {
    super(10, 'Selling Foobar');
  }

  completionPossible(): boolean {
    return this.ecosystem.nbFoobar > 0;
  }

  getCompletionNotPossibleMessage(): string {
    if (this.ecosystem.nbFoobar === 0) {
      return 'Not enough Foobar';
    }

    return '';
  }

  internalCompleteAction(): void {
    const nbFoobarToSell = this.ecosystem.nbFoobar > 5 ? 5 : this.ecosystem.nbFoobar;
    this.ecosystem.nbFoobar -= nbFoobarToSell;
    this.ecosystem.moneyMoney += nbFoobarToSell;
  }
}
