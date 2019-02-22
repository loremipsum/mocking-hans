import {App} from "../src/Decorator/App";
import {JsonResponse} from "../src/Response/JsonResponse";
import {Route} from "../src/Decorator/Route";
import {HttpMethod} from "../src/Enum/HttpMethod";

@App({
    name: 'DC',
    port: 65000
})
export class DC {
    @Route("/1.0.0/cp/:cpid/:cpsystem/current_state", HttpMethod.GET)
    public getChargingPointMainState(req) {
        this.validateRequest(req);
        return new JsonResponse({
            state: this.getRandomChargingPointState(),
            timestamp: this.generateTimestamp()
        });
    }

    @Route("/1.0.0/cp/:cpid/:cpsystem/target_state", HttpMethod.POST)
    public setChargingPointMainState() {
        return new JsonResponse({
            source: 'mcs',
            primary_state: this.getRandomChargingPointState(),
            secondary_state: this.getRandomChargingPointState(),
            begin: this.generateTimestamp()
        });
    }

    @Route("/1.0.0/cp/:cpid/:cpsystem/current_spottest", HttpMethod.GET)
    public getSpotTestModeConfiguration() {
        return new JsonResponse({
            'ison': 'true',
            'begin': this.generateTimestamp(),
            'end': this.generateTimestamp(),
            'timestamp': this.generateTimestamp(),
            'config': {
                'transaction': this.getRandomTransaction(),
                'isenvironmental': this.getRandomBooleanValue(),
                'missmatchedlpn': this.getRandomBooleanValue(),
                'hastrailer': this.getRandomBooleanValue(),
                'tagstatusflag': this.getRandomStatusFlags(),
                'signalcode': this.getRandomSignalCodes(),
                'classes': this.getRandomClasses(),
                'quantity': 42
            }
        });
    }

    @Route("/1.0.0/cp/:cpid/:cpsystem/target_spottest", HttpMethod.POST)
    public setSpotTestMode() {
        return this.getSpotTestModeConfiguration();
    }

    @Route("/1.0.0/cp/:cpid/current_power", HttpMethod.GET)
    public getPowerState() {
        return new JsonResponse({
            primary: {
                gantry: this.getRandomBooleanValue(),
                cpc: this.getRandomBooleanValue()
            },
            secondary: {
                gantry: this.getRandomBooleanValue(),
                cpc: this.getRandomBooleanValue()
            },
            vms1: this.getRandomBooleanValue(),
            vms2: this.getRandomBooleanValue(),
            timestamp: this.generateTimestamp()
        });
    }

    private validateRequest(req) {
        if (req.params.cpsystem && ['p', 's'].indexOf(req.params.cpsystem) < 0) {
            throw new Error('Invalid cpsystem (allowed are either "p" or "s")');
        }
    }

    private getRandomClass() {
        return this.getRandomValueFromArray(['car', 'van', 'truck', 'bus', 'motorcycle']);
    }

    private getRandomClasses() {
        const classes = [];
        for (let i = 0; i <= this.getRandomNumberBetween(1, 3); i++) {
            classes.push(this.getRandomClass());
        }
        return classes;
    }

    private getRandomSignalCode() {
        return this.getRandomValueFromArray(['02', '08', '10', '20', '22', '23', '25', '28', '40', '41', '42']);
    }

    private getRandomSignalCodes() {
        const classes = [];
        for (let i = 0; i <= this.getRandomNumberBetween(1, 3); i++) {
            classes.push(this.getRandomSignalCode());
        }
        return classes;
    }

    private getRandomTransaction() {
        return this.getRandomValueFromArray(['EN15509', 'AutoPASS']);
    }

    private getRandomStatusFlag() {
        return this.getRandomValueFromArray(['wanted', 'video']);
    }

    private getRandomStatusFlags() {
        const classes = [];
        for (let i = 0; i <= this.getRandomNumberBetween(1, 2); i++) {
            classes.push(this.getRandomStatusFlag());
        }
        return classes;
    }

    private getRandomBooleanValue() {
        return this.getRandomValueFromArray(['true', 'false']);
    }

