import {Container} from './Container';

export class State extends Container {
  public get(key: string, fallback: any = null) {
    if (! this.has(key) && fallback) {
      return fallback;
    }

    return this.elements.get(key);
  }

  public set(key: string, value: any) {
    this.elements.set(key, value);
  }
}
