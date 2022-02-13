import { Actions } from '../models/action.enum';
import { Ecosystem } from '../models/ecosystem';
import { Robot } from '../models/robot';
import { AbstractWorkplace } from '../workplace/abstract.worplace';

/**
 * The beloved project manager, asking politely robots to do the job without any pressure.
 */
export class ProjectManager {
  private kpis: Map<AbstractWorkplace, unknown> = new Map();

  constructor(private ecosystem: Ecosystem) {
  }

  initEcosystemForManager() {
    // Init ecosystem with two robots doing foo & bar mining

    let robot = new Robot();
    robot.actionFinished().subscribe(this.onRobotActionFinished);
    this.ecosystem.robots.push(robot);
    this.ecosystem.workplaces.get(Actions.FooFightingMiningAction)?.addRobot(robot);

    robot = new Robot();
    robot.actionFinished().subscribe(this.onRobotActionFinished);
    this.ecosystem.robots.push(robot);
    this.ecosystem.workplaces.get(Actions.BarAthonMiningAction)?.addRobot(robot);

    this.ecosystem.workplaces.forEach((workplace) => {
      workplace.reporting$.subscribe((producedResources: unknown) => {
        this.kpis.set(workplace, producedResources);
      });
    });
  }

  pretendToManage() {
    if (Math.random() > 0.99) {
      this.doKpis();
    }

    this.ecosystem.robots.forEach((robot) => {
      const nextWorkplace = this.findBestWorkplace();

      if (!robot.hasAction()) {
        nextWorkplace?.addRobot(robot);
      } else {
        const robotWorkplace = robot.getCurrentWorkplace();
        if (robotWorkplace !== nextWorkplace) {
          robot.setNextWorkplace(nextWorkplace);
        }
      }
    });
  }

  private onRobotActionFinished(robot: Robot) {
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
  private findBestWorkplace(): AbstractWorkplace {
    if (this.ecosystem.moneyMoney >= 20) {
      if (this.ecosystem.fooCount >= 40) {
        return this.ecosystem.getWorkplace(Actions.BuyRobotAction);
      } else {
        return this.ecosystem.getWorkplace(Actions.FooFightingMiningAction);
      }
    }

    if (this.ecosystem.foobarCount >= 20) {
      return this.ecosystem.getWorkplace(Actions.SellFoobarAction);
    }

    if (this.ecosystem.barCount >= 20 && this.ecosystem.fooCount >= 20) {
      return this.ecosystem.getWorkplace(Actions.FoobarAssemblyAction);
    }

    if (this.ecosystem.fooCount < 20) {
      return this.ecosystem.getWorkplace(Actions.FooFightingMiningAction);
    }

    return this.ecosystem.getWorkplace(Actions.BarAthonMiningAction);
  }

  /**
   * Because a good manager does kpis
   */
  private doKpis(): void {
    console.log("I'm the manager, I need to produce KPIS !!!!!");
    this.kpis.forEach((production, workplace) => {
      console.log(`Workplace '${workplace.getWorkplaceRole()}' produced : ${JSON.stringify(production)}`);
    });
    console.log("I'm the manager, I feel goot after producing KPIS <3");
  }
}
