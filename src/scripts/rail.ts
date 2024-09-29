import {
  CubicBezierCurve3,
  ExtrudeGeometry,
  Mesh,
  MeshNormalMaterial,
  Shape,
  Vector2,
  Vector3
} from 'three';

export class Rail {
  public curve: CubicBezierCurve3;

  public mesh: Mesh | null = null;

  private parentCurve: CubicBezierCurve3;

  private startVector: Vector3;
  private controlVectorOne: Vector3;

  private controlVectorTwo: Vector3;

  private endVector: Vector3;

  constructor(parentCurve: CubicBezierCurve3) {
    this.parentCurve = parentCurve;

    this.startVector = parentCurve.v0.clone();
    this.controlVectorOne = parentCurve.v1.clone();
    this.controlVectorTwo = parentCurve.v2.clone();
    this.endVector = parentCurve.v3.clone();

    this.curve = new CubicBezierCurve3(
      this.startVector,
      this.controlVectorOne,
      this.controlVectorTwo,
      this.endVector
    );
  }

  public calculateOffset(parent: CubicBezierCurve3, offset: number, left: boolean = true) {
    const p = parent.clone();

    const startNormal = new Vector3()
      .subVectors(p.v0, p.v1)
      .normalize()
      .cross(new Vector3(0, 1, 0))
      .normalize();

    startNormal.multiplyScalar(offset);

    const endNormal = new Vector3()
      .subVectors(p.v3, p.v2)
      .normalize()
      .cross(new Vector3(0, 1, 0))
      .normalize();

    endNormal.multiplyScalar(offset);

    if (!left) {
      startNormal.negate();
    } else {
      endNormal.negate();
    }

    this.curve.v0 = p.v0.add(startNormal);
    this.curve.v1 = p.v1.add(startNormal);
    this.curve.v2 = p.v2.add(endNormal);
    this.curve.v3 = p.v3.add(endNormal);
  }

  public generateMesh() {
    const extrudeSettings = {
      steps: 20,
      bevelEnabled: false,
      extrudePath: this.curve
    };
    const pts = [
      new Vector2(0, 0),
      new Vector2(0.1, 0),
      new Vector2(0.1, 0.1),
      new Vector2(0, 0.1)
    ];
    const shape = new Shape(pts);

    const mesh = new Mesh(new ExtrudeGeometry(shape, extrudeSettings), new MeshNormalMaterial());
    mesh.position.y = 0.1;

    this.mesh = mesh;
  }
}
