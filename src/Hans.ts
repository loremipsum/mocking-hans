import 'reflect-metadata';
import {Metadata, RouteDefinition, SocketDefinition} from '@loremipsum/mocking-hans/model';
import {JsonResponse, Response, XmlFromJsonResponse} from '@loremipsum/mocking-hans/response';
import chalk from 'chalk';
import WebSocket = require('ws');
import * as url from 'url';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import {FileResponse} from './Response/FileResponse';
import * as path from 'path';
import {State} from './Utility/State';

// Let's be honest here: I've always wanted to name a class "Hans".
export class Hans {
  private appInstances: Map<string, object> = new Map<string, object>();

  /**
   * Hans-wide state, shared across all applications; will be injected to application constructors as first argument.
   */
  private state: State = new State();

  constructor(protected apps: Array<{ new(...args: any[]) }>) {
  }

  public async bootstrap() {
    this.apps.forEach((app) => {
      const expressApp: express.Application = express();
      expressApp.use(express.static('public'));
      expressApp.use(bodyParser.json());

      const port = Reflect.getMetadata(Metadata.Port, app);
      const name = Reflect.getMetadata(Metadata.Name, app);

      this.applyLogger(expressApp, name, port);

      const server = require('http').Server(expressApp);
      server.listen(port, () => {
        // tslint:disable-next-line
        console.info(`\t✔️  Started ${chalk.underline(name)} on localhost:${chalk.bold(port)}`);
      });

      const io = require('socket.io')(server);
      this.registerSockets(app, io);
      this.registerWebsockets(app, server);
      this.registerRoutes(app, expressApp, io);
    });
  }

  private registerSockets(app, io) {
    const sockets  = Reflect.getMetadata(Metadata.SocketIORoutes, app) as Array<SocketDefinition>;
    const instance = this.getAppInstance(app);

    sockets.forEach(socket => {
      const s = io.of(socket.namespace);
      s.on(socket.event, sock => instance[socket.methodName](sock));
    });
  }

  private registerWebsockets(app, server) {
    const sockets  = Reflect.getMetadata(Metadata.NativeSocketRoutes, app) as Array<SocketDefinition>;
    const port     = Reflect.getMetadata(Metadata.Port, app);
    const name     = Reflect.getMetadata(Metadata.Name, app);
    const instance = this.getAppInstance(app);

    sockets.forEach(websocket => {
      const wss = new WebSocket.Server({
        noServer: true,
        perMessageDeflate: false,
      });

      wss.on(websocket.event, function (ws) {
        instance[websocket.methodName](ws);
      });

      server.on('upgrade', function (request, socket, head) {
        if (url.parse(request.url).pathname !== websocket.namespace) {
          return;
        }
        // tslint:disable-next-line
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
    const routes   = Reflect.getMetadata(Metadata.Routes, app) as Array<RouteDefinition>;
    const instance = this.getAppInstance(app);

    routes.forEach(route => {
      expressApp[route.requestMethod](route.path, (req, res, next) => {
        const cb = instance[route.methodName](req, res, next, io);

        if (!(cb instanceof Response)) {
          return cb;
        }

        res.status(cb.getStatusCode());
        res.set(cb.getHeaders());

        if (cb instanceof FileResponse) {
          return res.sendFile(path.join(__dirname, '../public', cb.getFilename()));
        }

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
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    }));
  }

  private getAppInstance(app: { new(...args: any[]) }) {
    const name = Reflect.getMetadata(Metadata.Name, app);

    if (!this.appInstances.has(name)) {
      this.appInstances.set(name, new app(this.state));
    }

    return this.appInstances.get(name);
  }
}
