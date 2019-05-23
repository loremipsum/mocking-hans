import {Response} from '../../src/Response';

describe("Response", () => {
  test("getters", () => {
    const response = new Response('content', 400, ['Content-Type: text/plain']);

    expect(response.getContent()).toEqual('content');
    expect(response.getStatusCode()).toEqual(400);
    expect(response.getHeaders()).toEqual(['Content-Type: text/plain']);
  });
});
