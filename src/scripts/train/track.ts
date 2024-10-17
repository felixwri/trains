import {
  BoxGeometry,
  CubicBezierCurve3,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  Scene,
  SphereGeometry,
  Vector3
} from 'three';
import { Rail } from './rail';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

export class Track {
  public next: Track | null = null;
  public previous: Track | null = null;

  public startVector: Vector3 = new Vector3();
  public controlVectorOne: Vector3 = new Vector3();
  public controlVectorTwo: Vector3 = new Vector3();
  public endVector: Vector3 = new Vector3();
  public addedToScene: boolean = false;

  private _containsTrain = false;

  private _stop: number = 0;

  public curve: CubicBezierCurve3 = new CubicBezierCurve3();

  private leftRail: Rail;
  private rightRail: Rail;
  private sleeperSpacing = 0.4;
  public trackWidth = 0.22;

  private debugLine: Line2 | null = null;

  constructor() {
    this.curve.v0 = this.startVector;
    this.curve.v1 = this.controlVectorOne;
    this.curve.v2 = this.controlVectorTwo;
    this.curve.v3 = this.endVector;

    this.leftRail = new Rail(this.curve);

    this.rightRail = new Rail(this.curve);
  }

  set containsTrain(value: boolean) {
    this._containsTrain = value;
    this.updateDebug();
  }

  get containsTrain() {
    return this._containsTrain;
  }

  set stop(value: number) {
    this._stop = value;
    this.updateDebug();
  }

  get stop() {
    return this._stop;
  }

  private updateDebug() {
    if (this._containsTrain) {
      this.debugLine?.material.color.set(0xff00ff);
    } else if (this._stop > 0) {
      this.debugLine?.material.color.set(0x00ff00);
    } else {
      this.debugLine?.material.color.set(0xff0000);
    }
  }

  setPoints(start: Vector3, control1: Vector3, control2: Vector3, end: Vector3) {
    this.startVector.copy(start);
    this.controlVectorOne.copy(control1);
    this.controlVectorTwo.copy(control2);
    this.endVector.copy(end);

    return this;
  }

  setStartPoints(start: Vector3, control1: Vector3) {
    this.startVector.copy(start);
    this.controlVectorOne.copy(control1);

    return this;
  }

  setEndPoints(control2: Vector3, end: Vector3) {
    this.controlVectorTwo.copy(control2);
    this.endVector.copy(end);

    return this;
  }

  /**
   * Allows for manual creation of a track piece which is
   * connected to a previous track piece
   *
   * @param previous Previous track piece
   * @param controlVectorOne This tracks first control point
   * @param controlVectorTwo This tracks second control point
   * @param endVector This tracks end point
   * @returns this
   */
  afterManual(
    previous: Track,
    controlVectorOne: Vector3,
    controlVectorTwo: Vector3,
    endVector: Vector3
  ) {
    this.previous = previous;
    previous.next = this;

    this.startVector.copy(previous.endVector);
    this.controlVectorOne.copy(controlVectorOne);
    this.controlVectorTwo.copy(controlVectorTwo);
    this.endVector.copy(endVector);
    return this;
  }

  /**
   * Connects this track to the end of another track piece
   * This creates a connection which is two way
   * @param previous Track to attach on to
   * @returns this
   */
  after(previous: Track) {
    this.previous = previous;
    previous.next = this;

    this.startVector.copy(previous.endVector);

    const offset = new Vector3().copy(previous.controlVectorTwo).sub(previous.endVector);
    const newControlVectorOne = new Vector3().copy(this.startVector).add(offset.negate());

    this.controlVectorOne.copy(newControlVectorOne);
    return this;
  }
  /**
   * Connects this track the start of another track piece.
   * This creates a one way connection unless the next piece
   * of track has no previous connections
   * @param next Track to attach to
   * @returns this
   */
  connectTo(next: Track) {
    this.next = next;

    if (next.previous !== null) {
      next.previous = this;
    }

    this.endVector.copy(next.startVector);

    const offset = new Vector3().copy(next.controlVectorOne).sub(next.startVector);
    const newControlVectorTwo = new Vector3().copy(this.endVector).add(offset.negate());

    this.controlVectorTwo.copy(newControlVectorTwo);
    return this;
  }

