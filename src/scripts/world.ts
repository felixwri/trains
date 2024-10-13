import {
  AmbientLight,
  DirectionalLight,
  Fog,
  Mesh,
  PlaneGeometry,
  Scene,
  ShadowMaterial
} from 'three';
import { TrainLine } from './trainSetup';
import { preload } from './train/preload';

export class World {
  private scene: Scene;
  private trainline: TrainLine;

  constructor(scene: Scene) {
    this.scene = scene;
    this.trainline = new TrainLine(scene);
  }

  setup() {
    const sun = new DirectionalLight(0xffffff, 6);
    sun.position.set(-10, 10, -10);

    sun.castShadow = true;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -10;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;

    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 1000;

    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;

    // const sunHelper = new CameraHelper(sun.shadow.camera);

    sun.target.position.set(4, -5, 0);

    this.scene.add(sun);
    this.scene.add(sun.target);
    // this.scene.add(sunHelper);

    const ambient = new AmbientLight(0xc2f1ff, 1);

    this.scene.add(ambient);
    this.scene.fog = new Fog(0xd8d8d8, 20, 60);
  }

  addFloor() {
    const floorGeometry = new PlaneGeometry(100, 100);
    const floorMaterial = new ShadowMaterial({ opacity: 0.5 });
    const floor = new Mesh(floorGeometry, floorMaterial);

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;

    this.scene.add(floor);
  }

  async build() {
    // const mainScene = preload.get('scene');
    // mainScene.castShadow = false;
    // this.scene.add(mainScene);
    // const station_cover = preload.get('station_cover');
    // station_cover.castShadow = true;
    // this.scene.add(station_cover);

    const station_plt_1 = preload.get('station');
    station_plt_1.castShadow = true;
    station_plt_1.position.set(-3, 0, 2.2);

    const station_plt_2 = preload.get('station');
    station_plt_2.castShadow = true;
    station_plt_2.position.set(-3, 0, -1);
    station_plt_2.rotation.y = Math.PI;

    const station_plt_3 = preload.get('station');
    station_plt_3.castShadow = true;
    station_plt_3.position.set(-3, 0, -4.3);
    station_plt_3.rotation.y = Math.PI;

    this.scene.add(station_plt_1);
    this.scene.add(station_plt_2);
    this.scene.add(station_plt_3);
  }

  layTrack() {
    this.trainline.create();
  }

  animate(delta: number) {
    this.trainline.animate(delta);
  }
}
