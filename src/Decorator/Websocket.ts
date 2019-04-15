import 'reflect-metadata';
import {MetadataKey, SocketDefinition} from '../Model';

export const Websocket = (event: string, namespace: string = '/'): MethodDecorator => {
  return (target: any, propertyKey: string): void => {
    if (!Reflect.getMetadata(MetadataKey.NativeSocketRoutes, target.constructor)) {
      Reflect.defineMetadata(MetadataKey.NativeSocketRoutes, [], target.constructor);
    }

    const sockets = Reflect.getMetadata(MetadataKey.NativeSocketRoutes, target.constructor) as Array<SocketDefinition>;

    sockets.push({
      event,
      namespace,
      methodName: propertyKey,
    });
  };
};
