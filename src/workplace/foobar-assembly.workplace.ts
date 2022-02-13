import { Actions } from '../models/action.enum';
import { Ecosystem } from '../models/ecosystem';
import { AbstractWorkplace } from './abstract.worplace';

export class FoobarAssemblyWorkplace extends AbstractWorkplace {
  constructor(ecosystem: Ecosystem) {
    super(ecosystem);
    this.producedResources = {fooCount: 0, barCount: 0, foobarCount: 0};
  }

  getWorkplaceRole(): Actions.FoobarAssemblyAction {
    return Actions.FoobarAssemblyAction;
  }

  getTimeToCompleteAction(): number {
    return 2;
  }

  canDoAction(): boolean {
    return this.ecosystem.fooCount > 1 && this.ecosystem.barCount > 1;
  }

  getCompletionNotPossibleMessage(): string {
    const resultWarning = [];
    if (this.ecosystem.fooCount < 1) {
      resultWarning.push('Not enough foo');
    }
    if (this.ecosystem.barCount < 1) {
      resultWarning.push('Not enough bar');
    }
    return resultWarning.join(' & ');
  }

  internalCompleteAction(): boolean {
    this.ecosystem.fooCount -= 1;
    this.ecosystem.barCount -= 1;
    this.producedResources.fooCount -= 1;
    this.producedResources.barCount -= 1;

    // Success
    if (Math.floor(Math.random() * 100) + 1 > 40) {
      this.ecosystem.foobarCount += 1;
      this.producedResources.foobarCount += 1;
      return true;
    } else {
      // Failure
      this.ecosystem.barCount += 1;
      this.producedResources.barCount += 1;
      return false;
    }
  }
}
