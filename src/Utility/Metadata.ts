import 'reflect-metadata';
import {MetadataKey} from '../Model';

export class Metadata {
  public static get<T>(target: any, key: MetadataKey, fallback: any = null): T {
    if(Reflect.hasMetadata(key, target)) {
      return Reflect.getMetadata(key, target);
    }

    return fallback;
  }

  public static set(target: any, key: MetadataKey, value: any) {
    Reflect.defineMetadata(key, value, target);
  }

  public static has(target: any, key: MetadataKey) {
    return Reflect.hasMetadata(key, target);
  }
}
