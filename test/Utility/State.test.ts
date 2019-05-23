import {State} from '../../src/Utility';

describe('Container', () => {
  test('get without fallback', () => {
    const state = new State();
    expect(state.get('foo')).toBeUndefined();
    state.set('foo', 42);
    expect(state.get('foo')).toEqual(42);
  });

  test('get with fallback', () => {
    const state = new State();
    expect(state.get('foo', 'bar')).toEqual('bar');
  });
});
