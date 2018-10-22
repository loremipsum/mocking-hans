import {Response} from "./Response";
const jsonxml = require('jsontoxml');

export class XmlFromJsonResponse extends Response {
    constructor(protected data = {}) {
        super();
    }

    getContent() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${jsonxml(this.data)}`;
    }
}
