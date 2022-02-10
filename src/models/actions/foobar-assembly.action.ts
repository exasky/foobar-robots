import { Ecosystem } from '../ecosystem';
import { AbstractAction } from './abstract-action';

export class FoobarAssembly extends AbstractAction {
  constructor(private ecosystem: Ecosystem) {
    super(2, 'Foobar assembly');
  }

  completionPossible(): boolean {
    return this.ecosystem.nbFoo > 1 && this.ecosystem.nbBar > 1;
  }

  getCompletionNotPossibleMessage(): string {
    const resultWarning = [];
    if (this.ecosystem.nbFoo < 1) {
      resultWarning.push('Not enough foo');
    }
    if (this.ecosystem.nbBar < 1) {
      resultWarning.push('Not enough bar');
    }
    return resultWarning.join(' & ');
  }

  internalCompleteAction(): void {
    this.ecosystem.nbFoo -= 1;
    this.ecosystem.nbBar -= 1;

    // Success
    if (Math.floor(Math.random() * 100) + 1 > 40) {
      this.ecosystem.nbFoobar += 1;
    } else {
      // Failure
      this.ecosystem.nbBar += 1;
    }
  }
}
