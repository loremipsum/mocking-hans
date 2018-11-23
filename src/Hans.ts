import {RouteRegistry} from "./Registry/RouteRegistry";
import {Response} from "./Response/Response";
import {JsonResponse} from "./Response/JsonResponse";
import {XmlFromJsonResponse} from "./Response/XmlFromJsonResponse";
import {SocketRegistry} from "./Registry/SocketRegistry";
import {WebsocketRegistry} from "./Registry/WebsocketRegistry";
import * as url from "url";
import WebSocket = require("ws");

const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');

// Let's be honest here: I've always wanted to name class "Hans".
export class Hans {
    constructor(protected apps) {
    }

    public async bootstrap() {
        this.apps.forEach(app => {
            const expressApp = express();
            expressApp.use(express.static('public'));

            const port = Reflect.getMetadata('port', app);
            const name = Reflect.getMetadata('name', app);

            this.applyLogger(expressApp, name, port);

            const server = require('http').Server(expressApp);
            server.listen(port, () => {
                console.info(`\t✔️  Started ${chalk.underline(name)} on localhost:${chalk.bold(port)}`);
            });

            const io = require('socket.io')(server);
            this.registerSockets(app, io);
            this.registerWebsockets(app, server);
            this.registerRoutes(app, expressApp, io);
        });
    }

    private registerSockets(app, io) {
        SocketRegistry
            .getSockets()
            .filter(s => s.target.constructor.name === app.name)
            .forEach(socket => {
                const s = io.of(socket.namespace);
                s.on(socket.event, (sock) => socket.target[socket.property](sock));
            });
    }

    private registerWebsockets(app, server) {
        const port = Reflect.getMetadata('port', app);
        const name = Reflect.getMetadata('name', app);

        WebsocketRegistry
            .getSockets()
            .filter(s => s.target.constructor.name === app.name)
            .forEach(websocket => {
                const wss = new WebSocket.Server({
                    noServer: true,
                    perMessageDeflate: false
                });

                wss.on(websocket.event, function (ws) {
                    websocket.target[websocket.property](ws);
                });

                server.on('upgrade', function (request, socket, head) {
                    if (url.parse(request.url).pathname !== websocket.namespace) {
                        return;
                    }
                    console.info(`${chalk.underline(name)} (:${port}): ` + [
                        'WS',
                        chalk.bold(websocket.event),
                        websocket.namespace,
                    ].join(' '));
                    wss.handleUpgrade(request, socket, head, function done(ws) {
                        wss.emit(websocket.event, ws, request);
                    });
                });
            });
    }

    private registerRoutes(app, expressApp, io) {
        RouteRegistry
            .getRoutes()
            .filter(r => r.target.constructor.name === app.name)
            .forEach((route) => {
                expressApp[route.httpMethod](route.path, (req, res, next) => {
                    const cb = route.target[route.property](req, res, next, io);

                    if (!(cb instanceof Response)) {
                        return cb;
                    }

                    res.status(cb.getStatusCode());
                    res.set(cb.getHeaders());

                    if (cb instanceof JsonResponse) {
                        return res.json(cb.getData());
                    }

                    if (cb instanceof XmlFromJsonResponse) {
                        res.set('Content-Type', 'text/xml');
                    }

                    return res.send(cb.getContent());
                });
            });
    }

    private applyLogger(expressApp, name, port) {
        expressApp.use(morgan((tokens, req, res) => {
            const status = tokens.status(req, res);

            return `${chalk.underline(name)} (:${port}): ` + [
                tokens.method(req, res),
                tokens.url(req, res),
                status.toString().charAt(0) === '4' ? chalk.red.bold(status) : chalk.bold(status),
                tokens['response-time'](req, res), 'ms'
            ].join(' ');
        }));
    }
}
