import {JsonResponse} from '../../src/Response';

describe("JsonResponse", () => {
  test("getters", () => {
    const response = new JsonResponse({foo: 'bar'}, 400, {'X-Test': 'foobar'});

    expect(response.getContent()).toEqual({foo: 'bar'});
    expect(response.getStatusCode()).toEqual(400);
    expect(response.getHeaders()).toEqual({
      'X-Test': 'foobar',
      'Content-Type': 'application/json'
    });
  });

  test("getters with custom header Content-Type", () => {
    const response = new JsonResponse("test", 200, {'Content-Type': 'application/ld+json'});

    expect(response.getContent()).toEqual("test");
    expect(response.getStatusCode()).toEqual(200);
    expect(response.getHeaders()).toEqual({'Content-Type': 'application/ld+json'});
  });

  test("getters with default status", () => {
    const response = new JsonResponse("test");

    expect(response.getContent()).toEqual("test");
    expect(response.getStatusCode()).toEqual(200);
    expect(response.getHeaders()).toEqual({'Content-Type': 'application/json'});
  });

  test("getters with default content", () => {
    const response = new JsonResponse();

    expect(response.getContent()).toEqual({});
    expect(response.getStatusCode()).toEqual(200);
    expect(response.getHeaders()).toEqual({'Content-Type': 'application/json'});
  });
});
