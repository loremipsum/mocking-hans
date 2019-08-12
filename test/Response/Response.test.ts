import {Response} from '../../src/Response';

describe("Response", () => {
  test("getters", () => {
    const response = new Response('content', 400, {'Content-Type': 'text/plain', 'Set-Cookie': ["first", "second"]});

    expect(response.getContent()).toEqual('content');
    expect(response.getStatusCode()).toEqual(400);
    expect(response.getHeaders()).toEqual({'Content-Type': 'text/plain', 'Set-Cookie': ["first", "second"]});
  });

  test("getters with default headers", () => {
    const response = new Response('content', 301);

    expect(response.getContent()).toEqual('content');
    expect(response.getStatusCode()).toEqual(301);
    expect(response.getHeaders()).toEqual({});
  });

  test("getters with default status", () => {
    const response = new Response(1);

    expect(response.getContent()).toEqual(1);
    expect(response.getStatusCode()).toEqual(200);
    expect(response.getHeaders()).toEqual({});
  });

  test("getters with defaults", () => {
    const response = new Response();

    expect(response.getContent()).toEqual('');
    expect(response.getStatusCode()).toEqual(200);
    expect(response.getHeaders()).toEqual({});
  });
});
