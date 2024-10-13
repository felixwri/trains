import * as THREE from 'three';
import { CameraController } from './cameraController';
import { World } from './world';
import { preload } from './train/preload';

export class MainScene {
  private cube: THREE.Mesh | null;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: CameraController;
  private world: World;

  private then: number = 0;

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
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // this.initPostprocessing();

    this.load();
    return this.renderer;
  }

  async load() {
    await preload.load();

    this.world.setup();
    this.world.addFloor();
    this.world.build();
    this.world.layTrack();
  }

  animate(time: number) {
    requestAnimationFrame(this.animate.bind(this));

    const delta = (time - this.then) / 16.67; // Normalize delta time to 60fps
    this.then = time;
    this.world.animate(delta);

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
