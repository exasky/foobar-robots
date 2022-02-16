import { Ecosystem } from '../ecosystem';
import { AbstractAction } from './abstract-action';

export class SellFoobarAction extends AbstractAction {
  constructor(private ecosystem: Ecosystem) {
    super(10, 'Selling Foobar');
  }

  completionPossible(): boolean {
    return this.ecosystem.foobarCount > 0;
  }

  getCompletionNotPossibleMessage(): string {
    if (this.ecosystem.foobarCount === 0) {
      return 'Not enough Foobar';
    }

    return '';
  }

  internalCompleteAction(): void {
    const nbFoobarToSell = Math.max(5, this.ecosystem.foobarCount);
    this.ecosystem.foobarCount -= nbFoobarToSell;
    this.ecosystem.moneyMoney += nbFoobarToSell;
  }
}
