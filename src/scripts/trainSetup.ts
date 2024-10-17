import { Scene, Vector3 } from 'three';
import { Track } from './train/track';
import { TrainRouteManager } from './train/trainRoute';
import { TrainEngine } from './train/engine';
import { TrainCarriage } from './train/carriage';
import { Train } from './train/train';

export class TrainLine {
  private scene: Scene;
  private trains: Train[] = [];
  private trainRoutes: TrainRouteManager;

  public selectedTrack: Track | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
    this.trainRoutes = new TrainRouteManager(scene);
  }

  create() {
    this.createRoute();
    this.createRoute2();
    this.createRoute3();
    this.createRoute4();
    this.createRoute5();
    this.trainRoutes.finish();
  }

  createRoute() {
    const directive = this.trainRoutes.createRoute();
    directive
      .setRoot(
        new Vector3(-10, 0, 1.1),
        new Vector3(-5, 0, 1.1),
        new Vector3(-2, 0, 1.1),
        new Vector3(4, 0, 1.1)
      )
      .setJunction('station_plt_2')
      .wait(5)
      .moveTo(20, 0, 1.1)
      .moveTo(30, 0, 1.1)
      .moveTo(40, 0, 1.1)
      .arcTo(45, 0, -5)
      .arcTo(40, 0, -10)
      .arcTo(35, 0, -5)
      .arcTo(30, 0, 0.1)
      .moveTo(20, 0, 0.1)
      .connectToJunction('station_plt_1');

    this.addTrain(directive.getRoot());
  }

  createRoute2() {
    const directive = this.trainRoutes.createRoute();
    directive
      .setRoot(
        new Vector3(2, 0, 0.1),
        new Vector3(-2, 0, 0.1),
        new Vector3(-5, 0, 0.1),
        new Vector3(-10, 0, 0.1)
      )
      .setJunction('station_plt_1')
      .wait(4)
      .moveTo(-20, 0, 0.1)
      .moveTo(-30, 0, 0.1)
      .moveTo(-40, 0, 0.1)
      .arcTo(-45, 0, 5)
      .arcTo(-40, 0, 10)
      .arcTo(-35, 0, 5)
      .arcTo(-30, 0, 1.1)
      .moveTo(-20, 0, 1.1)
      .connectToJunction('station_plt_2');

    this.addTrain(directive.getRoot());
  }

  createRoute3() {
    const directive = this.trainRoutes.createRoute();
    directive
      .setRoot(
        new Vector3(2, 0, -2.1),
        new Vector3(-2, 0, -2.1),
        new Vector3(-5, 0, -2.1),
        new Vector3(-10, 0, -2.1)
      )
      .wait(5)
      .moveTo(-18, 0, -1.5)
      .moveTo(-30, 0, -1.1)
      .moveTo(-40, 0, -1.1)
      .arcTo(-46, 0, 5)
      .arcTo(-56, 0, 15)
      .arcTo(-66, 0, 5)
      .arcTo(-56, 0, -2.1)
      .moveTo(-40, 0, -2.1)
      .moveTo(-30, 0, -2.1)
      .moveTo(-24, 0, -2.1)
      .moveTo(-18, 0, -3.0)
      .setJunction('station_plt_3')
      .moveTo(-10, 0, -3.2)
      .moveTo(4, 0, -3.2)
      .wait(5)
      .moveTo(20, 0, -3.2)
      .arcTo(30, 0, -10)
      .moveTo(30, 0, -20)
      .arcTo(40, 0, -25)
      .arcTo(50, 0, -20)
      .arcTo(40, 0, -15)
      .arcTo(32, 0, -10)
      .arcTo(22, 0, -2.1)
      .moveTo(10, 0, -2.1)
      .connectToRoot();

    this.addTrain(directive.getRoot());
  }

  createRoute4() {
    const directive = this.trainRoutes.createRoute();
    directive
      .setRoot(
        new Vector3(-55, 0, -3.1),
        new Vector3(-50, 0, -3.1),
        new Vector3(-35, 0, -3.1),
        new Vector3(-30, 0, -3.1)
      )
      .connectToJunction('station_plt_3');

    this.addTrain(directive.getRoot());
  }

  createRoute5() {
    const directive = this.trainRoutes.createRoute();
    directive
      .setRoot(
        new Vector3(-10, 0, -5.4),
        new Vector3(-5, 0, -5.4),
        new Vector3(0, 0, -5.4),
        new Vector3(4.4, 0, -5.4)
      )
      .wait(7)
      .moveTo(10, 0, -5.4)
      .moveTo(20, 0, -5.4);

    const start = directive.getTrack();

    directive
      .arcTo(28, 0, -10)
      .moveTo(28, 0, -30)
      .arcTo(20, 0, -40)
      .moveTo(10, 0, -40)
      .moveTo(-20, 0, -40)
      .moveTo(-50, 0, -40);

    const secondStart = directive.getTrack();

    directive
      .arcTo(-60, 0, -30)
      .moveTo(-60, 0, -10)
      .arcTo(-50, 0, -5.4)
      .moveTo(-30, 0, -5.4)
      .moveTo(-20, 0, -5.4)
      .connectToRoot();

    this.addTrain(start);
    this.addTrain(secondStart);
  }

  addTrain(track: Track) {
    const engine = new TrainEngine();
    const carriageOne = new TrainCarriage();
    const carriageTwo = new TrainCarriage();
    const carriageThree = new TrainCarriage();

    const train = new Train(engine, [carriageOne, carriageTwo, carriageThree]);
    train.addToScene(this.scene);
    train.setToTrack(track);
    this.trains.push(train);
  }

  animate(delta: number) {
    for (const train of this.trains) {
      train.update(delta);
    }
  }
}
