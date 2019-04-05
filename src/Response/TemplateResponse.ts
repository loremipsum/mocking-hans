import {Response} from './Response';

export class TemplateResponse extends Response {
  constructor(protected content: string | object, protected variables: object, statusCode: number = 200, headers = []) {
    super(content, statusCode, headers);
  }

  public getContent() {
    let result = this.content;
    for (const key in this.variables) {
      if (!this.variables.hasOwnProperty(key)) {
        continue;
      }

      if (typeof this.content === 'string') {
        result = this.content.replace(`%${key}%`, this.variables[key]);
      }

      if (typeof this.content === 'object') {
        result = JSON.parse(JSON.stringify(result).replace(`%${key}%`, this.variables[key]));
      }
    }
    return result;
  }
}
