import * as THREE from 'three';
import { CameraController } from './cameraController';
import { World } from './world';

export class MainScene {
  private cube: THREE.Mesh | null;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: CameraController;
  private world: World;

  private then: number = 0;

  private cos: number = 0;

  constructor() {
    this.cube = null;
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.scene = new THREE.Scene();
    this.camera = new CameraController(this.scene, this.renderer.domElement);
    this.world = new World(this.scene);
  }

  init() {
    window.addEventListener('resize', this.debounce(this.resize.bind(this), 100));

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.world.setup();
    this.world.addFloor();
    // this.world.build();
    this.world.layTrack();
    return this.renderer;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // const delta = time - this.then;
    // this.then = time;
    // console.log(delta);

    this.renderer.render(this.scene, this.camera.getCamera());
  }

  resize() {
    console.log('resize');
    this.camera.updateAspect();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };
}
