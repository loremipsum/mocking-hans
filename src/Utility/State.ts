import {Container} from './Container';

export class State extends Container {
  public get(key: string, fallback?: any) {
    if (!this.has(key)) {
      return fallback;
    }

    return this.elements.get(key);
  }

  public set(key: string, value: any) {
    this.elements.set(key, value);
  }
}
