import {Response} from '@loremipsum/mocking-hans/response';

export class JsonResponse extends Response {
  constructor(protected content = {}, statusCode: number = 200, headers = []) {
    super(content, statusCode, headers);
  }
}
