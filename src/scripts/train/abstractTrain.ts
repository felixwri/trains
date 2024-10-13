import { Box3, Mesh, Quaternion, Scene, Vector3 } from 'three';
import { preload } from './preload';
import type { Track } from './track';
import { WheelSet } from './wheelset';

export abstract class AbstractTrain {
  public firstWheels: WheelSet = new WheelSet();
  public secondWheels: WheelSet = new WheelSet();
  public carriage: Mesh;

  public bounds: Box3 = new Box3();

  public previousTrack: Track | null = null;

  public wheelSeperation = 3.2;
  public speed = 0.0;

  constructor() {
    this.carriage = preload.get('carriage');
    this.bounds.setFromObject(this.carriage);
  }

  abstract addToScene(scene: Scene): void;

  setModel(model: Mesh) {
    this.carriage = model;
  }

  getWidth() {
    return this.bounds.getSize(new Vector3()).x;
  }

  getHeight() {
    return this.bounds.getSize(new Vector3()).y;
  }

  setToTrack(track: Track, offset: number = 0) {
    this.firstWheels.setToTrack(track, 0 + offset);
    this.secondWheels.setToTrack(track, this.wheelSeperation + offset);
    const firstWheelPosition = this.firstWheels.position;
    const secondWheelPosition = this.secondWheels.position;
    const tangent = new Vector3().subVectors(secondWheelPosition, firstWheelPosition).normalize();
    const forward = new Vector3(0, 0, 1);
    const quaternion = new Quaternion().setFromUnitVectors(forward, tangent);
    this.carriage.applyQuaternion(quaternion);
  }

  reportSpeed() {
    return this.speed;
  }

  update(distance: number) {
    this.firstWheels.move(distance);
    this.secondWheels.move(distance);

    const firstWheelPosition = this.firstWheels.position;
    const secondWheelPosition = this.secondWheels.position;

    const direction = new Vector3().subVectors(secondWheelPosition, firstWheelPosition).normalize();
    const forward = new Vector3(0, 0, 1);
    const quaternion = new Quaternion().setFromUnitVectors(forward, direction);
    this.carriage.position.copy(firstWheelPosition);
    this.carriage.quaternion.copy(quaternion);
  }
}
