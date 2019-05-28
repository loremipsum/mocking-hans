import {FileResponse} from '../../src/Response';

describe("FileResponse", () => {
  test("getters", () => {
    const response = new FileResponse('foo.jpg', 400, ['Content-Type: image/jpeg']);

    expect(response.getFilename()).toEqual('foo.jpg');
    expect(response.getStatusCode()).toEqual(400);
    expect(response.getHeaders()).toEqual(['Content-Type: image/jpeg']);
  });

  test("getters with default headers", () => {
    const response = new FileResponse('foo.jpg', 300);

    expect(response.getFilename()).toEqual('foo.jpg');
    expect(response.getStatusCode()).toEqual(300);
    expect(response.getHeaders()).toEqual([]);
  });

  test("getters with default status", () => {
    const response = new FileResponse('foo.jpg');

    expect(response.getFilename()).toEqual('foo.jpg');
    expect(response.getStatusCode()).toEqual(200);
    expect(response.getHeaders()).toEqual([]);
  });
});
