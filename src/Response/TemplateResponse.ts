import {Response} from './Response';

export class TemplateResponse extends Response {
  constructor(protected content: string | object, protected variables: object, statusCode: number = 200, headers = []) {
    super(content, statusCode, headers);
  }

  public getContent() {
    for (const key in this.variables) {
      if (!this.variables.hasOwnProperty(key)) {
        continue;
      }

      if (typeof this.content === 'string') {
        this.content = this.content.replace(`%${key}%`, this.variables[key]);
      }

      if (typeof this.content === 'object') {
        this.content = JSON.parse(JSON.stringify(this.content).replace(`%${key}%`, this.variables[key]));
      }
    }
    return this.content;
  }
}
