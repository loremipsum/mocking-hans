import {Response} from './Response';

export class TemplateResponse extends Response {
  constructor(
    content: string | object,
    protected variables: Record<string, any> = {},
    statusCode: number = 200,
    headers: Record<string, string | string[]> = {},
  ) {
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
