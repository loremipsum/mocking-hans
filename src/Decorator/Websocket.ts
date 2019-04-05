import 'reflect-metadata';
import {Metadata, SocketDefinition} from '@loremipsum/mocking-hans/model';

export const Websocket = (event: string, namespace: string = '/'): MethodDecorator => {
  return (target: any, propertyKey: string): void => {
    if (!Reflect.getMetadata(Metadata.NativeSocketRoutes, target.constructor)) {
      Reflect.defineMetadata(Metadata.NativeSocketRoutes, [], target.constructor);
    }

    const sockets = Reflect.getMetadata(Metadata.NativeSocketRoutes, target.constructor) as Array<SocketDefinition>;

    sockets.push({
      event,
      namespace,
      methodName: propertyKey,
    });
  };
};