    private getRandomChargingPointState() {
        return this.getRandomValueFromArray(['charging', 'standby']);
    }

    private getRandomValueFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private getRandomNumberBetween(min: number, max: number) {
        return Math.floor((Math.random() * max) + min);
    }

    /**
     * Returns a RFC3339 formatted date
     */
    private generateTimestamp() {
        return (new Date()).toISOString();
    }

    // /**
    //  * On connection to the global room.
    //  */
    // @Websocket('connection')
    // onGlobalTopicConnection() {
    //     console.log(`Someone connected to /. Nothing to see here...`);
    // }
    //
    // /**
    //  * Request of transaction data
    //  */
    // @Websocket('connection', '/efkon/no/dc/ctrl/cmd/transactions/get')
    // onTransactionDataRequest(ws) {
    //     ws.on('message', function (message) {
    //         console.log(`Incoming message: ${message}`);
    //     });
    // }
    //
    // /**
    //  * Response of transaction data
    //  */
    // @Websocket('connection', '/efkon/no/dc/ctrl/cmd/response/transactions-uuid')
    // async onTransactionDataResponse(ws) {
    //     // wait 1s to allow onTransactionDataRequest connection
    //     let transactions = fs.readFileSync("public/file/transactions.txt");
    //     console.log(`wait 1s...`);
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     ws.send(transactions, function ack(error) {
    //         error && console.error(error);
    //     });
    // }
    //
    // /**
    //  * Response of files data
    //  */
    // @Websocket('connection', '/efkon/no/dc/ctrl/cmd/response/files-uuid')
    // async onTransactionFileResponse(ws) {
    //     let files = new JsonResponse({
    //         "files": [
    //             {
    //                 "filename": "file1",
    //                 "created": "2001-12-17T09:30:47Z",
    //                 "status": "transferred",
    //                 "time": "2001-12-17T09:30:47Z",
    //                 "history": [{"status": "queued", "time": "2001-12-17T09:30:47Z"}]
    //             },
    //             {
    //                 "filename": "file2",
    //                 "created": "2001-12-17T09:30:47Z",
    //                 "status": "queued",
    //                 "time": "2001-12-17T09:30:47Z",
    //                 "history": [{"status": "transferred", "time": "2001-12-17T09:30:47Z"}]
    //             }
    //         ],
    //         "status": "ok",
    //         "message": "message1",
    //     });
    //
    //     // wait 1s to allow onTransactionFilesRequest connection
    //     console.log(`wait 1s...`);
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     ws.send(JSON.stringify(files), function ack(error) {
    //         error && console.error(error);
    //     });
    // }
    //
    // /**
    //  * Response of download files data
    //  */
    // @Websocket('connection', '/efkon/no/dc/ctrl/cmd/response/download-uuid')
    // async onTransactionFileDownloadResponse(ws) {
    //     let files = new JsonResponse('file.tar.gz');
    //
    //     // wait 1s to allow onTransactionFilesRequest connection
    //     console.log(`wait 1s...`);
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     ws.send(JSON.stringify(files), function ack(error) {
    //         error && console.error(error);
    //     });
    // }
    //
    // /**
    //  * Response of retransfer files data
    //  */
    // @Websocket('connection', '/efkon/no/dc/ctrl/cmd/response/retransfer-uuid')
    // async onTransactionFileRetransferResponse(ws) {
    //     let files = new JsonResponse({
    //         "files": [
    //             {
    //                 "filename": "file1",
    //                 "created": "2001-12-17T09:30:47Z",
    //                 "status": "transferred",
    //                 "time": "2001-12-17T09:30:47Z",
    //                 "history": [{"status": "queued", "time": "2001-12-17T09:30:47Z"}]
    //             }],
    //         "status": "ok",
    //         "message": "message: transferred",
    //     });
    //
    //     // wait 1s to allow onTransactionFilesRequest connection
    //     console.log(`wait 1s...`);
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     ws.send(JSON.stringify(files), function ack(error) {
    //         error && console.error(error);
    //     });
    // }
}
