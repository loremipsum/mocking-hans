import {Response} from '../../src/Response';

describe("Response", () => {
  test("getters", () => {
    const response = new Response('content', 400, ['Content-Type: text/plain']);

    expect(response.getContent()).toEqual('content');
    expect(response.getStatusCode()).toEqual(400);
    expect(response.getHeaders()).toEqual(['Content-Type: text/plain']);
  });

  test("getters with default headers", () => {
    const response = new Response('content', 301);

    expect(response.getContent()).toEqual('content');
    expect(response.getStatusCode()).toEqual(301);
    expect(response.getHeaders()).toEqual([]);
  });

  test("getters with default status", () => {
    const response = new Response('content');

    expect(response.getContent()).toEqual('content');
    expect(response.getStatusCode()).toEqual(200);
    expect(response.getHeaders()).toEqual([]);
  });
});
