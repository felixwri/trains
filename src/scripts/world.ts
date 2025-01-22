import {
  AmbientLight,
  DirectionalLight,
  Fog,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene,
  ShadowMaterial
} from 'three';
import { TrainLine } from './trainSetup';
import { preload } from './train/preload';
import { Colors } from '@/const';

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

    const color = Colors.background;

    this.scene.fog = new Fog(color, 30, 80);
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
    const station = preload.get('station');
    station.receiveShadow = true;
    station.castShadow = true;
    station.position.set(0, 0, 2.25);
    station.rotation.y = Math.PI;
    let material = station.material as MeshStandardMaterial;
    material.roughness = 1;
    material.side = 0;

    const bridge = preload.get('station_bridge');
    bridge.castShadow = true;
    bridge.position.set(0, 0, 2.25);
    bridge.rotation.y = Math.PI;
    material = bridge.material as MeshStandardMaterial;
    material.roughness = 1;

    const roof = preload.get('station_roof');
    roof.castShadow = true;
    roof.position.set(0, 0, 2.25);
    roof.rotation.y = Math.PI;
    material = roof.material as MeshStandardMaterial;
    material.roughness = 1;

    this.scene.add(station);
    this.scene.add(bridge);
    this.scene.add(roof);
  }

  layTrack() {
    this.trainline.create();
  }

  animate(delta: number) {
    this.trainline.animate(delta);
  }
}
