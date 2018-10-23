import {RouteRegistry} from "./Registry/RouteRegistry";
import {Response} from "./Response/Response";
import {JsonResponse} from "./Response/JsonResponse";
import {XmlFromJsonResponse} from "./Response/XmlFromJsonResponse";
import {SocketRegistry} from "./Registry/SocketRegistry";

const express = require('express');
const chalk   = require('chalk');
const morgan  = require('morgan');

// Let's be honest here: I've always wanted to name class "Hans".
export class Hans {
    constructor(protected apps) {
    }

    public async bootstrap() {
        this.apps.forEach(app => {
            const expressApp = express();

            const port = Reflect.getMetadata('port', app);
            const name = Reflect.getMetadata('name', app);

            this.applyLogger(expressApp, name, port);

            const server = require('http').Server(expressApp);
            server.listen(port, () => {
                console.info(`\t✔️  Started ${chalk.underline(name)} on localhost:${chalk.bold(port)}`);
            });

            const io = require('socket.io')(server);
            this.registerSockets(app, io);
            this.registerRoutes(app, expressApp, io);
        });
    }

    private registerSockets(app, io) {
        SocketRegistry
            .getSockets()
            .filter(s => s.target.constructor.name === app.name).forEach(socket => {
            const s = io.of(socket.namespace);
            s.on(socket.event, (sock) => socket.target[socket.property](sock));
        });
    }

    private registerRoutes(app, expressApp, io) {
        RouteRegistry
            .getRoutes()
            .filter(r => r.target.constructor.name === app.name).forEach((route) => {
            expressApp[route.httpMethod](route.path, (req, res) => {
                const cb = route.target[route.property](req, res, io);

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
