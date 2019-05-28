import {Helper} from '../../src/Utility';

describe('Helper', () => {
  test('getRandomElementByProbability', () => {
    const elem = Helper.getRandomElementByProbability([{
      element: 'foo',
      probability: 0
    }, {
      element: 'bar',
      probability: 1
    }]);

    expect(elem).toEqual({element: 'bar', probability: 1})
  });

  test('hasProbability', () => {
    expect(Helper.hasProbability(0)).toBeFalsy();
    expect(Helper.hasProbability(1)).toBeTruthy();
  });
});
