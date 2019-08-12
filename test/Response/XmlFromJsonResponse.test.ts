import {XmlFromJsonResponse} from '../../src/Response';

describe("XmlFromJsonResponse", () => {
  test("getters", () => {
    const response = new XmlFromJsonResponse({foo: 'bar'}, 400);

    expect(response.getContent()).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><foo>bar</foo>`);
    expect(response.getStatusCode()).toEqual(400);
    expect(response.getHeaders()).toEqual({'Content-Type': 'text/xml'});
  });

  test("getters with defaults", () => {
    const response = new XmlFromJsonResponse();

    expect(response.getContent()).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`);
    expect(response.getStatusCode()).toEqual(200);
    expect(response.getHeaders()).toEqual({'Content-Type': 'text/xml'});
  });
});
