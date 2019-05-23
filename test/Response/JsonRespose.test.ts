import {JsonResponse} from '../../src/Response';

describe("JsonResponse", () => {
  test("getters", () => {
    const response = new JsonResponse({foo: 'bar'}, 400);

    expect(response.getContent()).toEqual({foo: 'bar'});
    expect(response.getStatusCode()).toEqual(400);
    expect(response.getHeaders()).toEqual(['Content-Type: application/json']);
  });
});
