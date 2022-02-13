import { AbstractWorkplace } from '../workplace/abstract.worplace';
import { Actions } from './action.enum';
import { Robot } from './robot';

/**
 * POTO
 */
export class Ecosystem {
  workplaces: Map<Actions, AbstractWorkplace> = new Map();
  robots: Robot[] = [];

  fooCount = 0;
  barCount = 0;
  foobarCount = 0;
  moneyMoney = 0;

  getWorkplace(action: Actions): AbstractWorkplace {
    const workplace = this.workplaces.get(action);
    if (!workplace) {
      throw new Error(`No workplace found for action ${action}! Please fix it.`);
    }
    return workplace;
  }

  toString(): string {
    return JSON.stringify({
      fooCount: this.fooCount,
      barCount: this.barCount,
      foobarCount: this.foobarCount,
      moneyMoney: this.moneyMoney,
      robotCount: this.robots.length,
    })
  }
}
