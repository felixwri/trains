import { Scene, Vector3 } from 'three';
import { Track } from './track';

export class TrainDirective {
  private track: Track[] = [];
  private root: Track | null = null;
  private identified: { [key: number]: Track } = {};
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  private addTrackToScene(track: Track) {
    track.generateMesh();
    track.addToScene(this.scene);
  }

  getRoot() {
    if (this.root === null) {
      throw new Error('Root track not set');
    }
    return this.root;
  }

  setRoot(start: Vector3, control1: Vector3, control2: Vector3, end: Vector3) {
    this.root = new Track();
    this.root.setPoints(start, control1, control2, end);
    this.track.push(this.root);

    this.addTrackToScene(this.root);

    return this;
  }

  moveTo(checkpoint: Vector3, id: number | null = null) {
    if (this.root === null) {
      throw new Error('Root track not set');
    }

    if (id !== null) {
      this.identified[id] = this.root;
    }

    const track = new Track();
    track.after(this.track[this.track.length - 1]);
    track.moveTo(checkpoint);
    this.track.push(track);

    this.addTrackToScene(track);

    return this;
  }

  arcTo(checkpoint: Vector3) {
    if (this.root === null) {
      throw new Error('Root track not set');
    }

    const track = new Track();
    track.after(this.track[this.track.length - 1]);
    track.arcTo(checkpoint);
    this.track.push(track);

    this.addTrackToScene(track);

    return this;
  }

  connectTo(id: number) {
    if (!this.identified[id]) {
      throw new Error(`Track with ID: ${id} does not exist`);
    }

    const track = new Track();

    track.after(this.track[this.track.length - 1]);

    const targetTrack = this.identified[id];
    track.connectTo(targetTrack);

    this.track.push(track);

    this.addTrackToScene(track);

    return this;
  }

  connectToRoot() {
    if (this.root === null) {
      throw new Error('Root track not set');
    }

    const track = new Track();
    track.after(this.track[this.track.length - 1]);
    track.connectTo(this.root);

    this.track.push(track);

    this.addTrackToScene(track);

    return this;
  }
}
