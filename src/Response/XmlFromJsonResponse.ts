import {Response} from './Response';
import {jsonxml} from 'jsontoxml';

export class XmlFromJsonResponse extends Response {
  constructor(protected data = {}) {
    super();
  }

  public getContent() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${jsonxml(this.data)}`;
  }
}
