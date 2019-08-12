import {Response} from './Response';

export class FileResponse extends Response {
  constructor(protected filename: string, statusCode: number = 200, headers: Record<string, string | string[]> = {}) {
    super(null, statusCode, headers);
  }

  public getFilename() {
    return this.filename;
  }
}
