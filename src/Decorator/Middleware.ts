import 'reflect-metadata';
import {Request, Response, NextFunction} from 'express';
import {Metadata} from '@loremipsum/mocking-hans/model';

type MiddlewareCallback = (req: Request, res: Response, next: NextFunction) => void;

export const Middleware = (callback: Array<MiddlewareCallback>): MethodDecorator => {
  return (target: any, propertyKey: string): void => {
    if (!Reflect.getMetadata(Metadata.Middleware, target.constructor)) {
      Reflect.defineMetadata(Metadata.Middleware, new Map<string, Array<MiddlewareCallback>>(), target.constructor);
    }

    const middleware = Reflect.getMetadata(Metadata.Middleware, target.constructor) as
      Map<string, Array<MiddlewareCallback>>;

    middleware.set(propertyKey, callback);

    Reflect.defineMetadata(Metadata.Middleware, middleware, target.constructor);
  };
};
