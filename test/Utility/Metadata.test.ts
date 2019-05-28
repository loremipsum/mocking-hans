import {Metadata} from '../../src/Utility';
import {MetadataKey} from '../../src/Model';

describe("Metadata", () => {
  class Foo {}
  Reflect.defineMetadata(MetadataKey.Name, 'bar', Foo);

  test("get without fallback", () => {
    expect(Metadata.get<string>(Foo, MetadataKey.Name)).toEqual('bar');
    expect(Metadata.get<string>(Foo, MetadataKey.PublicDirectory)).toBeNull();
  });

  test("get with fallback", () => {
    expect(Metadata.get<string>(Foo, MetadataKey.PublicDirectory, 'test')).toEqual('test');
  });

  test('set', () => {
    expect(Metadata.get<number>(Foo, MetadataKey.Port)).toBeNull();
    Metadata.set(Foo, MetadataKey.Port, 42);
    expect(Metadata.get<number>(Foo, MetadataKey.Port)).toEqual(42);
  });

  test('has', () => {
    expect(Metadata.has(Foo, MetadataKey.PublicDirectory)).toBeFalsy();
    Metadata.set(Foo, MetadataKey.PublicDirectory, 'foo');
    expect(Metadata.has(Foo, MetadataKey.PublicDirectory)).toBeTruthy();
  });
});
