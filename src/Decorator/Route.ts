import 'reflect-metadata';
import {HttpMethod, MetadataKey, RouteDefinition} from '../Model';
import {Metadata, Type} from '../Utility';
import {AdapterInterface, ExpressAdapter} from '../Adapter';

const addRoute = (path: string, requestMethod: HttpMethod, target: object, methodName: string) => {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  const adapter = Metadata.get<Array<Type<AdapterInterface>>>(target.constructor, MetadataKey.Adapter, []);
  const routes  = Metadata.get<Array<RouteDefinition>>(target.constructor, MetadataKey.Routes, []);

  if (!adapter.find(e => e === ExpressAdapter)) {
    adapter.push(ExpressAdapter);
  }

  routes.push({
    path,
    requestMethod,
    methodName,
  });

  Metadata.set(target.constructor, MetadataKey.Adapter, adapter);
  Metadata.set(target.constructor, MetadataKey.Routes, routes);
};

export const Get = (path: string):
  MethodDecorator => (target: any, propertyKey: string) => addRoute(path, HttpMethod.GET, target, propertyKey);

export const Post = (path: string):
  MethodDecorator => (target: any, propertyKey: string) => addRoute(path, HttpMethod.POST, target, propertyKey);

export const Delete = (path: string):
  MethodDecorator => (target: any, propertyKey: string) => addRoute(path, HttpMethod.DELETE, target, propertyKey);

export const Put = (path: string):
  MethodDecorator => (target: any, propertyKey: string) => addRoute(path, HttpMethod.PUT, target, propertyKey);
