import 'reflect-metadata';
import {Metadata} from '@loremipsum/mocking-hans/model';
import {Request, Response, NextFunction} from 'express';

export const App = (options: {
  name: string,
  port: number,
  middleware?: Array<(req: Request, res: Response, next: NextFunction) => void>,
}): ClassDecorator => {
  return (target: any): void => {
    Reflect.defineMetadata(Metadata.Name, options.name, target);
    Reflect.defineMetadata(Metadata.Port, options.port, target);

    if (Array.isArray(options.middleware)) {
      Reflect.defineMetadata(Metadata.AppMiddleware, options.middleware, target);
    }

    // In case an app doesn't make use of these metadata keys set the default values for them
    [
      Metadata.NativeSocketRoutes,
      Metadata.SocketIORoutes,
      Metadata.Routes,
    ].forEach(metadata => {
      if (! Reflect.hasMetadata(metadata, target)) {
        Reflect.defineMetadata(metadata, [], target);
      }
    });
  };
};
