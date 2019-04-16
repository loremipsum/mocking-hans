import 'reflect-metadata';
import {MetadataKey} from '../Model';
import {NextFunction, Request, Response} from 'express';
import {Metadata} from '../Utility';
import {Container} from '../Utility/Container';
import * as path from 'path';

export const App = (options: {
  name: string,
  port: number,
  middleware?: Array<(req: Request, res: Response, next: NextFunction) => void>,
  publicDirectory?: string,
  configure?: (container: Container) => void,
}): ClassDecorator => {
  return (target: any): void => {
    if (!options.configure) {
      options.configure = () => void 0;
    }

    Metadata.set(target, MetadataKey.Configuration, options.configure);
    Metadata.set(target, MetadataKey.Name, options.name);
    Metadata.set(target, MetadataKey.Port, options.port);

    if (!Array.isArray(options.middleware)) {
      options.middleware = [];
    }

    Metadata.set(target, MetadataKey.AppMiddleware, options.middleware);

    if (!options.publicDirectory) {
      options.publicDirectory = path.join(__dirname, '../../public/');
    }

    Metadata.set(target, MetadataKey.PublicDirectory, options.publicDirectory);

    // In case an app doesn't make use of these metadata keys set the default values for them
    [
      MetadataKey.NativeSocketRoutes,
      MetadataKey.SocketIORoutes,
      MetadataKey.Routes,
    ].forEach(metadata => {
      if (! Metadata.has(target, metadata)) {
        Metadata.set(target, metadata, []);
      }
    });
  };
};
