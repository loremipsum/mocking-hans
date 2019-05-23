import {Container} from '../../src/Utility';

describe("Container", () => {
  test('set', () => {
    const container = new Container();
    expect(container.get('foo')).toBeUndefined();
    container.set('foo', {foo: 'bar'});
    expect(container.get('foo')).toEqual({foo: 'bar'});
  });

  test('has', () => {
    const container = new Container();
    expect(container.has('foo')).toBeFalsy();
    container.set('foo', {foo: 'bar'});
    expect(container.has('foo')).toBeTruthy();
  });
});
