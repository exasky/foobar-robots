import { Ecosystem } from './models/ecosystem';
import { ProjectManager } from './manager/project-manager';
import { Robot } from './models/robot';

const canSimulationEnd = (ecosystem: Ecosystem): boolean => {
  return ecosystem.robots.length >= 30;
};

const endSimulation = (intervalId: number): void => {
  console.log();
  console.log();
  console.log();
  console.log('##################################################');
  console.log(
    'You made poor and sad robots work for nothing except your own profit.'
  );
  console.log('I hope you are proud of you.');
  console.log();
  console.log(
    'Anyway, congratz ! You achieved to buy 30 robots in order to mine all resources on the planet.'
  );
  console.log();
  console.log('Bye bye, see you next time');
  console.log('##################################################');

  clearInterval(intervalId);
};

const logEcosystem = (ecosystem: Ecosystem): void => {
  console.log({
    nbFoo: ecosystem.nbFoo,
    nbBar: ecosystem.nbBar,
    nbFoobar: ecosystem.nbFoobar,
    moneyMoney: ecosystem.moneyMoney,
    nbRobots: ecosystem.robots.length,
  });
};

const elapsedTimePerIntervalTickInSeconds = 0.1;
let nbOfTicksPassed = 0;

const ecosystem = new Ecosystem();
const projectManager = new ProjectManager(ecosystem);
projectManager.initEcosystemForManager();

const intervalId = setInterval(() => {
  ecosystem.robots.forEach((robot) => {
    robot.doJobForTime(elapsedTimePerIntervalTickInSeconds);
  });
  projectManager.pretendToManageForTime();

  // log each 'simulation second'
  if (nbOfTicksPassed % 10 === 0) {
    logEcosystem(ecosystem);
  }

  if (canSimulationEnd(ecosystem)) {
    logEcosystem(ecosystem);
    endSimulation(intervalId);
  }

  nbOfTicksPassed++;
}, 1);
