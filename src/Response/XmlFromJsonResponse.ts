import {Response} from './Response';
import * as jsonxml from 'jsontoxml';

export class XmlFromJsonResponse extends Response {
  constructor(content = {}, statusCode: number = 200, headers: Record<string, string | string[]> = {}) {
    super(content, statusCode, {'Content-Type': 'text/xml', ...headers});
  }

  public getContent() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${jsonxml(this.content)}`;
  }
}
