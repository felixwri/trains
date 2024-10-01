import {
  CubicBezierCurve3,
  ExtrudeGeometry,
  Mesh,
  MeshPhongMaterial,
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

    const tangentNormalOne = this.calculateFirstControlPoint(p, offset);
    const tangentNormalTwo = this.calculateSecondControlPoint(p, offset);

    if (!left) {
      startNormal.negate();
    } else {
      endNormal.negate();
      tangentNormalOne.negate();
      tangentNormalTwo.negate();
    }

    this.curve.v0 = p.v0.add(startNormal);
    this.curve.v1 = p.v1.add(tangentNormalOne);
    this.curve.v2 = p.v2.add(tangentNormalTwo);
    this.curve.v3 = p.v3.add(endNormal);
  }

  calculateFirstControlPoint(p: CubicBezierCurve3, offset: number) {
    const magnitude = p.v0.clone().distanceTo(p.v1);
    const distanceAlongCurve = magnitude / p.getLength();

    const distanceFromControlToLine = p.v1.distanceTo(p.getPoint(distanceAlongCurve));

    const tangent = p.getTangentAt(distanceAlongCurve);
    const tangentNormal = new Vector3().crossVectors(tangent, new Vector3(0, 1, 0));
    tangentNormal.multiplyScalar(offset + distanceFromControlToLine * 0.05);
    return tangentNormal;
  }

  calculateSecondControlPoint(p: CubicBezierCurve3, offset: number) {
    const magnitude = p.v3.clone().distanceTo(p.v2);
    const distanceAlongCurve = 1 - magnitude / p.getLength();

    const tangent = p.getTangentAt(distanceAlongCurve);
    const tangentNormal = new Vector3().crossVectors(tangent, new Vector3(0, 1, 0));
    tangentNormal.multiplyScalar(offset);
    return tangentNormal;
  }

  public generateMesh() {
    const extrudeSettings = {
      steps: 20,
      bevelEnabled: false,
      extrudePath: this.curve
    };
    const pts = [
      new Vector2(0, -0.02),
      new Vector2(0.07, -0.02),
      new Vector2(0.07, 0.02),
      new Vector2(0, 0.02)
    ];
    const shape = new Shape(pts);

    const greyMaterial = new MeshPhongMaterial({ color: 0x888888 });

    const mesh = new Mesh(new ExtrudeGeometry(shape, extrudeSettings), greyMaterial);
    mesh.position.y = 0.1;

    this.mesh = mesh;
  }
}
