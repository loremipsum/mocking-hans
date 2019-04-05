export class Response {
  constructor(protected content: any = '', protected statusCode: number = 200, protected headers = []) {
  }

  public getContent() {
    return this.content;
  }

  public getStatusCode() {
    return this.statusCode;
  }

  public getHeaders() {
    return this.headers;
  }
}
