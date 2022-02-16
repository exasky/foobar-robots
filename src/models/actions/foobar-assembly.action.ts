import { Ecosystem } from '../ecosystem';
import { AbstractAction } from './abstract-action';

export class FoobarAssembly extends AbstractAction {
  constructor(private ecosystem: Ecosystem) {
    super(2, 'Foobar assembly');
  }

  completionPossible(): boolean {
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

  internalCompleteAction(): void {
    this.ecosystem.fooCount -= 1;
    this.ecosystem.barCount -= 1;

    // Success
    if (Math.floor(Math.random() * 100) + 1 > 40) {
      this.ecosystem.foobarCount += 1;
    } else {
      // Failure
      this.ecosystem.barCount += 1;
    }
  }
}
