import {Response} from "./Response";

export class JsonResponse extends Response {
    constructor(protected data = {}, statusCode: number = 200, headers = []) {
        super('', statusCode, headers);
    }

    getData() {
        return this.data;
    }
}
