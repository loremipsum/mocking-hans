import {App, MetadataKey} from "../../src";

describe("@App class decorator", () => {
  test('set metadata', () => {
    @App({
      name: "testing-hans",
      port: 42,
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
  });
});
