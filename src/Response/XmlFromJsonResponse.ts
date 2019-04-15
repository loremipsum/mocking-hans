import {Response} from './Response';
import * as jsonxml from 'jsontoxml';

export class XmlFromJsonResponse extends Response {
  constructor(protected content = {}) {
    super(content);

    this.headers.push('Content-Type: text/xml');
  }

  public getContent() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${jsonxml(this.content)}`;
  }
}
