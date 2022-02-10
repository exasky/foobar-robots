import { Ecosystem } from '../ecosystem';
import { Robot } from '../robot';
import { AbstractAction } from './abstract-action';

export class MoveToAction extends AbstractAction {
  private futureAction: AbstractAction;

  constructor(
    futureAction: AbstractAction,
    private robot: Robot
  ) {
    super(5, `Moving to ${futureAction.getActionName()}`);
    this.futureAction = futureAction;
  }

  getFutureAction(): AbstractAction {
    return this.futureAction;
  }

  internalCompleteAction(): void {
    this.robot.setAction(this.futureAction);
  }
}
