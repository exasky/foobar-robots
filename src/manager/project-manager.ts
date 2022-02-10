import { AbstractAction } from '../models/actions/abstract-action';
import { BarAthonAction } from '../models/actions/bar-athon.action';
import { BuyRobotAction } from '../models/actions/buy-robot.actions';
import { FooFightersMiningAction } from '../models/actions/foo-fighters-mining.action';
import { FoobarAssembly } from '../models/actions/foobar-assembly.action';
import { MoveToAction } from '../models/actions/move-to.actions';
import { SellFoobarAction } from '../models/actions/sell-foobar.action';
import { Ecosystem } from '../models/ecosystem';
import { Robot } from '../models/robot';

/**
 * The beloved project manager, asking politely robots to do the job without any pressure.
 */
export class ProjectManager {
  constructor(private ecosystem: Ecosystem) {}

  initEcosystemForManager() {
    // Init ecosystem with two robots doing foo & bar mining
    const fooMiningAction = new FooFightersMiningAction(this.ecosystem);
    let robot = new Robot();
    robot.setAction(fooMiningAction);
    this.ecosystem.robots.push(robot);

    const barMiningAction = new BarAthonAction(this.ecosystem);
    robot = new Robot();
    robot.setAction(barMiningAction);
    this.ecosystem.robots.push(robot);
  }

  pretendToManageForTime() {
    const nbRobots = this.ecosystem.robots.length;

    this.ecosystem.robots.forEach((robot) => {
      const bestAction = this.findBestAction();
      
      if (!robot.hasAction()) {
        robot.setAction(bestAction);
      } else {
        const robotAction = this.getRobotAction(robot);
        
        if (robotAction.getActionName() !== bestAction.getActionName()) {
          robot.setAction(new MoveToAction(bestAction, robot));
        }
      }
    });
  }

  private getRobotAction(robot: Robot): AbstractAction {
    return robot.getAction() instanceof MoveToAction
      ? (robot.getAction() as MoveToAction).getFutureAction()
      : (robot.getAction() as AbstractAction);
  }

  // Best algorithm possible by checking nb of robots assigned to a specific task for example
  /*
  const nbRobotsByAction = new Map<string, number>();
  // Not using this.ecosystem.robots.filter().count as if there is a lot of robots, the algorithm will do too much loops
   this.ecosystem.robots.forEach((robot) => {
     const typeOfRobotAction = typeof this.getRobotAction(robot);
     nbRobotsByAction.set(typeOfRobotAction, (nbRobotsByAction.get(typeOfRobotAction) || 0) + 1);
   });
  */
  private findBestAction(): AbstractAction {
    if (this.ecosystem.moneyMoney >= 20) {
      if (this.ecosystem.nbFoo >= 40) {
        return new BuyRobotAction(this.ecosystem);
      } else {
        return new FooFightersMiningAction(this.ecosystem);
      }
    }

    if (this.ecosystem.nbFoobar >= 20) {
      return new SellFoobarAction(this.ecosystem);
    }

    if (this.ecosystem.nbBar >= 20 && this.ecosystem.nbFoo >= 20) {
      return new FoobarAssembly(this.ecosystem);
    }

    if (this.ecosystem.nbFoo < 20) {
      return new FooFightersMiningAction(this.ecosystem);
    }

    return new BarAthonAction(this.ecosystem);
  }
}
