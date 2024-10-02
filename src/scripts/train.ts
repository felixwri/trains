import { Mesh, Quaternion, Scene, Vector3 } from 'three';
import { preload } from './preload';
import type { Track } from './track';

export class Train {
  private firstWheels: WheelSet = new WheelSet();
  private secondWheels: WheelSet = new WheelSet();
  private carriage: Mesh;
  private wheelSeperation = 3.2;
  private speed = 0.0;
  private acceleration = 0.0001;
  private maxSpeed = 0.2;
  private driver: 'stopped' | 'driving' | 'braking' = 'driving';

  constructor() {
    this.carriage = preload.get('carriage');
  }

  setToTrack(track: Track) {
    this.firstWheels.setToTrack(track, 0);
    this.secondWheels.setToTrack(track, this.wheelSeperation);
    const firstWheelPosition = this.firstWheels.position;
    const secondWheelPosition = this.secondWheels.position;
    const tangent = new Vector3().subVectors(secondWheelPosition, firstWheelPosition).normalize();
    const forward = new Vector3(0, 0, 1);
    const quaternion = new Quaternion().setFromUnitVectors(forward, tangent);
    this.carriage.applyQuaternion(quaternion);
  }

  addToScene(scene: Scene) {
    scene.add(this.carriage);
    this.firstWheels.addToScene(scene);
    this.secondWheels.addToScene(scene);
  }

  move(delta: number) {
    const track = this.secondWheels.reportTrack();

    if (track === null) {
      this.driver = 'stopped';
      return;
    } else if (track.next === null) {
      this.driver = 'braking';
    }

    switch (this.driver) {
      case 'braking':
        if (this.speed > 0) {
          this.speed -= this.acceleration;
        } else {
          this.speed = 0;
        }
        break;

      case 'driving':
        if (this.speed < this.maxSpeed) {
          this.speed += this.acceleration;
        }
        break;

      default:
        this.speed = 0;
        break;
    }

    this.firstWheels.move(this.speed * delta);
    this.secondWheels.move(this.speed * delta);

    this.update();
  }

  update() {
    const firstWheelPosition = this.firstWheels.position;
    const secondWheelPosition = this.secondWheels.position;

    const direction = new Vector3().subVectors(secondWheelPosition, firstWheelPosition).normalize();
    const forward = new Vector3(0, 0, 1);
    const quaternion = new Quaternion().setFromUnitVectors(forward, direction);
    this.carriage.position.copy(firstWheelPosition);
    this.carriage.quaternion.copy(quaternion);
  }
}

class WheelSet {
  public distance: number = 0;
  public position: Vector3 = new Vector3();
  private mesh: Mesh;
  private track: Track | null = null;

  constructor() {
    this.mesh = preload.get('wheelset');
  }

  addToScene(scene: Scene) {
    scene.add(this.mesh);
  }

  setToTrack(track: Track, offset: number) {
    this.track = track;
    this.distance = offset;

    if (offset > this.track.curve.getLength() && this.track.next !== null) {
      const length = this.track.curve.getLength();
      this.track = this.track.next;
      this.distance = offset - length;
    }

    this.mesh.position.copy(this.track.getPositionOnCurve(offset));
    this.position = this.mesh.position;

    const tangent = this.track.getTangent(offset);
    const forward = new Vector3(0, 0, 1);
    const quaternion = new Quaternion().setFromUnitVectors(forward, tangent);

    this.mesh.quaternion.copy(quaternion);
  }

  move(speed: number) {
    this.distance += speed;

    if (this.track === null) {
      return;
    }

    const trackLength = this.track.curve.getLength();

    while (this.distance > trackLength) {
      this.distance -= trackLength;
      this.track = this.track.next;

      if (this.track === null) {
        return;
      }
    }

    this.update();
  }

  update() {
    if (this.track === null) return;
    this.mesh.position.copy(this.track.getPositionOnCurve(this.distance));
    this.position = this.mesh.position;

    const tangent = this.track.getTangent(this.distance);
    const forward = new Vector3(0, 0, 1);

    const quaternion = new Quaternion().setFromUnitVectors(forward, tangent);

    this.mesh.quaternion.copy(quaternion);
  }

  reportTrack() {
    return this.track;
  }
}
