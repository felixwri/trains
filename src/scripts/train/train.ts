import type { Scene } from 'three';
import type { TrainCarriage } from './carriage';
import type { TrainEngine } from './engine';
import type { Track } from './track';

export class Train {
  private engine: TrainEngine;
  private carriages: TrainCarriage[];

  constructor(engine: TrainEngine, carriages: TrainCarriage[]) {
    this.engine = engine;
    this.carriages = carriages;

    this.engine.secondWheels.listener = this.enterTrack.bind(this);
    this.carriages[0].firstWheels.listener = this.exitTrack.bind(this);
  }

  private enterTrack(track: Track) {
    if (track.next === null) return;
    track.next.containsTrain = true;
  }

  private exitTrack(track: Track) {
    track.containsTrain = false;
  }

  addToScene(scene: Scene) {
    this.engine.addToScene(scene);
    for (const carriage of this.carriages) {
      carriage.addToScene(scene);
    }
  }

  setToTrack(track: any, offset: number = 0) {
    let distance = offset;
    for (const carriage of this.carriages) {
      carriage.setToTrack(track, distance);
      distance += carriage.getWidth();
    }
    this.engine.setToTrack(track, distance);
  }

  update(delta: number) {
    const speed = this.engine.calculateSpeed(delta);
    for (const carriage of this.carriages) {
      carriage.follow(speed, delta);
    }
  }
}
