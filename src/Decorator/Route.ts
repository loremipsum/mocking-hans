import 'reflect-metadata';
import {HttpMethod} from '../Model';
import {RouteDefinition} from '../Model';
import {Metadata} from '../Model';

const addRoute = (path: string, requestMethod: HttpMethod, target: object, methodName: string) => {
  if (!Reflect.getMetadata(Metadata.Routes, target.constructor)) {
    Reflect.defineMetadata(Metadata.Routes, [], target.constructor);
  }

  const routes = Reflect.getMetadata(Metadata.Routes, target.constructor) as Array<RouteDefinition>;

  routes.push({
    path,
    requestMethod,
    methodName,
  });

  Reflect.defineMetadata(Metadata.Routes, routes, target.constructor);
};

export const Get = (path: string):
  MethodDecorator => (target: any, propertyKey: string) => addRoute(path, HttpMethod.GET, target, propertyKey);

export const Post = (path: string):
  MethodDecorator => (target: any, propertyKey: string) => addRoute(path, HttpMethod.POST, target, propertyKey);

export const Delete = (path: string):
  MethodDecorator => (target: any, propertyKey: string) => addRoute(path, HttpMethod.DELETE, target, propertyKey);

export const Put = (path: string):
  MethodDecorator => (target: any, propertyKey: string) => addRoute(path, HttpMethod.PUT, target, propertyKey);
