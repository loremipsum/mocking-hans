import 'reflect-metadata';
import {MetadataKey, SocketDefinition} from '../Model';
import {AdapterInterface, WebsocketAdapter} from '../Adapter';
import {Metadata, Type} from '../Utility';

export const Websocket = (event: string, namespace: string = '/'): MethodDecorator => {
  return (target: object, propertyKey: string): void => {
    const adapter = Metadata.get<Array<Type<AdapterInterface>>>(target.constructor, MetadataKey.Adapter, []);
    const sockets = Metadata.get<Array<SocketDefinition>>(target.constructor, MetadataKey.NativeSocketRoutes, []);

    if (!adapter.find(e => e === WebsocketAdapter)) {
      adapter.push(WebsocketAdapter);
    }

    sockets.push({
      event,
      namespace,
      methodName: propertyKey,
    });

    Metadata.set(target.constructor, MetadataKey.NativeSocketRoutes, sockets);
    Metadata.set(target.constructor, MetadataKey.Adapter, adapter);
  };
};
