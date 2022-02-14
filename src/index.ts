import { ProjectManager } from './manager/project-manager';
import { Actions } from './models/action.enum';
import { Ecosystem } from './models/ecosystem';
import { RobotState } from './models/robot';
import { BarAthonMiningWorkplace } from './workplace/bar-athon-mining.workplace';
import { BuyRobotWorkplace } from './workplace/buy-robot.workplace';
import { FooMiningWorkplace } from './workplace/foo-mining.workplace';
import { FoobarAssemblyWorkplace } from './workplace/foobar-assembly.workplace';
import { SellFoobarWorkplace } from './workplace/sell-foobar.workplace';

const canSimulationEnd = (ecosystem: Ecosystem): boolean => {
  return ecosystem.robots.length >= 30;
};

const endSimulation = (intervalId: number): void => {
  console.log();
  console.log();
  console.log();
  console.log('##################################################');
  console.log('You made poor and sad robots work for nothing except your own profit.');
  console.log('I hope you are proud of you.');
  console.log();
  console.log('Anyway, congratz ! You achieved to buy 30 robots in order to mine all resources on the planet.');
  console.log();
  console.log('Bye bye, see you next time');
  console.log('##################################################');

  clearInterval(intervalId);
};

const elapsedTimePerIntervalTickInSeconds = 0.1;
const msForOneRealSecond = 1;
let nbOfTicksPassed = 0;

const ecosystem = new Ecosystem();
ecosystem.workplaces.set(Actions.FooFightingMiningAction, new FooMiningWorkplace(ecosystem));
ecosystem.workplaces.set(Actions.BarAthonMiningAction, new BarAthonMiningWorkplace(ecosystem));
ecosystem.workplaces.set(Actions.FoobarAssemblyAction, new FoobarAssemblyWorkplace(ecosystem));
ecosystem.workplaces.set(Actions.SellFoobarAction, new SellFoobarWorkplace(ecosystem));
ecosystem.workplaces.set(Actions.BuyRobotAction, new BuyRobotWorkplace(ecosystem));

const projectManager = new ProjectManager(ecosystem);
projectManager.initEcosystemForManager();

const intervalId = setInterval(() => {
  // Workplaces make robots work
  ecosystem.workplaces.forEach((workplace, _) => workplace.makeRobotsWorkForTime(elapsedTimePerIntervalTickInSeconds));
  // Need to make MOVING robot move ;)
  ecosystem.robots
    .filter((robot) => robot.getCurrentState() === RobotState.MOVING)
    .forEach((robot) => robot.doJobForTime(elapsedTimePerIntervalTickInSeconds));

  projectManager.pretendToManage();

  // console.log('Time passed: ' + nbOfTicksPassed * elapsedTimePerIntervalTickInSeconds);
  // log each 'simulation second'
  if ((nbOfTicksPassed * elapsedTimePerIntervalTickInSeconds) % 1 === 0) {
    console.log(ecosystem.toString());
  }

  if (canSimulationEnd(ecosystem)) {
    console.log(ecosystem.toString());
    endSimulation(intervalId);
  }

  nbOfTicksPassed++;
}, msForOneRealSecond);
