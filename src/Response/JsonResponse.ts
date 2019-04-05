import {Response} from './Response';

export class JsonResponse extends Response {
  constructor(protected data = {}, statusCode: number = 200, headers = []) {
    super('', statusCode, headers);
  }

  public getData() {
    return this.data;
  }
}
