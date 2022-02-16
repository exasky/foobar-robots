import { Robot } from './robot';

/**
 * POTO
 */
export class Ecosystem {
  robots: Robot[] = [];

  fooCount = 0;
  barCount = 0;
  foobarCount = 0;
  moneyMoney = 0;

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
