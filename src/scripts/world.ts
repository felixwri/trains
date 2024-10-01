import {
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene
} from 'three';
import { TrainLine } from './trainline';
import { preload } from './preload';

export class World {
  private scene: Scene;
  private TrainLine: TrainLine;

  constructor(scene: Scene) {
    this.scene = scene;
    this.TrainLine = new TrainLine(scene);
  }

  setup() {
    const sun = new DirectionalLight(0xffffff, 5);
    sun.position.set(5, 5, 5);
    sun.castShadow = true;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;

    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 1000;

    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;

    this.scene.add(sun);

    const ambient = new AmbientLight(0xc2f1ff, 0.2);

    this.scene.add(ambient);
  }

  addFloor() {
    const geometry = new PlaneGeometry(50, 50);
    const material = new MeshStandardMaterial({ color: 0xd8d8d8, side: DoubleSide });
    const plane = new Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;

    plane.name = 'floor';
    this.scene.add(plane);
  }

  async build() {
    for (let i = 0; i < 5; i++) {
      const tree = preload.get('tree');
      tree.position.x = -2 - i * 2;
      tree.position.z -= 1;
      this.scene.add(tree);
    }
  }

  layTrack() {
    this.TrainLine.createRoute();
    this.TrainLine.createRouteTwo();
  }

  animate(delta: number) {
    this.TrainLine.animate(delta);
  }
}
