import {
  BufferGeometry,
  CubicBezierCurve3,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
  Vector3
} from 'three';
import { Rail } from './rail';

export class Track {
  public next: Track | null = null;
  public previous: Track | null = null;

  public startVector: Vector3 = new Vector3();
  public controlVectorOne: Vector3 = new Vector3();
  public controlVectorTwo: Vector3 = new Vector3();
  public endVector: Vector3 = new Vector3();
  public addedToScene: boolean = false;

  public trackWidth = 0.5;

  private curve: CubicBezierCurve3 = new CubicBezierCurve3();

  private leftRail: Rail;
  private rightRail: Rail;

  constructor() {
    this.curve.v0 = this.startVector;
    this.curve.v1 = this.controlVectorOne;
    this.curve.v2 = this.controlVectorTwo;
    this.curve.v3 = this.endVector;

    this.leftRail = new Rail(this.curve);

    this.rightRail = new Rail(this.curve);
  }

  setPoints(start: Vector3, control1: Vector3, control2: Vector3, end: Vector3) {
    this.startVector.copy(start);
    this.controlVectorOne.copy(control1);
    this.controlVectorTwo.copy(control2);
    this.endVector.copy(end);

    return this;
  }

  generateMesh() {
    this.leftRail.calculateOffset(this.curve, this.trackWidth);
    this.rightRail.calculateOffset(this.curve, this.trackWidth, false);

    this.leftRail.generateMesh();
    this.rightRail.generateMesh();
  }

  addToScene(scene: Scene) {
    this.addedToScene = true;

    if (this.leftRail.mesh) {
      scene.add(this.leftRail.mesh);
    }

    if (this.rightRail.mesh) {
      scene.add(this.rightRail.mesh);
    }

    this.debug(scene);
  }

  disposeMesh(scene: Scene) {
    if (this.leftRail.mesh !== null) {
      this.leftRail.mesh.geometry.dispose();
      scene.remove(this.leftRail.mesh);
      this.leftRail.mesh = null;
    }
    if (this.rightRail.mesh !== null) {
      this.rightRail.mesh.geometry.dispose();
      scene.remove(this.rightRail.mesh);
      this.rightRail.mesh = null;
    }
  }

  debug(scene: Scene) {
    this.displayCurve(this.curve, scene);
    // this.displayCurve(this.leftRail.curve, scene);
    // this.displayCurve(this.rightRail.curve, scene);
  }

  public displayCurve(curve: CubicBezierCurve3, scene: Scene) {
    const geometry = new BufferGeometry().setFromPoints(curve.getPoints(50));
    const curveObject = new Line(geometry, new LineBasicMaterial({ color: 0xff0000 }));
    scene.add(curveObject);

    const sphereGeometry = new SphereGeometry(0.1, 32, 32);
    const colors = [0x00ff00, 0x0000ff, 0x00ffff, 0xff0000];

    const debugSphere = (pos: Vector3, col: number) => {
      const s = new Mesh(sphereGeometry, new MeshBasicMaterial({ color: col }));
      s.position.copy(pos);
      scene.add(s);
    };

    debugSphere(curve.v0, colors[0]);
    debugSphere(curve.v1, colors[1]);
    debugSphere(curve.v2, colors[2]);
    debugSphere(curve.v3, colors[3]);
  }
}
