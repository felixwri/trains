import { Mesh } from 'three';
import { ModelLoader } from './modelLoader';

class Preload {
  private static instance: Preload;
  public onLoaded: (() => void) | null = null;

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
    await this.loadModel('../../assets/models/train/train.gltf', 'carriage');
    await this.loadModel('../../assets/models/train/trolly.gltf', 'wheelset');
    await this.loadModel('../../assets/models/scene/station.gltf', 'station');
    await this.loadModel('../../assets/models/scene/station_bridge.gltf', 'station_bridge');
    await this.loadModel('../../assets/models/scene/station_roof.gltf', 'station_roof');
    console.log('Preloading complete');
    if (this.onLoaded) {
      this.onLoaded();
    }
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
