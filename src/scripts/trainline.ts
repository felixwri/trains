import { Scene, Vector3 } from 'three';
import { Track } from './track';
import { Train } from './train';
import { TrainDirective } from './route';

export class TrainLine {
  private scene: Scene;
  private trains: Train[] = [];

  public selectedTrack: Track | null = null;

  private route: Vector3[] = [
    new Vector3(10, 0, 4),
    new Vector3(15, 0, 1),
    new Vector3(15, 0, -4),
    new Vector3(10, 0, -6),
    new Vector3(0, 0, -6),
    new Vector3(-20, 0, -6),
    new Vector3(-30, 0, -6),
    new Vector3(-35, 0, -3),
    new Vector3(-35, 0, 2),
    new Vector3(-30, 0, 4),
    new Vector3(-10, 0, 4)
  ];

  constructor(scene: Scene) {
    this.scene = scene;
  }

  createRoute() {
    const root = new Track();
    root.setPoints(
      new Vector3(-10, 0, 4),
      new Vector3(-5, 0, 4),
      new Vector3(-2, 0, 4),
      new Vector3(-0, 0, 4)
    );
    root.generateMesh();
    root.addToScene(this.scene);

    let previous = root;

    for (const checkpoint of this.route) {
      const next = new Track();
      next.after(previous);
      next.moveTo(checkpoint);
      next.generateMesh();
      next.addToScene(this.scene);
      previous = next;
    }

    this.addTrain(root);
  }

  createRoute2() {
    const directive = new TrainDirective(this.scene);
    directive
      .setRoot(
        new Vector3(-10, 0, 4),
        new Vector3(-5, 0, 4),
        new Vector3(-2, 0, 4),
        new Vector3(-0, 0, 4)
      )
      .moveTo(new Vector3(10, 0, 4))
      .moveTo(new Vector3(15, 0, 1))
      .moveTo(new Vector3(15, 0, -4))
      .moveTo(new Vector3(10, 0, -6))
      .moveTo(new Vector3(0, 0, -6))
      .moveTo(new Vector3(-20, 0, -6))
      .moveTo(new Vector3(-30, 0, -6))
      .moveTo(new Vector3(-35, 0, -3))
      .moveTo(new Vector3(-35, 0, 2))
      .moveTo(new Vector3(-30, 0, 4))
      .connectToRoot();

    this.addTrain(directive.getRoot());
  }

  createRoute3() {
    const directive = new TrainDirective(this.scene);
    directive
      .setRoot(
        new Vector3(-10, 0, 2),
        new Vector3(-5, 0, 2),
        new Vector3(-2, 0, 2),
        new Vector3(-0, 0, 2)
      )
      .arcTo(new Vector3(5, 0, -3))
      .moveTo(new Vector3(5, 0, -20));

    this.addTrain(directive.getRoot());
  }

  addTrain(track: Track) {
    const train = new Train();
    train.setToTrack(track);
    train.addToScene(this.scene);

    this.trains.push(train);
  }

  animate(delta: number) {
    for (const train of this.trains) {
      train.move(delta);
    }
  }
}
