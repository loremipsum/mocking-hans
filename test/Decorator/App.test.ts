import {App, MetadataKey} from "../../src";

describe("@App class decorator", () => {
  test('set metadata', () => {
    const configure = jest.fn();

    @App({
      name: "testing-hans",
      port: 42,
      configure,
      publicDirectory: '/pubar/'
    })
    class Test {
    }

    expect(Reflect.getMetadata(MetadataKey.Name, Test)).toBe("testing-hans");
    expect(Reflect.getMetadata(MetadataKey.Port, Test)).toBe(42);
    expect(Reflect.getMetadata(MetadataKey.AppMiddleware, Test)).toEqual([]);
    expect(Reflect.getMetadata(MetadataKey.Middleware, Test)).toBe(undefined);
    expect(Reflect.getMetadata(MetadataKey.Routes, Test)).toEqual([]);
    expect(Reflect.getMetadata(MetadataKey.SocketIORoutes, Test)).toEqual([]);
    expect(Reflect.getMetadata(MetadataKey.NativeSocketRoutes, Test)).toEqual([]);
    expect(Reflect.getMetadata(MetadataKey.GraphqlRoutes, Test)).toEqual([]);
    expect(Reflect.getMetadata(MetadataKey.Configuration, Test)).toBe(configure);
    expect(Reflect.getMetadata(MetadataKey.PublicDirectory, Test)).toBe('/pubar/');
  });

  test('set middleware metadata', () => {
    const appMiddleware = () => {
    };

    @App({
      name: "testing-hans",
      port: 42,
      middleware: [appMiddleware],
    })
    class Test {
    }

    expect(Reflect.getMetadata(MetadataKey.AppMiddleware, Test)).toEqual([appMiddleware]);
    (Reflect.getMetadata(MetadataKey.Configuration, Test) as any)();
  });
});
