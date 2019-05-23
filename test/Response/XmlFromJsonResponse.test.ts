import {XmlFromJsonResponse} from '../../src/Response';
import * as jsonxml from 'jsontoxml';

describe("XmlFromJsonResponse", () => {
  test("getters", () => {
    const response = new XmlFromJsonResponse({foo: 'bar'}, 400);

    expect(response.getContent()).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${jsonxml({foo: 'bar'})}`);
    expect(response.getStatusCode()).toEqual(400);
    expect(response.getHeaders()).toEqual(['Content-Type: text/xml']);
  });
});
