import {MetadataKey, Middleware} from "../../src";

describe("@Middleware method decorator", () => {
  test('set metadata', () => {
    const routeFooMiddleware = () => {
    };
    const routeBarMiddleware = () => {
    };

    class Test {
      @Middleware([routeFooMiddleware])
      foo() {
      }

      @Middleware([routeBarMiddleware])
      bar() {
      }

      @Middleware([routeFooMiddleware, routeBarMiddleware])
      baz() {
      }
    }

    expect(Reflect.getMetadata(MetadataKey.Middleware, Test)).toEqual(new Map([
      ["foo", [routeFooMiddleware]],
      ["bar", [routeBarMiddleware]],
      ["baz", [routeFooMiddleware, routeBarMiddleware]]
    ]));
  });
});
