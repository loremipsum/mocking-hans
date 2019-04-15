import 'reflect-metadata';
import {MetadataKey, SocketDefinition} from '../Model';
import {Metadata, Type} from '../Utility';
import {AdapterInterface, SocketIOAdapter} from '../Adapter';

export const Socket = (event: string, namespace: string = '/'): MethodDecorator => {
  return (target: any, propertyKey: string): void => {
    const adapter = Metadata.get<Array<Type<AdapterInterface>>>(target.constructor, MetadataKey.Adapter, []);
    const sockets = Metadata.get<Array<SocketDefinition>>(target.constructor, MetadataKey.SocketIORoutes, []);

    if (!adapter.find(e => e === SocketIOAdapter)) {
      adapter.push(SocketIOAdapter);
    }

    sockets.push({
      event,
      namespace,
      methodName: propertyKey,
    });

    Metadata.set(target.constructor, MetadataKey.Adapter, adapter);
    Metadata.set(target.constructor, MetadataKey.SocketIORoutes, sockets);
  };
};
