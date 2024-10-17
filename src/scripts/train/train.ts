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
      carriage.relativeDistance = distance;
      distance += carriage.getWidth();
    }
    this.engine.setToTrack(track, distance);
    this.engine.relativeDistance = distance;
  }

  update(delta: number) {
    const speed = this.engine.calculateSpeed(delta);
    for (const carriage of this.carriages) {
      carriage.follow(speed, delta);
    }
    this.sync();
  }

  sync() {
    const theta = 0.5;
    const postion = this.engine.secondWheels.positionOnTrack();
    const distanceToCarriage = this.carriages[0].secondWheels.positionOnTrack();

    const firstTrack = this.engine.secondWheels.reportTrack();
    let tempTrack = this.carriages[0].secondWheels.reportTrack();
    let delta = 0;

    if (firstTrack !== tempTrack) {
      if (tempTrack === null) return;
      let dist = tempTrack?.curve.getLength() - this.carriages[0].secondWheels.positionOnTrack();

      tempTrack = tempTrack?.next;

      while (firstTrack !== tempTrack && firstTrack !== null && tempTrack !== null) {
        dist += tempTrack.curve.getLength();
        tempTrack = tempTrack.next;
      }

      delta = postion + dist;
    } else {
      delta = postion - distanceToCarriage;
    }

    if (
      this.engine.relativeDistance - delta > theta ||
      this.engine.relativeDistance - delta < -theta
    ) {
      console.log('DeSync');
      this.resync();
    }
  }

  resync() {
    const track = this.engine.secondWheels.reportTrack();
    this.setToTrack(track);
  }
}
