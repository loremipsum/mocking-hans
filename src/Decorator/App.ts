import 'reflect-metadata';
import {Metadata} from '@loremipsum/mocking-hans/model';

export const App = (options: {
  name: string,
  port: number
}): ClassDecorator => {
  return (target: any): void => {
    Reflect.defineMetadata(Metadata.Name, options.name, target);
    Reflect.defineMetadata(Metadata.Port, options.port, target);

    // In case an app doesn't make use of these metadata keys set the default values for them
    [
      Metadata.NativeSocketRoutes,
      Metadata.SocketIORoutes,
      Metadata.Routes
    ].forEach(metadata => {
      if (! Reflect.hasMetadata(metadata, target)) {
        Reflect.defineMetadata(metadata, [], target);
      }
    });
  };
};
