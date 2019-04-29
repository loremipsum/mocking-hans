import {Response} from './Response';

export class JsonResponse extends Response {
  constructor(protected content = {}, statusCode: number = 200, headers = []) {
    super(content, statusCode, headers);

    this.headers.push('Content-Type: application/json');
  }
}