  /**
   * Tries to estimate the scond control point for a track piece
   * @param point Point to pass through
   */
  moveTo(point: Vector3) {
    this.endVector.copy(point);

    const offset = new Vector3()
      .copy(this.endVector)
      .sub(this.controlVectorOne)
      .normalize()
      .multiplyScalar(2);
    this.controlVectorTwo.copy(point.clone().sub(offset));
  }

  arcTo(point: Vector3) {
    const start = this.startVector.clone();
    const control1 = this.controlVectorOne.clone();
    const end = point.clone();

    const d1 = new Vector3().subVectors(control1, start).normalize();
    const d2 = new Vector3().subVectors(end, start).normalize();

    const cross = new Vector3().crossVectors(d1, d2).normalize();

    if (cross.y === 0) {
      this.moveTo(point);
      return;
    }

    const displacement = new Vector3().subVectors(control1, start).normalize();
    const magnitude = start.distanceTo(end);

    let orthogonal;
    if (cross.y > 0) {
      orthogonal = new Vector3(-displacement.z, 0, displacement.x).normalize();
    } else {
      orthogonal = new Vector3(displacement.z, 0, -displacement.x).normalize();
    }

    const c1 = start.clone().add(displacement.multiplyScalar(magnitude / 2));
    const c2 = new Vector3().addVectors(end, orthogonal.multiplyScalar(magnitude / 2));

    this.controlVectorOne.copy(c1);
    this.controlVectorTwo.copy(c2);
    this.endVector.copy(end);
  }

  generateMesh(scene: Scene) {
    this.leftRail.calculateOffset(this.curve, this.trackWidth);
    this.rightRail.calculateOffset(this.curve, this.trackWidth, false);

    this.leftRail.generateMesh();
    this.rightRail.generateMesh();

    const sleeperGeometry = new BoxGeometry(0.8, 0.05, 0.15);
    const sleeperMaterial = new MeshStandardMaterial({ color: 0x291b01, roughness: 1 });

    const sleeperCount = Math.round(this.curve.getLength() / this.sleeperSpacing);

    const instancedSleepers = new InstancedMesh(sleeperGeometry, sleeperMaterial, sleeperCount);

    let count = 0;
    let index = 0;
    const forward = new Vector3(0, 0, 1);
    const matrix = new Matrix4();

    while (count < this.curve.getLength()) {
      const position = this.getPositionOnCurve(count);
      const tangent = this.getTangent(count);

      const quaternion = new Quaternion().setFromUnitVectors(forward, tangent);

      matrix.compose(position, quaternion, new Vector3(1, 1, 1));
      instancedSleepers.setMatrixAt(index, matrix);

      count += this.sleeperSpacing;
      index++;
    }

    scene.add(instancedSleepers);
  }

  addToScene(scene: Scene) {
    this.addedToScene = true;

    if (this.leftRail.mesh) {
      scene.add(this.leftRail.mesh);
    }

    if (this.rightRail.mesh) {
      scene.add(this.rightRail.mesh);
    }

    // this.debug(scene);
  }

  getTangent(distance: number) {
    const distanceAlongCurve = distance / this.curve.getLength();

    const tangent = this.curve.getTangentAt(distanceAlongCurve);
    return tangent;
  }

  getPositionOnCurve(distance: number) {
    const distanceAlongCurve = distance / this.curve.getLength();

    const point = this.curve.getPointAt(distanceAlongCurve);
    return point;
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
    this.displayLine(this.curve, scene);
    this.displayPoints(this.curve, scene);
    this.displayPoints(this.leftRail.curve, scene);
    this.displayPoints(this.rightRail.curve, scene);
  }

  public displayLine(curve: CubicBezierCurve3, scene: Scene) {
    const points = curve.getPoints(50);

    const positions = [];
    for (let i = 1; i < points.length - 1; i++) {
      positions.push(points[i].x, points[i].y + 0.1, points[i].z);
    }

    const geometry = new LineGeometry();
    geometry.setPositions(positions);

    const matLine = new LineMaterial({
      color: 0xff0000,
      linewidth: 0.2,
      worldUnits: true,
      alphaToCoverage: true
    });

    const line = new Line2(geometry, matLine);
    line.computeLineDistances();
    line.scale.set(1, 1, 1);

    this.debugLine = line;
    this.updateDebug();
    scene.add(line);
  }

  public displayPoints(curve: CubicBezierCurve3, scene: Scene) {
    const sphereGeometry = new SphereGeometry(0.1, 32, 32);
    const colors = [0x00ff00, 0x0000ff, 0x00ffff, 0xff0000, 0xffff00];

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
