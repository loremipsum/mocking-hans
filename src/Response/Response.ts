export class Response {
    constructor(protected content: any = '', protected statusCode: number = 200, protected headers = []) {
    }

    getContent() {
        return this.content;
    }

    getStatusCode() {
        return this.statusCode;
    }

    getHeaders() {
        return this.headers;
    }
}
