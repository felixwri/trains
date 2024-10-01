import { Scene, Vector3 } from 'three';
import { Track } from './track';
import { Train } from './train';

export class TrainLine {
  private scene: Scene;
  private isPointerDown: boolean = false;
  private trains: Train[] = [];

  public selectedTrack: Track | null = null;

  private route: Vector3[] = [
    new Vector3(10, 0, 0)
    // new Vector3(15, 0, 1),
    // new Vector3(20, 0, 0),
    // new Vector3(30, 0, -2)
  ];

  constructor(scene: Scene) {
    this.scene = scene;
  }

  createRoute() {
    const root = new Track();
    root.setPoints(
      new Vector3(-40, 0, 0),
      new Vector3(-38, 0, 0),
      new Vector3(-2, 0, 0),
      new Vector3(0, 0, 0)
    );
    root.generateMesh();
    root.addToScene(this.scene);

    let next = new Track();
    next.attachTo(root, new Vector3(4, 0, 0), new Vector3(8, 0, 0), new Vector3(10, 0, 0));
    next.generateMesh();
    next.addToScene(this.scene);

    let previous = next;

    next = new Track();
    next.attachTo(previous, new Vector3(14, 0, 0), new Vector3(18, 0, 0), new Vector3(20, 0, -2));
    next.generateMesh();
    next.addToScene(this.scene);

    previous = next;

    next = new Track();
    next.attachTo(
      previous,
      new Vector3(22, 0, -4),
      new Vector3(26, 0, -10),
      new Vector3(26, 0, -14)
    );
    next.generateMesh();
    next.addToScene(this.scene);

    this.addTrain(root);
  }

  createRouteTwo() {
    const root = new Track();
    root.setPoints(
      new Vector3(-50, 0, 8),
      new Vector3(-45, 0, 2),
      new Vector3(-42, 0, 2),
      new Vector3(-40, 0, 2)
    );
    root.generateMesh();
    root.addToScene(this.scene);

    let next = new Track();
    next.attachTo(root, new Vector3(-38, 0, 2), new Vector3(-2, 0, 2), new Vector3(0, 0, 2));
    next.generateMesh();
    next.addToScene(this.scene);

    const previous = next;

    next = new Track();
    next.attachTo(previous, new Vector3(2, 0, 2), new Vector3(10, 0, 2), new Vector3(15, 0, 2));
    next.generateMesh();
    next.addToScene(this.scene);

    this.addTrain(root);
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
