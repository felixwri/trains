import type { Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelLoader {
  private loader: GLTFLoader;

  constructor() {
    this.loader = new GLTFLoader();
  }

  async loadModel(path: string): Promise<Group | null> {
    path = import.meta.env.BASE_URL + path;
    console.log(path);
    const modelUrl = new URL(path, import.meta.url).href;
    console.log(modelUrl);
    console.log(import.meta.url);
    console.log(import.meta.env.BASE_URL);
    return new Promise((resolve, reject) => {
      this.loader.load(
        modelUrl,
        function (gltf) {
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
