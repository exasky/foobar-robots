import { Actions } from '../models/action.enum';
import { Ecosystem } from '../models/ecosystem';
import { AbstractWorkplace } from './abstract.worplace';

export class FooMiningWorkplace extends AbstractWorkplace {
  constructor(ecosystem: Ecosystem) {
    super(ecosystem, Actions.FooFightingMiningAction);
    this.producedResources = {fooCount: 0};
  }

  getTimeToCompleteAction(): number {
    return 1;
  }

  internalCompleteAction(): boolean {
    this.producedResources.fooCount += 1
    this.ecosystem.fooCount += 1;
    return true;
  }
}
