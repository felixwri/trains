import {
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene
} from 'three';
import { ModelLoader } from './modelLoader';
import { TrainLine } from './trainline';

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
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    sun.shadow.camera.left = -10;

    sun.shadow.camera.right = 10;
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
    const material = new MeshStandardMaterial({ color: 0xffffff, side: DoubleSide });
    const plane = new Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;

    plane.name = 'floor';
    this.scene.add(plane);
  }

  async build() {
    const modelLoader = new ModelLoader();
    const model = await modelLoader.loadModel('../assets/models/tree.gltf');
    if (model) {
      model.traverse((child) => {
        if (child instanceof Mesh) {
          child.castShadow = true; // Ensure the model casts shadows
        }
      });
      this.scene.add(model);

      for (let i = 0; i < 2; i++) {
        const model2 = model.clone();
        model2.position.x = -2 - i * 2;
        this.scene.add(model2);
      }
    }
  }

  layTrack() {
    this.TrainLine.createRoute();
  }
}
