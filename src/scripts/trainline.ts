import { Scene, Vector3 } from 'three';
import { Track } from './track';

export class TrainLine {
  private scene: Scene;
  private isPointerDown: boolean = false;

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
      new Vector3(0, 0, 0),
      new Vector3(1.5, 0, 0),
      new Vector3(3.5, 0, 0),
      new Vector3(5, 0, 0)
    );
    root.generateMesh();
    root.addToScene(this.scene);

    let next = new Track();
    next.setPoints(
      new Vector3(5, 0, 0),
      new Vector3(6.5, 0, 0),
      new Vector3(8.5, 0, -1),
      new Vector3(10, 0, 0)
    );
    next.generateMesh();
    next.addToScene(this.scene);

    next = new Track();
    next.setPoints(
      new Vector3(10, 0, 0),
      new Vector3(11.5, 0, 1),
      new Vector3(14, 0, 0),
      new Vector3(15.5, 0, 0)
    );
    next.generateMesh();
    next.addToScene(this.scene);

    next = new Track();

    next.setPoints(
      new Vector3(5, 0, 0),
      new Vector3(6.5, 0, 0),
      new Vector3(8.5, 0, -1),
      new Vector3(10, 0, 4)
    );
    next.generateMesh();
    next.addToScene(this.scene);
  }
}
