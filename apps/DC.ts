import {App} from "../src/Decorator/App";
import {Websocket} from "../src/Decorator/Websocket";
import {JsonResponse} from "../src/Response/JsonResponse";
import * as fs from "fs";

@App({
    name: 'DC',
    port: 65000
})
export class DC {
    /**
     * On connection to the global room.
     */
    @Websocket('connection')
    onGlobalTopicConnection() {
        console.log(`Someone connected to /. Nothing to see here...`);
    }

    /**
     * Request of transaction data
     */
    @Websocket('connection', '/efkon/no/dc/ctrl/cmd/transactions/get')
    onTransactionDataRequest(ws) {
        ws.on('message', function (message) {
            console.log(`Incoming message: ${message}`);
        });
    }

    /**
     * Response of transaction data
     */
    @Websocket('connection', '/efkon/no/dc/ctrl/cmd/response/transactions-uuid')
    async onTransactionDataResponse(ws) {
        // wait 1s to allow onTransactionDataRequest connection
        let transactions = fs.readFileSync("public/file/transactions.txt");
        console.log(`wait 1s...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        ws.send(transactions, function ack(error) {
            error && console.error(error);
        });
    }

    /**
     * Response of files data
     */
    @Websocket('connection', '/efkon/no/dc/ctrl/cmd/response/files-uuid')
    async onTransactionFileResponse(ws) {
        let files = new JsonResponse({
            "files": [
                {
                    "filename": "file1",
                    "created": "2001-12-17T09:30:47Z",
                    "status": "transferred",
                    "time": "2001-12-17T09:30:47Z",
                    "history": [{"status": "queued", "time": "2001-12-17T09:30:47Z"}]
                },
                {
                    "filename": "file2",
                    "created": "2001-12-17T09:30:47Z",
                    "status": "queued",
                    "time": "2001-12-17T09:30:47Z",
                    "history": [{"status": "transferred", "time": "2001-12-17T09:30:47Z"}]
                }
            ],
            "status": "ok",
            "message": "message1",
        });

        // wait 1s to allow onTransactionFilesRequest connection
        console.log(`wait 1s...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        ws.send(JSON.stringify(files), function ack(error) {
            error && console.error(error);
        });
    }

    /**
     * Response of download files data
     */
    @Websocket('connection', '/efkon/no/dc/ctrl/cmd/response/download-uuid')
    async onTransactionFileDownloadResponse(ws) {
        let files = new JsonResponse('file.tar.gz');

        // wait 1s to allow onTransactionFilesRequest connection
        console.log(`wait 1s...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        ws.send(JSON.stringify(files), function ack(error) {
            error && console.error(error);
        });
    }

    /**
     * Response of retransfer files data
     */
    @Websocket('connection', '/efkon/no/dc/ctrl/cmd/response/retransfer-uuid')
    async onTransactionFileRetransferResponse(ws) {
        let files = new JsonResponse({
            "files": [
                {
                    "filename": "file1",
                    "created": "2001-12-17T09:30:47Z",
                    "status": "transferred",
                    "time": "2001-12-17T09:30:47Z",
                    "history": [{"status": "queued", "time": "2001-12-17T09:30:47Z"}]
                }],
            "status": "ok",
            "message": "message: transferred",
        });

        // wait 1s to allow onTransactionFilesRequest connection
        console.log(`wait 1s...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        ws.send(JSON.stringify(files), function ack(error) {
            error && console.error(error);
        });
    }
}
