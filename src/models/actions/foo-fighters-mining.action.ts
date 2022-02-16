import { Ecosystem } from '../ecosystem';
import { AbstractAction } from './abstract-action';

export class FooFightersMiningAction extends AbstractAction {
  constructor(private ecosystem: Ecosystem) {
    super(1, 'Foo fight mining');
  }

  internalCompleteAction(): void {
    this.ecosystem.fooCount += 1;
  }
}
