import 'reflect-metadata';

export const App = (options: {
  name: string,
  port: number,
  sockets?: {
    enabled: boolean,
    callback?: () => void,
  },
}): ClassDecorator => {
  return (target: any): void => {
    Reflect.defineMetadata('name', options.name, target);
    Reflect.defineMetadata('port', options.port, target);
    Reflect.defineMetadata('sockets', options.sockets, target);
  };
};
