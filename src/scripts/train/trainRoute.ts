import { Scene, Vector3 } from 'three';
import { Track } from './track';

export class TrainRouteManager {
  private routes: { [key: string]: TrainRoute } = {};
  private connectable: { [key: string]: Track } = {};
  private tempJunctions: { [key: string]: Track } = {};

  constructor(private scene: Scene) {
    this.scene = scene;
    this.routes = {};
  }

  createRoute() {
    const route = new TrainRoute(this.scene, this);

    const name = `route_${Object.keys(this.routes).length}`;
    this.routes[name] = route;
    return route;
  }

  finish() {
    Object.keys(this.tempJunctions).forEach((key) => {
      console.log(key + ' has been connected');
      const connection = this.tempJunctions[key];
      const actual = this.getJunction(key);

      connection.connectTo(actual);
      connection.generateMesh(this.scene);
      connection.addToScene(this.scene);
    });
  }

  setJunction(key: string, track: Track) {
    if (this.routes[key]) {
      throw new Error(`Route with key: ${key} already registered`);
    }

    this.connectable[key] = track;
  }

  getJunction(key: string) {
    if (!this.connectable[key]) {
      throw new Error(`Track with key: ${key} does not exist`);
    }

    return this.connectable[key];
  }

  hasJunction(key: string) {
    return this.connectable[key] !== undefined;
  }

  temporaryJunction(key: string, connection: Track) {
    this.tempJunctions[key] = connection;
  }
}

class TrainRoute {
  private manager: TrainRouteManager;
  private track: Track[] = [];
  private root: Track | null = null;
  private scene: Scene;

  constructor(scene: Scene, manager: TrainRouteManager) {
    this.scene = scene;
    this.manager = manager;
  }

  private addTrackToScene(track: Track) {
    track.generateMesh(this.scene);
    track.addToScene(this.scene);
  }

  getRoot() {
    if (this.root === null) {
      throw new Error('Root track not set');
    }
    return this.root;
  }

  getTrack() {
    return this.track[this.track.length - 1];
  }

  setRoot(start: Vector3, control1: Vector3, control2: Vector3, end: Vector3) {
    this.root = new Track();
    this.root.setPoints(start, control1, control2, end);
    this.track.push(this.root);

    this.addTrackToScene(this.root);

    return this;
  }

  moveTo(x: number, y: number, z: number, id: string | null = null) {
    const checkpoint = new Vector3(x, y, z);
    if (this.root === null) {
      throw new Error('Root track not set');
    }

    const track = new Track();
    track.after(this.track[this.track.length - 1]);
    track.moveTo(checkpoint);
    this.track.push(track);

    if (id !== null) {
      this.manager.setJunction(id, track);
    }

    this.addTrackToScene(track);

    return this;
  }

  setJunction(id: string) {
    this.manager.setJunction(id, this.track[this.track.length - 1]);
    return this;
  }

  arcTo(x: number, y: number, z: number) {
    const checkpoint = new Vector3(x, y, z);

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

  connectToJunction(id: string) {
    if (!this.manager.hasJunction(id)) {
      // throw new Error(`Track with ID: ${id} does not exist`);
      console.warn(`Track with ID: ${id} does not exist`);
    }

    const track = new Track();

    track.after(this.track[this.track.length - 1]);

    if (!this.manager.hasJunction(id)) {
      console.warn(`Track with ID: ${id} does not exist`);
      const tempTrack = new Track();
      track.connectTo(tempTrack);
      this.manager.temporaryJunction(id, track);
    } else {
      const targetTrack = this.manager.getJunction(id);
      track.connectTo(targetTrack);

      this.track.push(track);
      this.addTrackToScene(track);
    }

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

  wait(time: number) {
    const track = this.track[this.track.length - 1];
    track.stop = time;

    return this;
  }
}
