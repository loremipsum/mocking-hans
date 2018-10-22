import {RouteRegistry} from "./Registry/RouteRegistry";
import {Response} from "./Response/Response";
import {JsonResponse} from "./Response/JsonResponse";
import {XmlFromJsonResponse} from "./Response/XmlFromJsonResponse";

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
            const sockets = Reflect.getMetadata('sockets', app);

            expressApp.use(morgan((tokens, req, res) => {
                const status = tokens.status(req, res);

                return `${chalk.underline(name)} (:${port}): ` + [
                    tokens.method(req, res),
                    tokens.url(req, res),
                    status.toString().charAt(0) === '4' ? chalk.red.bold(status) : chalk.bold(status),
                    tokens['response-time'](req, res), 'ms'
                ].join(' ');
            }));

            const server = require('http').Server(expressApp);
            server.listen(port, () => {
                console.info(`\t✔️  Started ${chalk.underline(name)} on localhost:${chalk.bold(port)}`);
            });

            RouteRegistry.getRoutes().filter(route => {
                return route.target.constructor.name === app.name;
            }).forEach((route) => {
                expressApp[route.httpMethod](route.path, (req, res) => {
                    const cb = route.target[route.property](req, res);

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

            if (sockets && sockets.enabled) {
                const io = require('socket.io')(server);
                io.on('connection', (socket) => {
                    if(sockets.callback) {
                        sockets.callback();
                    }


                })
            }
        });
    }
}
