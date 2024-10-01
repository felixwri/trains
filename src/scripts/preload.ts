import { Mesh } from 'three';
import { ModelLoader } from './modelLoader';

class Preload {
  private static instance: Preload;

  private container: { [key: string]: Mesh } = {};

  private constructor() {}

  public static getInstance(): Preload {
    if (!Preload.instance) {
      Preload.instance = new Preload();
    }
    return Preload.instance;
  }

  public get(key: string) {
    return this.container[key].clone();
  }

  public async load() {
    console.log('Preloading resources...');
    await this.loadModel('../assets/models/train.gltf', 'carriage');
    await this.loadModel('../assets/models/trolly.gltf', 'wheelset');
    await this.loadModel('../assets/models/tree.gltf', 'tree');
  }

  private async loadModel(url: string, key: string) {
    const modelLoader = new ModelLoader();
    const model = await modelLoader.loadModel(url);
    if (model) {
      model.traverse((child) => {
        if (child instanceof Mesh) {
          child.castShadow = true;
          this.container[key] = child;
        }
      });
    }
  }
}

const preload = Preload.getInstance();

export { preload };
