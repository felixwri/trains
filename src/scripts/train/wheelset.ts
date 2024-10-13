import { Mesh, Quaternion, Scene, Vector3 } from 'three';
import { preload } from './preload';
import type { Track } from './track';

export class WheelSet {
  public distance: number = 0;
  public listener: ((track: Track) => void) | null = null;
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

    this.track.containsTrain = true;

    this.mesh.position.copy(this.track.getPositionOnCurve(offset));
    this.position = this.mesh.position;

    const tangent = this.track.getTangent(offset);
    const forward = new Vector3(0, 0, 1);
    const quaternion = new Quaternion().setFromUnitVectors(forward, tangent);

    this.mesh.quaternion.copy(quaternion);
  }

  trackSwitchListener() {
    if (this.listener !== null && this.track !== null) {
      this.listener(this.track);
    }
  }

  move(speed: number) {
    this.distance += speed;

    if (this.track === null) {
      return;
    }

    const trackLength = this.track.curve.getLength();

    while (this.distance > trackLength) {
      this.distance -= trackLength;

      this.trackSwitchListener();

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

  trackLength() {
    if (this.track === null) return 0;
    return this.track.curve.getLength();
  }

  positionOnTrack() {
    return this.distance;
  }

  remainingDistance() {
    if (this.track === null) return 0;
    return this.track.curve.getLength() - this.distance;
  }

  remainingPercentage() {
    if (this.track === null) return 0;
    return 1 - this.distance / this.track.curve.getLength();
  }

  reportTrack() {
    return this.track;
  }
}
