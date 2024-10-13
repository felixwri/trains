import type { Scene } from 'three';
import { AbstractTrain } from './abstractTrain';
import type { Track } from './track';

enum TrainState {
  stopped = 'stopped',
  accelerating = 'accelerating',
  braking = 'braking',
  waiting_for_signal = 'waiting_for_signal',
  waiting_for_train = 'waiting_for_train'
}

class TrainDriver {
  current: TrainState = TrainState.accelerating;

  get() {
    return this.current;
  }

  set(state: TrainState) {
    this.current = state;
  }
}

export class TrainEngine extends AbstractTrain {
  private acceleration = 0.0001;
  private maxSpeed = 0.15;
  private driver = new TrainDriver();

  private waiting = false;
  private waitingTime = 0;
  private brakeStartSpeed = 0;

  constructor() {
    super();
  }

  private breakingCalc() {
    const tl = this.secondWheels.trackLength();
    const pos = this.secondWheels.positionOnTrack();

    let res = 1 - pos / tl;

    res = res * this.maxSpeed;

    return res;
  }

  private trackChange(track: Track) {
    this.previousTrack = track;
    const stop = track?.stop;

    if (stop !== undefined && stop > 0 && this.waiting === false) {
      this.driver.set(TrainState.braking);
      this.waiting = true;
      this.brakeStartSpeed = this.speed;
      this.waitingTime = stop;
    }

    if (track?.next?.containsTrain) {
      this.driver.set(TrainState.braking);
      this.brakeStartSpeed = this.speed;
    }
  }

  calculateSpeed(delta: number) {
    const track = this.secondWheels.reportTrack();

    if (track === null) {
      this.driver.set(TrainState.stopped);
      return 0;
    }

    if (track !== this.previousTrack) {
      this.trackChange(track);
    }

    if (track.next === null && this.driver.get() === TrainState.accelerating) {
      this.driver.set(TrainState.braking);
      this.waiting = true;
      this.brakeStartSpeed = this.speed;
    }

    if (
      !track.next?.containsTrain &&
      (this.driver.get() === TrainState.braking || this.driver.get() === TrainState.stopped) &&
      this.waiting === false
    ) {
      this.driver.set(TrainState.accelerating);
    }

    switch (this.driver.get()) {
      case TrainState.braking:
        if (this.speed > 0.001) {
          const maxBreakSpeed = this.breakingCalc();
          if (this.speed < maxBreakSpeed) {
            this.speed += this.acceleration;
          } else {
            this.speed = maxBreakSpeed;
          }
        } else {
          this.speed = 0;
          this.driver.set(TrainState.stopped);
          if (this.waitingTime > 0) {
            setTimeout(() => {
              this.driver.set(TrainState.accelerating);
              this.waiting = false;
              this.waitingTime = 0;
            }, this.waitingTime * 1000);
          }
        }
        break;

      case TrainState.accelerating:
        if (this.speed < this.maxSpeed) {
          this.speed += this.acceleration;
        }
        break;

      default:
        this.speed = 0;
        break;
    }

    this.update(this.speed * delta);

    return this.speed;
  }

  addToScene(scene: Scene): void {
    scene.add(this.carriage);
    this.firstWheels.addToScene(scene);
    this.secondWheels.addToScene(scene);
  }
}
