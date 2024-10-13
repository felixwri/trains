import type { Scene } from 'three';
import { AbstractTrain } from './abstractTrain';

export class TrainCarriage extends AbstractTrain {
  constructor() {
    super();
  }

  addToScene(scene: Scene): void {
    scene.add(this.carriage);
    this.firstWheels.addToScene(scene);
    this.secondWheels.addToScene(scene);
  }

  follow(speed: number, delta: number): void {
    this.speed = speed * delta;

    this.update(this.speed);
  }
}
