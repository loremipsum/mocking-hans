import {Response} from './Response';

export class JsonResponse extends Response {
  constructor(content = {}, statusCode: number = 200, headers: Record<string, string | string[]> = {}) {
    super(content, statusCode, {'Content-Type': 'application/json', ...headers});
  }
}
