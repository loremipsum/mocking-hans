import 'reflect-metadata';
import {Metadata} from '../Model';
import {SocketDefinition} from '../Model';

export const Websocket = (event: string, namespace: string = '/'): MethodDecorator => {
  return (target: any, propertyKey: string): void => {
    if (!Reflect.getMetadata(Metadata.NativeSocketRoutes, target.constructor)) {
      Reflect.defineMetadata(Metadata.NativeSocketRoutes, [], target.constructor);
    }

    const sockets = Reflect.getMetadata(Metadata.NativeSocketRoutes, target.constructor) as Array<SocketDefinition>;

    sockets.push({
      event,
      namespace,
      methodName: propertyKey
    });
  };
};
