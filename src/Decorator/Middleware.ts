import {NextFunction, Request, Response} from 'express';
import {MetadataKey} from '../Model';
import {Metadata} from '../Utility';

type MiddlewareCallback = (req: Request, res: Response, next: NextFunction) => void;

export const Middleware = (callback: Array<MiddlewareCallback>): MethodDecorator => {
  return (target: any, propertyKey: string): void => {
    const middleware = Metadata.get<Map<string, Array<MiddlewareCallback>>>(
      target.constructor,
      MetadataKey.Middleware,
      new Map<string, Array<MiddlewareCallback>>()
    );

    middleware.set(propertyKey, callback);

    Metadata.set(target.constructor, MetadataKey.Middleware, middleware);
  };
};
