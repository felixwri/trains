import { PerspectiveCamera, Raycaster, Scene, Vector2, Vector3 } from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';

export class CameraController {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private controls: MapControls;

  private raycaster: Raycaster = new Raycaster();
  private pointer = new Vector2();

  private point: Vector3 = new Vector3();

  constructor(scene: Scene, domElement: HTMLCanvasElement) {
    this.scene = scene;
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.controls = new MapControls(this.camera, domElement);
    this.setup();
  }

  setup() {
    // window.addEventListener('pointerdown', this.onPointerDown.bind(this));

    this.camera.position.z = 10;
    this.camera.position.x = 0;
    this.camera.position.y = 10;

    this.controls.maxPolarAngle = Math.PI / 3;
    this.controls.target = new Vector3(-5, 0, 0);
    this.controls.update();
  }

  update() {
    // console.log(this.controls.update());
  }

  updateAspect() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  getCamera() {
    return this.camera;
  }

  setPointer(event: MouseEvent) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onPointerDown(event: MouseEvent) {
    this.setPointer(event);
    console.log('click');
  }

  render(scene: Scene) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(scene.children, false);
    if (intersects.length > 0) {
      this.point = intersects[0].point;
    }
  }
}
