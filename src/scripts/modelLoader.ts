import type { Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelLoader {
  private loader: GLTFLoader;

  constructor() {
    this.loader = new GLTFLoader();
  }

  async loadModel(path: string): Promise<Group | null> {
    const modelUrl = new URL(path, import.meta.url).href;
    return new Promise((resolve, reject) => {
      this.loader.load(
        modelUrl,
        function (gltf) {
          console.log(gltf.scene.position);
          resolve(gltf.scene);
        },
        undefined,
        function (error) {
          console.error(error);
          reject(error);
        }
      );
    });
  }
}
