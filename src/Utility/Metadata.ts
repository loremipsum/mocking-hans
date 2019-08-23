import 'reflect-metadata';
import {MetadataKey} from '../Model';

export class Metadata {
  public static get<T>(target: object, key: MetadataKey, fallback: T = null): T {
    if (Reflect.hasMetadata(key, target)) {
      return Reflect.getMetadata(key, target);
    }

    return fallback;
  }

  public static set(target: object, key: MetadataKey, value: any) {
    Reflect.defineMetadata(key, value, target);
  }

  public static has(target: object, key: MetadataKey) {
    return Reflect.hasMetadata(key, target);
  }
}
